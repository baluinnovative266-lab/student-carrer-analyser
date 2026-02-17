from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user, get_current_user_optional
from app.models.user import User
from typing import Optional
from fastapi.responses import JSONResponse
from app.models.api_schemas import CareerInput, CareerPredictionResponse, SkillGapResponse
from app.services.ml_service import career_predictor
from app.services.resume_parser import resume_parser

router = APIRouter()

# Define required skills per career path for more professional analysis
CAREER_SKILLS_MAP = {
    "Software Engineer": {"Python", "JavaScript", "React", "SQL", "Git", "Docker", "Problem Solving"},
    "Data Scientist": {"Python", "Numpy", "Pandas", "Scikit-Learn", "Machine Learning", "SQL", "Statistics"},
    "Web Developer": {"HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB"},
    "Product Manager": {"Leadership", "Communication", "Time Management", "Agile", "Jira", "Scrum"},
    "UI/UX Designer": {"HTML", "CSS", "Design", "Figma", "Usability", "Prototyping"}
}

# Career roadmap steps based on missing skills - NOW WITH DESCRIPTIONS
# Adaptive Career Roadmap Templates (Structured in 4 Phases)
CAREER_ROADMAPS = {
    "Software Engineer": {
        "Foundation": [
            {"title": "Master Python/Java Basics", "skill": "Programming", "description": "Deep dive into language syntax and core concepts."},
            {"title": "Data Structures & Algorithms", "skill": "Problem Solving", "description": "Focus on Big-O, Lists, Trees, and Graphs."}
        ],
        "Intermediate": [
            {"title": "Full-Stack Frameworks", "skill": "Web Development", "description": "Learn React/Vite for frontend and FastAPI for backend."},
            {"title": "Database Management", "skill": "SQL", "description": "Master relational databases and complex queries."}
        ],
        "Projects": [
            {"title": "Build a Scalable SaaS App", "skill": "System Architecture", "description": "Implement authentication and cloud storage."},
            {"title": "Open Source Contributions", "skill": "Collaboration", "description": "Submit PRs to major repositories on GitHub."}
        ],
        "Preparation": [
            {"title": "System Design Interviews", "skill": "Design Patterns", "description": "Practice architectural scalability problems."},
            {"title": "Mock Technical Interviews", "skill": "Communication", "description": "Refine your technical explanation skills."}
        ]
    },
    "Data Scientist": {
        "Foundation": [
            {"title": "Mathematics & Statistics", "skill": "Mathematics", "description": "Review linear algebra and probability theory."},
            {"title": "Python for Data Science", "skill": "Programming", "description": "Master NumPy, Pandas, and Matplotlib."}
        ],
        "Intermediate": [
            {"title": "Machine Learning Models", "skill": "Machine Learning", "description": "Implement Regression, Clustering, and Trees."},
            {"title": "SQL for Data Analysis", "skill": "SQL", "description": "Query large datasets for insights."}
        ],
        "Projects": [
            {"title": "End-to-End ML Pipeline", "skill": "Deep Learning", "description": "Deploy a model as a web service."},
            {"title": "Data Visualization Story", "skill": "Communication", "description": "Create a dashboard portraying data trends."}
        ],
        "Preparation": [
            {"title": "Case Study Interviews", "skill": "Logic", "description": "Solve real-world business problems with data."},
            {"title": "Portfolio Refinement", "skill": "Design", "description": "Polish your GitHub and Kaggle profiles."}
        ]
    },
    "Web Developer": {
        "Foundation": [
            {"title": "HTML, CSS, JS Mastery", "skill": "Programming", "description": "Build responsive and interactive static pages."},
            {"title": "Version Control (Git)", "skill": "Git", "description": "Master branching and merging workflows."}
        ],
        "Intermediate": [
            {"title": "Modern JS Frameworks", "skill": "React", "description": "Learn component lifecycle and state management."},
            {"title": "Backend Development", "skill": "Node.js", "description": "Build RESTful APIs with Express or FastAPI."}
        ],
        "Projects": [
            {"title": "E-commerce Platform", "skill": "System Integration", "description": "Implement payment gateways and user auth."},
            {"title": "Performance Optimization", "skill": "Optimization", "description": "Improve Core Web Vitals and load times."}
        ],
        "Preparation": [
            {"title": "Frontend Interview Prep", "skill": "JavaScript", "description": "Master closures, event loop, and DOM."},
            {"title": "Personal Portfolio Site", "skill": "Design", "description": "Showcase your work with a stunning UI."}
        ]
    }
}

