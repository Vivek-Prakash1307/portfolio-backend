package main

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

const (
	defaultPort        = "8080"
	maxContactBodySize = 16 << 10
	resendEndpoint     = "https://api.resend.com/emails"
)

var (
	resumeData       = buildResumeData()
	resumeJSON       = mustJSON(resumeData)
	resumeETag       = weakETag(resumeJSON)
	resendHTTPClient = &http.Client{Timeout: 8 * time.Second}
)

type ResumeData struct {
	Name     string          `json:"name"`
	Tagline  string          `json:"tagline"`
	About    string          `json:"about"`
	Skills   []SkillCategory `json:"skills"`
	Projects []Project       `json:"projects"`
	Contact  ContactInfo     `json:"contact"`
}

type SkillCategory struct {
	Category string   `json:"category"`
	Items    []string `json:"items"`
}

type Project struct {
	Title        string   `json:"title"`
	Description  string   `json:"description"`
	Github       string   `json:"github"`
	Technologies []string `json:"technologies"`
}

type ContactInfo struct {
	Email         string `json:"email"`
	Phone         string `json:"phone"`
	Github        string `json:"github"`
	Linkedin      string `json:"linkedin"`
	Leetcode      string `json:"leetcode"`
	Geeksforgeeks string `json:"geeksforgeeks"`
}

type ContactMessage struct {
	Name    string `json:"name" binding:"required,min=2,max=80"`
	Email   string `json:"email" binding:"required,email,max=160"`
	Message string `json:"message" binding:"required,min=10,max=3000"`
}

type EmailConfig struct {
	APIKey    string
	FromEmail string
	ToEmail   string
}

type queuedEmail struct {
	config  EmailConfig
	message ContactMessage
}

type emailDispatcher struct {
	queue chan queuedEmail
	send  func(context.Context, EmailConfig, ContactMessage) error
}

type rateLimiter struct {
	mu       sync.Mutex
	visitors map[string]*visitor
	limit    int
	window   time.Duration
}

type visitor struct {
	count     int
	expiresAt time.Time
}

func main() {
	router := setupRouter()
	port := getEnv("PORT", defaultPort)

	server := &http.Server{
		Addr:              ":" + port,
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       8 * time.Second,
		WriteTimeout:      12 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    1 << 20,
	}

	log.Printf("Portfolio API server listening on :%s", port)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatalf("failed to run server: %v", err)
	}
}

func setupRouter() *gin.Engine {
	if getEnv("GIN_MODE", "") == "" && getEnv("APP_ENV", "") == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("%s %s %d %s %s\n",
			param.Method,
			param.Path,
			param.StatusCode,
			param.Latency,
			param.ClientIP,
		)
	}))
	router.Use(securityHeaders())
	router.Use(cors.New(cors.Config{
		AllowOrigins:     parseCSVEnv("ALLOWED_ORIGINS", "http://localhost:3000"),
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodOptions},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "ETag"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))

	contactLimiter := newRateLimiter(5, 10*time.Minute)
	dispatcher := newEmailDispatcher(100, sendEmail)
	dispatcher.start(2)

	router.GET("/api/health", healthHandler)
	router.GET("/api/resume", getResumeData)
	router.POST("/api/contact", limitBody(maxContactBodySize), contactLimiter.middleware(), handleContactForm(dispatcher))

	return router
}

func securityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Next()
	}
}

func limitBody(limit int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, limit)
		c.Next()
	}
}

func healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "portfolio-api",
		"time":    time.Now().UTC().Format(time.RFC3339),
	})
}

func getResumeData(c *gin.Context) {
	c.Header("Cache-Control", "public, max-age=300, stale-while-revalidate=60")
	c.Header("ETag", resumeETag)
	c.Header("Content-Type", "application/json; charset=utf-8")

	if c.GetHeader("If-None-Match") == resumeETag {
		c.Status(http.StatusNotModified)
		return
	}

	c.Data(http.StatusOK, "application/json; charset=utf-8", resumeJSON)
}

