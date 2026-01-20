package main

import (
	"bytes"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os"
    "time"
	"strings"
    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
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

// ContactMessage struct for handling contact form submissions
type ContactMessage struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Message string `json:"message" binding:"required"`
}

// EmailConfig holds email configuration
type EmailConfig struct {
    APIKey    string
    FromEmail string
    ToEmail   string
}


func main() {
	router := gin.Default()

	originsEnv := getEnv("ALLOWED_ORIGINS", "http://localhost:3000")
	// allow comma-separated list if you ever add more
	var allowedOrigins []string
	for _, o := range strings.Split(originsEnv, ",") {
		o = strings.TrimSpace(o)
		if o != "" {
			allowedOrigins = append(allowedOrigins, o)
		}
	}

	log.Printf("✅ CORS AllowOrigins: %+v\n", allowedOrigins)

	router.Use(cors.New(cors.Config{
    AllowOrigins: allowedOrigins,
    AllowMethods:     []string{"GET", "POST", "OPTIONS","PUT","DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Accept","Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
}))

	router.GET("/api/resume", getResumeData)
	router.POST("/api/contact", handleContactForm)
	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy", "service": "portfolio-api"})
	})

	port := ":8080"
	log.Printf("🚀 Portfolio API server starting on port %s", port)
	if err := router.Run(port); err != nil {
		log.Fatalf("❌ Failed to run server: %v", err)
	}
}

