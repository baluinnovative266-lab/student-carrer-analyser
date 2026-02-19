from typing import List, Dict, Any, Optional

class JobService:
    # Curated dataset of companies and their primary hiring categories
    COMPANIES = {
        "Software Engineer": [
            {"name": "Google", "logo": "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_Icons_By_Google.png", "url": "https://www.google.com/about/careers/applications/jobs/results/"},
            {"name": "Microsoft", "logo": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", "url": "https://careers.microsoft.com/us/en/search-results"},
            {"name": "Amazon", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", "url": "https://www.amazon.jobs/en/search"},
            {"name": "Meta", "logo": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg", "url": "https://www.metacareers.com/jobs"},
            {"name": "Netflix", "logo": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", "url": "https://jobs.netflix.com/search"}
        ],
        "Data Scientist": [
            {"name": "IBM", "logo": "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg", "url": "https://www.ibm.com/careers"},
            {"name": "Deloitte", "logo": "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg", "url": "https://www2.deloitte.com/ui/en/careers/careers.html"},
            {"name": "Accenture", "logo": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg", "url": "https://www.accenture.com/in-en/careers"},
            {"name": "Adobe", "logo": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg", "url": "https://www.adobe.com/careers.html"}
        ],
        "Web Developer": [
            {"name": "Shopify", "logo": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg", "url": "https://www.shopify.com/careers"},
            {"name": "Airbnb", "logo": "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg", "url": "https://careers.airbnb.com/"},
            {"name": "Stripe", "logo": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", "url": "https://stripe.com/jobs/search"},
            {"name": "Atlassian", "logo": "https://upload.wikimedia.org/wikipedia/commons/0/01/Atlassian_Logo.svg", "url": "https://www.atlassian.com/company/careers"}
        ],
        "UI/UX Designer": [
            {"name": "Figma", "logo": "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg", "url": "https://www.figma.com/careers/"},
            {"name": "Canva", "logo": "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg", "url": "https://www.canva.com/careers/"},
            {"name": "Uber", "logo": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png", "url": "https://www.uber.com/careers/"}
        ]
    }

    # Curated dataset of job roles and their required skills
    JOB_ROLES = {
        "Software Engineer": [
            {"role": "Full Stack Developer", "level": "Entry", "required_skills": ["React", "Node.js", "Python", "SQL"]},
            {"role": "Backend Engineer", "level": "Intermediate", "required_skills": ["Python", "Algorithms", "System Design", "Databases"]},
            {"role": "Frontend Engineer", "level": "Entry", "required_skills": ["React", "CSS", "TypeScript", "REST APIs"]},
            {"role": "Cloud Architect", "level": "Expert", "required_skills": ["Cloud Computing", "System Design", "Networking", "DevOps"]}
        ],
        "Data Scientist": [
            {"role": "Machine Learning Engineer", "level": "Intermediate", "required_skills": ["Python", "Machine Learning", "Statistics", "SQL"]},
            {"role": "Data Analyst", "level": "Entry", "required_skills": ["SQL", "Statistics", "Data Visualization", "Python"]},
            {"role": "AI Researcher", "level": "Expert", "required_skills": ["Machine Learning", "Deep Learning", "Math", "Python"]}
        ],
        "Web Developer": [
            {"role": "Junior Web Developer", "level": "Entry", "required_skills": ["HTML/CSS", "JavaScript", "React"]},
            {"role": "E-commerce Specialist", "level": "Intermediate", "required_skills": ["React", "Node.js", "REST APIs", "Database"]}
        ],
        "UI/UX Designer": [
            {"role": "Product Designer", "level": "Intermediate", "required_skills": ["Figma", "User Research", "Prototyping", "UI/UX Design"]},
            {"role": "UX Researcher", "level": "Entry", "required_skills": ["User Research", "Wireframing", "Communication"]}
        ]
    }

    @staticmethod
    def calculate_match(user_skills: List[str], required_skills: List[str]) -> Dict[str, Any]:
        """Calculate skill match percentage and identify gaps."""
        user_skills_lower = [s.lower() for s in user_skills]
        required_skills_lower = [s.lower() for s in required_skills]
        
        matched_skills = [s for s in required_skills_lower if s in user_skills_lower]
        missing_skills = [s for s in required_skills if s.lower() not in user_skills_lower]
        
        match_percentage = (len(matched_skills) / len(required_skills)) * 100 if required_skills else 0
        
        return {
            "match_percentage": round(match_percentage, 1),
            "missing_skills": missing_skills,
            "is_eligible": match_percentage >= 70
        }

    @classmethod
    def get_matches(cls, career_path: str, user_skills: List[str]) -> List[Dict[str, Any]]:
        """Find matching jobs for a user based on career path and skills."""
        roles = cls.JOB_ROLES.get(career_path, [])
        companies = cls.COMPANIES.get(career_path, [])
        
        matches = []
        for role in roles:
            match_data = cls.calculate_match(user_skills, role["required_skills"])
            
            # Only return jobs if match is >= 40% (to show gaps) or if explicitly eligible
            if match_data["match_percentage"] >= 40:
                # Assign companies to roles randomly (for mock)
                import random
                company = random.choice(companies) if companies else {"name": "Tech Corp", "logo": "", "url": "#"}
                
                matches.append({
                    "role": role["role"],
                    "level": role["level"],
                    "required_skills": role["required_skills"],
                    "match_percentage": match_data["match_percentage"],
                    "missing_skills": match_data["missing_skills"],
                    "is_eligible": match_data["is_eligible"],
                    "company_name": company["name"],
                    "company_logo": company["logo"],
                    "apply_url": company["url"]
                })
        
        return sorted(matches, key=lambda x: x["match_percentage"], reverse=True)

    @classmethod
    def get_companies_by_career(cls, career_path: str) -> List[Dict[str, Any]]:
        """Get top hiring companies for a career path."""
        return cls.COMPANIES.get(career_path, [])

job_service = JobService()