# Default template for other careers
CAREER_ROADMAPS["UI/UX Designer"] = {
    "Foundation": [{"title": "Design Principles", "skill": "Design", "description": "Color theory, typography, and hierarchy."}],
    "Intermediate": [{"title": "Prototyping Labs", "skill": "Figma", "description": "Master interactive high-fidelity prototypes."}],
    "Projects": [{"title": "Utility App Redesign", "skill": "UX Research", "description": "Conduct user tests and iterate designs."}],
    "Preparation": [{"title": "Design Portfolio", "skill": "Branding", "description": "Build case studies for your best work."}]
}
CAREER_ROADMAPS["Product Manager"] = {
    "Foundation": [{"title": "PM Fundamentals", "skill": "Management", "description": "Market research and feature prioritization."}],
    "Intermediate": [{"title": "Data for PMs", "skill": "Analytics", "description": "Use SQL and Mixpanel to track metrics."}],
    "Projects": [{"title": "Launch a Side Product", "skill": "Leadership", "description": "Lead a small team to build and launch an MVP."}],
    "Preparation": [{"title": "Product Case Prep", "skill": "Communication", "description": "Master product sense and strategy questions."}]
}

@router.get("/health")
def health_check():
    return {"status": "healthy"}

def generate_adaptive_roadmap(career_name: str, user_skills: list, scores: dict):
    """
    Generates a 4-phase adaptive roadmap based on career match and existing skills.
    """
    base_roadmap = CAREER_ROADMAPS.get(career_name, CAREER_ROADMAPS["Software Engineer"])
    adaptive_roadmap = []
    
    user_skills_lower = [s.lower() for s in user_skills]
    
    for phase, steps in base_roadmap.items():
        phase_steps = []
        for step in steps:
            # Skip step if user already has the skill (from resume or high score)
            skill_needed = step.get("skill", "").lower()
            if skill_needed in user_skills_lower:
                continue
            
            # Additional logic: if it's a foundation step but the user has high score in that area
            if phase == "Foundation" and scores.get(skill_needed, 0) > 80:
                continue
                
            phase_steps.append(step)
            
        # If all steps in a phase are skipped, add a "Pro" step or keep it empty
        if not phase_steps:
            phase_steps.append({
                "title": f"Advanced {phase} Mastery",
                "description": f"You've already mastered the foundations of {phase}. Focus on mentoring others or specialized research.",
                "status": "completed"
            })
            
        adaptive_roadmap.extend(phase_steps)
        
    return adaptive_roadmap[:5] # Limit to top 5 most relevant steps for dashboard UI

@router.post("/predict-career", response_model=CareerPredictionResponse)
def predict_career(input_data: CareerInput, current_user: Optional[User] = Depends(get_current_user_optional), db: Session = Depends(get_db)):
    result = career_predictor.predict(input_data.dict())
    
    # Enrich the prediction with roadmap and skills data
    predicted_career = result.get("predicted_career", "General Analyst")
    
    # fallback if specific career not in map
    if predicted_career not in CAREER_SKILLS_MAP:
         # Try to find closest match or default
         if "Engineer" in predicted_career:
             predicted_career = "Software Engineer"
         elif "Data" in predicted_career:
             predicted_career = "Data Scientist"
    
    required_skills = list(CAREER_SKILLS_MAP.get(predicted_career, CAREER_SKILLS_MAP["Software Engineer"]))
    
    def calculate_match_score(career_name: str, input_data: CareerInput) -> float:
        """
        Calculate how well the user's profile matches a specific career.
        We normalize 1-10 scales to 0-100 for consistent weighting.
        """
        int_coding = input_data.interest_coding * 10
        int_design = input_data.interest_design * 10
        int_mgmt = input_data.interest_management * 10
        
        scores = {
            "Software Engineer": (input_data.math_score * 0.15 + input_data.programming_score * 0.35 + input_data.problem_solving_score * 0.20 + int_coding * 0.20 + input_data.communication_score * 0.10),
            "Data Scientist": (input_data.math_score * 0.30 + input_data.programming_score * 0.25 + input_data.problem_solving_score * 0.20 + int_coding * 0.15 + input_data.communication_score * 0.10),
            "Web Developer": (input_data.programming_score * 0.30 + input_data.problem_solving_score * 0.15 + int_coding * 0.25 + int_design * 0.20 + input_data.communication_score * 0.10),
            "UI/UX Designer": (input_data.communication_score * 0.20 + int_design * 0.35 + input_data.problem_solving_score * 0.15 + int_coding * 0.10 + input_data.math_score * 0.05 + int_mgmt * 0.15),
            "Product Manager": (input_data.communication_score * 0.30 + int_mgmt * 0.35 + input_data.problem_solving_score * 0.20 + input_data.math_score * 0.10 + int_coding * 0.05)
        }
        return min(100, max(0, scores.get(career_name, 50)))

    career_match = calculate_match_score(predicted_career, input_data)
    
    # Initialize missing variables
    verified_skills = [] # Extension point for skill verification
    radar_data = [
        {"subject": "Tech", "A": input_data.programming_score, "fullMark": 100},
        {"subject": "Math", "A": input_data.math_score, "fullMark": 100},
        {"subject": "Comm", "A": input_data.communication_score, "fullMark": 100},
        {"subject": "Logic", "A": input_data.problem_solving_score, "fullMark": 100},
        {"subject": "Design", "A": input_data.interest_design * 10, "fullMark": 100}
    ]
    
    # Generate probability chart data (top 5 careers)
    probability_chart_data = [
        {"career": prob["name"], "probability": prob["prob"]}
        for prob in result.get("probabilities", [])[:5]
    ]
    
    # Generate skill comparison data
    skill_comparison_data = [
        {"skill": "Mathematics", "yourScore": input_data.math_score, "required": 75},
        {"skill": "Programming", "yourScore": input_data.programming_score, "required": 80},
        {"skill": "Communication", "yourScore": input_data.communication_score, "required": 70},
        {"skill": "Problem Solving", "yourScore": input_data.problem_solving_score, "required": 75},
    ]
    
    # Determine next recommended skill to learn
    skill_gaps = [
        ("Mathematics", 75 - input_data.math_score),
        ("Programming", 80 - input_data.programming_score),
        ("Communication", 70 - input_data.communication_score),
        ("Problem Solving", 75 - input_data.problem_solving_score),
    ]
    # Find the skill with the largest gap
    next_skill = max(skill_gaps, key=lambda x: x[1])
    next_recommended_skill = next_skill[0] if next_skill[1] > 0 else required_skills[0] if required_skills else "Python"
    
    # Generate charts data from input scores
    scores_dict = {
        "programming": input_data.programming_score,
        "mathematics": input_data.math_score,
        "communication": input_data.communication_score,
        "logic": input_data.problem_solving_score,
        "sql": 70 if input_data.programming_score > 80 else 40
    }
    
    # Enrichment: Adaptive Roadmap
    adaptive_roadmap = generate_adaptive_roadmap(predicted_career, verified_skills, scores_dict)
    
    # Save prediction to user profile if logged in
    if current_user:
        current_user.predicted_career = predicted_career
        db.commit()
    
    return {
        "predicted_career": result.get("predicted_career"),
        "confidence": result.get("probabilities")[0].get("prob") if result.get("probabilities") else 0,
        "probabilities": result.get("probabilities"),
        "extracted_skills": verified_skills if verified_skills else ["Beginner"], 
        "missing_skills": required_skills[:5], # Show top skills needed
        "recommended_roadmap": adaptive_roadmap,
        "radar_data": radar_data,
        "career_match_score": career_match,
        "next_recommended_skill": next_recommended_skill,
        "probability_chart_data": probability_chart_data,
        "skill_comparison_data": skill_comparison_data
    }

