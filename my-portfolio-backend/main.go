package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// ResumeData struct to hold the portfolio information
// This can be expanded to include more detailed sections like education, experience, etc.
type ResumeData struct {
	Name    string   `json:"name"`
	Tagline string   `json:"tagline"`
	About   string   `json:"about"`
	Skills  []SkillCategory `json:"skills"`
	Projects []Project `json:"projects"`
	Contact ContactInfo `json:"contact"`
}

// SkillCategory struct for skills
type SkillCategory struct {
	Category string   `json:"category"`
	Items    []string `json:"items"`
}

// Project struct for projects
type Project struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Github      string   `json:"github"`
	Technologies []string `json:"technologies"`
}

// ContactInfo struct for contact details
type ContactInfo struct {
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Github   string `json:"github"`
	Linkedin string `json:"linkedin"`
}

func main() {
	// Initialize Gin router
	router := gin.Default()

	// Configure CORS middleware
	// This is crucial to allow your React frontend (running on a different port/domain)
	// to make requests to your Go backend.
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://127.0.0.1:3000"}, // Replace with your frontend URL(s) in production
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           86400, // 24 hours
	}))

	// Define a simple API endpoint to serve resume data
	router.GET("/api/resume", getResumeData)

	// Start the server
	port := ":8080" // You can change the port as needed
	log.Printf("Go backend server starting on port %s", port)
	if err := router.Run(port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

// getResumeData handles the /api/resume GET request
func getResumeData(c *gin.Context) {
	// In a real application, this data might come from a database.
	// For now, we'll hardcode it to match the frontend's dummy data.
	data := ResumeData{
		Name:    "Vivek Prakash",
		Tagline: "Full Stack Developer | Go, React, JavaScript Enthusiast",
		About:   "A passionate and results-driven Full Stack Developer with a strong foundation in Go, React, JavaScript, and various database technologies. I thrive on building robust, scalable, and user-friendly applications. With experience in developing RESTful APIs, responsive UIs, and microservices, I am always eager to learn new technologies and solve complex problems.",
		Skills: []SkillCategory{
			{Category: "Languages", Items: []string{"Go", "C++", "HTML", "CSS", "JavaScript"}},
			{Category: "Frameworks/Tools", Items: []string{"Gin", "GORM", "Git", "Docker", "Bash", "Linux", "React", "Tailwind CSS"}},
			{Category: "Databases", Items: []string{"MySQL", "PostgreSQL", "MongoDB"}},
			{Category: "Core CS", Items: []string{"Data Structures", "Algorithms", "OOP", "OS", "Computer Networks"}},
			{Category: "Soft Skills", Items: []string{"Team Collaboration", "Debugging", "Code Optimization", "Communication"}},
		},
		Projects: []Project{
			{
				Title:       "Email Checker Tool (Go)",
				Description: "Built a Go-based utility that validates email syntax and domain existence using modular design and efficient error handling. Improved input reliability by integrating domain lookup APIs.",
				Github:      "https://github.com/Vivek-Prakash1307/email-checker",
				Technologies: []string{"Go"},
			},
			{
				Title:       "Amazon Clone UI (HTML, CSS, JS)",
				Description: "Created a fully responsive e-commerce interface mimicking Amazon's layout and product cards. Focused on responsive design principles to ensure cross-device compatibility.",
				Github:      "https://github.com/Vivek-Prakash1307/amazon-clone",
				Technologies: []string{"HTML", "CSS", "JavaScript"},
			},
			{
				Title:       "Web Server API (Go, MySQL)",
				Description: "Developed RESTful API endpoints using Gin and GORM for user authentication and product management. Integrated MySQL database with complete CRUD operations.",
				Github:      "https://github.com/Vivek-Prakash1307/web-server-api",
				Technologies: []string{"Go", "MySQL", "Gin", "GORM"},
			},
			{
				Title:       "Weather Tracker & URL Shortener (Go, MongoDB)",
				Description: "Combined two microservices: a weather dashboard using OpenWeatherMap API and a secure URL shortener with JWT authentication. Implemented MongoDB integration for persistent shortlink storage.",
				Github:      "https://github.com/Vivek-Prakash1307/weather-url-shortener",
				Technologies: []string{"Go", "MongoDB"},
			},
			{
				Title:       "Load Balancer (Go)",
				Description: "Built a lightweight HTTP load balancer using round-robin algorithm with custom server health checks. Improved request distribution and fault tolerance for backend microservices.",
				Github:      "https://github.com/Vivek-Prakash1307/load-balancer",
				Technologies: []string{"Go"},
			},
		},
		Contact: ContactInfo{
			Email:    "alivevivek8@gmail.com",
			Phone:    "+91 7309058513",
			Github:   "github.com/Vivek-Prakash1307",
			Linkedin: "linkedin.com/in/vivek-prakash-00230a300",
		},
	}

	c.JSON(http.StatusOK, data)
}
