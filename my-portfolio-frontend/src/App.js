import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const journeyRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  const portfolioData = {
    name: "Vivek Prakash",
    tagline: "Full Stack Developer with Golang",
    intro: "Passionate about building innovative and efficient web solutions. Eager to learn, adapt, and contribute by building real-world projects that combine strong fundamentals with practical implementation.",
    about: "I’m Vivek Prakash, a final-year engineering student with a strong focus on backend development and scalable systems. Over the past few years, I’ve gained hands-on experience building REST APIs, microservices, and performance-optimized applications using Go, Gin, Docker, and AWS. I have a solid foundation in Data Structures, Algorithms, and System Design, which I’ve applied in both academic projects and personal initiatives. I’ve also explored frontend with React to build full-stack solutions, which has helped me understand end-to-end product development. My problem-solving skills have been strengthened through consistent DSA practice, and I’m actively preparing for placements at top companies like Microsoft. Beyond technical skills, I’m driven by a long-term goal to build impactful, reliable, and scalable products, and I’m always looking for opportunities where I can contribute meaningfully and keep growing as an engineer.",
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
        github: "https://github.com/Vivek-Prakash1307/email-domain-checker",
        technologies: ["Go"],
      },
      {
        title: "Go-Stock-scrapper",
        description: "A web scraping tool built with Go (Golang) and Colly to fetch live stock market data from Yahoo Finance. The program collects information such as company name, current stock price, and percentage change, then stores the results in a CSV file for further analysis or record-keeping.",
        github: "https://github.com/Vivek-Prakash1307/amazon-clone",
        technologies: ["HTML", "CSS", "JavaScript"],
      },
      {
        title: "Web Server API (Go, MySQL)",
        description: "Developed RESTful API endpoints using Gin and GORM for user authentication and product management. Integrated MySQL database with complete CRUD operations.",
        github: "https://github.com/Vivek-Prakash1307/web-server-api",
        technologies: ["Go", "MySQL", "Gin", "GORM"],
      },
      {
        title: "Weather Tracker ",
        description: "Combined two microservices: a weather dashboard using OpenWeatherMap API and a secure URL shortener with JWT authentication. Implemented MongoDB integration for persistent shortlink storage.",
        github: "https://github.com/Vivek-Prakash1307/URL_SHORTENER",
        technologies: ["Go", "MongoDB"],
      },
      {
        title: "Load Balancer (Go)",
        description: "Built a lightweight HTTP load balancer using round-robin algorithm with custom server health checks. Improved request distribution and fault tolerance for backend microservices.",
        github: "https://github.com/Vivek-Prakash1307/load-balancer",
        technologies: ["Go"],
      },
      {
        title: "Go URL Shortener",
        description: "A lightweight URL shortening service built with Go (Golang). This application allows users to enter a long URL and generate a shortened link that redirects to the original address. It uses an in-memory map for storing short-to-original URL mappings, making it simple and fast for local testing or small-scale deployments.",
        github: "https://github.com/Vivek-Prakash1307/load-balancer",
        technologies: ["Go"],
      },
    ],
    contact: {
      email: "alivevivek8@gmail.com",
      phone: "+91 7309058513",
      github: "github.com/Vivek-Prakash1307",
      linkedin: "linkedin.com/in/vivek-prakash-00230a300",
      leetcode: "leetcode.com/u/alivevivek8",
    }
  };

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const animateObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const sections = [homeRef, aboutRef, journeyRef, skillsRef, projectsRef, contactRef];
    sections.forEach(ref => {
      if (ref.current) {
        navObserver.observe(ref.current);
        animateObserver.observe(ref.current);
      }
    });

    document.querySelectorAll('.scroll-animate').forEach(el => {
      animateObserver.observe(el);
    });

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      sections.forEach(ref => {
        if (ref.current) {
          navObserver.unobserve(ref.current);
          animateObserver.unobserve(ref.current);
        }
      });
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Message sent successfully! I\'ll get back to you soon. 🚀'
        });
        setFormData({ name: '', email: '', message: '' }); // Reset form
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please check your connection or try emailing me directly.'
      });
    } finally {
      setIsSubmitting(false);
      // Clear status after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: '', message: '' });
      }, 5000);
    }
  };

  const FloatingParticles = () => {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animation: `float ${5 + Math.random() * 10}s infinite linear`,
            }}
          />
        ))}
      </div>
    );
  };

  const MouseTracker = () => (
    <div
      className="fixed w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full pointer-events-none opacity-20 blur-sm transition-all duration-300 ease-out z-50"
      style={{
        left: mousePosition.x - 16,
        top: mousePosition.y - 16,
        transform: 'translate3d(0, 0, 0)',
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative">
      <FloatingParticles />
      <MouseTracker />
      
      {/* Navigation */}
      <nav className="fixed w-full z-40 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {portfolioData.name.split(' ')[0]}
          </div>
          <div className="hidden md:flex space-x-1">
            {['home', 'about', 'journey', 'skills', 'projects', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`px-6 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                  activeSection === section
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 shadow-lg shadow-emerald-400/25'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" ref={homeRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/50 to-emerald-900/50"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <div className="mb-8">
              <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 p-1 mb-8 shadow-2xl shadow-emerald-400/25">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-6xl font-bold text-white">
                  VP
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-6">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                {portfolioData.name}
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-emerald-400 mb-4 font-medium">{portfolioData.tagline}</p>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">{portfolioData.intro}</p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => scrollToSection('projects')}
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-400/50"
              >
                <span className="relative z-10">View My Work</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button
                onClick={() => scrollToSection('contact')}
                className="group relative px-8 py-4 border-2 border-emerald-400 text-emerald-400 font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-emerald-400 hover:text-slate-900"
              >
                <span className="relative z-10">Let's Connect</span>
              </button>
            </div>

            <div className="flex justify-center space-x-8 mt-12">
              {[
                { href: `https://${portfolioData.contact.github}`, icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" },
                { href: `https://${portfolioData.contact.linkedin}`, icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                { href: `https://${portfolioData.contact.leetcode}`, icon: "M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:text-slate-900 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900/50"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-5xl font-black text-center mb-16 scroll-animate">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">About Me</span>
          </h2>
          <div className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl scroll-animate hover:shadow-emerald-400/20 transition-all duration-500">
            <p className="text-lg leading-relaxed text-white/90 mb-6">{portfolioData.about}</p>
            <p className="text-lg leading-relaxed text-white/90">
              My goal is to leverage my expertise to build impactful solutions that make a difference.
            </p>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section id="journey" ref={journeyRef} className="py-24 px-6 bg-gradient-to-r from-slate-900 to-purple-900 relative">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-5xl font-black text-center mb-16 scroll-animate">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">My Journey</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Education */}
            <div className="scroll-animate">
              <h3 className="text-3xl font-bold text-emerald-400 mb-10 text-center lg:text-left">Education</h3>
              <div className="space-y-8">
                {portfolioData.education.map((edu, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-400/20"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-l-2xl transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
                    <h4 className="text-xl font-bold text-white mb-2">{edu.degree}</h4>
                    <p className="text-emerald-400 font-medium">{edu.institution}</p>
                    <p className="text-white/60 text-sm">{edu.years}</p>
                    {edu.cgpa && <p className="text-cyan-400 text-sm font-medium mt-1">CGPA: {edu.cgpa}</p>}
                    {edu.percentage && <p className="text-cyan-400 text-sm font-medium mt-1">Percentage: {edu.percentage}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="scroll-animate">
              <h3 className="text-3xl font-bold text-purple-400 mb-10 text-center lg:text-left">Experience</h3>
              <div className="space-y-8">
                {portfolioData.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-400/20"
                  >
                    <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400 rounded-r-2xl transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
                    <h4 className="text-xl font-bold text-white mb-2">{exp.title}</h4>
                    <p className="text-purple-400 font-medium">{exp.company}</p>
                    <p className="text-white/60 text-sm">{exp.years}</p>
                    <p className="text-white/80 mt-3">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" ref={skillsRef} className="py-24 px-6 bg-gradient-to-r from-purple-900 to-slate-900 relative">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-5xl font-black text-center mb-16 scroll-animate">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">My Skills</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Coding Skills */}
            <div className="scroll-animate">
              <h3 className="text-3xl font-bold text-cyan-400 mb-10 text-center lg:text-left">Coding Skills</h3>
              <div className="space-y-6">
                {portfolioData.codingSkills.map((skill, index) => (
                  <div key={index} className="group bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white text-lg font-bold">{skill.name}</span>
                      <span className="text-cyan-400 text-lg font-bold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-cyan-400/50"
                        style={{ 
                          width: `${skill.level}%`,
                          animation: `fillBar 2s ease-out ${index * 0.2}s both`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Skills */}
            <div className="scroll-animate">
              <h3 className="text-3xl font-bold text-purple-400 mb-10 text-center lg:text-left">Professional Skills</h3>
              <div className="space-y-6">
                {portfolioData.professionalSkills.map((skill, index) => (
                  <div key={index} className="group bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white text-lg font-bold">{skill.name}</span>
                      <span className="text-purple-400 text-lg font-bold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-purple-400/50"
                        style={{ 
                          width: `${skill.level}%`,
                          animation: `fillBar 2s ease-out ${index * 0.2}s both`
                        }}
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
      <section id="projects" ref={projectsRef} className="py-24 px-6 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <h2 className="text-5xl font-black text-center mb-16 scroll-animate">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">My Projects</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.projects.map((project, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden hover:border-emerald-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-400/25 scroll-animate"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-emerald-400 transition-colors duration-300 hover:scale-110 transform"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-white/80 mb-6 leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-400/30 hover:bg-emerald-400/30 transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="py-24 px-6 bg-gradient-to-br from-purple-900 via-slate-900 to-emerald-900 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-5xl font-black text-center mb-8 scroll-animate">
            <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">Let's Connect!</span>
          </h2>
          
          <p className="text-xl text-center text-white/80 mb-16 scroll-animate">
            Ready to bring your ideas to life? Let's build something amazing together!
          </p>

          <div className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl scroll-animate">
            {/* Status Message */}
            {submitStatus.message && (
              <div className={`mb-6 p-4 rounded-xl border ${
                submitStatus.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              } transition-all duration-300`}>
                <div className="flex items-center">
                  {submitStatus.type === 'success' ? (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {submitStatus.message}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-white/70 text-sm font-bold mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 group-hover:border-emerald-400/50"
                    placeholder="Your Name"
                  />
                </div>
                <div className="group">
                  <label className="block text-white/70 text-sm font-bold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 group-hover:border-emerald-400/50"
                    placeholder="Your Email"
                  />
                </div>
              </div>
              
              <div className="group">
                <label className="block text-white/70 text-sm font-bold mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 group-hover:border-emerald-400/50 resize-none"
                  placeholder="Tell me about your project, collaboration ideas, or just say hello..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full px-8 py-4 font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                  isSubmitting 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-400 to-cyan-400 hover:shadow-2xl hover:shadow-emerald-400/50'
                } text-slate-900`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </span>
                {!isSubmitting && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div className="group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-white/60 text-sm">Email</p>
                  <p className="text-emerald-400 font-medium text-sm">{portfolioData.contact.email}</p>
                </div>
                
                <div className="group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <p className="text-white/60 text-sm">Phone</p>
                  <p className="text-purple-400 font-medium text-sm">{portfolioData.contact.phone}</p>
                </div>
                
                <div className="group">
                  <a href={`https://${portfolioData.contact.github}`} target="_blank" rel="noopener noreferrer">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </div>
                    <p className="text-white/60 text-sm">GitHub</p>
                    <p className="text-cyan-400 font-medium text-sm hover:underline">View Profile</p>
                  </a>
                </div>
                
                <div className="group">
                  <a href={`https://${portfolioData.contact.linkedin}`} target="_blank" rel="noopener noreferrer">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    <p className="text-white/60 text-sm">LinkedIn</p>
                    <p className="text-blue-400 font-medium text-sm hover:underline">Connect</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-xl py-12 text-center border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              {portfolioData.name}
            </div>
            <p className="text-white/60">Full Stack Developer</p>
          </div>
          
          <p className="text-white/50 text-sm mb-4">
            &copy; {new Date().getFullYear()} {portfolioData.name}. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Designed & Built with React, Tailwind CSS, and Go
          </p>
        </div>
      </footer>

      {/* Enhanced Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * {
          font-family: 'Inter', sans-serif;
        }

        body {
          overflow-x: hidden;
        }

        .scroll-animate {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scroll-animate.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }

        @keyframes fillBar {
          from { width: 0%; }
          to { width: var(--final-width); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 3s ease infinite;
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(52, 211, 153, 0.3); }
          50% { box-shadow: 0 0 40px rgba(52, 211, 153, 0.6); }
        }

        .hover\\:animate-glow:hover {
          animation: glow 2s ease-in-out infinite;
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #06b6d4);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #0891b2);
        }

        /* Enhanced button hover effects */
        .btn-glow {
          position: relative;
          overflow: hidden;
        }

        .btn-glow::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .btn-glow:hover::before {
          left: 100%;
        }
      `}</style>
    </div>
  );
}

export default App;