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

    PHASE_METADATA = {
        # ... (Previous metadata kept for brevity, will rely on default behavior or add new ones if needed)
        # For this upgraded version, we generally use the detailed data in templates or a generic fallback
        # to ensure we don't end up with massive file size issues in this replacement.
        # We'll use a smart default generator for metadata if missing.
    }

    def _get_phase_metadata(self, career: str, phase_name: str) -> Dict[str, Any]:
        """
        Smart metadata generator.
        """
        defaults = {
            "Phase 1 – Foundations": {
                "description": f"Building the bedrock for a {career}. internalizing core concepts.",
                "objectives": ["Understand core principles", "Master basic tools"],
                 "tools": ["VS Code", "Basic Tools"],
                 "resources": ["Introductory Course", "Official Documentation"]
            },
             "Phase 2 – Core Skills": {
                "description": "Moving from theory to practice with industry-standard patterns.",
                "objectives": ["Apply theoretical knowledge", "Build small applications"],
                 "tools": ["Frameworks", "Databases"],
                 "resources": ["Advanced Tutorials", "Project-based Learning"]
            },
             "Phase 3 – Projects": {
                "description": "Integration and real-world application. Building portfolio-worthy artifacts.",
                "objectives": ["Build end-to-end systems", "Collaborate on code"],
                 "tools": ["Production Tools", "CI/CD"],
                 "resources": ["System Design Books", "Open Source"]
            },
             "Phase 4 – Career Preparation": {
                "description": "Polishing your profile for the job market and interviews.",
                "objectives": ["Ace interviews", "Optimize resume"],
                 "tools": ["LinkedIn", "Mock Interviews"],
                 "resources": ["Interview Guides", "Career Coaching"]
            }
        }
        return defaults.get(phase_name, {})

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
                if any(ext_skill in skill_req or skill_req in ext_skill for ext_skill in existing_skills_lower):
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

            phase_meta = self._get_phase_metadata(career, phase_name)
            
            personalized_roadmap.append({
                "phase": phase_name,
                "steps": phase_steps,
                **phase_meta
            })
            
        return personalized_roadmap

    def get_fallback_skills(self, career: str) -> List[Dict[str, Any]]:
        # ... (Keep existing fallback logic or simplify)
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

