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
                {"type": "course", "title": "CS50: Introduction to Computer Science", "url": "https://cs50.harvard.edu/x/", "platform": "Harvard/edX"},
                {"type": "video", "title": "Programming Fundamentals Crash Course", "url": "https://www.youtube.com/results?search_query=programming+fundamentals+crash+course", "platform": "YouTube"},
                {"type": "article", "title": "Learn Python — Interactive Tutorial", "url": "https://www.learnpython.org/", "platform": "LearnPython.org"},
                {"type": "tool", "title": "HackerRank: 30 Days of Code", "url": "https://www.hackerrank.com/domains/tutorials/30-days-of-code", "platform": "HackerRank"},
                {"type": "course", "title": "The Odin Project: Foundations", "url": "https://www.theodinproject.com/paths/foundations", "platform": "The Odin Project"},
                {"type": "article", "title": "Git & GitHub for Beginners", "url": "https://guides.github.com/activities/hello-world/", "platform": "GitHub Guides"}
            ],
            "Phase 2 – Core Skills": [
                {"type": "course", "title": "Algorithms Specialization (Stanford)", "url": "https://www.coursera.org/specializations/algorithms", "platform": "Coursera"},
                {"type": "video", "title": "Data Structures Full Course", "url": "https://www.youtube.com/results?search_query=data+structures+full+course", "platform": "YouTube"},
                {"type": "tool", "title": "LeetCode: Top Interview Questions", "url": "https://leetcode.com/problemset/top-interview-questions/", "platform": "LeetCode"},
                {"type": "article", "title": "Full-Stack Open: Modern Web Dev", "url": "https://fullstackopen.com/en/", "platform": "University of Helsinki"},
                {"type": "course", "title": "Database Design & SQL Mastery", "url": "https://www.khanacademy.org/computing/computer-programming/sql", "platform": "Khan Academy"},
                {"type": "tool", "title": "VisuAlgo: Algorithm Visualizer", "url": "https://visualgo.net/", "platform": "VisuAlgo"}
            ],
            "Phase 3 – Projects": [
                {"type": "video", "title": "Build & Deploy Full Stack Project", "url": "https://www.youtube.com/results?search_query=full+stack+project+tutorial+2024", "platform": "YouTube"},
                {"type": "article", "title": "Docker for Beginners: Containerize Apps", "url": "https://docker-curriculum.com/", "platform": "Docker Curriculum"},
                {"type": "tool", "title": "Vercel: Deploy Frontend Projects Free", "url": "https://vercel.com/", "platform": "Vercel"},
                {"type": "course", "title": "GitHub Actions CI/CD Pipeline", "url": "https://docs.github.com/en/actions/quickstart", "platform": "GitHub Docs"},
                {"type": "article", "title": "How to Write a Great README", "url": "https://www.makeareadme.com/", "platform": "MakeAReadme"},
                {"type": "tool", "title": "Railway: Deploy Backend Apps Free", "url": "https://railway.app/", "platform": "Railway"}
            ],
            "Phase 4 – Career Preparation": [
                {"type": "course", "title": "Grokking the System Design Interview", "url": "https://www.designgurus.io/course/grokking-the-system-design-interview", "platform": "Design Gurus"},
                {"type": "video", "title": "Mock Technical Interview Practice", "url": "https://www.youtube.com/results?search_query=mock+coding+interview+google", "platform": "YouTube"},
                {"type": "tool", "title": "Pramp: Free Mock Interviews", "url": "https://www.pramp.com/", "platform": "Pramp"},
                {"type": "article", "title": "Tech Interview Handbook", "url": "https://www.techinterviewhandbook.org/", "platform": "Tech Interview HB"},
                {"type": "course", "title": "AWS Cloud Practitioner Essentials", "url": "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/", "platform": "AWS Training"},
                {"type": "tool", "title": "Resume Worded: ATS Resume Scorer", "url": "https://resumeworded.com/", "platform": "Resume Worded"}
            ]
        },
        "Data Scientist": {
            "Phase 1 – Foundations": [
                {"type": "course", "title": "Statistics & Probability (Khan Academy)", "url": "https://www.khanacademy.org/math/statistics-probability", "platform": "Khan Academy"},
                {"type": "video", "title": "3Blue1Brown: Essence of Linear Algebra", "url": "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", "platform": "YouTube"},
                {"type": "article", "title": "Python for Data Science Handbook", "url": "https://jakevdp.github.io/PythonDataScienceHandbook/", "platform": "Jake VDP"},
                {"type": "tool", "title": "Kaggle Learn: Intro to ML", "url": "https://www.kaggle.com/learn/intro-to-machine-learning", "platform": "Kaggle"},
                {"type": "course", "title": "DataCamp: Data Scientist with Python", "url": "https://www.datacamp.com/tracks/data-scientist-with-python", "platform": "DataCamp"},
                {"type": "video", "title": "StatQuest: Statistics Fundamentals", "url": "https://www.youtube.com/c/joshstarmer", "platform": "YouTube"}
            ],
            "Phase 2 – Core Skills": [
                {"type": "course", "title": "Machine Learning by Andrew Ng", "url": "https://www.coursera.org/learn/machine-learning", "platform": "Coursera"},
                {"type": "video", "title": "Scikit-learn Full Tutorial", "url": "https://www.youtube.com/results?search_query=scikit+learn+full+tutorial", "platform": "YouTube"},
                {"type": "tool", "title": "Google Colab: Free GPU Notebooks", "url": "https://colab.research.google.com/", "platform": "Google Colab"},
                {"type": "article", "title": "Towards Data Science: ML Tutorials", "url": "https://towardsdatascience.com/", "platform": "Medium/TDS"},
                {"type": "course", "title": "SQL for Data Scientists", "url": "https://mode.com/sql-tutorial/", "platform": "Mode Analytics"},
                {"type": "tool", "title": "Weights & Biases: Experiment Tracking", "url": "https://wandb.ai/", "platform": "W&B"}
            ],
            "Phase 3 – Projects": [
                {"type": "tool", "title": "Kaggle Competitions: Real Datasets", "url": "https://www.kaggle.com/competitions", "platform": "Kaggle"},
                {"type": "video", "title": "End-to-End ML Project Tutorial", "url": "https://www.youtube.com/results?search_query=end+to+end+machine+learning+project", "platform": "YouTube"},
                {"type": "course", "title": "MLflow: Model Lifecycle Management", "url": "https://mlflow.org/docs/latest/tutorials-and-examples/tutorial.html", "platform": "MLflow"},
                {"type": "article", "title": "Streamlit: Build Data Apps Fast", "url": "https://streamlit.io/", "platform": "Streamlit"},
                {"type": "tool", "title": "Hugging Face: NLP Models & Datasets", "url": "https://huggingface.co/", "platform": "Hugging Face"},
                {"type": "article", "title": "DVC: Data Version Control Guide", "url": "https://dvc.org/doc/start", "platform": "DVC"}
            ],
            "Phase 4 – Career Preparation": [
                {"type": "course", "title": "Google Data Analytics Certificate", "url": "https://www.coursera.org/professional-certificates/google-data-analytics", "platform": "Coursera"},
                {"type": "video", "title": "Data Science Interview Questions", "url": "https://www.youtube.com/results?search_query=data+science+interview+preparation", "platform": "YouTube"},
                {"type": "tool", "title": "StrataScratch: SQL Interview Practice", "url": "https://www.stratascratch.com/", "platform": "StrataScratch"},
                {"type": "article", "title": "How to Build a DS Portfolio", "url": "https://www.dataquest.io/blog/build-a-data-science-portfolio/", "platform": "Dataquest"},
                {"type": "course", "title": "AWS Machine Learning Specialty", "url": "https://aws.amazon.com/certification/certified-machine-learning-specialty/", "platform": "AWS"},
                {"type": "tool", "title": "Interview Query: DS Interview Prep", "url": "https://www.interviewquery.com/", "platform": "Interview Query"}
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
        
        # Get resources
        career_resources = self.PHASE_RESOURCES.get(career, self.PHASE_RESOURCES.get("Software Engineer", {}))
        resources = career_resources.get(phase_name, [])
        
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

        # Get career-specific tools for this phase
        tools_map = {
            "Phase 1 – Foundations": {"Software Engineer": ["VS Code", "Git", "Terminal"], "Data Scientist": ["Jupyter", "Python", "Anaconda"], "Product Manager": ["Notion", "Miro", "Slack"], "Cybersecurity Analyst": ["Linux Terminal", "Wireshark", "VirtualBox"], "UI/UX Designer": ["Figma", "Miro", "Pen & Paper"]},
            "Phase 2 – Core Skills": {"Software Engineer": ["React", "Node.js", "PostgreSQL"], "Data Scientist": ["Scikit-learn", "TensorFlow", "SQL"], "Product Manager": ["Jira", "Amplitude", "SQL"], "Cybersecurity Analyst": ["Kali Linux", "Burp Suite", "Nmap"], "UI/UX Designer": ["Figma Advanced", "Adobe XD", "Maze"]},
            "Phase 3 – Projects": {"Software Engineer": ["Docker", "AWS/GCP", "GitHub Actions"], "Data Scientist": ["MLflow", "Streamlit", "Hugging Face"], "Product Manager": ["Linear", "Figma", "Analytics"], "Cybersecurity Analyst": ["Metasploit", "ELK Stack", "Splunk"], "UI/UX Designer": ["Framer", "Webflow", "Storybook"]},
            "Phase 4 – Career Preparation": {"Software Engineer": ["LinkedIn", "Pramp", "LeetCode"], "Data Scientist": ["Kaggle", "StrataScratch", "LinkedIn"], "Product Manager": ["Exponent", "LinkedIn", "Glassdoor"], "Cybersecurity Analyst": ["PentesterLab", "LinkedIn", "BugCrowd"], "UI/UX Designer": ["Behance", "Dribbble", "ADPList"]},
        }
        
        tools = tools_map.get(phase_name, {}).get(career, ["VS Code", "Git", "Browser"])
        
        return {
            "description": career_descriptions.get(phase_name, f"Mastering essential skills for {career}."),
            "focus": phase_obj.get("focus", "Building expertise"),
            "objectives": phase_obj.get("objectives", ["Master core skills", "Build practical experience"]),
            "expectations": phase_obj.get("expectations", ["Ready for the next level"]),
            "improvement_areas": improvement_areas,
            "tools": tools,
            "resources": resources,
            "mindmap_nodes": mindmap_nodes
        }

    def generate(self, career: str, scores: dict[str, int], existing_skills: List[str], confidence: float = 0.5) -> List[dict[str, Any]]:
        template = self.TEMPLATES.get(career, self.TEMPLATES.get("Software Engineer")) # Fallback to SE
        
        personalized_roadmap = []
        existing_skills_lower = [s.lower() for s in existing_skills]
        
        # --- Modifier Logic ---
        
        # 1. Remedial Check: If scores are low in key areas, we might modify Phase 1
        needs_remedial_math = scores.get("math", 100) < 40
        needs_remedial_coding = scores.get("programming", 100) < 40
        
        # 2. Acceleration Check: If skills exist, we mark them completed or skip
        # (Handled inside the loop via is_completed)

        # 3. Ambition Check: High confidence adds "Advanced" content
        is_ambitious = confidence > 0.8
        
        for phase_name, steps in template.items():
            phase_steps = []
            
            # Dynamic Step Injection
            if phase_name == "Phase 1 – Foundations":
                if needs_remedial_coding:
                    phase_steps.append({
                        "skill": "Intro to Logic", 
                        "title": "Remedial: Coding Basics", 
                        "duration": "2 weeks", 
                        "outcome": "Building confidence in basic logic structures.",
                        "status": "critical",
                        "custom_description": "Added due to low programming score. Focus here first!"
                    })
            
            for step in steps:
                skill_req = step["skill"].lower()
                status = "upcoming"
                is_completed = False
                custom_desc = step["outcome"]
                
                # Check for existing skills
                # More intelligent check: search in both skill name and title
                search_text = f"{skill_req} {step['title'].lower()}"
                if any(ext_skill in search_text or search_text in ext_skill for ext_skill in existing_skills_lower):
                    status = "completed"
                    is_completed = True
                    custom_desc = "You already have this skill! moving to next."
                
                # Score impacts
                elif scores.get(skill_req, 0) > 85:
                    status = "fast-track"
                    custom_desc = "High aptitude detected. You can move through this quickly."
                elif scores.get(skill_req, 100) < 40 and not is_completed:
                     status = "critical"
                     custom_desc = f"CRITICAL: {custom_desc}. Extra focus needed due to low assessment score."

                phase_steps.append({
                    **step,
                    "status": status,
                    "is_completed": is_completed,
                    "custom_description": custom_desc
                })
            
            # Ambition Injection
            if phase_name == "Phase 3 – Projects" and is_ambitious:
                 phase_steps.append({
                    "skill": "Open Source", 
                    "title": "Advanced: Open Source Contribution", 
                    "duration": "ongoing", 
                    "outcome": " contributing to real-world software.",
                    "status": "upcoming",
                    "custom_description": "Added due to high confidence. Challenge yourself!"
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
