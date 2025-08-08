import React, { useState, useEffect, useRef } from 'react';

// Main App component
function App() {
  const [activeSection, setActiveSection] = useState('home');

  // Refs for sections to observe for scroll animation and navigation highlighting
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const journeyRef = useRef(null); // New ref for My Journey section
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  // Dummy data for the portfolio. In a real application, this might come from the Go backend.
  const portfolioData = {
    name: "Vivek Prakash",
    tagline: "Full Stack Developer",
    intro: "Passionate about building innovative and efficient web solutions.",
    about: "A highly motivated and detail-oriented Full Stack Developer with expertise in Go, React, JavaScript, and various database technologies. I specialize in crafting robust backend APIs and dynamic, responsive user interfaces. My commitment to clean code, performance optimization, and continuous learning drives me to deliver high-quality software solutions.",
    education: [
      { degree: "B.Tech in Computer Science", institution: "Dayananda Sagar University, Bengaluru", years: "2022-2026", cgpa: "8.59/10" },
      { degree: "M.Sc in Mathematics", institution: "V.B.S. Purvanchal University, UP", years: "2020-2022", percentage: "73%" },
      { degree: "B.Sc in Mathematics", institution: "V.B.S. Purvanchal University, UP", years: "2017-2020", percentage: "65.38%" },
    ],
    experience: [
      { title: "Web Developer", company: "Company A", years: "2024-Present", description: "Developed and maintained web applications using React and Go. Implemented RESTful APIs and integrated with various databases." },
      { title: "Software Intern", company: "Company B", years: "2023 Summer", description: "Contributed to backend services development, focusing on performance optimization and new feature implementation." },
    ],
    codingSkills: [
      { name: "Go", level: 90 },
      { name: "React", level: 85 },
      { name: "JavaScript", level: 80 },
      { name: "HTML/CSS", level: 95 },
      { name: "MySQL", level: 75 },
    ],
    professionalSkills: [
      { name: "Problem Solving", level: 90 },
      { name: "Team Collaboration", level: 85 },
      { name: "Code Optimization", level: 88 },
      { name: "Debugging", level: 92 },
      { name: "Communication", level: 80 },
    ],
    projects: [
      {
        title: "Email Checker Tool (Go)",
        description: "Built a Go-based utility that validates email syntax and domain existence using modular design and efficient error handling. Improved input reliability by integrating domain lookup APIs.",
        github: "https://github.com/Vivek-Prakash1307/email-domain-checker", // Replace with actual link
        technologies: ["Go"],
      },
      {
        title: "Amazon Clone UI (HTML, CSS, JS)",
        description: "Created a fully responsive e-commerce interface mimicking Amazon's layout and product cards. Focused on responsive design principles to ensure cross-device compatibility.",
        github: "https://github.com/Vivek-Prakash1307/amazon-clone", // Replace with actual link
        technologies: ["HTML", "CSS", "JavaScript"],
      },
      {
        title: "Web Server API (Go, MySQL)",
        description: "Developed RESTful API endpoints using Gin and GORM for user authentication and product management. Integrated MySQL database with complete CRUD operations.",
        github: "https://github.com/Vivek-Prakash1307/web-server-api", // Replace with actual link
        technologies: ["Go", "MySQL", "Gin", "GORM"],
      },
      {
        title: "Weather Tracker & URL Shortener (Go, MongoDB)",
        description: "Combined two microservices: a weather dashboard using OpenWeatherMap API and a secure URL shortener with JWT authentication. Implemented MongoDB integration for persistent shortlink storage.",
        github: "https://github.com/Vivek-Prakash1307/URL_SHORTENER", // Replace with actual link
        technologies: ["Go", "MongoDB"],
      },
      {
        title: "Load Balancer (Go)",
        description: "Built a lightweight HTTP load balancer using round-robin algorithm with custom server health checks. Improved request distribution and fault tolerance for backend microservices.",
        github: "https://github.com/Vivek-Prakash1307/load-balancer", // Replace with actual link
        technologies: ["Go"],
      },
    ],
    contact: {
      email: "alivevivek8@gmail.com",
      phone: "+91 7309058513",
      github: "github.com/Vivek-Prakash1307",
      linkedin: "linkedin.com/in/vivek-prakash-00230a300",
    }
  };

  // Function to create an Intersection Observer for scroll animations
  const createObserver = (ref, className) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(className);
            observer.unobserve(entry.target); // Stop observing once animated
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  };

  // Effect to handle scroll animations and navigation highlighting
  useEffect(() => {
    // For navigation highlighting
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = [homeRef, aboutRef, journeyRef, skillsRef, projectsRef, contactRef];
    sections.forEach(ref => {
      if (ref.current) navObserver.observe(ref.current);
    });

    // For scroll animations
    const cleanupFunctions = [
      createObserver(homeRef, 'animate-fade-in-up'),
      createObserver(aboutRef, 'animate-fade-in-up'),
      createObserver(journeyRef, 'animate-fade-in-up'),
      createObserver(skillsRef, 'animate-fade-in-up'),
      createObserver(projectsRef, 'animate-fade-in-up'),
      createObserver(contactRef, 'animate-fade-in-up'),
    ];

    // Observe individual elements for more granular animations
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 } // Adjust threshold as needed
      );
      observer.observe(el);
      cleanupFunctions.push(() => observer.unobserve(el));
    });


    return () => {
      sections.forEach(ref => {
        if (ref.current) navObserver.unobserve(ref.current);
      });
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, []);

  // Function to handle smooth scrolling
  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary text-light-text font-inter antialiased overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="fixed w-full z-50 bg-dark-primary bg-opacity-90 shadow-lg backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#home" className="text-2xl font-bold text-accent-primary hover:text-accent-secondary transition duration-300">
            {portfolioData.name.split(' ')[0]}
          </a>
          <div className="hidden md:flex space-x-2"> {/* Reduced space-x to make room for padding */}
            {['home', 'about', 'journey', 'skills', 'projects', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`
                  px-4 py-2 rounded-lg text-lg font-medium capitalize relative group
                  ${activeSection === section
                    ? 'bg-accent-primary/40 text-white shadow-md' // Active state: more opaque background, white text, shadow
                    : 'text-white hover:bg-accent-secondary/30' // Default: white text, more opaque hover background
                  }
                  transition-all duration-300 ease-in-out
                  hover:scale-105 transform
                `}
              >
                {section}
                {/* Removed underline effect for a cleaner box-style hover/active */}
                {/* <span className={`absolute left-0 bottom-0 w-full h-0.5 bg-accent-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${activeSection === section ? 'scale-x-100' : ''}`}></span> */}
              </button>
            ))}
          </div>
          {/* Mobile Menu Button (Hamburger) - Not implemented for brevity, but a common pattern */}
          <div className="md:hidden">
            <button className="text-white hover:text-accent-primary focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" ref={homeRef} className="relative flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/1920x1080/0A0A0A/00E676?text=Abstract+Cyber+Lines')" }}>
        <div className="absolute inset-0 bg-dark-primary opacity-70"></div>
        <div className="relative z-10 text-center p-8 bg-card-dark bg-opacity-80 rounded-xl shadow-2xl max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-glow-primary">
          <div className="md:w-1/2 text-left animate-on-scroll fade-in-left">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4">
              Hi, I'm <span className="text-accent-primary">{portfolioData.name}</span>
            </h1>
            <p className="text-3xl md:text-4xl text-accent-secondary mb-4">{portfolioData.tagline}</p>
            <p className="text-lg text-light-text-muted mb-8">{portfolioData.intro}</p>
            <div className="flex space-x-4">
              <a
                href="#projects"
                onClick={() => scrollToSection('projects')}
                className="px-8 py-3 bg-accent-primary text-dark-primary font-semibold rounded-full shadow-lg hover:bg-accent-secondary hover:text-white transform hover:scale-105 transition-all duration-300 ease-in-out group relative overflow-hidden"
              >
                <span className="relative z-10">View My Work</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-shine"></span>
              </a>
              <a
                href="#contact"
                onClick={() => scrollToSection('contact')}
                className="px-8 py-3 border-2 border-accent-primary text-accent-primary font-semibold rounded-full shadow-lg hover:bg-accent-primary hover:text-dark-primary transform hover:scale-105 transition-all duration-300 ease-in-out group relative overflow-hidden"
              >
                <span className="relative z-10">Let's Talk</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-shine"></span>
              </a>
            </div>
            <div className="flex space-x-6 mt-8 justify-start">
              <a href={`https://${portfolioData.contact.github}`} target="_blank" rel="noopener noreferrer" className="text-light-text-muted hover:text-accent-primary transform hover:scale-125 transition-transform duration-300">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.475.087.687-.206.687-.457 0-.228-.008-.836-.013-1.649-2.758.593-3.335-1.34-3.335-1.34-.45-.913-1.09-1.157-1.09-1.157-.886-.606.069-.594.069-.594.977.07 1.49.997 1.49 1.033.867 1.503 2.28.98 2.83.75.087-.587.34-1.09.626-1.339-2.14-.243-4.387-1.073-4.387-4.764 0-1.05.378-1.907 1.002-2.578-.1-.243-.435-1.218.097-2.54 0 0 .798-.258 2.618 1.002A9.014 9.014 0 0112 4.317c.85.004 1.7.11 2.5.326 1.82-1.26 2.618-1.002 2.618-1.002.532 1.322.197 2.297.097 2.54.624.67 1.002 1.528 1.002 2.578 0 3.699-2.25 4.516-4.396 4.75.35.304.67.921.67 1.855 0 1.34-.012 2.42-.012 2.747 0 .25.216.547.69.456C21.135 20.197 24 16.442 24 12.017 24 6.484 19.523 2 14 2h-2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href={`https://${portfolioData.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-light-text-muted hover:text-accent-primary transform hover:scale-125 transition-transform duration-300">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.325-.028-3.044-1.858-3.044-1.869 0-2.151 1.448-2.151 2.953v5.66H9.59V9.218h3.413v1.56c.493-.892 1.37-1.56 3.14-1.56 3.768 0 4.473 2.495 4.473 5.777v6.004zM3.388 8.574a2.27 2.27 0 01-2.269-2.268 2.27 2.27 0 012.269-2.268c1.254 0 2.272 1.018 2.272 2.268 0 1.25-.99 2.268-2.272 2.268zM3.535 20.452H.98V9.218h2.555v11.234z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center animate-on-scroll fade-in-right">
            <img
              src="https://placehold.co/400x400/0f172a/00E676?text=Your+Photo" // Replace with your actual photo
              alt="Vivek Prakash"
              className="rounded-full w-80 h-80 object-cover shadow-2xl border-4 border-accent-primary transform transition-all duration-500 hover:scale-105 hover:shadow-glow-primary"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="py-20 px-6 bg-dark-secondary">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center text-accent-primary mb-12 animate-on-scroll fade-in-up">About Me</h2>
          <div className="bg-card-dark p-8 rounded-xl shadow-lg border border-border-color animate-on-scroll fade-in-up delay-200 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-glow-secondary">
            <p className="text-lg leading-relaxed text-light-text-muted mb-4">{portfolioData.about}</p>
            <p className="text-lg leading-relaxed text-light-text-muted">
              My goal is to leverage my expertise to build impactful solutions that make a difference.
            </p>
          </div>
        </div>
      </section>

      {/* My Journey Section (Education & Experience) */}
      <section id="journey" ref={journeyRef} className="py-20 px-6 bg-dark-primary">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-accent-primary mb-12 animate-on-scroll fade-in-up">My Journey</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Education */}
            <div className="animate-on-scroll fade-in-left">
              <h3 className="text-3xl font-semibold text-accent-secondary mb-8 text-center md:text-left">Education</h3>
              <div className="space-y-8">
                {portfolioData.education.map((edu, index) => (
                  <div
                    key={index}
                    className="bg-card-dark p-6 rounded-xl shadow-lg border border-border-color transform transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-secondary relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-2 h-full bg-accent-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                    <h4 className="text-xl font-bold text-white mb-1">{edu.degree}</h4>
                    <p className="text-light-text-muted">{edu.institution}</p>
                    <p className="text-light-text-muted text-sm italic">{edu.years}</p>
                    {edu.cgpa && <p className="text-light-text-muted text-sm">CGPA: {edu.cgpa}</p>}
                    {edu.percentage && <p className="text-light-text-muted text-sm">Percentage: {edu.percentage}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="animate-on-scroll fade-in-right">
              <h3 className="text-3xl font-semibold text-accent-secondary mb-8 text-center md:text-left">Experience</h3>
              <div className="space-y-8">
                {portfolioData.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="bg-card-dark p-6 rounded-xl shadow-lg border border-border-color transform transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-secondary relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-2 h-full bg-accent-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                    <h4 className="text-xl font-bold text-white mb-1">{exp.title}</h4>
                    <p className="text-light-text-muted">{exp.company}</p>
                    <p className="text-light-text-muted text-sm italic">{exp.years}</p>
                    <p className="text-light-text-muted text-base mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" ref={skillsRef} className="py-20 px-6 bg-dark-secondary">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center text-accent-primary mb-12 animate-on-scroll fade-in-up">My Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Coding Skills */}
            <div className="animate-on-scroll fade-in-left">
              <h3 className="text-3xl font-semibold text-accent-secondary mb-8 text-center md:text-left">Coding Skills</h3>
              <div className="space-y-6">
                {portfolioData.codingSkills.map((skill, index) => (
                  <div key={index} className="bg-card-dark p-6 rounded-xl shadow-lg border border-border-color transform transition-all duration-300 hover:scale-[1.01] hover:shadow-glow-secondary">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-lg font-medium">{skill.name}</span>
                      <span className="text-accent-tertiary text-lg font-semibold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-accent-tertiary h-2.5 rounded-full animate-progress"
                        style={{ width: `${skill.level}%`, animationDelay: `${index * 100}ms` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Skills */}
            <div className="animate-on-scroll fade-in-right">
              <h3 className="text-3xl font-semibold text-accent-secondary mb-8 text-center md:text-left">Professional Skills</h3>
              <div className="space-y-6">
                {portfolioData.professionalSkills.map((skill, index) => (
                  <div key={index} className="bg-card-dark p-6 rounded-xl shadow-lg border border-border-color transform transition-all duration-300 hover:scale-[1.01] hover:shadow-glow-secondary">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-lg font-medium">{skill.name}</span>
                      <span className="text-accent-tertiary text-lg font-semibold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-accent-tertiary h-2.5 rounded-full animate-progress"
                        style={{ width: `${skill.level}%`, animationDelay: `${index * 100}ms` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" ref={projectsRef} className="py-20 px-6 bg-dark-primary">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-accent-primary mb-12 animate-on-scroll fade-in-up">My Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {portfolioData.projects.map((project, index) => (
              <div
                key={index}
                className="bg-card-dark rounded-xl shadow-lg overflow-hidden border border-border-color transform transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-primary group animate-on-scroll fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-accent-secondary transition duration-300">
                    {project.title}
                  </h3>
                  <p className="text-light-text-muted text-base mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="bg-accent-tertiary/20 text-accent-tertiary text-xs font-medium px-2.5 py-0.5 rounded-full border border-accent-tertiary/50">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-accent-primary hover:text-accent-secondary font-medium transition duration-300 group-hover:underline"
                  >
                    View on GitHub
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="py-20 px-6 bg-dark-secondary">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold text-center text-accent-primary mb-12 animate-on-scroll fade-in-up">Contact Me!</h2>
          <div className="bg-card-dark p-8 rounded-xl shadow-lg border border-border-color animate-on-scroll fade-in-up delay-200">
            <p className="text-lg text-light-text-muted text-center mb-8">
              Feel free to reach out to me for collaborations, job opportunities, or just a chat!
            </p>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-light-text-muted text-sm font-bold mb-2">Name</label>
                <input type="text" id="name" name="name" className="shadow appearance-none border rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-accent-primary bg-input-bg border-border-color transition duration-300" placeholder="Your Name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-light-text-muted text-sm font-bold mb-2">Email</label>
                <input type="email" id="email" name="email" className="shadow appearance-none border rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-accent-primary bg-input-bg border-border-color transition duration-300" placeholder="Your Email" />
              </div>
              <div>
                <label htmlFor="message" className="block text-light-text-muted text-sm font-bold mb-2">Your Message</label>
                <textarea id="message" name="message" rows="6" className="shadow appearance-none border rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-accent-primary bg-input-bg border-border-color transition duration-300" placeholder="Type your message here..."></textarea>
              </div>
              <button type="submit" className="w-full px-8 py-4 bg-accent-primary text-dark-primary font-semibold rounded-full shadow-lg hover:bg-accent-secondary hover:text-white transform hover:scale-105 transition-all duration-300 ease-in-out group relative overflow-hidden">
                <span className="relative z-10">Send Message</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-shine"></span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-primary py-8 text-center text-light-text-muted text-sm">
        <div className="container mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} {portfolioData.name}. All rights reserved.</p>
          <p className="mt-2">Designed & Built with React, Tailwind CSS, and Go</p>
        </div>
      </footer>

      {/* Global Styles and Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        body {
          font-family: 'Inter', sans-serif;
          overflow-x: hidden; /* Prevent horizontal scroll due to animations */
        }

        /* Custom Tailwind Colors (add these to tailwind.config.js as well) */
        /*
        extend: {
          colors: {
            'dark-primary': '#0A0A0A', // Almost black
            'dark-secondary': '#1A1A1A', // Slightly lighter dark
            'card-dark': '#2A2A2A', // For cards and forms
            'border-color': '#4A4A4A', // Subtle border for dark elements
            'light-text': '#E0E0E0', // Main light text
            'light-text-muted': '#A0A0A0', // Muted text
            'accent-primary': '#00E676', // Vibrant green (for headings, main buttons)
            'accent-secondary': '#64FFDA', // Lighter cyan (for sub-headings, hover states)
            'accent-tertiary': '#FFD700', // Golden yellow (for skill percentages, tags)
            'input-bg': '#3A3A3A', // Background for form inputs
          },
          boxShadow: {
            'glow-primary': '0 0 15px rgba(0, 230, 118, 0.7), 0 0 30px rgba(0, 230, 118, 0.5)', // Green glow
            'glow-secondary': '0 0 10px rgba(100, 255, 218, 0.5), 0 0 20px rgba(100, 255, 218, 0.3)', // Cyan glow
          },
        },
        */

        /* Animate on Scroll - Fade In Up */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .animate-on-scroll.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Specific animation delays for sequential appearance */
        .animate-on-scroll.delay-100 { transition-delay: 0.1s; }
        .animate-on-scroll.delay-200 { transition-delay: 0.2s; }
        .animate-on-scroll.delay-300 { transition-delay: 0.3s; }

        /* Fade In Left */
        .animate-on-scroll.fade-in-left {
          transform: translateX(-50px);
        }
        .animate-on-scroll.fade-in-left.is-visible {
          transform: translateX(0);
        }

        /* Fade In Right */
        .animate-on-scroll.fade-in-right {
          transform: translateX(50px);
        }
        .animate-on-scroll.fade-in-right.is-visible {
          transform: translateX(0);
        }

        /* Progress Bar Animation */
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: var(--skill-width); } /* Dynamically set by inline style */
        }
        .animate-progress {
          animation: progress-fill 1.5s ease-out forwards;
        }

        /* Shine Effect for Buttons */
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-30deg); }
          100% { transform: translateX(100%) skewX(-30deg); }
        }
        .group:hover .animate-shine {
          animation: shine 1s infinite linear;
        }
      `}</style>
    </div>
  );
}

export default App;