@router.post("/analyze-resume", response_model=SkillGapResponse)
async def analyze_resume(file: UploadFile = File(...), current_user: Optional[User] = Depends(get_current_user_optional), db: Session = Depends(get_db)):
    contents = await file.read()
    filename = file.filename.lower()
    
    # Text Extraction
    text = ""
    try:
        if filename.endswith('.pdf'):
            text = resume_parser.extract_text_from_pdf(contents)
        elif filename.endswith('.docx') or filename.endswith('.doc'):
            text = resume_parser.extract_text_from_docx(contents)
        elif filename.endswith('.txt'):
            text = contents.decode("utf-8")
        else:
            try:
                text = contents.decode("utf-8")
            except:
                text = "" 
    except Exception as e:
        print(f"Error parsing file: {e}")
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": f"Could not parse file content. Error: {str(e)}"
            }
        )

    if not text:
         return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "We couldn’t read text from this resume. Please upload a text-based PDF or DOCX file (not scanned images)."
            }
        )

    extracted_skills = resume_parser.extract_skills(text)
    
    # Infer target career or default
    target_career = "Software Engineer"
    if any(s.lower() in ["design", "figma", "ui", "ux"] for s in extracted_skills):
        target_career = "UI/UX Designer"
    elif any(s.lower() in ["data", "ml", "machine learning", "python", "sql"] for s in extracted_skills):
        target_career = "Data Scientist"
    
    required = CAREER_SKILLS_MAP.get(target_career, CAREER_SKILLS_MAP["Software Engineer"])
    missing = list(required - set(extracted_skills))
    
    # Use real adaptive roadmap helper
    roadmap = generate_adaptive_roadmap(target_career, extracted_skills, {"programming": 60, "soft skills": 80})
    
    radar_data = [
        {"subject": "Tech", "A": 65, "fullMark": 100},
        {"subject": "Soft Skills", "A": 80, "fullMark": 100},
        {"subject": "Experience", "A": 40, "fullMark": 100}
    ]
    
    # Save prediction to user profile if logged in
    if current_user:
        current_user.predicted_career = target_career
        db.commit()
    
    return {
        "extracted_skills": extracted_skills,
        "missing_skills": missing,
        "recommended_roadmap": roadmap,
        "radar_data": radar_data
    }