func handleContactForm(dispatcher *emailDispatcher) gin.HandlerFunc {
	return func(c *gin.Context) {
		var contactMsg ContactMessage
		if err := c.ShouldBindJSON(&contactMsg); err != nil {
			status := http.StatusBadRequest
			message := "Invalid input data."
			if strings.Contains(err.Error(), "http: request body too large") {
				status = http.StatusRequestEntityTooLarge
				message = "Message payload is too large."
			}
			c.JSON(status, gin.H{"error": message})
			return
		}

		contactMsg.normalize()
		if err := contactMsg.validate(); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		emailConfig := EmailConfig{
			APIKey:    getEnv("RESEND_API_KEY", ""),
			FromEmail: getEnv("FROM_EMAIL", ""),
			ToEmail:   getEnv("TO_EMAIL", "alivevivek8@gmail.com"),
		}

		if err := emailConfig.validate(); err != nil {
			log.Printf("email configuration error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Email service is not configured correctly."})
			return
		}

		if !dispatcher.enqueue(emailConfig, contactMsg) {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"error": "Message queue is busy. Please try again in a moment.",
			})
			return
		}

		c.JSON(http.StatusAccepted, gin.H{
			"message": "Message accepted and is being delivered now.",
			"status":  "queued",
		})
	}
}

func (m *ContactMessage) normalize() {
	m.Name = compactSpace(m.Name)
	m.Email = strings.ToLower(strings.TrimSpace(m.Email))
	m.Message = strings.TrimSpace(m.Message)
}

func (m ContactMessage) validate() error {
	if strings.ContainsAny(m.Name, "\r\n<>") {
		return errors.New("Name contains unsupported characters.")
	}
	if len(m.Message) < 10 {
		return errors.New("Message must be at least 10 characters.")
	}
	return nil
}

func (c EmailConfig) validate() error {
	if c.APIKey == "" {
		return errors.New("RESEND_API_KEY is missing")
	}
	if c.FromEmail == "" {
		return errors.New("FROM_EMAIL is missing")
	}
	if c.ToEmail == "" {
		return errors.New("TO_EMAIL is missing")
	}
	return nil
}

func sendEmail(ctx context.Context, config EmailConfig, contactMsg ContactMessage) error {
	subject := fmt.Sprintf("Portfolio Contact: Message from %s", contactMsg.Name)
	body := fmt.Sprintf(`New contact form submission from your portfolio website:

Name: %s
Email: %s
Time: %s

Message:
%s

--
This message was sent from your portfolio contact form.
`, contactMsg.Name, contactMsg.Email, time.Now().UTC().Format(time.RFC3339), contactMsg.Message)

	payload := map[string]any{
		"from":     fmt.Sprintf("Portfolio Contact <%s>", config.FromEmail),
		"to":       []string{config.ToEmail},
		"reply_to": contactMsg.Email,
		"subject":  subject,
		"text":     body,
	}

	var buf bytes.Buffer
	if err := json.NewEncoder(&buf).Encode(payload); err != nil {
		return fmt.Errorf("encode email payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, resendEndpoint, &buf)
	if err != nil {
		return fmt.Errorf("create resend request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+config.APIKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	resp, err := resendHTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("send resend request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= http.StatusMultipleChoices {
		body, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
		return fmt.Errorf("resend returned status %d: %s", resp.StatusCode, strings.TrimSpace(string(body)))
	}

	return nil
}

func newEmailDispatcher(queueSize int, sender func(context.Context, EmailConfig, ContactMessage) error) *emailDispatcher {
	return &emailDispatcher{
		queue: make(chan queuedEmail, queueSize),
		send:  sender,
	}
}

func (d *emailDispatcher) enqueue(config EmailConfig, message ContactMessage) bool {
	select {
	case d.queue <- queuedEmail{config: config, message: message}:
		return true
	default:
		return false
	}
}

func (d *emailDispatcher) start(workers int) {
	for i := 0; i < workers; i++ {
		go d.worker()
	}
}

func (d *emailDispatcher) worker() {
	for job := range d.queue {
		d.deliver(job)
	}
}

func (d *emailDispatcher) deliver(job queuedEmail) {
	backoffs := []time.Duration{0, 250 * time.Millisecond, 750 * time.Millisecond}
	for attempt, backoff := range backoffs {
		if backoff > 0 {
			time.Sleep(backoff)
		}

		ctx, cancel := context.WithTimeout(context.Background(), 8*time.Second)
		err := d.send(ctx, job.config, job.message)
		cancel()

		if err == nil {
			log.Printf("contact email delivered from %s <%s>", job.message.Name, job.message.Email)
			return
		}

		log.Printf("contact email delivery attempt %d failed: %v", attempt+1, err)
	}
}

func newRateLimiter(limit int, window time.Duration) *rateLimiter {
	limiter := &rateLimiter{
		visitors: make(map[string]*visitor),
		limit:    limit,
		window:   window,
	}

	go limiter.cleanup()
	return limiter
}

func (r *rateLimiter) middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := clientIP(c.Request)
		now := time.Now()

		r.mu.Lock()
		v, ok := r.visitors[ip]
		if !ok || now.After(v.expiresAt) {
			v = &visitor{expiresAt: now.Add(r.window)}
			r.visitors[ip] = v
		}
		v.count++
		allowed := v.count <= r.limit
		retryAfter := time.Until(v.expiresAt)
		r.mu.Unlock()

		if !allowed {
			c.Header("Retry-After", fmt.Sprintf("%.0f", retryAfter.Seconds()))
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "Too many contact attempts. Please try again later.",
			})
			return
		}

		c.Next()
	}
}