func getResumeData(c *gin.Context) {
	data := ResumeData{
		Name:    "Vivek Prakash",
		Tagline: "Full Stack Developer | Go, React, JavaScript Enthusiast",
		About:   "A passionate and results-driven Full Stack Developer with a strong foundation in Go, React, JavaScript, and various database technologies. I thrive on building robust, scalable, and user-friendly applications. With experience in developing RESTful APIs, responsive UIs, and microservices, I am always eager to learn new technologies and solve complex problems.",
		Skills: []SkillCategory{
			{Category: "Languages", Items: []string{"Go", "C++", "HTML", "CSS", "JavaScript","Java","Python"}},
			{Category: "Frameworks/Tools", Items: []string{"Gin", "GORM", "Git", "Docker", "Bash", "Linux", "React", "Tailwind CSS","Fiber"}},
			{Category: "Databases", Items: []string{"MySQL", "PostgreSQL", "MongoDB"}},
			{Category: "Core CS", Items: []string{"Data Structures", "Algorithms", "Object Oriented Programming", "Operating System", "Computer Networks"}},
			{Category: "Soft Skills", Items: []string{"Team Collaboration", "Debugging", "Code Optimization", "Communication"}},
		},
		Projects: []Project{
			{
				Title:        "Email-Intelligence-Platform",
				Description:  "Built a Go-based utility that validates email syntax and domain existence using modular design and efficient error handling. Improved input reliability by integrating domain lookup APIs.",
				Github:       "https://email-intelligence-platform-eora.vercel.app/",
				Technologies: []string{  "Go (Golang)",
					"Gin (HTTP Framework)",
					"Goroutines (Concurrency)",
					"REST APIs",
					"DNS MX Record Lookup",
					"SMTP Validation (Basic)",
					"CORS Handling",
					"React",
					"HTML",
					"CSS",
					"Tailwind CSS",
					"PostgreSQL / MySQL",
					"Docker",
					"Linux",
					"Git",
					"GitHub",
					"Postman",
					"Render (Backend Deployment)",
					"Vercel (Frontend Deployment)",
				},
			},
			{
				Title:        "Go-Stock-scrapper",
				Description:  "A web scraping tool built with Go (Golang) and Colly to fetch live stock market data from Yahoo Finance. The program collects information such as company name, current stock price, and percentage change, then stores the results in a CSV file for further analysis or record-keeping.",
				Github:       "https://github.com/Vivek-Prakash1307/Stock-Scrapper",
				Technologies: []string{"HTML", "CSS", "JavaScript"},
			},
			{
				Title:        "Web Server API",
				Description:  "Developed RESTful API endpoints using Gin and GORM for user authentication and product management. Integrated MySQL database with complete CRUD operations.",
				Github:       "https://github.com/Vivek-Prakash1307/Web-Server-API",
				Technologies: []string{"Go", "MySQL", "Gin", "GORM"},
			},
			{
				Title:        "Weather-app",
				Description:  "Combined two microservices: a weather dashboard using OpenWeatherMap API and a secure URL shortener with JWT authentication. Implemented MongoDB integration for persistent shortlink storage.",
				Github:       "https://github.com/Vivek-Prakash1307/Weather-app",
				Technologies: []string{  "Go (Golang)",
								"Gin (HTTP Framework)",
								"REST APIs",
								"External Weather API Integration",
								"In-Memory Caching",
								"JSON Data Handling",
								"HTTP Client",
								"Error Handling & Logging",
								"Docker",
								"Linux",
								"Git",
								"GitHub",
								"Postman",
								"Health Checks",
								"Microservice Architecture"},
			},
			{
				Title:        "HTTP Load Balancer",
				Description:  "Built a lightweight HTTP load balancer using round-robin algorithm with custom server health checks. Improved request distribution and fault tolerance for backend microservices.",
				Github:       "https://github.com/Vivek-Prakash1307/Load_Balancer",
				Technologies: []string{"Go","net/http","Reverse Proxy",
   					 "Round-Robin Load Balancing", "Goroutines (Concurrency)"},
			},
			{
				Title:        "URL_SHORTENER",
				Description:  "Built a lightweight HTTP load balancer using round-robin algorithm with custom server health checks. Improved request distribution and fault tolerance for backend microservices.",
				Github:       "https://github.com/Vivek-Prakash1307/URL_SHORTENER",
				Technologies: []string{"Go"},
			},
			{
				Title:        "Slack-bot",
				Description:  "Built a Go-based Slack bot that listens to user commands, parses input parameters, and calculates age from the provided year of birth. The bot securely loads environment variables, handles invalid input gracefully, and processes Slack command events concurrently using Go routines.",
				Github:       "https://github.com/Vivek-Prakash1307/Slack-bot",
				Technologies: []string{"Go (Golang)", "Slack API", "Slacker Framework", "dotenv"," Goroutines", "Context API", "Environment Variables", "Input Validation"},
			},
			{
				Title:        "PPT-to-PDF-Converter",
				Description:  "Built a production-ready Go web application that converts multiple document formats (PPT, PPTX, ODP, DOC, DOCX, ODT) to PDF with enterprise-grade performance. Features concurrent job processing, real-time progress tracking, 100MB file support, and optimized LibreOffice integration. Deployed with Docker containerization on Railway with automated health checks, file cleanup routines, and comprehensive error handling.",
				Github:       "https://github.com/Vivek-Prakash1307/PPT-TO-PDF-CONVERTER",
				Technologies: []string{"Go (Golang)", "Gin Framework", "LibreOffice", "Docker", "Railway", "Ubuntu", "JavaScript ES6+", "HTML5", "CSS3", "RESTful APIs", "Concurrent Processing", "File Storage Systems", "YAML Configuration", "Logrus", "UUID", "CORS Middleware", "Health Monitoring", "CI/CD Pipeline", "Container Orchestration", "Process Management"},
			},
			{
				Title:        "Chunked-File-Uploader",
				Description:  "Built a production-ready React TypeScript web application featuring robust chunked file uploads with enterprise-grade reliability. Implements deterministic state machine architecture, automatic retry mechanisms with exponential backoff, IndexedDB persistence for upload resumption, real-time progress tracking, and comprehensive accessibility support. Features pause/resume functionality, checksum verification, concurrent chunk processing, and extensive test coverage with Vitest, React Testing Library, and Storybook integration.",
				Github:       "https://github.com/Vivek-Prakash1307/chunked-file-uploader", // Add your GitHub URL here
				Technologies: []string{
					"React 19", 
					"TypeScript", 
					"Vite", 
					"IndexedDB", 
					"Web Crypto API", 
					"State Machine Architecture", 
					"Chunked Upload Protocol", 
					"Checksum Verification", 
					"Vitest", 
					"React Testing Library", 
					"Storybook", 
					"Playwright", 
					"ESLint", 
					"Accessibility (WCAG)", 
					"Drag & Drop API", 
					"File API", 
					"Concurrent Processing", 
					"Error Recovery", 
					"Progress Tracking", 
					"Persistence Layer", 
					"Component Testing", 
					"Visual Testing", 
					"CI/CD Pipeline",
				},
			},

			{
				Title:        "TaskFlow-Task-Management-App",
				Description:  "Built a full-stack task management application with modern SaaS-style authentication and kanban board functionality. Features secure JWT-based user authentication, responsive mobile-first UI design, real-time task operations (CRUD), and organized task categorization with color-coded status indicators (Todo-Red, In Progress-Yellow, Completed-Green). Implemented with React frontend using Tailwind CSS for modern UI components, Node.js/Express backend with MongoDB database, and comprehensive error handling with loading states.",
				Github:       "https://github.com/Vivek-Prakash1307/PrimeTrade",
				Technologies: []string{"React.js", "Node.js", "Express.js", "MongoDB", "Mongoose ODM", "JWT Authentication", "bcryptjs", "Tailwind CSS", "Vite", "Axios", "React Router DOM", "Context API", "JavaScript ES6+", "HTML5", "CSS3", "RESTful APIs", "CORS Middleware", "dotenv", "Responsive Design", "Mobile-First Design", "SaaS UI/UX", "Kanban Board", "Real-time Updates", "Form Validation", "Error Handling", "Loading States", "Local Storage", "Modern Authentication Flow"},
			},

			{
				Title:        "CLI-Task-Manager",
				Description:  "Built a command-line task management application in Go with interactive terminal interface. Features include adding new tasks with unique IDs, listing all tasks with completion status, marking tasks as done, and persistent session management. Implements clean CLI commands (add, list, done, exit) with real-time feedback and error handling for invalid operations. The application uses Go's built-in packages for efficient I/O operations and string manipulation, providing a lightweight and fast task management solution for developers who prefer terminal-based workflows.",
				Github:       "https://github.com/Vivek-Prakash1307/ToDo-List",
				Technologies: []string{"Go", "Go Modules", "bufio Package", "Command Line Interface", "Terminal I/O", "Interactive Shell"},
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

	c.Header("Cache-Control", "public, max-age=300")
	c.JSON(http.StatusOK, data)
}

// handleContactForm processes contact form submissions and sends email
func handleContactForm(c *gin.Context) {
    var contactMsg ContactMessage

    // Bind and validate JSON input
    if err := c.ShouldBindJSON(&contactMsg); err != nil {
        log.Printf("❌ Bind error in /api/contact: %v", err)
        c.JSON(http.StatusBadRequest, gin.H{
            "error":   "Invalid input data",
            "details": err.Error(),
        })
        return
    }

    log.Printf("📩 Contact request: %+v", contactMsg)

    // ✅ Resend email config (HTTP API, no SMTP)
    emailConfig := EmailConfig{
        APIKey:    getEnv("RESEND_API_KEY", ""),
        FromEmail: getEnv("FROM_EMAIL", ""),
        ToEmail:   getEnv("TO_EMAIL", "alivevivek8@gmail.com"),
    }

    if emailConfig.APIKey == "" || emailConfig.FromEmail == "" {
        log.Println("❌ Email not configured correctly – RESEND_API_KEY or FROM_EMAIL missing")
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Email service is not configured correctly on server.",
        })
        return
    }

    // Send email via Resend HTTP API
    if err := sendEmail(emailConfig, contactMsg); err != nil {
        log.Printf("❌ Failed to send email via Resend: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to send message. Please try again later.",
        })
        return
    }

    // Log the contact attempt
    log.Printf("✅ Email sent successfully from %s (%s)", contactMsg.Name, contactMsg.Email)

    c.JSON(http.StatusOK, gin.H{
        "message": "Message sent successfully! I'll get back to you soon.",
        "status":  "success",
    })
}


