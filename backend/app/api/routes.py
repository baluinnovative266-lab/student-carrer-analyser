from fastapi import APIRouter, UploadFile, File, HTTPException
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
    "Product Manager": {"leadership", "communication", "time management", "agile", "jira", "scrum"},
    "UI/UX Designer": {"html", "css", "design", "figma", "usability", "prototyping"}
}

# Career roadmap steps based on missing skills
CAREER_ROADMAPS = {
    "Software Engineer": [
        "Master Data Structures and Algorithms through LeetCode",
        "Build a production-grade project using React and FastAPI",
        "Learn System Design and Scalability patterns",
        "Contribute to open-source projects on GitHub",
        "Get certified in AWS or Azure Cloud services"
    ],
    "Data Scientist": [
        "Complete Advanced Machine Learning specialization",
        "Build a comprehensive data analysis pipeline using Pandas/Numpy",
        "Master SQL for complex data queries",
        "Learn Deep Learning frameworks (PyTorch/TensorFlow)",
        "Create a portfolio of data visualization projects using Tableau"
    ],
    "Web Developer": [
         "Build a full-stack MERN application",
         "Learn verify secure authentication (JWT/OAuth)",
         "Deploy applications on Vercel/Netlify/Heroku",
         "Understand RESTful API design principles"
    ],
     "Product Manager": [
        "Take a product management certification course",
        "Learn allows data analysis for product metrics (SQL/Tableau)",
        "Build a side project and launch it to users",
        "Study agile methodologies and scrum framework"
    ],
    "UI/UX Designer": [
        "Build a portfolio on Behance/Dribbble",
        "Complete Google UX Design Certificate",
        "Redesign popular apps to practice UI patterns",
        "Learn user research and usability testing methods"
    ]
}

@router.get("/health")
def health_check():
    return {"status": "healthy"}

@router.post("/predict-career", response_model=CareerPredictionResponse)
def predict_career(input_data: CareerInput):
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
    roadmap = CAREER_ROADMAPS.get(predicted_career, CAREER_ROADMAPS["Software Engineer"])
    
    # Generate charts data from input scores
    radar_data = [
        {"subject": "Math", "A": input_data.math_score, "fullMark": 100},
        {"subject": "Coding", "A": input_data.programming_score, "fullMark": 100},
        {"subject": "Comm", "A": input_data.communication_score, "fullMark": 100},
        {"subject": "Logic", "A": input_data.problem_solving_score, "fullMark": 100},
        {"subject": "Mgmt", "A": input_data.interest_management * 10, "fullMark": 100}, # Scale 1-10 to 10-100
        {"subject": "Design", "A": input_data.interest_design * 10, "fullMark": 100}
    ]
    
    # We don't have extracted skills for prediction, so we can say "Your input profile"
    # Or just leave extracted empty. Let's populate "missing" as the path to learn.
    
    return {
        "predicted_career": result.get("predicted_career"),
        "confidence": result.get("probabilities")[0].get("prob") if result.get("probabilities") else 0,
        "probabilities": result.get("probabilities"),
        "extracted_skills": ["Math: " + str(input_data.math_score), "Coding: " + str(input_data.programming_score)], # Show strengths?
        "missing_skills": required_skills[:5], # Show top skills needed
        "recommended_roadmap": roadmap,
        "radar_data": radar_data
    }

@router.post("/analyze-resume", response_model=SkillGapResponse)
async def analyze_resume(file: UploadFile = File(...)):
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
    
    # Define required skills per career path for more professional analysis
    
    # Generate roadmap based on career and missing skills
    base_roadmap = CAREER_ROADMAPS.get(target_career, ["Participate in open-source projects", "Master system design principles"])
    
    # Supplement with skill-specific actions
    roadmap = [f"Complete an intensive bootcamp focusing on {skill}" for skill in missing[:2]]
    roadmap.extend(base_roadmap[:3])
    
    return {
        "extracted_skills": extracted_skills,
        "missing_skills": missing,
        "recommended_roadmap": roadmap,
        "radar_data": radar_data
    }
