import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { CheckCircle, XCircle, TrendingUp, BookOpen, Target, Award, BarChart3, X, ChevronDown, ChevronUp } from 'lucide-react';
import ChatBot from '../components/ChatBot';

const Dashboard = () => {
    const location = useLocation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedStat, setSelectedStat] = useState(null); // For Modal
    const [expandedSteps, setExpandedSteps] = useState({}); // For Roadmap

    const Counter = ({ target, duration = 1.5 }) => {
        const [count, setCount] = useState(0);
        useEffect(() => {
            let start = 0;
            const end = parseInt(target);
            if (start === end) return;
            let timer = setInterval(() => {
                start += Math.ceil(end / 40);
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(start);
                }
            }, duration * 25);
            return () => clearInterval(timer);
        }, [target]);
        return <span>{count}%</span>;
    };

    useEffect(() => {
        // Mock data or data passed from ResumeAnalysis
        const data = location.state?.resumeResults || location.state?.predictionResults;

        if (data) {
            setStats(data);
            setLoading(false);
        } else {
            // No data passed, stop loading to show "Get Started"
            setLoading(false);
        }
    }, [location.state]);

    const toggleStep = (index) => {
        setExpandedSteps(prev => ({ ...prev, [index]: !prev[index] }));
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading your career insights...</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 flex items-center justify-center">
                <div className="max-w-4xl w-full text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100"
                    >
                        <Award className="w-20 h-20 text-indigo-500 mx-auto mb-6" />
                        <h1 className="text-4xl font-black text-gray-900 mb-4">Ready to Launch Your Career?</h1>
                        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
                            Unlock AI-powered insights. Analyze your resume or predict your career path to get started.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                            <a href="/career-prediction" className="group p-6 rounded-2xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all duration-300">
                                <Target className="w-10 h-10 text-indigo-600 group-hover:text-white mb-4" />
                                <h3 className="text-lg font-bold mb-2">Career Predictor</h3>
                                <p className="text-sm opacity-80">Input your academic scores & interests</p>
                            </a>
                            <a href="/resume-analysis" className="group p-6 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all duration-300">
                                <BookOpen className="w-10 h-10 text-emerald-600 group-hover:text-white mb-4" />
                                <h3 className="text-lg font-bold mb-2">Resume Analyzer</h3>
                                <p className="text-sm opacity-80">Upload your CV to find skill gaps</p>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Career Dashboard</h1>
                    <p className="text-gray-500">Track your progress and skill mastery</p>
                </div>

                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        title="Match Score"
                        value={stats.career_match_score ? `${Math.round(stats.career_match_score)}%` : "N/A"}
                        icon={<Target />}
                        color="text-primary"
                        bg="bg-red-50"
                        onClick={() => setSelectedStat({ type: 'match', title: 'Match Score Breakdown', data: stats.radar_data })}
                    />
                    <StatCard
                        title="Skills Found"
                        value={stats.extracted_skills.length}
                        icon={<CheckCircle />}
                        color="text-green-600"
                        bg="bg-green-50"
                        onClick={() => setSelectedStat({ type: 'skills_found', title: 'Verified Skills', data: stats.extracted_skills })}
                    />
                    <StatCard
                        title="Skills Gap"
                        value={stats.missing_skills.length}
                        icon={<XCircle />}
                        color="text-orange-600"
                        bg="bg-orange-50"
                        onClick={() => setSelectedStat({ type: 'skills_gap', title: 'Missing Skills', data: stats.missing_skills })}
                    />
                    <StatCard
                        title="Next Goal"
                        value={stats.next_recommended_skill || "Cloud"}
                        icon={<TrendingUp />}
                        color="text-blue-600"
                        bg="bg-blue-50"
                        onClick={() => setSelectedStat({ type: 'next_goal', title: 'Next Learning Goal', data: stats.next_recommended_skill })}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Skills Radar Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Award className="text-primary" size={20} /> Skill Proficiency
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.radar_data}>
                                    <PolarGrid stroke="#e5e7eb" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="My Skills"
                                        dataKey="A"
                                        stroke="#E23744"
                                        fill="#E23744"
                                        fillOpacity={0.6}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Animated Skill Bars Section */}
                        <div className="mt-8 pt-8 border-t border-gray-100 space-y-5">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Mastery Breakdown</h4>
                            {stats.radar_data.map((skill, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-gray-700">{skill.subject}</span>
                                        <span className="font-black text-indigo-600">
                                            <Counter target={skill.A} />
                                        </span>
                                    </div>
                                    <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${skill.A}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.1 }}
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 rounded-full"
                                        >
                                            <div className="absolute top-0 right-0 w-2 h-full bg-white/30 blur-[2px]" />
                                        </motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Flow-Path Roadmap */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            <BookOpen className="text-indigo-600" size={20} /> Your Career Roadmap
                        </h3>
                        <div className="relative">
                            {stats.recommended_roadmap.map((step, index) => {
                                const isLast = index === stats.recommended_roadmap.length - 1;
                                const colors = [
                                    { bg: 'bg-indigo-500', ring: 'ring-indigo-100', accent: 'border-indigo-200', lightBg: 'bg-indigo-50' },
                                    { bg: 'bg-violet-500', ring: 'ring-violet-100', accent: 'border-violet-200', lightBg: 'bg-violet-50' },
                                    { bg: 'bg-blue-500', ring: 'ring-blue-100', accent: 'border-blue-200', lightBg: 'bg-blue-50' },
                                    { bg: 'bg-cyan-500', ring: 'ring-cyan-100', accent: 'border-cyan-200', lightBg: 'bg-cyan-50' },
                                    { bg: 'bg-emerald-500', ring: 'ring-emerald-100', accent: 'border-emerald-200', lightBg: 'bg-emerald-50' },
                                ];
                                const c = colors[index % colors.length];
                                const durations = ['2-3 weeks', '3-4 weeks', '2 weeks', '4 weeks', '3 weeks'];

                                // Handle both old string format and new dict format
                                const stepTitle = typeof step === 'string' ? step : step.title;
                                const stepDesc = typeof step === 'string' ? '' : step.description;
                                const isExpanded = expandedSteps[index];

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 * index }}
                                        className="flex items-start gap-5 mb-0"
                                    >
                                        {/* Flow node + connector */}
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`w-10 h-10 rounded-full ${c.bg} ring-4 ${c.ring} text-white flex items-center justify-center font-bold text-sm shadow-lg z-10 flex-shrink-0 cursor-pointer transition-transform hover:scale-110`}
                                                onClick={() => toggleStep(index)}
                                            >
                                                {index + 1}
                                            </div>
                                            {!isLast && (
                                                <div className="w-0.5 h-full bg-gradient-to-b from-gray-300 to-gray-200 min-h-[4rem]" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className={`flex-1 pb-8 ${isLast ? '' : ''}`}>
                                            <div
                                                className={`p-5 rounded-xl ${c.lightBg} border ${c.accent} hover:shadow-md transition-all cursor-pointer`}
                                                onClick={() => toggleStep(index)}
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="text-gray-900 font-bold text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                                        {stepTitle}
                                                    </p>
                                                    {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                                </div>

                                                <AnimatePresence>
                                                    {isExpanded && stepDesc && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <p className="text-gray-600 text-sm mb-3 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                                {stepDesc}
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className={`h-1.5 w-1.5 rounded-full ${c.bg}`}></div>
                                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                        Estimated: {durations[index % durations.length]}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            {/* Final checkpoint */}
                            <div className="flex items-center gap-5 ml-0 pt-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 ring-4 ring-green-100 text-white flex items-center justify-center shadow-lg">
                                    <CheckCircle size={20} />
                                </div>
                                <p className="text-lg font-bold text-emerald-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Career Ready! 🎯</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* New Charts Row - Career Probabilities & Skill Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Career Probability Chart */}
                    {stats.probability_chart_data && stats.probability_chart_data.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                <BarChart3 className="text-pink-500" size={20} /> Career Match Probabilities
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.probability_chart_data} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                        <YAxis dataKey="career" type="category" width={120} tick={{ fill: '#374151', fontSize: 12, fontWeight: 600 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            formatter={(value) => `${value.toFixed(1)}%`}
                                        />
                                        <Bar dataKey="probability" fill="#ec4899" radius={[0, 8, 8, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}

                    {/* Skill Comparison Chart */}
                    {stats.skill_comparison_data && stats.skill_comparison_data.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                <Target className="text-indigo-500" size={20} /> Your Skills vs Required
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.skill_comparison_data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="skill" tick={{ fill: '#6b7280', fontSize: 11 }} />
                                        <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 600 }} />
                                        <Bar dataKey="yourScore" fill="#10b981" name="Your Score" radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="required" fill="#6366f1" name="Required" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Extracted Skills Tags */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                >
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Verified Skills</h3>
                    <div className="flex flex-wrap gap-3">
                        {stats.extracted_skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold border border-green-100"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Modal for Detailed Stats */}
            <AnimatePresence>
                {selectedStat && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setSelectedStat(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl relative z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedStat(null)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-2xl font-bold text-gray-900 mb-6 pr-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {selectedStat.title}
                            </h3>

                            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                {selectedStat.type === 'match' && (
                                    <div className="space-y-4">
                                        <p className="text-gray-600 mb-4">A breakdown of how your profile matches this career path:</p>
                                        {selectedStat.data.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                                <span className="font-semibold text-gray-700">{item.subject}</span>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-pink-500"
                                                            style={{ width: `${item.A}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-bold text-gray-900 w-8 text-right">{item.A}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {(selectedStat.type === 'skills_found' || selectedStat.type === 'skills_gap') && (
                                    <div className="grid grid-cols-1 gap-3">
                                        {Array.isArray(selectedStat.data) && selectedStat.data.length > 0 ? (
                                            selectedStat.data.map((skill, i) => (
                                                <div key={i} className={`p-4 rounded-xl border flex items-center gap-3 ${selectedStat.type === 'skills_found' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-orange-50 border-orange-100 text-orange-800'}`}>
                                                    {selectedStat.type === 'skills_found' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                                                    <span className="font-semibold">{skill}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 italic text-center py-4">No skills listed in this category.</p>
                                        )}
                                    </div>
                                )}

                                {selectedStat.type === 'next_goal' && (
                                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Target size={32} />
                                        </div>
                                        <p className="text-gray-600 mb-2 font-medium">Your Immediate Focus</p>
                                        <h4 className="text-3xl font-black text-blue-700 mb-4">{selectedStat.data}</h4>
                                        <p className="text-gray-600 text-sm">
                                            Mastering this skill will significantly improve your match score. Check the roadmap for specific resources!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* AI Career Assistant ChatBot */}
            <ChatBot
                career={stats.predicted_career}
                skills={stats.extracted_skills}
            />
        </div>
    );
};

const StatCard = ({ title, value, icon, color, bg, onClick }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group`}
        onClick={onClick}
    >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bg} ${color} group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">{value}</p>
        </div>
    </motion.div>
);

export default Dashboard;
