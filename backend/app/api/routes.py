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
    "Product Manager": {"Leadership", "Communication", "Time Management", "Agile", "Jira", "Scrum"},
    "UI/UX Designer": {"HTML", "CSS", "Design", "Figma", "Usability", "Prototyping"}
}

# Career roadmap steps based on missing skills - NOW WITH DESCRIPTIONS
CAREER_ROADMAPS = {
    "Software Engineer": [
        {
            "title": "Master Data Structures & Algorithms",
            "description": "Practice solving algorithmic problems on platforms like LeetCode or HackerRank to build a strong foundation for technical interviews."
        },
        {
            "title": "Build a Full-Stack Project",
            "description": "Create a complete application using React for the frontend and Python/FastAPI for the backend to understand system integration."
        },
        {
            "title": "Learn System Design Principles",
            "description": "Study scalability, load balancing, and database design to prepare for architectural decisions in large-scale systems."
        },
        {
            "title": "Contribute to Open Source",
            "description": "Find a repository on GitHub, understand the codebase, and submit a pull request to gain real-world collaboration experience."
        },
        {
            "title": "Cloud Certification (AWS/Azure)",
            "description": "Get certified in cloud services to demonstrate your ability to deploy and manage applications in a cloud environment."
        }
    ],
    "Data Scientist": [
        {
            "title": "Advanced Machine Learning",
            "description": "Deep dive into algorithms like Random Forests, SVMs, and Gradient Boosting. Understand model tuning and evaluation metrics."
        },
        {
            "title": "Data Analysis Pipeline",
            "description": "Build a comprehensive pipeline using Pandas and NumPy to clean, process, and analyze large datasets efficiently."
        },
        {
            "title": "Master Complex SQL Queries",
            "description": "Learn window functions, joins, and subqueries to extract meaningful insights from relational databases."
        },
        {
            "title": "Deep Learning Frameworks",
            "description": "Gain proficiency in PyTorch or TensorFlow for building neural networks and solving complex problems like image recognition."
        },
        {
            "title": "Data Visualization Portfolio",
            "description": "Create interactive dashboards using Tableau or PowerBI to effectively communicate your data findings to stakeholders."
        }
    ],
    "Web Developer": [
        {
            "title": "Build a MERN Stack App",
            "description": "Develop a full-fledged application using logical MongoDB, Express, React, and Node.js to master the JavaScript ecosystem."
        },
        {
            "title": "Secure Authentication",
            "description": "Implement robust authentication systems using JWT or OAuth 2.0 to protect user data and manage sessions securely."
        },
        {
            "title": "Deployment & DevOps Basics",
            "description": "Deploy your applications on platforms like Vercel or Netlify and learn basic CI/CD pipelines for automated testing and deployment."
        },
        {
            "title": "RESTful API Design",
            "description": "Design and document scalable APIs following REST principles, ensuring proper status codes and resource management."
        },
         {
            "title": "Responsive UI Design",
            "description": "Master CSS Grid and Flexbox to create responsive layouts that work seamlessly across all device sizes."
        }
    ],
     "Product Manager": [
        {
            "title": "Product Management Certification",
            "description": "Enroll in a recognized course to learn the fundamentals of product lifecycle management and strategic planning."
        },
        {
            "title": "Data-Driven Decision Making",
            "description": "Learn to use tools like SQL and Tableau to analyze user metrics and make informed product decisions based on data."
        },
        {
            "title": "Launch a Side Project",
            "description": "Identify a problem, build a solution, and launch it to a small user base to experience the full product cycle firsthand."
        },
        {
            "title": "Agile & Scrum Methodologies",
            "description": "Study agile frameworks to effectively manage cross-functional teams and deliver value in iterative cycles."
        },
        {
            "title": "User Research Techniques",
            "description": "Conduct user interviews and usability testing to deeply understand customer needs and pain points."
        }
    ],
    "UI/UX Designer": [
        {
            "title": "Build a Design Portfolio",
            "description": "Showcase your best work on platforms like Behance or Dribbble, focusing on case studies that explain your design process."
        },
        {
            "title": "Google UX Design Certificate",
            "description": "Complete a structured certification to learn standard UX practices, from empathy mapping to high-fidelity prototyping."
        },
        {
            "title": "Redesign Popular Apps",
            "description": "Take an existing app and redesign a key flow to practice UI patterns and improve user experience."
        },
        {
            "title": "Usability Testing",
            "description": "Learn how to conduct usability tests to validate your designs and iterate based on real user feedback."
        },
        {
            "title": "Master Figma Prototyping",
            "description": "Become proficient in Figma's advanced features like auto-layout and interactive components for rapid prototyping."
        }
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
    
    # Calculate personalized career match score based on user input
    def calculate_match_score(career_name: str, input_data: CareerInput) -> float:
        """
        Calculate how well the user's profile matches a specific career.
        We normalize 1-10 scales to 0-100 for consistent weighting.
        """
        
        # Normalize interest scores to 0-100
        int_coding = input_data.interest_coding * 10
        int_design = input_data.interest_design * 10
        int_mgmt = input_data.interest_management * 10
        
        scores = {
            "Software Engineer": (
                input_data.math_score * 0.15 +
                input_data.programming_score * 0.35 +
                input_data.problem_solving_score * 0.20 +
                int_coding * 0.20 +
                input_data.communication_score * 0.10
            ),
            "Data Scientist": (
                input_data.math_score * 0.30 +
                input_data.programming_score * 0.25 +
                input_data.problem_solving_score * 0.20 +
                int_coding * 0.15 +
                input_data.communication_score * 0.10
            ),
            "Web Developer": (
                input_data.programming_score * 0.30 +
                input_data.problem_solving_score * 0.15 +
                int_coding * 0.25 +
                int_design * 0.20 +
                input_data.communication_score * 0.10
            ),
            "UI/UX Designer": (
                input_data.communication_score * 0.20 +
                int_design * 0.35 +
                input_data.problem_solving_score * 0.15 +
                int_coding * 0.10 + 
                input_data.math_score * 0.05 + 
                int_mgmt * 0.15 # Management slightly relevant for product design
            ),
            "Product Manager": (
                input_data.communication_score * 0.30 +
                int_mgmt * 0.35 +
                input_data.problem_solving_score * 0.20 +
                input_data.math_score * 0.10 +
                int_coding * 0.05
            )
        }
        
        raw_score = scores.get(career_name, 50)
        return min(100, max(0, raw_score))
    
    career_match = calculate_match_score(predicted_career, input_data)
    
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
    radar_data = [
        {"subject": "Math", "A": input_data.math_score, "fullMark": 100},
        {"subject": "Coding", "A": input_data.programming_score, "fullMark": 100},
        {"subject": "Comm", "A": input_data.communication_score, "fullMark": 100},
        {"subject": "Logic", "A": input_data.problem_solving_score, "fullMark": 100},
        {"subject": "Mgmt", "A": input_data.interest_management * 10, "fullMark": 100}, # Scale 1-10 to 10-100
        {"subject": "Design", "A": input_data.interest_design * 10, "fullMark": 100}
    ]
    
    # Enrich Extracted Skills (Verified Skills)
    # We'll consider skills with score > 60 as "Verified"
    verified_skills = []
    if input_data.math_score >= 60: verified_skills.append("Mathematics")
    if input_data.programming_score >= 60: verified_skills.append("Programming")
    if input_data.communication_score >= 60: verified_skills.append("Communication")
    if input_data.problem_solving_score >= 60: verified_skills.append("Problem Solving")
    if input_data.interest_coding >= 6: verified_skills.append("Coding Interest")
    if input_data.interest_design >= 6: verified_skills.append("Design Interest")
    if input_data.interest_management >= 6: verified_skills.append("Management Interest")
    
    return {
        "predicted_career": result.get("predicted_career"),
        "confidence": result.get("probabilities")[0].get("prob") if result.get("probabilities") else 0,
        "probabilities": result.get("probabilities"),
        "extracted_skills": verified_skills if verified_skills else ["Beginner"], 
        "missing_skills": required_skills[:5], # Show top skills needed
        "recommended_roadmap": roadmap,
        "radar_data": radar_data,
        "career_match_score": career_match,
        "next_recommended_skill": next_recommended_skill,
        "probability_chart_data": probability_chart_data,
        "skill_comparison_data": skill_comparison_data
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
    
    # Mock data for resume analysis response to match schema
    target_career = "Software Engineer" # In real app, we'd predict this from resume too
    missing = ["App Development", "Cloud Deployment"]
    
    # Use real roadmap structures
    base_roadmap = CAREER_ROADMAPS.get(target_career, CAREER_ROADMAPS["Software Engineer"])
    
    # We can customize the first step based on missing skills if we want
    # but for now, returning the standard robust roadmap is better than broken strings
    roadmap = base_roadmap
    
    radar_data = [
        {"subject": "Tech", "A": 65, "fullMark": 100},
        {"subject": "Soft Skills", "A": 80, "fullMark": 100},
        {"subject": "Experience", "A": 40, "fullMark": 100}
    ]
    
    return {
        "extracted_skills": extracted_skills,
        "missing_skills": missing,
        "recommended_roadmap": roadmap,
        "radar_data": radar_data
    }
