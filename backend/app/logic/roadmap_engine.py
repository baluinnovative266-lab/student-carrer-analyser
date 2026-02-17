from typing import List, Dict, Any

class RoadmapEngine:
    """
    Generates personalized 4-phase career roadmaps based on:
    - Predicted career
    - Academic scores
    - Existing skills (from resume)
    - Confidence levels
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
                {"skill": "Programming", "title": "Python for Data Science", "duration": "3 weeks", "outcome": "Proficiency in NumPy and Pandas."}
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
        # Additional templates for other careers follow similar patterns...
    }

    PHASE_METADATA = {
        "Software Engineer": {
            "Phase 1 – Foundations": {
                "description": "Establish the logical bedrock for a professional engineering career. This phase focuses on internalizing how computers 'think' and building the resilience to debug complex problems.",
                "objectives": ["Master core programming constructs", "Build algorithmic problem-solving skills", "Understand discrete math applications"],
                "tools": ["VS Code", "Terminal/Shell", "GitHub"],
                "expectations": "Junior engineers should write clean, working code for isolated components.",
                "examples": ["Automated File Processor", "Command-Line Task Manager", "Logic-based Game Engine (CLI)"],
                "resources": ["Clean Code (Robert Martin)", "LeetCode/HackerRank Logic Challenges"],
                "topics": ["Variables & Scope", "Control Flow", "Big O Notation", "Basic Algorithms"],
                "youtube_videos": [
                    {"title": "CS50: Introduction to Computer Science", "url": "https://www.youtube.com/watch?v=8mAITcNt734"},
                    {"title": "Programming Logic Explained", "url": "https://www.youtube.com/watch?v=Kz6-K_pM0Ww"}
                ],
                "practice_resources": ["FreeCodeCamp Javascript Algorithms", "Exercism Python Track"]
            },
            "Phase 2 – Core Skills": {
                "description": "Transition from syntax to systems. You will learn to manage memory efficiently, design robust database schemas, and architect scalable backend services.",
                "objectives": ["Implement complex data structures", "Architect RESTful API systems", "Optimize relational database queries"],
                "tools": ["Docker", "PostgreSQL", "Node.js/Python FastAPI"],
                "expectations": "Developing an understanding of web infrastructure and system interactions.",
                "examples": ["E-commerce API with Auth", "Real-time Chat Backend", "Library Management System"],
                "resources": ["System Design Primer", "SQL Performance Explained"],
                "topics": ["RESTful APIs", "Relational Databases", "Node.js/FastAPI Core", "Authentication Basics"],
                "youtube_videos": [
                    {"title": "Backend Engineering Course", "url": "https://www.youtube.com/watch?v=fN25fMQZ9bw"},
                    {"title": "Database Design Masterclass", "url": "https://www.youtube.com/watch?v=ztHopE5Wnpc"}
                ],
                "practice_resources": ["Full Stack Open (University of Helsinki)", "SQLZoo Exercises"]
            },
            "Phase 3 – Projects": {
                "description": "Integration and real-world application. This is where you connect frontend and backend to deliver complete products, focusing on user experience and collaborative development.",
                "objectives": ["Build full-stack applications", "Implement CI/CD pipelines", "Master Git collaboration workflows"],
                "tools": ["Vercel", "GitHub Actions", "Postman/Insomnia"],
                "expectations": "Demonstrating the ability to ship features from conception to deployment.",
                "examples": ["AI-powered Content Platform", "Social Media Dashboard", "Cryptocurrency Tracker"],
                "resources": ["High Performance Browser Networking", "Pragmatic Programmer"],
                "topics": ["React/Vue Internals", "CI/CD Pipelines", "State Management", "Deployment Architectures"],
                "youtube_videos": [
                    {"title": "CI/CD for Beginners", "url": "https://www.youtube.com/watch?v=scEDHsr3APg"},
                    {"title": "Advanced React Patterns", "url": "https://www.youtube.com/watch?v=Q7pM9vS3gTM"}
                ],
                "practice_resources": ["Build a clone of Netflix/Twitter", "Frontend Mentor Challenges"]
            },
            "Phase 4 – Career Preparation": {
                "description": "The final polish for the job market. Focus on high-level system design, behavioral competence, and building a professional brand that stands out in top-tier tech companies.",
                "objectives": ["Prepare for System Design interviews", "Polish professional portfolio", "Master behavioral interview techniques"],
                "tools": ["LinkedIn", "Excalidraw (System Design)", "Personal Blog/Portfolio Site"],
                "expectations": "Ready to operate in a high-growth engineering team with clear technical communication.",
                "examples": ["Distributed System Case Study", "Open Source Contributions", "Technical Blog Series"],
                "resources": ["Cracking the Coding Interview", "Designing Data-Intensive Applications"]
            }
        },
        "Data Scientist": {
            "Phase 1 – Foundations": {
                "description": "Master the language of data: Mathematics and Statistics. This phase builds the analytical mindset required to interpret complex data patterns.",
                "objectives": ["Proficiency in Probability & Statistics", "Master Python Data Science libraries", "Perform Exploratory Data Analysis (EDA)"],
                "tools": ["Jupyter Notebooks", "Pandas", "Matplotlib/Seaborn"],
                "expectations": "Ability to clean, explore, and draw initial insights from raw datasets.",
                "examples": ["Housing Price Correlation Study", "Customer Segmentation Analysis", "Weather Pattern Visualization"],
                "resources": ["Introduction to Statistical Learning", "Python for Data Analysis"],
                "topics": ["Probability Distributions", "Hypothesis Testing", "Data Cleaning with Pandas", "Matplotlib Visualization"],
                "youtube_videos": [
                    {"title": "Statistics for Data Science", "url": "https://www.youtube.com/watch?v=Vfo5le26IhY"},
                    {"title": "Pandas Tutorial for Beginners", "url": "https://www.youtube.com/watch?v=dcqPhpLi7qw"}
                ],
                "practice_resources": ["Kaggle Titanic Competition", "DataCamp Python Intro"]
            },
            "Phase 2 – Core Skills": {
                "description": "From descriptive to predictive analysis. Learn the core Machine Learning algorithms and the data engineering pipelines that power them.",
                "objectives": ["Implement Supervised Learning models", "Understand Model Evaluation metrics", "Build ETL pipelines for ML"],
                "tools": ["Scikit-Learn", "SQL", "Apache Spark (Intro)"],
                "expectations": "Capability to build and validate predictive models with statistical rigor.",
                "examples": ["Churn Prediction Model", "Stock Market Sentiment Analysis", "Spam Detection Engine"],
                "resources": ["Hands-on Machine Learning (O'Reilly)", "Deep Learning Specialization (Coursera)"],
                "topics": ["Linear & Logistic Regression", "Decision Trees", "Model Validation (K-Fold)", "Feature Engineering"],
                "youtube_videos": [
                    {"title": "Machine Learning by Andrew Ng", "url": "https://www.youtube.com/watch?v=jGwO_UgTS7I"},
                    {"title": "Scikit-Learn Crash Course", "url": "https://www.youtube.com/watch?v=0Lt9w-ROKFQ"}
                ],
                "practice_resources": ["Kaggle Churn Prediction", "UCI Machine Learning Repository"]
            },
            "Phase 3 – Projects": {
                "description": "Deep Dive and Domain Specialization. Apply advanced techniques like Deep Learning or NLP to solve specific, complex industry problems.",
                "objectives": ["Build Deep Learning architectures", "Implement NLP or Computer Vision projects", "Deploy ML models to production"],
                "tools": ["TensorFlow/PyTorch", "MLflow", "AWS SageMaker (Intro)"],
                "expectations": "Mastery of the end-to-end ML lifecycle from research to deployment.",
                "examples": ["Image Recognition App", "Voice-to-Text Analyzer", "Recommendation System for E-commerce"],
                "resources": ["Deep Learning with Python (F. Chollet)", "Pattern Recognition and Machine Learning"],
                "topics": ["Neural Network Architectures", "NLP with Transformers", "Model Deployment (API)", "ML Monitoring"],
                "youtube_videos": [
                    {"title": "Deep Learning Specialization", "url": "https://www.youtube.com/watch?v=7ebqcLzWQD8"},
                    {"title": "MLOps for Beginners", "url": "https://www.youtube.com/watch?v=fX3iAtOunx8"}
                ],
                "practice_resources": ["Hugging Face Course", "Fast.ai Practical Deep Learning"]
            },
            "Phase 4 – Career Preparation": {
                "description": "Bridging Data Science and Business Value. Learn to communicate findings to stakeholders and prepare for the specialized interviews of top tech firms.",
                "objectives": ["Translate data insights to business strategy", "Polish Kaggle/GitHub portfolios", "Prepare for ML system design rounds"],
                "tools": ["Tableau/PowerBI", "LinkedIn", "Medium (Technical Writing)"],
                "expectations": "A data professional who can drive business impact through evidence-based decisions.",
                "examples": ["Business Impact Case Study", "Published ML Research Article", "End-to-End Portfolio Showcase"],
                "resources": ["Storytelling with Data", "Approaching (Almost) Any Machine Learning Problem"]
            }
        },
        "UI/UX Designer": {
            "Phase 1 – Foundations": {
                "description": "Visual Literacy and Design Thinking. Develop the 'eye' for design and understand the fundamental laws of user interface and typography.",
                "objectives": ["Master Design Principles (Grid, Hierarchy, Color)", "Learn Design Thinking methodology", "Understand Typography & Layout"],
                "tools": ["Figma", "Adobe Color", "Typeface Explorers"],
                "expectations": "Ability to create visually balanced and logically structured interfaces.",
                "examples": ["Interactive Form Redesign", "Landing Page Component Kit", "Visual Identity Exploration"],
                "resources": ["The Design of Everyday Things", "Thinking with Type"],
                "topics": ["Gestalt Principles", "Visual Hierarchy", "Color Theory", "Grid Systems"],
                "youtube_videos": [
                    {"title": "Design Theory for Beginners", "url": "https://www.youtube.com/watch?v=9E4CWW-W0kM"},
                    {"title": "Typography Mastery", "url": "https://www.youtube.com/watch?v=qrS9eGZzN0Y"}
                ],
                "practice_resources": ["Daily UI Challenge", "Behance Case Study Reviews"]
            },
            "Phase 2 – Core Skills": {
                "description": "User Centricity and Prototyping. Move from static designs to interactive experiences by studying user behavior and mastering high-fidelity prototyping.",
                "objectives": ["Conduct User Research & Interviews", "Master High-Fidelity Prototyping", "Design for Accessibility (WCAG)"],
                "tools": ["Figma (Auto-layout, Components)", "Miro/FigJam", "Maze (Testing)"],
                "expectations": "Creating prototypes that simulate real product interactions and address user pain points.",
                "examples": ["Health App User Flow", "Dashboard Interactive Prototype", "Design System for a Startup"],
                "resources": ["Don't Make Me Think", "Laws of UX"],
                "topics": ["Information Architecture", "User Personas", "Prototyping Interaction", "Accessibility Audits"],
                "youtube_videos": [
                    {"title": "UX Research Methods", "url": "https://www.youtube.com/watch?v=GAn7_p9zGvE"},
                    {"title": "Figma Advanced Prototyping", "url": "https://www.youtube.com/watch?v=XshFz1P2I-U"}
                ],
                "practice_resources": ["UserTesting.com basic practice", "Maze.co prototypes"]
            },
            "Phase 3 – Projects": {
                "description": "Product Design and Industry Workflows. Collaborate with engineering constraints and build comprehensive case studies that solve real-world problems.",
                "objectives": ["Develop End-to-End Design Case Studies", "Understand Developer Handoff workflows", "Implement Mobile-First responsive design"],
                "tools": ["Zeplin/Storybook (Intro)", "ProtoPie", "Notion (Case Studies)"],
                "expectations": "A comprehensive portfolio showing a problem-solving approach to product design.",
                "examples": ["Fintech App End-to-End Design", "B2B SaaS Platform Redesign", "Civic Tech Accessibility Audit"],
                "resources": ["Refactoring UI", "Universal Principles of Design"]
            },
            "Phase 4 – Career Preparation": {
                "description": "Professional Branding for Designers. Polish your portfolio storytelling, master design critiques, and prepare for the unique interview processes of design teams.",
                "objectives": ["Polish Portfolio Storytelling", "Master Design Critique & Articulation", "Prepare for Design Challenges"],
                "tools": ["Webflow/Framer (Portfolio)", "Behance/Dribbble", "LinkedIn"],
                "expectations": "A professional designer ready to defend design decisions and collaborate in product squads.",
                "examples": ["High-Impact Design Case Study", "Industry-Specific Portfolio Polish", "Design Thinking Workshop Prep"],
                "resources": ["Articulating Design Decisions", "Show Your Work!"]
            }
        }
    }

    # Default template for fallbacks
    DEFAULT_TEMPLATE = {
        "Phase 1 – Foundations": [{"skill": "General", "title": "Career Fundamentals", "duration": "4 weeks", "outcome": "Core industry understanding."}],
        "Phase 2 – Core Skills": [{"skill": "Specialization", "title": "Domain Mastery", "duration": "6 weeks", "outcome": "Advanced technical proficiency."}],
        "Phase 3 – Projects": [{"skill": "Implementation", "title": "Real-world Project", "duration": "8 weeks", "outcome": "Tangible proof of work."}],
        "Phase 4 – Career Preparation": [{"skill": "Portfolio", "title": "Personal Branding", "duration": "3 weeks", "outcome": "Successful job placement strategy."}]
    }

    # Default metadata for other careers
    DEFAULT_PHASE_METADATA = {
        "Phase 1 – Foundations": {
            "description": "Core concepts and industry essentials.",
            "objectives": ["Learn fundamentals", "Basic tool proficiency"],
            "tools": ["Industry Standard Tools"],
            "expectations": "Junior-level understanding.",
            "examples": ["Foundation project"],
            "resources": ["Industry Blogs"]
        },
        "Phase 2 – Core Skills": {
            "description": "Advanced techniques and domain specialization.",
            "objectives": ["Master technical skills", "Workflow optimization"],
            "tools": ["Pro Tools"],
            "expectations": "Developing professional independence.",
            "examples": ["Mid-level project"],
            "resources": ["Technical Whitepapers"]
        },
        "Phase 3 – Projects": {
            "description": "Real-world application and portfolio building.",
            "objectives": ["Build end-to-end projects", "Collaborative work"],
            "tools": ["Deployment Tools"],
            "expectations": "Ready for professional environments.",
            "examples": ["Advanced project"],
            "resources": ["Portfolio Best Practices"]
        },
        "Phase 4 – Career Preparation": {
            "description": "Interview prep and personal branding.",
            "objectives": ["Polish portfolio", "Interview mastery"],
            "tools": ["Networking Platforms"],
            "expectations": "Industry-ready professional.",
            "examples": ["Final showcase"],
            "resources": ["Interview Guides"]
        }
    }

    def generate(self, career: str, scores: dict[str, int], existing_skills: List[str]) -> List[dict[str, Any]]:
        template = self.TEMPLATES.get(career, self.DEFAULT_TEMPLATE)
        meta_templates = self.PHASE_METADATA.get(career, self.DEFAULT_PHASE_METADATA)
        
        personalized_roadmap = []
        existing_skills_lower = [s.lower() for s in existing_skills]
        
        for phase_name, steps in template.items():
            phase_steps = []
            for step in steps:
                skill_req = step["skill"].lower()
                status = "upcoming"
                is_completed = False
                
                if skill_req in existing_skills_lower:
                    status = "completed"
                    is_completed = True
                elif scores.get(skill_req, 0) > 85:
                    status = "fast-track"
                
                custom_desc = step["outcome"]
                if scores.get(skill_req, 100) < 50:
                    status = "critical"
                    custom_desc = f"CRITICAL: {custom_desc}. Extra focus needed."

                phase_steps.append({
                    **step,
                    "status": status,
                    "is_completed": is_completed,
                    "custom_description": custom_desc
                })
            
            # Phase metadata injection
            phase_meta = meta_templates.get(phase_name, self.DEFAULT_PHASE_METADATA.get(phase_name))
            
            personalized_roadmap.append({
                "phase": phase_name,
                "steps": phase_steps,
                **phase_meta
            })
            
        return personalized_roadmap

    def get_fallback_skills(self, career: str) -> List[Dict[str, Any]]:
        """
        Provides a set of industry-standard skills for a career path
        when no resume has been uploaded yet.
        """
        fallback_data = {
            "Software Engineer": [
                {"name": "HTML/CSS", "category": "Technical", "description": "Foundation of web visual structure."},
                {"name": "Python/JS", "category": "Technical", "description": "Core programming languages for modern dev."},
                {"name": "SQL", "category": "Technical", "description": "Standard language for database management."},
                {"name": "Git", "category": "Tools", "description": "Version control for collaborative coding."},
                {"name": "Communication", "category": "Soft Skills", "description": "Articulating technical ideas clearly."},
                {"name": "Teamwork", "category": "Soft Skills", "description": "Collaborating effectively in agile squads."}
            ],
            "Data Scientist": [
                {"name": "Python", "category": "Technical", "description": "The primary language for data manipulation."},
                {"name": "Statistics", "category": "Technical", "description": "Mathematical foundations for inference."},
                {"name": "Pandas/NumPy", "category": "Tools", "description": "Essential libraries for data engineering."},
                {"name": "SQL", "category": "Technical", "description": "Retrieving data from relational stores."},
                {"name": "Problem Solving", "category": "Soft Skills", "description": "Deconstructing business issues into data tasks."},
                {"name": "Data Storytelling", "category": "Soft Skills", "description": "Presenting insights with impact."}
            ],
            "UI/UX Designer": [
                {"name": "Figma", "category": "Tools", "description": "Industry standard for interface design."},
                {"name": "User Research", "category": "Technical", "description": "Understanding user needs and behaviors."},
                {"name": "Typography", "category": "Technical", "description": "The art and technique of arranging type."},
                {"name": "Prototyping", "category": "Technical", "description": "Building interactive product simulations."},
                {"name": "Empathy", "category": "Soft Skills", "description": "Deeply understanding user pain points."},
                {"name": "Presentation", "category": "Soft Skills", "description": "Defending design decisions to stakeholders."}
            ]
        }
        
        return fallback_data.get(career, [
            {"name": "Communication", "category": "Soft Skills", "description": "Universal professional competency."},
            {"name": "Digital Literacy", "category": "Technical", "description": "Proficiency in common digital tools."},
            {"name": "Logical Thinking", "category": "Soft Skills", "description": "Structured approach to task solving."}
        ])

roadmap_engine = RoadmapEngine()