func (r *rateLimiter) cleanup() {
	ticker := time.NewTicker(time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		now := time.Now()
		r.mu.Lock()
		for ip, visitor := range r.visitors {
			if now.After(visitor.expiresAt) {
				delete(r.visitors, ip)
			}
		}
		r.mu.Unlock()
	}
}

func clientIP(r *http.Request) string {
	if forwarded := strings.TrimSpace(r.Header.Get("X-Forwarded-For")); forwarded != "" {
		parts := strings.Split(forwarded, ",")
		if ip := net.ParseIP(strings.TrimSpace(parts[0])); ip != nil {
			return ip.String()
		}
	}

	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err == nil {
		return host
	}
	return r.RemoteAddr
}

func buildResumeData() ResumeData {
	return ResumeData{
		Name:    "Vivek Prakash",
		Tagline: "Backend-Focused Full Stack Developer",
		About:   "Backend-focused full-stack engineer building production-minded Go services, APIs, data pipelines, deployment workflows, and React interfaces for real-world systems.",
		Skills: []SkillCategory{
			{Category: "Backend Engineering", Items: []string{"Go", "Gin", "Fiber", "REST APIs", "JWT Auth", "Microservices", "Goroutines"}},
			{Category: "Systems and Infrastructure", Items: []string{"Docker", "Linux", "HTTP", "DNS", "Reverse Proxies", "Kubernetes Basics", "CI/CD Basics"}},
			{Category: "Data and Storage", Items: []string{"PostgreSQL", "MySQL", "MongoDB", "CSV Pipelines", "Caching", "Structured Logging"}},
			{Category: "Frontend Delivery", Items: []string{"React", "TypeScript", "JavaScript", "Tailwind CSS", "Accessibility", "Playwright"}},
		},
		Projects: []Project{
			{
				Title:        "Automated Financial Data Extraction and Analysis System",
				Description:  "A scalable Go data extraction and analysis platform for 500+ companies with concurrent scraping, checkpoint recovery, retry handling, and structured parsing pipelines.",
				Github:       "https://github.com/Vivek-Prakash1307/Automated-Financial-Data-Extraction-and-Analysis-System-",
				Technologies: []string{"Go", "Goroutines", "Concurrent Processing", "Web Scraping", "HTML Parsing", "Data Pipelines", "Checkpoint Recovery", "Structured Logging"},
			},
			{
				Title:        "Repository-Centric Kubernetes Security Analysis Framework",
				Description:  "A Kubernetes security analysis framework for repository-centric scanning, Helm chart analysis, RBAC validation, network policy checks, WebSocket operations, and posture scoring.",
				Github:       "https://github.com/Aegios-k8s/major-project",
				Technologies: []string{"Go", "Kubernetes", "Helm", "DevSecOps", "GitHub APIs", "WebSockets", "Docker"},
			},
			{
				Title:        "Email Intelligence Platform",
				Description:  "A production-ready full-stack email verification platform with concurrent domain checks, DNS MX lookup, SMTP validation, REST APIs, PostgreSQL, Docker, and cloud deployment.",
				Github:       "https://github.com/Vivek-Prakash1307/email-intelligence-platform",
				Technologies: []string{"Go", "Gin", "Goroutines", "REST APIs", "DNS MX Lookup", "React", "PostgreSQL", "Docker", "Render", "Vercel"},
			},
			{
				Title:        "HTTP Load Balancer",
				Description:  "A lightweight Go reverse proxy using round-robin load balancing, custom health checks, and fault-tolerant request distribution.",
				Github:       "https://github.com/Vivek-Prakash1307/Load_Balancer",
				Technologies: []string{"Go", "net/http", "Reverse Proxy", "Round-Robin Load Balancing", "Goroutines"},
			},
			{
				Title:        "Chunked File Uploader",
				Description:  "A React and TypeScript upload system with resumable chunks, retry flows, IndexedDB persistence, state-machine logic, checksum verification, and tests.",
				Github:       "https://github.com/Vivek-Prakash1307/chunked-file-uploader",
				Technologies: []string{"React", "TypeScript", "Vite", "IndexedDB", "Web Crypto API", "Vitest", "Playwright"},
			},
			{
				Title:        "PPT-to-PDF Converter",
				Description:  "A Go web application for document-to-PDF conversion using LibreOffice, concurrent processing, large uploads, progress tracking, Docker deployment, and cleanup routines.",
				Github:       "https://github.com/Vivek-Prakash1307/PPT-TO-PDF-CONVERTER",
				Technologies: []string{"Go", "Gin", "LibreOffice", "Docker", "Railway", "Concurrent Processing", "File Handling"},
			},
			{
				Title:        "WeatherStack",
				Description:  "A Go weather microservice using external weather APIs, caching, health checks, Docker support, and resilient REST endpoints.",
				Github:       "https://github.com/Vivek-Prakash1307/weatherstack-go",
				Technologies: []string{"Go", "Gin", "REST APIs", "Caching", "Docker", "Linux"},
			},
			{
				Title:        "Web Server API",
				Description:  "REST API endpoints with Gin and GORM for authentication and product management backed by MySQL CRUD workflows.",
				Github:       "https://github.com/Vivek-Prakash1307/Web-Server-API",
				Technologies: []string{"Go", "Gin", "GORM", "MySQL", "REST APIs", "Authentication"},
			},
			{
				Title:        "TaskFlow Task Management App",
				Description:  "A full-stack task management application with JWT authentication, kanban workflows, responsive UI, and real-time CRUD operations.",
				Github:       "https://github.com/Vivek-Prakash1307/PrimeTrade",
				Technologies: []string{"React", "Node.js", "Express", "MongoDB", "JWT", "Tailwind CSS"},
			},
		},
		Contact: ContactInfo{
			Email:         "alivevivek8@gmail.com",
			Phone:         "+91 7309058513",
			Github:        "github.com/Vivek-Prakash1307",
			Linkedin:      "linkedin.com/in/vivek-prakash-00230a300",
			Leetcode:      "leetcode.com/u/alivevivek8",
			Geeksforgeeks: "geeksforgeeks.org/user/alivevng22/",
		},
	}
}

func parseCSVEnv(key, fallback string) []string {
	raw := getEnv(key, fallback)
	values := make([]string, 0, 4)
	for _, value := range strings.Split(raw, ",") {
		value = strings.TrimSpace(value)
		if value != "" {
			values = append(values, value)
		}
	}
	return values
}

func compactSpace(value string) string {
	return strings.Join(strings.Fields(strings.TrimSpace(value)), " ")
}

func mustJSON(value any) []byte {
	data, err := json.Marshal(value)
	if err != nil {
		panic(err)
	}
	return data
}

func weakETag(data []byte) string {
	sum := sha256.Sum256(data)
	return `W/"` + hex.EncodeToString(sum[:12]) + `"`
}

func getEnv(key, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}
	return fallback
}