// sendEmail sends the contact form email using SMTP
// sendEmail uses Resend HTTP API to send the contact form email
func sendEmail(config EmailConfig, contactMsg ContactMessage) error {
    subject := fmt.Sprintf("Portfolio Contact: Message from %s", contactMsg.Name)

    body := fmt.Sprintf(`
New contact form submission from your portfolio website:

Name: %s
Email: %s
Time: %s

Message:
%s

--
This message was sent from your portfolio contact form.
`, contactMsg.Name, contactMsg.Email, time.Now().Format("2006-01-02 15:04:05"), contactMsg.Message)

    // Resend API payload
    payload := map[string]interface{}{
        "from":    fmt.Sprintf("Portfolio Contact <%s>", config.FromEmail),
        "to":      []string{config.ToEmail},
        "subject": subject,
        "text":    body,
    }

    buf := new(bytes.Buffer)
    if err := json.NewEncoder(buf).Encode(payload); err != nil {
        return fmt.Errorf("failed to encode email payload: %w", err)
    }

    req, err := http.NewRequest("POST", "https://api.resend.com/emails", buf)
    if err != nil {
        return fmt.Errorf("failed to create HTTP request: %w", err)
    }

    req.Header.Set("Authorization", "Bearer "+config.APIKey)
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{
        Timeout: 10 * time.Second,
    }

    resp, err := client.Do(req)
    if err != nil {
        return fmt.Errorf("failed to send HTTP request to Resend: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode >= 300 {
        var respBody bytes.Buffer
        _, _ = respBody.ReadFrom(resp.Body)
        return fmt.Errorf("Resend returned status %d: %s", resp.StatusCode, respBody.String())
    }

    return nil
}


// ✅ helper function to safely load env vars
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
