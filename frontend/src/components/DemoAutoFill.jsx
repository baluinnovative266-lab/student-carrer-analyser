import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DemoAutoFill = ({ targetPath }) => {
    const navigate = useNavigate();

    const handleAutoFill = () => {
        const mockResults = {
            predicted_career: "Software Engineer",
            match_score: 88,
            extracted_skills: [
                { name: "Python", category: "Technical" },
                { name: "JavaScript", category: "Technical" },
                { name: "React", category: "Tools & Frameworks" },
                { name: "Communication", category: "Soft Skills" }
            ],
            missing_skills: ["Data Structures", "Docker", "Machine Learning"],
            next_recommended_skill: "Data Structures",
            career_match_score: 88,
            probability_chart_data: [
                { name: "Software Engineer", probability: 88 },
                { name: "Data Scientist", probability: 65 },
                { name: "Product Manager", probability: 42 }
            ],
            skill_comparison_data: [
                { skill: "Programming", yourScore: 90, required: 85 },
                { skill: "System Design", yourScore: 40, required: 75 },
                { skill: "Problem Solving", yourScore: 95, required: 90 }
            ],
            recommended_roadmap: [
                { id: 1, title: "Phase 1 – Foundations", status: "completed" },
                { id: 2, title: "Phase 2 – Core Skills", status: "current" },
                { id: 3, title: "Phase 3 – Projects", status: "locked" },
                { id: 4, title: "Phase 4 – Career Preparation", status: "locked" }
            ]
        };

        navigate(targetPath, { state: { resumeResults: mockResults } });
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(236,72,153,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAutoFill}
            className="fixed bottom-8 left-8 z-50 bg-white text-pink-600 border-2 border-pink-100 px-6 py-3 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:bg-pink-50 transition-all group"
        >
            <Zap size={20} className="fill-pink-500 group-hover:animate-pulse" />
            Auto-Fill Demo
        </motion.button>
    );
};

export default DemoAutoFill;
