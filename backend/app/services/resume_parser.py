import re
from typing import List, Set
from pypdf import PdfReader
import io
import docx

class ResumeParser:
    def __init__(self):
        # Expanded skill set for better matching
        self.skills_db: Set[str] = {
            # Programming Languages
            "python", "java", "c++", "c#", "javascript", "typescript", "ruby", "php", "swift", "kotlin", "go", "rust",
            # Web Frameworks
            "react", "angular", "vue", "django", "flask", "fastapi", "spring boot", "asp.net", "node.js", "express",
            # Data Science & ML
            "numpy", "pandas", "scikit-learn", "tensorflow", "pytorch", "keras", "matplotlib", "seaborn", "opencv", "nltk", "spacy",
            # Databases
            "sql", "mysql", "postgresql", "mongodb", "redis", "oracle", "sqlite",
            # DevOps & Cloud
            "aws", "azure", "google cloud", "docker", "kubernetes", "jenkins", "git", "github", "gitlab", "ci/cd",
            # Soft Skills
            "communication", "leadership", "problem solving", "teamwork", "time management", "critical thinking", "adaptability",
            # Other
            "html", "css", "linux", "agile", "scrum", "jira"
        }

    def extract_text_from_pdf(self, file_content: bytes) -> str:
        """Extracts text from a PDF file efficiently with fallback."""
        try:
            reader = PdfReader(io.BytesIO(file_content))
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text.strip()
        except Exception as e:
            print(f"Error extracting text from PDF: {e}")
            return ""

    def extract_text_from_docx(self, file_content: bytes) -> str:
        """Extracts text from a DOCX file."""
        try:
            doc = docx.Document(io.BytesIO(file_content))
            text = ""
            for para in doc.paragraphs:
                text += para.text + "\n"
            return text.strip()
        except Exception as e:
            print(f"Error extracting text from DOCX: {e}")
            return ""

    def extract_skills(self, text: str) -> List[str]:
        """Extracts skills from the given text using keyword matching."""
        if not text:
            return []
            
        text_lower = text.lower()
        # Remove special chars for better matching but keep spaces
        text_clean = re.sub(r'[^\w\s]', ' ', text_lower)
        
        found_skills = set()
        
        # Check for each skill in the text
        # Using word boundary checks to avoid partial matches (e.g. "go" in "good")
        for skill in self.skills_db:
            # Create a regex pattern for the skill safely
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_clean):
                found_skills.add(skill.title())  # Store as Title Case
                
        return list(found_skills)

resume_parser = ResumeParser()
