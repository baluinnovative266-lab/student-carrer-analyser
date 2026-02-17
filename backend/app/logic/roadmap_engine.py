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

    # Default template for fallbacks
    DEFAULT_TEMPLATE = {
        "Phase 1 – Foundations": [{"skill": "General", "title": "Career Fundamentals", "duration": "4 weeks", "outcome": "Core industry understanding."}],
        "Phase 2 – Core Skills": [{"skill": "Specialization", "title": "Domain Mastery", "duration": "6 weeks", "outcome": "Advanced technical proficiency."}],
        "Phase 3 – Projects": [{"skill": "Implementation", "title": "Real-world Project", "duration": "8 weeks", "outcome": "Tangible proof of work."}],
        "Phase 4 – Career Preparation": [{"skill": "Portfolio", "title": "Personal Branding", "duration": "3 weeks", "outcome": "Successful job placement strategy."}]
    }

    def generate(self, career: str, scores: dict[str, int], existing_skills: List[str]) -> List[dict[str, Any]]:
        template = self.TEMPLATES.get(career, self.DEFAULT_TEMPLATE)
        personalized_roadmap = []
        
        existing_skills_lower = [s.lower() for s in existing_skills]
        
        for phase_name, steps in template.items():
            phase_steps = []
            for step in steps:
                skill_req = step["skill"].lower()
                
                # Logic: Skip if user is already highly proficient
                # If the skill is in resume, mark as 'completed'
                # If score is > 85, mark as 'fast-track'
                
                status = "upcoming"
                is_completed = False
                
                if skill_req in existing_skills_lower:
                    status = "completed"
                    is_completed = True
                elif scores.get(skill_req, 0) > 85:
                    status = "fast-track"
                
                # Dynamic Logic based on scores
                custom_desc = step["outcome"]
                if scores.get(skill_req, 100) < 50:
                    status = "critical"
                    custom_desc = f"CRITICAL: {custom_desc}. Extra focus needed due to score."

                phase_steps.append({
                    **step,
                    "status": status,
                    "is_completed": is_completed,
                    "custom_description": custom_desc
                })
            
            # Special Injection Logic
            if phase_name == "Phase 1 – Foundations" and scores.get("communication", 100) < 50:
                phase_steps.append({
                    "skill": "Soft Skills",
                    "title": "Verbal Communication 101",
                    "duration": "2 weeks",
                    "outcome": "Improved clarity in technical discussions.",
                    "status": "injected"
                })

            personalized_roadmap.append({
                "phase": phase_name,
                "steps": phase_steps
            })
            
        return personalized_roadmap

roadmap_engine = RoadmapEngine()
