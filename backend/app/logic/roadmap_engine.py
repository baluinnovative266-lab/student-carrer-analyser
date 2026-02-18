from typing import List, Dict, Any

class RoadmapEngine:
    """
    Generates personalized 4-phase career roadmaps based on:
    - Predicted career
    - Academic scores
    - Existing skills (from resume)
    - Confidence levels
    
    Each phase includes unique mindmap nodes, objectives, resources, and expectations.
    """
    
    TEMPLATES = {
        "Software Engineer": {
            "Phase 1 – Foundations": [
                {"skill": "Programming", "title": "Programming Logic & Syntax", "duration": "3 weeks", "outcome": "Mastery of control flows and data types."},
                {"skill": "Logic", "title": "Algorithmic Thinking", "duration": "2 weeks", "outcome": "Ability to solve complex problems with code."},
                {"skill": "Math", "title": "Discrete Mathematics", "duration": "4 weeks", "outcome": "Understanding logic, sets, and graph theory."}
            ],
            "Phase 2 – Core Skills": [
                {"skill": "Data Structures", "title": "Advanced Data Structures", "duration": "4 weeks", "outcome": "Efficiently handling memory and storage."},
                {"skill": "Web Development", "title": "Backend Architecture", "duration": "5 weeks", "outcome": "Building scalable server-side systems."},
                {"skill": "Database", "title": "Database Design & SQL", "duration": "3 weeks", "outcome": "Optimizing data retrieval and integrity."}
            ],
            "Phase 3 – Projects": [
                {"skill": "Full Stack", "title": "End-to-End Web App", "duration": "6 weeks", "outcome": "A production-ready SaaS application."},
                {"skill": "Git", "title": "Collaborative Development", "duration": "2 weeks", "outcome": "Working seamlessly with team workflows."}
            ],
            "Phase 4 – Career Preparation": [
                {"skill": "System Design", "title": "Scalability & Performance", "duration": "4 weeks", "outcome": "Designing high-traffic architectures."},
                {"skill": "Soft Skills", "title": "Technical Interviews Prep", "duration": "3 weeks", "outcome": "Confidence in coding and behavioral rounds."}
            ]
        },
        "Data Scientist": {
            "Phase 1 – Foundations": [
                {"skill": "Math", "title": "Statistical Foundations", "duration": "4 weeks", "outcome": "Grasping probability and inference."},
                {"skill": "Python", "title": "Python for Data Science", "duration": "3 weeks", "outcome": "Proficiency in NumPy and Pandas."}
            ],
            "Phase 2 – Core Skills": [
                {"skill": "Machine Learning", "title": "Supervised Learning", "duration": "5 weeks", "outcome": "Building Predictive Models."},
                {"skill": "SQL", "title": "Data Engineering for AI", "duration": "3 weeks", "outcome": "ETL processes and big data handling."}
            ],
            "Phase 3 – Projects": [
                {"skill": "Deep Learning", "title": "Neural Networks Project", "duration": "6 weeks", "outcome": "Implementing image/text classification."},
                {"skill": "Visualization", "title": "Data Storytelling", "duration": "2 weeks", "outcome": "Actionable dashboards and reports."}
            ],
            "Phase 4 – Career Preparation": [
                {"skill": "Case Studies", "title": "Business Problem Solving", "duration": "3 weeks", "outcome": "Translating data to business decisions."},
                {"skill": "Portfolio", "title": "Kaggle & GitHub Polish", "duration": "2 weeks", "outcome": "A professional data science presence."}
            ]
        },
        "Product Manager": {
            "Phase 1 – Foundations": [
                {"skill": "Market Research", "title": "Understanding the Market", "duration": "3 weeks", "outcome": "Analyzing user needs and market trends."},
                {"skill": "Communication", "title": "Effective Communication", "duration": "2 weeks", "outcome": "Articulating ideas clearly to stakeholders."}
            ],
            "Phase 2 – Core Skills": [
                {"skill": "Agile", "title": "Agile Methodologies", "duration": "4 weeks", "outcome": "Running scrums and managing backlogs."},
                {"skill": "Data Analysis", "title": "Product Metrics", "duration": "3 weeks", "outcome": "Making data-driven product decisions."}
            ],
            "Phase 3 – Projects": [
                {"skill": "Product Launch", "title": "End-to-End Product Lifecycle", "duration": "6 weeks", "outcome": "Launching a product from concept to market."},
                {"skill": "Strategy", "title": "Product Strategy", "duration": "3 weeks", "outcome": "Defining long-term product vision."}
            ],
            "Phase 4 – Career Preparation": [
                {"skill": "Case Studies", "title": "Product Case Studies", "duration": "3 weeks", "outcome": "Solving real-world product problems."},
                {"skill": "Interview Prep", "title": "PM Interview Prep", "duration": "3 weeks", "outcome": "Acing the PM interview process."}
            ]
        },
        "Cybersecurity Analyst": {
             "Phase 1 – Foundations": [
                {"skill": "Networking", "title": "Network Fundamentals", "duration": "4 weeks", "outcome": "Understanding TCP/IP, DNS, and HTTP."},
                {"skill": "OS Internals", "title": "Linux/Windows Internals", "duration": "3 weeks", "outcome": "Command line proficiency and system architecture."}
            ],
            "Phase 2 – Core Skills": [
                {"skill": "Security", "title": "Vulnerability Assessment", "duration": "4 weeks", "outcome": "Identifying and classifying security risks."},
                {"skill": "Cryptography", "title": "Applied Cryptography", "duration": "3 weeks", "outcome": "Securing data in transit and at rest."}
            ],
            "Phase 3 – Projects": [
                {"skill": "Penetration Testing", "title": "Ethical Hacking Lab", "duration": "5 weeks", "outcome": "Simulating attacks to find weaknesses."},
                {"skill": "SIEM", "title": "Security Monitoring", "duration": "3 weeks", "outcome": "Detecting and responding to incidents."}
            ],
            "Phase 4 – Career Preparation": [
                {"skill": "Certifications", "title": "CompTIA Security+ / CEH Prep", "duration": "4 weeks", "outcome": "Industry-recognized credential preparation."},
                {"skill": "Interview Prep", "title": "Security Interview Cases", "duration": "2 weeks", "outcome": "Handling technical security scenarios."}
            ]
        },
        "UI/UX Designer": {
            "Phase 1 – Foundations": [
                {"skill": "Design Theory", "title": "Design Principles", "duration": "3 weeks", "outcome": "Mastery of color, typography, and layout."},
                {"skill": "Tools", "title": "Figma Basics", "duration": "2 weeks", "outcome": "Proficiency in industry-standard design tools."}
            ],
            "Phase 2 – Core Skills": [
                {"skill": "User Research", "title": "UX Research Methods", "duration": "4 weeks", "outcome": "Conducting interviews and usability testing."},
                {"skill": "Prototyping", "title": "Interactive Prototyping", "duration": "3 weeks", "outcome": "Creating high-fidelity clickable mockups."}
            ],
            "Phase 3 – Projects": [
                {"skill": "App Redesign", "title": "Mobile App Case Study", "duration": "5 weeks", "outcome": "End-to-end redesign of a popular app."},
                {"skill": "Design System", "title": "Building a Design System", "duration": "3 weeks", "outcome": "Creating reusable component libraries."}
            ],
            "Phase 4 – Career Preparation": [
                {"skill": "Portfolio", "title": "Portfolio Curation", "duration": "3 weeks", "outcome": "Showcasing work effectively on Behance/Dribbble."},
                {"skill": "Interview Prep", "title": "Design Critiques", "duration": "2 weeks", "outcome": "Articulating design decisions confidently."}
            ]
        }
    }

    # ==========================================
    # DETAILED SKILL METADATA FOR SIDE PANELS
    # ==========================================
    SKILL_DETAILS = {
        "programming": {
            "description": "The logic and syntax used to build functional software. Focuses on variables, loops, and basic algorithms.",
            "importance": "Core foundation for any developer role. Prevents 'spaghetti code' and improves logic.",
            "use_cases": ["Backend Logic", "Scripting", "Mobile Apps"],
            "objectives": ["Understand Variables & Types", "Master Control Flow", "Apply OOP Patterns"],
            "learning_time": "4 Weeks"
        },
        "logic": {
            "description": "Structured thinking to solve complex problems by breaking them into smaller, manageable parts.",
            "importance": "Essential for debugging and architecture design.",
            "use_cases": ["Bug Fixing", "System Flow", "Game Logic"],
            "objectives": ["Boolean Algebra", "Edge Case Identification", "Pseudo-coding"],
            "learning_time": "2 Weeks"
        },
        "math": {
            "description": "Mathematical foundations like Statistics, Probability, and Discrete Math tailored for Tech.",
            "importance": "Powerhouse for Data Science and Graphics programming.",
            "use_cases": ["ML Models", "3D Rendering", "A/B Testing"],
            "objectives": ["Descriptive Statistics", "Calculus for ML", "Discrete Logic"],
            "learning_time": "4 Weeks"
        },
        "data structures": {
            "description": "Ways to store and organize data efficiently like Arrays, Hash Maps, and Trees.",
            "importance": "Directly impacts application speed and technical interview performance.",
            "use_cases": ["Search Engines", "Database Indices", "File Systems"],
            "objectives": ["Space/Time Complexity", "Tree Traversals", "Hash Map Optimization"],
            "learning_time": "3 Weeks"
        },
        "web development": {
            "description": "Building and maintaining websites, from visual elements to server logic.",
            "importance": "Most common entry point for software careers.",
            "use_cases": ["E-commerce", "SaaS Dashboards", "Personal Portfolios"],
            "objectives": ["Frontend (React/Vue)", "Backend (Node/FastAPI)", "RESTful APIs"],
            "learning_time": "5 Weeks"
        },
        "database": {
            "description": "Storing, retrieving, and managing and organizing data using SQL or NoSQL.",
            "importance": "The brain of any application; essential for data persistence.",
            "use_cases": ["User Management", "Transaction Logs", "Inventory Systems"],
            "objectives": ["Schema Normalization", "Indexing", "ACID Properties"],
            "learning_time": "3 Weeks"
        },
        "machine learning": {
            "description": "Algorithms that improve automatically through experience and data usage.",
            "importance": "Key for predictive analytics and modern AI features.",
            "use_cases": ["Recommendation Engines", "Fraud Detection", "Computer Vision"],
            "objectives": ["Supervised Learning", "Overfitting Prevention", "Hyperparameter Tuning"],
            "learning_time": "6 Weeks"
        },
        "ui/ux design": {
            "description": "Ensuring products are intuitive to use and visually pleasing.",
            "importance": "Determines user retention and overall product success.",
            "use_cases": ["App Interfaces", "Design Systems", "User Journeys"],
            "objectives": ["Figma Prototyping", "Hierarchy & Layout", "User Empathy"],
            "learning_time": "4 Weeks"
        },
        "agile": {
            "description": "Iterative project management that focuses on continuous delivery and feedback.",
            "importance": "Industry standard for how modern tech teams operate.",
            "use_cases": ["Scrum Teams", "Startup Pivots", "Large Engineering Orgs"],
            "objectives": ["Sprint Planning", "Jira/Linear Mastery", "Retrospectives"],
            "learning_time": "2 Weeks"
        },
        "security": {
            "description": "Protecting systems, networks, and programs from digital attacks.",
            "importance": "Critical to protect user data and maintain trust.",
            "use_cases": ["Pentesting", "Zero Trust Architecture", "SOC Analysis"],
            "objectives": ["Network Security", "Cryptography", "Identity Mgmt"],
            "learning_time": "5 Weeks"
        }
    }

    # ==========================================
    # ENRICHED PROJECTS FOR PHASES (Carrier + Phase)
    # ==========================================
    PROJECT_TEMPLATES = {
        "Software Engineer": {
            "Phase 1 – Foundations": [
                {"title": "Terminal Task Manager", "overview": "A CLI app to manage daily tasks.", "tech_stack": "Python", "difficulty": "Easy", "github_link": "https://github.com/project-hub/cli-task-manager"},
                {"title": "Algorithm Visualizer", "overview": "Visualize sorting algorithms in the browser.", "tech_stack": "JavaScript", "difficulty": "Medium", "github_link": "https://github.com/project-hub/algo-viz"}
            ],
            "Phase 2 – Core Skills": [
                {"title": "Real-time Chat App", "overview": "Build a messaging system with WebSockets.", "tech_stack": "Node.js + Socket.io", "difficulty": "Hard", "github_link": "https://github.com/project-hub/realtime-chat"},
                {"title": "Inventory API", "overview": "A robust REST API for warehouse management.", "tech_stack": "FastAPI + Postgres", "difficulty": "Medium", "github_link": "https://github.com/project-hub/inventory-api"}
            ],
            "Phase 3 – Projects": [
                {"title": "SaaS Dashboard", "overview": "Complete project management suite with Auth.", "tech_stack": "React + Firebase", "difficulty": "Hard", "github_link": "https://github.com/project-hub/saas-dashboard"},
                {"title": "E-commerce Microservice", "overview": "Scale a small store into microservices.", "tech_stack": "Go + Docker", "difficulty": "Expert", "github_link": "https://github.com/project-hub/micro-store"}
            ]
        },
        "Data Scientist": {
            "Phase 1 – Foundations": [
                {"title": "Stock Data Scraper", "overview": "Extract and clean financial data.", "tech_stack": "Python + BeautifulSoup", "difficulty": "Medium", "github_link": "https://github.com/project-hub/stock-scraper"}
            ],
            "Phase 2 – Core Skills": [
                {"title": "Housing Price Predictor", "overview": "Regression model for real estate.", "tech_stack": "Pandas + Scikit-learn", "difficulty": "Medium", "github_link": "https://github.com/project-hub/price-predict"}
            ],
            "Phase 3 – Projects": [
                {"title": "Deep Learning Chatbot", "overview": "Train an LSTM model for conversation.", "tech_stack": "TensorFlow/PyTorch", "difficulty": "Hard", "github_link": "https://github.com/project-hub/ai-chat"}
            ]
        },
        "UI/UX Designer": {
            "Phase 1 – Foundations": [
                {"title": "Portfolio Wireframes", "overview": "High-fidelity layouts for your own site.", "tech_stack": "Figma", "difficulty": "Easy", "github_link": "https://github.com/project-hub/ux-portfolio"}
            ],
            "Phase 3 – Projects": [
                {"title": "Healthcare App Redesign", "overview": "End-to-end case study for medical UX.", "tech_stack": "Figma + Protopie", "difficulty": "Hard", "github_link": "https://github.com/project-hub/health-redesign"}
            ]
        }
    }

    # ==========================================
    # PHASE-SPECIFIC MINDMAP DATA PER CAREER
    # Each phase has unique branches and subnodes
    # ==========================================
    MINDMAP_DATA = {
        "Software Engineer": {
            "Phase 1 – Foundations": {
                "branches": [
                    {"name": "Programming Basics", "subnodes": ["Variables & Types", "Control Flow", "Functions", "OOP Concepts"]},
                    {"name": "Core Concepts", "subnodes": ["Big-O Notation", "Recursion", "Memory Management", "Compilation"]},
                    {"name": "Learning Resources", "subnodes": ["CS50 (Harvard)", "freeCodeCamp", "The Odin Project", "Codecademy"]},
                    {"name": "Practice Exercises", "subnodes": ["HackerRank Easy", "LeetCode Warm-up", "Codewars Katas", "Project Euler"]}
                ]
            },
            "Phase 2 – Core Skills": {
                "branches": [
                    {"name": "Technical Stacks", "subnodes": ["Python/Django", "JavaScript/Node.js", "Java/Spring", "Go/Gin"]},
                    {"name": "Frameworks", "subnodes": ["React", "Express.js", "FastAPI", "Next.js"]},
                    {"name": "Algorithms & DS", "subnodes": ["Trees & Graphs", "Dynamic Programming", "Sorting", "Hash Maps"]},
                    {"name": "Case Studies", "subnodes": ["Netflix Architecture", "Uber Dispatch", "Slack Real-time", "Stripe Payments"]}
                ]
            },
            "Phase 3 – Projects": {
                "branches": [
                    {"name": "Real-world Projects", "subnodes": ["E-commerce Platform", "Chat Application", "Task Manager API", "Blog CMS"]},
                    {"name": "GitHub Workflow", "subnodes": ["Branching Strategy", "Pull Requests", "Code Reviews", "CI/CD Pipelines"]},
                    {"name": "Deployment", "subnodes": ["Docker Containers", "AWS/GCP Basics", "Vercel/Netlify", "Database Hosting"]},
                    {"name": "Portfolio Building", "subnodes": ["README Quality", "Live Demos", "Architecture Docs", "Test Coverage"]}
                ]
            },
            "Phase 4 – Career Preparation": {
                "branches": [
                    {"name": "Resume Building", "subnodes": ["ATS Optimization", "Project Highlights", "Quantified Impact", "Technical Skills Section"]},
                    {"name": "Mock Interviews", "subnodes": ["DSA Rounds", "System Design", "Behavioral (STAR)", "Take-Home Challenges"]},
                    {"name": "Certifications", "subnodes": ["AWS Cloud Practitioner", "Meta Frontend Dev", "Google IT Support", "Oracle Java"]},
                    {"name": "Job Platforms", "subnodes": ["LinkedIn Optimization", "AngelList/Wellfound", "GitHub Jobs", "Hired.com"]}
                ]
            }
        },
        "Data Scientist": {
            "Phase 1 – Foundations": {
                "branches": [
                    {"name": "Math Basics", "subnodes": ["Linear Algebra", "Probability", "Calculus", "Statistics"]},
                    {"name": "Core Concepts", "subnodes": ["Data Types", "Distributions", "Hypothesis Testing", "Bayesian Thinking"]},
                    {"name": "Learning Resources", "subnodes": ["Khan Academy Stats", "3Blue1Brown", "StatQuest", "Coursera Math"]},
                    {"name": "Practice Exercises", "subnodes": ["Kaggle Learn", "DataCamp Basics", "NumPy Exercises", "Pandas Challenges"]}
                ]
            },
            "Phase 2 – Core Skills": {
                "branches": [
                    {"name": "Technical Stacks", "subnodes": ["Python/Scikit-learn", "R/Tidyverse", "Spark/PySpark", "SQL/PostgreSQL"]},
                    {"name": "Frameworks", "subnodes": ["TensorFlow", "PyTorch", "XGBoost", "Keras"]},
                    {"name": "Algorithms", "subnodes": ["Linear Regression", "Decision Trees", "SVM", "Neural Networks"]},
                    {"name": "Case Studies", "subnodes": ["Netflix Recommendations", "Fraud Detection", "Churn Prediction", "NLP Sentiment"]}
                ]
            },
            "Phase 3 – Projects": {
                "branches": [
                    {"name": "Real-world Projects", "subnodes": ["Price Predictor", "Image Classifier", "Recommendation Engine", "Time Series Forecast"]},
                    {"name": "GitHub Workflow", "subnodes": ["Jupyter Notebooks", "Data Versioning (DVC)", "Model Registry", "Experiment Tracking"]},
                    {"name": "Deployment", "subnodes": ["Flask/FastAPI Model Serving", "Streamlit Dashboards", "MLflow", "Docker for ML"]},
                    {"name": "Portfolio Building", "subnodes": ["Kaggle Competitions", "Blog Write-ups", "Interactive Demos", "Research Papers"]}
                ]
            },
            "Phase 4 – Career Preparation": {
                "branches": [
                    {"name": "Resume Building", "subnodes": ["Kaggle Rank", "Publication List", "Project Metrics", "Technical Blog"]},
                    {"name": "Mock Interviews", "subnodes": ["ML System Design", "Case Study Analysis", "Coding + SQL", "Statistics Questions"]},
                    {"name": "Certifications", "subnodes": ["Google Data Analytics", "IBM Data Science", "AWS ML Specialty", "TensorFlow Developer"]},
                    {"name": "Job Platforms", "subnodes": ["LinkedIn Data Roles", "Kaggle Jobs", "DataJobs.com", "AI-Jobs.net"]}
                ]
            }
        },
        "Product Manager": {
            "Phase 1 – Foundations": {
                "branches": [
                    {"name": "PM Basics", "subnodes": ["Product Thinking", "User Personas", "Problem Framing", "Value Proposition"]},
                    {"name": "Core Concepts", "subnodes": ["Jobs-to-be-Done", "Design Thinking", "Lean Startup", "MVP Strategy"]},
                    {"name": "Learning Resources", "subnodes": ["Product School", "Reforge", "Lenny's Newsletter", "Inspired (Book)"]},
                    {"name": "Practice Exercises", "subnodes": ["Product Teardowns", "Competitive Analysis", "User Interviews", "Feature Prioritization"]}
                ]
            },
            "Phase 2 – Core Skills": {
                "branches": [
                    {"name": "Technical Literacy", "subnodes": ["API Concepts", "SQL Basics", "A/B Testing", "Analytics Tools"]},
                    {"name": "Frameworks", "subnodes": ["RICE Scoring", "OKRs", "North Star Metric", "Kano Model"]},
                    {"name": "Methodologies", "subnodes": ["Agile/Scrum", "Kanban", "Sprint Planning", "Retrospectives"]},
                    {"name": "Case Studies", "subnodes": ["Airbnb Growth", "Spotify Discovery", "Slack Adoption", "Uber Pricing"]}
                ]
            },
            "Phase 3 – Projects": {
                "branches": [
                    {"name": "Real-world Projects", "subnodes": ["Feature Spec Document", "Go-to-Market Plan", "User Research Report", "Metrics Dashboard"]},
                    {"name": "Collaboration", "subnodes": ["Cross-functional Teams", "Stakeholder Mgmt", "Design Sprints", "Dev Handoff"]},
                    {"name": "Launch Strategy", "subnodes": ["Beta Testing", "Phased Rollout", "Feature Flags", "Launch Metrics"]},
                    {"name": "Portfolio Building", "subnodes": ["Case Study Deck", "Product Blog", "Side Projects", "Community Talks"]}
                ]
            },
            "Phase 4 – Career Preparation": {
                "branches": [
                    {"name": "Resume Building", "subnodes": ["Impact Metrics", "Product Launches", "Growth Stories", "Leadership Examples"]},
                    {"name": "Mock Interviews", "subnodes": ["Product Sense", "Estimation Questions", "Strategy Cases", "Behavioral Rounds"]},
                    {"name": "Certifications", "subnodes": ["PMP Certification", "Scrum Master", "Google PM Certificate", "Pragmatic Institute"]},
                    {"name": "Job Platforms", "subnodes": ["LinkedIn PM Roles", "Product Hunt Jobs", "Mind the Product", "Glassdoor PM"]}
                ]
            }
        },
        "Cybersecurity Analyst": {
            "Phase 1 – Foundations": {
                "branches": [
                    {"name": "Network Basics", "subnodes": ["TCP/IP Model", "DNS & HTTP", "Firewalls", "VPN Concepts"]},
                    {"name": "Core Concepts", "subnodes": ["CIA Triad", "Attack Vectors", "Threat Modeling", "Security Policies"]},
                    {"name": "Learning Resources", "subnodes": ["TryHackMe Free", "Cybrary Basics", "CompTIA Network+", "Professor Messer"]},
                    {"name": "Practice Exercises", "subnodes": ["OverTheWire Bandit", "PicoCTF", "HackTheBox Starting", "CyberDefenders"]}
                ]
            },
            "Phase 2 – Core Skills": {
                "branches": [
                    {"name": "Technical Stacks", "subnodes": ["Kali Linux", "Wireshark", "Burp Suite", "Metasploit"]},
                    {"name": "Frameworks", "subnodes": ["NIST CSF", "OWASP Top 10", "MITRE ATT&CK", "ISO 27001"]},
                    {"name": "Algorithms", "subnodes": ["Encryption (AES/RSA)", "Hashing (SHA)", "PKI", "Key Exchange"]},
                    {"name": "Case Studies", "subnodes": ["SolarWinds Attack", "Equifax Breach", "WannaCry", "Log4Shell Vuln"]}
                ]
            },
            "Phase 3 – Projects": {
                "branches": [
                    {"name": "Real-world Projects", "subnodes": ["Home Lab Setup", "Vulnerability Scanner", "SIEM Dashboard", "Incident Response Plan"]},
                    {"name": "CTF Challenges", "subnodes": ["Web Exploitation", "Forensics", "Reverse Engineering", "Cryptographic Puzzles"]},
                    {"name": "Deployment", "subnodes": ["Security Hardening", "IDS/IPS Setup", "Log Aggregation", "Automated Scanning"]},
                    {"name": "Portfolio Building", "subnodes": ["CTF Write-ups", "Security Blog", "Tool Development", "Bug Bounty Reports"]}
                ]
            },
            "Phase 4 – Career Preparation": {
                "branches": [
                    {"name": "Resume Building", "subnodes": ["Certifications List", "CTF Rankings", "Tools Proficiency", "Incident Reports"]},
                    {"name": "Mock Interviews", "subnodes": ["Scenario-based Q&A", "Network Troubleshooting", "Incident Response Drills", "Compliance Questions"]},
                    {"name": "Certifications", "subnodes": ["CompTIA Security+", "CEH", "OSCP", "CISSP"]},
                    {"name": "Job Platforms", "subnodes": ["CyberSecJobs", "InfoSec Jobs", "LinkedIn Security", "ClearanceJobs"]}
                ]
            }
        },
        "UI/UX Designer": {
            "Phase 1 – Foundations": {
                "branches": [
                    {"name": "Design Basics", "subnodes": ["Color Theory", "Typography", "Layout & Grid", "Visual Hierarchy"]},
                    {"name": "Core Concepts", "subnodes": ["User-Centered Design", "Accessibility (a11y)", "Gestalt Principles", "Design Ethics"]},
                    {"name": "Learning Resources", "subnodes": ["Google UX Certificate", "Interaction Design Foundation", "Refactoring UI", "Laws of UX"]},
                    {"name": "Practice Exercises", "subnodes": ["Daily UI Challenge", "Dribbble Recreation", "Figma Tutorials", "Wireframe Sketching"]}
                ]
            },
            "Phase 2 – Core Skills": {
                "branches": [
                    {"name": "Technical Stacks", "subnodes": ["Figma Advanced", "Adobe XD", "Sketch", "Framer"]},
                    {"name": "Frameworks", "subnodes": ["Material Design", "Apple HIG", "Atomic Design", "Design Tokens"]},
                    {"name": "Research Methods", "subnodes": ["User Interviews", "Usability Testing", "Card Sorting", "A/B Testing"]},
                    {"name": "Case Studies", "subnodes": ["Airbnb Redesign", "Duolingo UX", "Spotify Wrapped", "Apple.com Design"]}
                ]
            },
            "Phase 3 – Projects": {
                "branches": [
                    {"name": "Real-world Projects", "subnodes": ["Mobile App Redesign", "SaaS Dashboard", "E-commerce UX Audit", "Design System"]},
                    {"name": "Design Process", "subnodes": ["Research → Ideate", "Wireframe → Prototype", "Test → Iterate", "Handoff → Dev"]},
                    {"name": "Tools Mastery", "subnodes": ["Figma Components", "Auto Layout", "Prototyping", "Design Tokens"]},
                    {"name": "Portfolio Building", "subnodes": ["Case Study Format", "Behance/Dribbble", "Personal Website", "Process Documentation"]}
                ]
            },
            "Phase 4 – Career Preparation": {
                "branches": [
                    {"name": "Resume Building", "subnodes": ["Visual Resume", "Portfolio Link", "Process Showcase", "Impact Metrics"]},
                    {"name": "Mock Interviews", "subnodes": ["Design Challenge", "Whiteboard Exercise", "Portfolio Walkthrough", "Design Critique"]},
                    {"name": "Certifications", "subnodes": ["Google UX Professional", "Nielsen Norman UX", "HFI CUA", "Interaction Design Foundation"]},
                    {"name": "Job Platforms", "subnodes": ["Dribbble Jobs", "Behance Jobs", "LinkedIn Design", "Designerjobs.co"]}
                ]
            }
        }
    }

    # ==========================================
    # PHASE-SPECIFIC RESOURCES PER CAREER
    # Unique curated resources for each phase
    # ==========================================
    PHASE_RESOURCES = {
        "Software Engineer": {
            "Phase 1 – Foundations": [
                {"type": "course", "title": "CS50: Introduction to Computer Science", "url": "https://cs50.harvard.edu/x/", "platform": "Harvard", "duration": "12 weeks", "difficulty": "Beginner"},
                {"type": "video", "title": "Programming Logic for Beginners", "url": "https://www.youtube.com/watch?v=zOjov-2OZ0E", "platform": "YouTube", "duration": "45 mins", "difficulty": "Beginner"},
                {"type": "pdf", "title": "Clean Code: A Handbook of Agile Software Craftsmanship", "url": "https://www.investigatii.md/uploads/resurse/Clean_Code.pdf", "platform": "PDF", "duration": "Read", "difficulty": "Intermediate"},
                {"type": "article", "title": "The Odin Project: Foundations", "url": "https://www.theodinproject.com/paths/foundations/courses/foundations", "platform": "Odin Project", "duration": "40 hours", "difficulty": "Beginner"}
            ],
            "Phase 2 – Core Skills": [
                {"type": "course", "title": "Full Stack Open: Deep Dive Into Modern Web Dev", "url": "https://fullstackopen.com/en/", "platform": "University of Helsinki", "duration": "14 weeks", "difficulty": "Intermediate"},
                {"type": "video", "title": "System Design for Beginners", "url": "https://www.youtube.com/watch?v=i7SInS8vO0E", "platform": "YouTube", "duration": "1 hour", "difficulty": "Intermediate"},
                {"type": "article", "title": "REST API Design Best Practices", "url": "https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/", "platform": "StackOverflow", "duration": "20 mins", "difficulty": "Intermediate"},
                {"type": "pdf", "title": "The Pragmatic Programmer: Quick Guide", "url": "https://www.cs.colorado.edu/~kena/classes/5448/f12/presentation-materials/thepragmaticprogrammer.pdf", "platform": "PDF", "duration": "Read", "difficulty": "Intermediate"}
            ],
            "Phase 3 – Projects": [
                {"type": "video", "title": "Building a Real-time Chat with WebSockets", "url": "https://www.youtube.com/watch?v=kYRPZRLS8L4", "platform": "YouTube", "duration": "1.5 hours", "difficulty": "Advanced"},
                {"type": "article", "title": "Microservices Architecture Guide", "url": "https://microservices.io/patterns/microservices.html", "platform": "Microservices.io", "duration": "30 mins", "difficulty": "Advanced"},
                {"type": "course", "title": "AWS Cloud Practitioner Essentials", "url": "https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials", "platform": "AWS", "duration": "6 hours", "difficulty": "Intermediate"}
            ],
            "Phase 4 – Career Preparation": [
                {"type": "video", "title": "Cracking the Coding Interview: Tips", "url": "https://www.youtube.com/watch?v=uQ_Xit_C9pQ", "platform": "YouTube", "duration": "30 mins", "difficulty": "Hard"},
                {"type": "article", "title": "Star Method for Behavioral Interviews", "url": "https://www.themuse.com/advice/star-interview-method", "platform": "The Muse", "duration": "15 mins", "difficulty": "Beginner"},
                {"type": "pdf", "title": "Software Engineering Resume Template", "url": "https://www.careercup.com/resume", "platform": "CareerCup", "duration": "Template", "difficulty": "Beginner"}
            ]
        },
        "Data Scientist": {
            "Phase 1 – Foundations": [
                {"type": "course", "title": "Python for Data Science (IBM)", "url": "https://www.edx.org/course/python-for-data-science-2", "platform": "edX", "duration": "4 weeks", "difficulty": "Beginner"},
                {"type": "video", "title": "Linear Algebra for ML Pro", "url": "https://www.youtube.com/watch?v=kjBOesZCoqc", "platform": "YouTube", "duration": "2 hours", "difficulty": "Beginner"}
            ],
            "Phase 2 – Core Skills": [
                {"type": "article", "title": "Pandas Cheat Sheet for Data Analysis", "url": "https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf", "platform": "Pandas", "duration": "5 mins", "difficulty": "Beginner"},
                {"type": "video", "title": "Scikit-Learn Machine Learning Workflow", "url": "https://www.youtube.com/watch?v=0Lt9w-RO8MC", "platform": "YouTube", "duration": "1 hour", "difficulty": "Intermediate"}
            ],
            "Phase 3 – Projects": [
                {"type": "video", "title": "Building your Data Science Portfolio", "url": "https://www.youtube.com/watch?v=8_L79767auM", "platform": "YouTube", "duration": "45 mins", "difficulty": "Intermediate"}
            ],
            "Phase 4 – Career Preparation": [
                {"type": "article", "title": "Data Science Interview Bible", "url": "https://towardsdatascience.com/data-science-interview-guide-4ee9f5eb7787", "platform": "Medium", "duration": "1 hour", "difficulty": "Hard"}
            ]
        },
        "Product Manager": {
            "Phase 1 – Foundations": [
                {"type": "course", "title": "Product Management Fundamentals", "url": "https://www.coursera.org/learn/uva-darden-digital-product-management", "platform": "Coursera"},
                {"type": "video", "title": "What Does a Product Manager Do?", "url": "https://www.youtube.com/results?search_query=product+manager+role+explained", "platform": "YouTube"},
                {"type": "article", "title": "Lenny's Newsletter: PM Insights", "url": "https://www.lennysnewsletter.com/", "platform": "Substack"},
                {"type": "tool", "title": "Miro: Collaborative Whiteboarding", "url": "https://miro.com/", "platform": "Miro"},
                {"type": "course", "title": "Design Thinking for Innovation", "url": "https://www.coursera.org/learn/uva-darden-design-thinking-innovation", "platform": "Coursera"},
                {"type": "article", "title": "Inspired by Marty Cagan (Summary)", "url": "https://www.productplan.com/learn/inspired-marty-cagan-summary/", "platform": "ProductPlan"}
            ],
            "Phase 2 – Core Skills": [
                {"type": "course", "title": "Agile with Atlassian Jira", "url": "https://www.coursera.org/learn/agile-atlassian-jira", "platform": "Coursera"},
                {"type": "video", "title": "Product Metrics & Analytics Deep Dive", "url": "https://www.youtube.com/results?search_query=product+metrics+analytics+pm", "platform": "YouTube"},
                {"type": "tool", "title": "Amplitude: Product Analytics", "url": "https://amplitude.com/", "platform": "Amplitude"},
                {"type": "article", "title": "RICE Prioritization Framework", "url": "https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/", "platform": "Intercom"},
                {"type": "course", "title": "SQL for Product Managers", "url": "https://mode.com/sql-tutorial/", "platform": "Mode"},
                {"type": "tool", "title": "Notion: Product Spec Templates", "url": "https://www.notion.so/templates/product", "platform": "Notion"}
            ],
            "Phase 3 – Projects": [
                {"type": "course", "title": "Product Launch: Go-to-Market Strategy", "url": "https://www.reforge.com/", "platform": "Reforge"},
                {"type": "video", "title": "How Top PMs Ship Products", "url": "https://www.youtube.com/results?search_query=how+product+managers+ship+products", "platform": "YouTube"},
                {"type": "article", "title": "Writing Great Product Specs", "url": "https://www.lennysnewsletter.com/p/my-favorite-templates-issue-37", "platform": "Lenny's"},
                {"type": "tool", "title": "Linear: Modern Project Management", "url": "https://linear.app/", "platform": "Linear"},
                {"type": "article", "title": "Feature Flag Best Practices", "url": "https://launchdarkly.com/blog/what-are-feature-flags/", "platform": "LaunchDarkly"},
                {"type": "tool", "title": "Figma: Collaborate with Designers", "url": "https://www.figma.com/", "platform": "Figma"}
            ],
            "Phase 4 – Career Preparation": [
                {"type": "course", "title": "Exponent: PM Interview Course", "url": "https://www.tryexponent.com/courses/pm", "platform": "Exponent"},
                {"type": "video", "title": "PM Interview: Product Sense Practice", "url": "https://www.youtube.com/results?search_query=product+sense+interview+practice", "platform": "YouTube"},
                {"type": "tool", "title": "Product School: Free PM Resources", "url": "https://productschool.com/free-product-management-resources/", "platform": "Product School"},
                {"type": "article", "title": "Cracking the PM Interview (Guide)", "url": "https://www.crackingthepminterview.com/", "platform": "CTPMI"},
                {"type": "course", "title": "Google Project Management Certificate", "url": "https://www.coursera.org/professional-certificates/google-project-management", "platform": "Coursera"},
                {"type": "tool", "title": "Glassdoor: PM Interview Questions", "url": "https://www.glassdoor.com/Interview/product-manager-interview-questions-SRCH_KO0,15.htm", "platform": "Glassdoor"}
            ]
        },
        "Cybersecurity Analyst": {
            "Phase 1 – Foundations": [
                {"type": "course", "title": "TryHackMe: Complete Beginner Path", "url": "https://tryhackme.com/path/outline/beginner", "platform": "TryHackMe"},
                {"type": "video", "title": "CompTIA Network+ Full Course", "url": "https://www.youtube.com/results?search_query=comptia+network+plus+full+course", "platform": "YouTube"},
                {"type": "article", "title": "Linux Command Line Basics", "url": "https://linuxcommand.org/", "platform": "LinuxCommand.org"},
                {"type": "tool", "title": "OverTheWire: Bandit Wargame", "url": "https://overthewire.org/wargames/bandit/", "platform": "OverTheWire"},
                {"type": "course", "title": "Cybrary: Introduction to IT & Cybersecurity", "url": "https://www.cybrary.it/", "platform": "Cybrary"},
                {"type": "article", "title": "OWASP Top 10 Explained", "url": "https://owasp.org/www-project-top-ten/", "platform": "OWASP"}
            ],
            "Phase 2 – Core Skills": [
                {"type": "course", "title": "Ethical Hacking with Kali Linux", "url": "https://www.udemy.com/course/learn-ethical-hacking-from-scratch/", "platform": "Udemy"},
                {"type": "video", "title": "Wireshark Tutorial for Beginners", "url": "https://www.youtube.com/results?search_query=wireshark+tutorial+beginners", "platform": "YouTube"},
                {"type": "tool", "title": "HackTheBox: Penetration Testing Labs", "url": "https://www.hackthebox.com/", "platform": "HackTheBox"},
                {"type": "article", "title": "MITRE ATT&CK Framework Guide", "url": "https://attack.mitre.org/", "platform": "MITRE"},
                {"type": "course", "title": "Cryptography I (Stanford)", "url": "https://www.coursera.org/learn/crypto", "platform": "Coursera"},
                {"type": "tool", "title": "Burp Suite Community Edition", "url": "https://portswigger.net/burp/communitydownload", "platform": "PortSwigger"}
            ],
            "Phase 3 – Projects": [
                {"type": "video", "title": "Build a Home Hacking Lab", "url": "https://www.youtube.com/results?search_query=home+cyber+security+lab+setup", "platform": "YouTube"},
                {"type": "tool", "title": "VulnHub: Vulnerable VMs for Practice", "url": "https://www.vulnhub.com/", "platform": "VulnHub"},
                {"type": "article", "title": "SIEM Setup with ELK Stack", "url": "https://www.elastic.co/what-is/siem", "platform": "Elastic"},
                {"type": "course", "title": "Incident Response & Handling", "url": "https://www.cybrary.it/course/incident-response/", "platform": "Cybrary"},
                {"type": "tool", "title": "Splunk Free: Log Analysis Practice", "url": "https://www.splunk.com/en_us/download/splunk-enterprise.html", "platform": "Splunk"},
                {"type": "article", "title": "CTF Write-ups Collection", "url": "https://ctftime.org/writeups/", "platform": "CTFtime"}
            ],
            "Phase 4 – Career Preparation": [
                {"type": "course", "title": "CompTIA Security+ Study Guide", "url": "https://www.comptia.org/certifications/security", "platform": "CompTIA"},
                {"type": "video", "title": "OSCP Certification Preparation", "url": "https://www.youtube.com/results?search_query=oscp+preparation+guide", "platform": "YouTube"},
                {"type": "tool", "title": "PentesterLab: Practice Security Skills", "url": "https://pentesterlab.com/", "platform": "PentesterLab"},
                {"type": "article", "title": "Cybersecurity Career Roadmap", "url": "https://www.cyberseek.org/pathway.html", "platform": "CyberSeek"},
                {"type": "course", "title": "CEH Certification Path", "url": "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/", "platform": "EC-Council"},
                {"type": "tool", "title": "BugCrowd: Bug Bounty Platform", "url": "https://www.bugcrowd.com/", "platform": "BugCrowd"}
            ]
        },
        "UI/UX Designer": {
            "Phase 1 – Foundations": [
                {"type": "course", "title": "Google UX Design Certificate", "url": "https://www.coursera.org/professional-certificates/google-ux-design", "platform": "Coursera"},
                {"type": "video", "title": "Figma Tutorial for Beginners", "url": "https://www.youtube.com/results?search_query=figma+tutorial+beginners+2024", "platform": "YouTube"},
                {"type": "article", "title": "Laws of UX: Essential Principles", "url": "https://lawsofux.com/", "platform": "Laws of UX"},
                {"type": "tool", "title": "Daily UI: 100 Day Design Challenge", "url": "https://www.dailyui.co/", "platform": "Daily UI"},
                {"type": "course", "title": "Interaction Design Foundation: Basics", "url": "https://www.interaction-design.org/", "platform": "IxDF"},
                {"type": "article", "title": "Refactoring UI: Design Tips", "url": "https://www.refactoringui.com/", "platform": "Refactoring UI"}
            ],
            "Phase 2 – Core Skills": [
                {"type": "course", "title": "Advanced Figma: Components & Variants", "url": "https://www.youtube.com/results?search_query=figma+advanced+components+variants", "platform": "YouTube"},
                {"type": "video", "title": "UX Research Methods Masterclass", "url": "https://www.youtube.com/results?search_query=ux+research+methods+masterclass", "platform": "YouTube"},
                {"type": "tool", "title": "Maze: Remote Usability Testing", "url": "https://maze.co/", "platform": "Maze"},
                {"type": "article", "title": "Material Design 3 Guidelines", "url": "https://m3.material.io/", "platform": "Google"},
                {"type": "course", "title": "Nielsen Norman Group: UX Certification", "url": "https://www.nngroup.com/ux-certification/", "platform": "NNGroup"},
                {"type": "tool", "title": "Coolors: Color Palette Generator", "url": "https://coolors.co/", "platform": "Coolors"}
            ],
            "Phase 3 – Projects": [
                {"type": "video", "title": "Complete App Redesign Case Study", "url": "https://www.youtube.com/results?search_query=app+redesign+case+study+ux", "platform": "YouTube"},
                {"type": "tool", "title": "Figma Community: Free Templates", "url": "https://www.figma.com/community", "platform": "Figma"},
                {"type": "article", "title": "Building a Design System from Scratch", "url": "https://www.designsystems.com/", "platform": "Design Systems"},
                {"type": "course", "title": "UX Case Study Writing Guide", "url": "https://uxdesign.cc/", "platform": "UX Collective"},
                {"type": "tool", "title": "Framer: Interactive Prototyping", "url": "https://www.framer.com/", "platform": "Framer"},
                {"type": "article", "title": "Atomic Design Methodology", "url": "https://bradfrost.com/blog/post/atomic-web-design/", "platform": "Brad Frost"}
            ],
            "Phase 4 – Career Preparation": [
                {"type": "course", "title": "Portfolio Design for UX Designers", "url": "https://www.youtube.com/results?search_query=ux+portfolio+design+tips", "platform": "YouTube"},
                {"type": "video", "title": "UX Design Interview Preparation", "url": "https://www.youtube.com/results?search_query=ux+design+interview+preparation", "platform": "YouTube"},
                {"type": "tool", "title": "Behance: Showcase Your Work", "url": "https://www.behance.net/", "platform": "Behance"},
                {"type": "article", "title": "How to Present Design Work", "url": "https://medium.com/design-bootcamp/how-to-present-your-design-work-e08b1b53e23a", "platform": "Medium"},
                {"type": "tool", "title": "Dribbble: Design Community & Jobs", "url": "https://dribbble.com/", "platform": "Dribbble"},
                {"type": "course", "title": "ADPList: Free Design Mentorship", "url": "https://adplist.org/", "platform": "ADPList"}
            ]
        }
    }

    # ==========================================
    # PHASE-SPECIFIC OBJECTIVES & EXPECTATIONS
    # ==========================================
    PHASE_OBJECTIVES = {
        "Phase 1 – Foundations": {
            "focus": "Building foundational knowledge and mental models",
            "objectives": [
                "Understand core terminology and concepts",
                "Set up your development environment", 
                "Complete introductory exercises and tutorials",
                "Build confidence in basic tools and workflows"
            ],
            "expectations": [
                "Comfortable with fundamental concepts",
                "Able to complete guided exercises independently",
                "Ready to move into intermediate topics"
            ]
        },
        "Phase 2 – Core Skills": {
            "focus": "Deepening technical expertise with industry-standard tools",
            "objectives": [
                "Master key frameworks and technical stacks",
                "Solve intermediate-level challenges independently",
                "Study real-world architecture and case studies",
                "Develop systematic problem-solving approaches"
            ],
            "expectations": [
                "Can build small-to-medium applications",
                "Understands trade-offs between different approaches",
                "Ready to tackle real-world project complexity"
            ]
        },
        "Phase 3 – Projects": {
            "focus": "Applying skills to real-world projects and building portfolio",
            "objectives": [
                "Build at least 2-3 portfolio-worthy projects",
                "Learn version control and collaborative workflows",
                "Practice deployment and production best practices",
                "Document work effectively for recruiters"
            ],
            "expectations": [
                "Has a visible portfolio on GitHub/personal site",
                "Can explain technical decisions and trade-offs",
                "Experienced with end-to-end development lifecycle"
            ]
        },
        "Phase 4 – Career Preparation": {
            "focus": "Polishing profile and preparing for the job market",
            "objectives": [
                "Optimize resume for ATS and recruiters",
                "Practice mock interviews (technical + behavioral)",
                "Earn at least one industry certification",
                "Build professional network on relevant platforms"
            ],
            "expectations": [
                "Interview-ready with practiced responses",
                "Professional online presence established",
                "Clear understanding of target roles and companies"
            ]
        }
    }

    # ==========================================
    # MODULE-SPECIFIC RESOURCES (Used for side panels)
    # ==========================================
    MODULE_RESOURCES = {
        "programming": [
            {"type": "video", "title": "Programming Logic Masterclass", "url": "https://www.youtube.com/watch?v=zOjov-2OZ0E", "description": "Fundamentals of coding logic."},
            {"type": "course", "title": "Intro to Programming (Harvard CS50)", "url": "https://cs50.harvard.edu/x/", "description": "The world's most famous intro to CS."}
        ],
        "data structures": [
            {"type": "video", "title": "Data Structures in 10 Minutes", "url": "https://www.youtube.com/watch?v=bum_19loOEc", "description": "Quick overview of core structures."},
            {"type": "tool", "title": "VisuAlgo", "url": "https://visualgo.net/", "description": "Visualizing data structures and algorithms."}
        ],
        "logic": [
            {"type": "article", "title": "The Art of Logical Thinking", "url": "https://plato.stanford.edu/entries/logic-informal/", "description": "Foundations of informal logic."}
        ],
        "web development": [
            {"type": "course", "title": "The Complete Web Dev Bootcamp", "url": "https://www.udemy.com/course/the-complete-web-development-bootcamp/", "description": "From zero to full-stack."}
        ],
        "machine learning": [
            {"type": "video", "title": "Machine Learning for Everyone", "url": "https://www.youtube.com/watch?v=IpGxLWOIZy4", "description": "A non-technical intro to ML."}
        ]
    }

    def _get_phase_metadata(self, career: str, phase_name: str, scores: dict = None) -> Dict[str, Any]:
        """
        Build rich phase metadata including objectives, expectations, resources, and mindmap.
        """
        # Base objectives for the phase
        phase_obj = self.PHASE_OBJECTIVES.get(phase_name, {})
        
        # Career-specific description
        career_descriptions = {
            "Phase 1 – Foundations": f"Building the bedrock for a {career}. Internalizing core concepts and setting up your learning environment.",
            "Phase 2 – Core Skills": f"Deepening your {career} expertise with industry-standard tools, frameworks, and problem-solving techniques.",
            "Phase 3 – Projects": f"Applying your {career} skills to real-world projects. Building a portfolio that demonstrates practical competence.",
            "Phase 4 – Career Preparation": f"Polishing your {career} profile for the job market. Interview prep, certifications, and networking.",
        }
        
        # Get mindmap data
        career_mindmap = self.MINDMAP_DATA.get(career, self.MINDMAP_DATA.get("Software Engineer", {}))
        mindmap_nodes = career_mindmap.get(phase_name, {"branches": []})
        
        # Get resources (PHASE LEVEL)
        career_resources = self.PHASE_RESOURCES.get(career, self.PHASE_RESOURCES.get("Software Engineer", {}))
        resources = career_resources.get(phase_name, [])
        
        # Enrich resources with more metadata
        enriched_resources = []
        for res in resources:
            # Add default metadata if missing
            res_copy = res.copy()
            if 'duration' not in res_copy:
                res_copy['duration'] = "2-4 hours" if res_copy['type'] in ['course', 'video'] else "15-30 mins"
            if 'difficulty' not in res_copy:
                res_copy['difficulty'] = "Beginner" if "Foundations" in phase_name else "Intermediate"
            if 'description' not in res_copy:
                res_copy['description'] = f"Master {res_copy['title']} to excel in this phase."
            enriched_resources.append(res_copy)

        # Compute improvement areas from scores
        improvement_areas = []
        if scores:
            if scores.get("programming", 100) < 60:
                improvement_areas.append("Strengthen programming fundamentals — practice daily coding")
            if scores.get("math", 100) < 60:
                improvement_areas.append("Improve mathematical foundations — focus on applied math")
            if scores.get("communication", 100) < 60:
                improvement_areas.append("Develop communication skills — practice presentations")
            if scores.get("logic", 100) < 60:
                improvement_areas.append("Sharpen problem-solving — work through logic puzzles")
            if scores.get("design", 100) < 60:
                improvement_areas.append("Explore design thinking — study UI/UX basics")
        
        if not improvement_areas:
            improvement_areas = ["Continue building on your strengths", "Explore advanced topics in your strong areas"]

        # Get career-specific tools for this phase with full metadata
        TOOL_META = {
            "VS Code": {"name": "VS Code", "desc": "The most popular code editor for modern development.", "url": "https://code.visualstudio.com", "logo": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg"},
            "Git": {"name": "Git", "desc": "Distributed version control system to track changes.", "url": "https://git-scm.com", "logo": "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.svg"},
            "Figma": {"name": "Figma", "desc": "Collaborative design tool for UI/UX teams.", "url": "https://figma.com", "logo": "https://www.vectorlogo.zone/logos/figma/figma-icon.svg"},
            "Python": {"name": "Python", "desc": "Powerful language for backend, AI, and data science.", "url": "https://python.org", "logo": "https://www.vectorlogo.zone/logos/python/python-icon.svg"},
            "React": {"name": "React", "desc": "A JavaScript library for building user interfaces.", "url": "https://reactjs.org", "logo": "https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"},
            "PostgreSQL": {"name": "PostgreSQL", "desc": "Advanced open source relational database.", "url": "https://postgresql.org", "logo": "https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg"},
            "Docker": {"name": "Docker", "desc": "Containerization platform for reliable deployments.", "url": "https://docker.com", "logo": "https://www.vectorlogo.zone/logos/docker/docker-icon.svg"},
            "AWS": {"name": "AWS", "desc": "Comprehensive cloud computing platform.", "url": "https://aws.amazon.com", "logo": "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg"},
            "Jupyter": {"name": "Jupyter", "desc": "Interactive tool for data science and research.", "url": "https://jupyter.org", "logo": "https://www.vectorlogo.zone/logos/jupyter/jupyter-icon.svg"},
            "Miro": {"name": "Miro", "desc": "Online whiteboard for visual collaboration.", "url": "https://miro.com", "logo": "https://www.vectorlogo.zone/logos/miro/miro-icon.svg"},
            "Wireshark": {"name": "Wireshark", "desc": "World's foremost network protocol analyzer.", "url": "https://wireshark.org", "logo": "https://www.vectorlogo.zone/logos/wireshark/wireshark-icon.svg"},
            "Kali Linux": {"name": "Kali Linux", "desc": "Advanced OS for penetration testing.", "url": "https://kali.org", "logo": "https://www.vectorlogo.zone/logos/kali/kali-icon.svg"}
        }

        phase_tools_raw = {
            "Phase 1 – Foundations": {"Software Engineer": ["VS Code", "Git", "Python"], "Data Scientist": ["Jupyter", "Python", "Git"], "UI/UX Designer": ["Figma", "Miro"], "Cybersecurity Analyst": ["Git", "Wireshark"]},
            "Phase 2 – Core Skills": {"Software Engineer": ["React", "PostgreSQL"], "Data Scientist": ["Jupyter", "PostgreSQL"], "UI/UX Designer": ["Figma", "Miro"], "Cybersecurity Analyst": ["Kali Linux", "Wireshark"]},
            "Phase 3 – Projects": {"Software Engineer": ["Docker", "AWS"], "Data Scientist": ["Docker", "AWS"], "UI/UX Designer": ["Figma", "Framer"], "Cybersecurity Analyst": ["Kali Linux", "Docker"]},
            "Phase 4 – Career Preparation": {"Software Engineer": ["Git", "VS Code"], "Data Scientist": ["Jupyter", "Git"], "UI/UX Designer": ["Figma", "Behance"], "Cybersecurity Analyst": ["Kali Linux", "Wireshark"]},
        }
        
        tools_list = phase_tools_raw.get(phase_name, {}).get(career, ["VS Code", "Git"])
        tools_data = [TOOL_META.get(t, {"name": t, "desc": "Essential tool for this phase.", "url": "#", "logo": ""}) for t in tools_list]
        
        # Get featured projects (PHASE LEVEL)
        featured_projects = self.PROJECT_TEMPLATES.get(career, {}).get(phase_name, [])

        return {
            "description": career_descriptions.get(phase_name, f"Mastering essential skills for {career}."),
            "focus": phase_obj.get("focus", "Building expertise"),
            "objectives": phase_obj.get("objectives", ["Master core skills", "Build practical experience"]),
            "expectations": phase_obj.get("expectations", ["Ready for the next level"]),
            "improvement_areas": improvement_areas,
            "tools": tools_data,
            "resources": enriched_resources,
            "mindmap_nodes": mindmap_nodes,
            "featured_projects": featured_projects,
            "skill_details": {k: v for k, v in self.SKILL_DETAILS.items()} # Ensure fresh copy
        }\

    def generate(self, career: str, scores: dict[str, int], existing_skills: List[str], confidence: float = 0.5) -> List[dict[str, Any]]:
        template = self.TEMPLATES.get(career, self.TEMPLATES.get("Software Engineer")) # Fallback to SE
        
        personalized_roadmap = []
        existing_skills_lower = [s.lower() for s in existing_skills]
        
        needs_remedial_math = scores.get("math", 100) < 40
        needs_remedial_coding = scores.get("programming", 100) < 40
        is_ambitious = confidence > 0.8
        
        for phase_name, steps in template.items():
            phase_steps = []
            
            if phase_name == "Phase 1 – Foundations" and needs_remedial_coding:
                phase_steps.append({
                    "skill": "Intro to Logic", 
                    "title": "Remedial: Coding Basics", 
                    "duration": "2 weeks", 
                    "outcome": "Building confidence in basic logic structures.",
                    "status": "critical",
                    "custom_description": "Added due to low programming score."
                })
            
            for step in steps:
                skill_req = step["skill"].lower()
                status = "upcoming"
                is_completed = False
                custom_desc = step["outcome"]
                
                search_text = f"{skill_req} {step['title'].lower()}"
                if any(ext_skill in search_text or search_text in ext_skill for ext_skill in existing_skills_lower):
                    status = "completed"
                    is_completed = True
                    custom_desc = "You already have this skill! moving to next."
                
                elif scores.get(skill_req, 0) > 85:
                    status = "fast-track"
                    custom_desc = "High aptitude detected. You can move through this quickly."
                elif scores.get(skill_req, 100) < 40 and not is_completed:
                     status = "critical"
                     custom_desc = f"CRITICAL: {custom_desc}. Extra focus needed."

                # ENRICH STEP WITH MODULE-SPECIFIC DATA
                skill_meta = self.SKILL_DETAILS.get(skill_req, {})
                module_resources = self.MODULE_RESOURCES.get(skill_req, [])
                
                # Get a unique project for this step if it exists in templates
                phase_projects = self.PROJECT_TEMPLATES.get(career, {}).get(phase_name, [])
                # Purely for demo, we link projects to specific steps by title match or circular assignment
                step_project = None
                for p in phase_projects:
                    if skill_req in p['title'].lower() or skill_req in p['tech_stack'].lower():
                        step_project = p
                        break
                
                if not step_project and phase_projects:
                    # Fallback to first available in phase if no skill match
                    step_project = phase_projects[0]

                phase_steps.append({
                    **step,
                    "status": status,
                    "is_completed": is_completed,
                    "custom_description": custom_desc,
                    "skill_details": skill_meta,
                    "module_resources": module_resources,
                    "featured_project": step_project
                })
            
            if phase_name == "Phase 3 – Projects" and is_ambitious:
                 phase_steps.append({
                    "skill": "Open Source", 
                    "title": "Advanced: Open Source Contribution", 
                    "duration": "ongoing", 
                    "outcome": " contributing to real-world software.",
                    "status": "upcoming",
                    "custom_description": "Added due to high confidence.",
                    "module_resources": [{"type": "link", "title": "GitHub Explore", "url": "https://github.com/explore"}]
                })

            phase_meta = self._get_phase_metadata(career, phase_name, scores)
            
            personalized_roadmap.append({
                "phase": phase_name,
                "steps": phase_steps,
                **phase_meta
            })
            
        return personalized_roadmap

    def get_fallback_skills(self, career: str) -> List[Dict[str, Any]]:
        fallback_data = {
            "Software Engineer": [
                {"name": "HTML/CSS", "category": "Technical", "description": "Web foundations."},
                {"name": "Python/JS", "category": "Technical", "description": "Core languages."},
                {"name": "SQL", "category": "Technical", "description": "Data management."}
            ],
             "Data Scientist": [
                {"name": "Python", "category": "Technical", "description": "Data manipulation."},
                {"name": "Statistics", "category": "Technical", "description": "Inference basics."},
                {"name": "SQL", "category": "Technical", "description": "Data retrieval."}
            ]
        }
        return fallback_data.get(career, [{"name": "Communication", "category": "Soft Skills", "description": "General professional skill."}])

roadmap_engine = RoadmapEngine()
