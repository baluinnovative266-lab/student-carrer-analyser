import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { CheckCircle, XCircle, TrendingUp, BookOpen, Target, Award, BarChart3, X, ChevronDown, ChevronUp, ShieldCheck, Sparkles, Layout, Info, ChevronRight } from 'lucide-react';
import ChatBot from '../components/ChatBot';
import FAQSection from '../components/FAQSection';

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

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedStat, setSelectedStat] = useState(null); // For General Stats Modal
    const [selectedSkill, setSelectedSkill] = useState(null); // For Skill Matter Modal
    const [expandedSteps, setExpandedSteps] = useState({}); // For Roadmap

    const Counter = ({ target, duration = 1.5 }) => {
        const [count, setCount] = useState(0);
        useEffect(() => {
            if (!target) return;
            let start = 0;
            const end = parseInt(target) || 0;
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
        try {
            // Mock data or data passed from ResumeAnalysis
            const data = location.state?.resumeResults || location.state?.predictionResults;

            if (data) {
                setStats(data);
                // Persist for deep-link pages
                if (data.recommended_roadmap) {
                    localStorage.setItem('current_roadmap', JSON.stringify(data.recommended_roadmap));
                }
            } else {
                // Try to load from persistence if state is lost on refresh
                const cachedRoadmap = localStorage.getItem('current_roadmap');
                if (cachedRoadmap && !stats) {
                    // We don't have full stats but we have roadmap, enough for some fallback
                    // This is a safety net
                }
            }
        } catch (err) {
            console.error("Dashboard mount error:", err);
        } finally {
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
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
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
                        onClick={() => setSelectedStat({ type: 'match', title: 'Match Score Breakdown', data: stats.radar_data || [] })}
                    />
                    <StatCard
                        title="Skills Found"
                        value={(stats.extracted_skills || []).length}
                        icon={<CheckCircle />}
                        color="text-green-600"
                        bg="bg-green-50"
                        onClick={() => setSelectedStat({ type: 'skills_found', title: 'Verified Skills', data: stats.extracted_skills || [] })}
                    />
                    <StatCard
                        title="Skills Gap"
                        value={(stats.missing_skills || []).length}
                        icon={<XCircle />}
                        color="text-orange-600"
                        bg="bg-orange-50"
                        onClick={() => setSelectedStat({ type: 'skills_gap', title: 'Missing Skills', data: stats.missing_skills || [] })}
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
                            {(stats.radar_data || []).map((skill, i) => (
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
                                            animate={{ width: `${skill.A || 0}%` }}
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

                    {/* 4-Phase Flow-Path Roadmap */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 lg:col-span-2 relative overflow-hidden"
                    >
                        {/* Decorative background element */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
                            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                                    <TrendingUp size={24} />
                                </div>
                                Personalized Success Journey
                            </h3>
                            <Link
                                to="/roadmap/full"
                                state={{ roadmap: stats.recommended_roadmap }}
                                className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors group"
                            >
                                View Full Journey
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="space-y-12 relative">
                            {/* The vertical connection line */}
                            <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-emerald-500 rounded-full opacity-20" />

                            {(() => {
                                // Backward compatibility check for roadmap format
                                const roadmap = Array.isArray(stats.recommended_roadmap) ? stats.recommended_roadmap : [];
                                const isNewFormat = roadmap.length > 0 && typeof roadmap[0] === 'object' && roadmap[0].phase;

                                const normalizedRoadmap = isNewFormat ? roadmap : [
                                    {
                                        phase: "Career Path Steps",
                                        steps: roadmap.map(step => (typeof step === 'string' ? { title: step, skill: 'General', duration: '2-3 weeks', outcome: 'Mastery' } : step))
                                    }
                                ];

                                return normalizedRoadmap.map((phase, pIndex) => (
                                    <div key={pIndex} className="relative pl-16">
                                        {/* Phase Header */}
                                        <Link
                                            to={`/roadmap/phase-${pIndex + 1}`}
                                            state={{ roadmap: normalizedRoadmap }}
                                            className="absolute left-0 top-0 w-14 h-14 bg-white border-4 border-indigo-500 rounded-2xl flex items-center justify-center shadow-lg z-10 transition-all hover:scale-110 hover:rotate-3 cursor-pointer group"
                                        >
                                            <span className="text-xl font-black text-indigo-600 group-hover:text-blue-600">{pIndex + 1}</span>
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ChevronRight className="w-3 h-3 text-white" />
                                            </div>
                                        </Link>

                                        <div className="mb-6 flex items-center justify-between pr-4">
                                            <div>
                                                <h4 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                                    {phase.phase}
                                                </h4>
                                                <div className="h-1 w-20 bg-indigo-500 rounded-full" />
                                            </div>
                                            <Link
                                                to={`/roadmap/phase-${pIndex + 1}`}
                                                state={{ roadmap: normalizedRoadmap }}
                                                className="text-xs font-bold text-indigo-400 hover:text-indigo-600 uppercase tracking-widest hidden md:block"
                                            >
                                                Learn More
                                            </Link>
                                        </div>

                                        <div className="grid gap-4">
                                            {Array.isArray(phase.steps) && phase.steps.map((step, sIndex) => {
                                                const statusColors = {
                                                    completed: "bg-emerald-50 border-emerald-200 text-emerald-700",
                                                    critical: "bg-rose-50 border-rose-200 text-rose-700",
                                                    'fast-track': "bg-amber-50 border-amber-200 text-amber-700",
                                                    upcoming: "bg-gray-50 border-gray-100 text-gray-600"
                                                };
                                                const currentStatus = step.status || 'upcoming';

                                                return (
                                                    <motion.div
                                                        key={sIndex}
                                                        whileHover={{ x: 10, backgroundColor: '#f8fafc' }}
                                                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${statusColors[currentStatus] || statusColors.upcoming}`}
                                                        onClick={() => setExpandedSteps(prev => ({ ...prev, [`${pIndex}-${sIndex}`]: !prev[`${pIndex}-${sIndex}`] }))}
                                                    >
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-xs font-black uppercase tracking-widest opacity-60">{step.skill}</span>
                                                                    {currentStatus === 'completed' && <CheckCircle size={14} className="text-emerald-500" />}
                                                                    {currentStatus === 'critical' && <Sparkles size={14} className="text-rose-500" />}
                                                                </div>
                                                                <p className="font-bold text-gray-900 leading-tight mb-1">{step.title}</p>
                                                                <p className="text-xs font-medium opacity-80">Duration: {step.duration}</p>
                                                            </div>
                                                            <ChevronDown className={`transition-transform duration-300 ${expandedSteps[`${pIndex}-${sIndex}`] ? 'rotate-180' : ''}`} size={18} />
                                                        </div>

                                                        <AnimatePresence>
                                                            {expandedSteps[`${pIndex}-${sIndex}`] && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    className="overflow-hidden mt-3 pt-3 border-t border-black/5"
                                                                >
                                                                    <p className="text-sm font-medium leading-relaxed">
                                                                        {step.custom_description || step.outcome}
                                                                    </p>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ));
                            })()}
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

                {/* Enhanced Categorized Verified Skills Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 mb-10 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Verified Career Competencies</h3>
                            <p className="text-gray-500 font-medium">Click any skill to reveal expert insights and mastery details.</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full font-bold text-sm border border-emerald-100 animate-pulse">
                            <ShieldCheck size={18} /> Verified by AI
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {['Technical', 'Soft Skills', 'Tools'].map((category) => {
                            const skillsInCategory = stats.extracted_skills.filter(s => s.category === category || (category === 'Tools' && s.category === 'Tools & Frameworks'));
                            const iconMap = {
                                'Technical': <Layout className="text-indigo-600" />,
                                'Soft Skills': <Sparkles className="text-pink-600" />,
                                'Tools': <Target className="text-emerald-600" />
                            };

                            return (
                                <div key={category} className="space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-50">
                                        <div className="p-2 rounded-xl bg-gray-50">
                                            {iconMap[category]}
                                        </div>
                                        <h4 className="font-black text-gray-800 uppercase tracking-widest text-sm">{category}</h4>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {skillsInCategory.length > 0 ? (
                                            skillsInCategory.map((skill, index) => (
                                                <motion.button
                                                    key={index}
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setSelectedSkill(skill)}
                                                    className="group flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-100 rounded-2xl hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all text-left"
                                                >
                                                    <span className="font-bold text-gray-700 group-hover:text-indigo-600">{skill.name}</span>
                                                    <Info size={14} className="text-gray-300 group-hover:text-indigo-400" />
                                                </motion.button>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 text-sm italic font-medium">No {category.toLowerCase()} identified yet.</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* SaaS FAQ Section */}
                <FAQSection />
            </div>

            {/* Modal for Skill Matter (Interactive Description) */}
            <AnimatePresence>
                {selectedSkill && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setSelectedSkill(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, rotateX: -10 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.9, opacity: 0, rotateX: 10 }}
                            className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative z-10 border border-white/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedSkill(null)}
                                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="inline-flex p-4 rounded-3xl bg-indigo-50 text-indigo-600 mb-6 font-black text-sm uppercase tracking-widest border border-indigo-100">
                                {selectedSkill.category}
                            </div>

                            <h3 className="text-3xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {selectedSkill.name}
                            </h3>

                            <div className="h-1.5 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-8" />

                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 shadow-inner">
                                <p className="text-lg text-gray-700 leading-relaxed font-medium italic">
                                    "{selectedSkill.description}"
                                </p>
                            </div>

                            <div className="mt-10 flex justify-center">
                                <button
                                    onClick={() => setSelectedSkill(null)}
                                    className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200"
                                >
                                    Got it, thanks!
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
                                            selectedStat.data.map((skill, i) => {
                                                const skillName = typeof skill === 'object' ? skill.name : skill;
                                                return (
                                                    <div key={i} className={`p-4 rounded-xl border flex items-center gap-3 ${selectedStat.type === 'skills_found' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-orange-50 border-orange-100 text-orange-800'}`}>
                                                        {selectedStat.type === 'skills_found' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                                                        <span className="font-semibold">{skillName}</span>
                                                    </div>
                                                );
                                            })
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

export default Dashboard;
