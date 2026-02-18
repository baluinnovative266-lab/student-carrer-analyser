import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
    CheckCircle, XCircle, TrendingUp, BookOpen, Target, Award, BarChart3,
    X, ShieldCheck, Sparkles, Layout, Info, ChevronRight, ArrowRight, Brain
} from 'lucide-react';
import AvatarSelector from '../components/AvatarSelector';

// ─── Page transition variants ─────────────────────────────────────────────────
const pageVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.25, ease: 'easeIn' } },
};

// ─── Animated counter ─────────────────────────────────────────────────────────
const Counter = ({ target, duration = 1.5 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!target) return;
        let start = 0;
        const end = parseInt(target) || 0;
        if (start === end) return;
        const timer = setInterval(() => {
            start += Math.ceil(end / 40);
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(start);
        }, duration * 25);
        return () => clearInterval(timer);
    }, [target, duration]);
    return <span>{count}%</span>;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon, color, bg, onClick }) => (
    <motion.div
        whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(236,72,153,0.15)' }}
        whileTap={{ scale: 0.97 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all group"
        onClick={onClick}
    >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} ${color} group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">{value}</p>
        </div>
    </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedStat, setSelectedStat] = useState(null);
    const [selectedSkill, setSelectedSkill] = useState(null);

    useEffect(() => {
        try {
            const data = location.state?.resumeResults || location.state?.predictionResults;
            if (data) {
                setStats(data);
                if (data.recommended_roadmap) {
                    localStorage.setItem('current_roadmap', JSON.stringify(data.recommended_roadmap));
                }
                if (data.predicted_career) {
                    localStorage.setItem('predicted_career', data.predicted_career);
                }
                // persist full stats for roadmap page
                localStorage.setItem('career_stats', JSON.stringify(data));
            } else {
                // Try to restore from localStorage
                const cached = localStorage.getItem('career_stats');
                if (cached) setStats(JSON.parse(cached));
            }
        } catch (err) {
            console.error('ResultsPage mount error:', err);
        } finally {
            setLoading(false);
        }
    }, [location.state]);

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Loading your career insights…</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center max-w-lg w-full"
                >
                    <Brain className="w-20 h-20 text-pink-400 mx-auto mb-6" />
                    <h1 className="text-3xl font-black text-gray-900 mb-4">No Results Yet</h1>
                    <p className="text-gray-500 mb-8">Run a career prediction or resume analysis to see your results here.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/career-prediction" className="p-5 rounded-2xl bg-pink-50 border border-pink-100 hover:bg-pink-100 transition-all text-center">
                            <Target className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                            <p className="font-bold text-gray-800 text-sm">Career Predictor</p>
                        </Link>
                        <Link to="/resume-analysis" className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all text-center">
                            <BookOpen className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                            <p className="font-bold text-gray-800 text-sm">Resume Analyzer</p>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-gray-50 pt-24 pb-16 px-4"
        >
            <div className="max-w-7xl mx-auto">

                {/* ── Hero ── */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8 relative overflow-hidden"
                >
                    <div className="absolute -top-16 -right-16 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <p className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-2">AI Analysis Complete</p>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                Your Career Match Results
                            </h1>
                            {stats.predicted_career && (
                                <p className="text-gray-500 text-lg">
                                    Best fit: <span className="font-bold text-pink-600">{stats.predicted_career}</span>
                                </p>
                            )}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/roadmap/overview', { state: { roadmap: stats.recommended_roadmap } })}
                            className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all whitespace-nowrap"
                        >
                            View My Roadmap <ArrowRight size={20} />
                        </motion.button>
                    </div>
                </motion.div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <StatCard
                        title="Match Score"
                        value={stats.career_match_score ? `${Math.round(stats.career_match_score)}%` : 'N/A'}
                        icon={<Target size={22} />}
                        color="text-pink-600"
                        bg="bg-pink-50"
                        onClick={() => setSelectedStat({ type: 'match', title: 'Match Score Breakdown', data: stats.radar_data || [] })}
                    />
                    <StatCard
                        title="Skills Found"
                        value={(stats.extracted_skills || []).length}
                        icon={<CheckCircle size={22} />}
                        color="text-emerald-600"
                        bg="bg-emerald-50"
                        onClick={() => setSelectedStat({ type: 'skills_found', title: 'Verified Skills', data: stats.extracted_skills || [] })}
                    />
                    <StatCard
                        title="Skills Gap"
                        value={(stats.missing_skills || []).length}
                        icon={<XCircle size={22} />}
                        color="text-orange-600"
                        bg="bg-orange-50"
                        onClick={() => setSelectedStat({ type: 'skills_gap', title: 'Missing Skills', data: stats.missing_skills || [] })}
                    />
                    <StatCard
                        title="Next Goal"
                        value={stats.next_recommended_skill || 'Cloud'}
                        icon={<TrendingUp size={22} />}
                        color="text-blue-600"
                        bg="bg-blue-50"
                        onClick={() => setSelectedStat({ type: 'next_goal', title: 'Next Learning Goal', data: stats.next_recommended_skill })}
                    />
                </div>

                {/* ── Avatar + Radar + Skill Bars ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-5 lg:col-span-1"
                    >
                        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100/10">
                            <AvatarSelector currentCareer={stats.predicted_career} />
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                                <Award className="text-pink-500" size={20} /> Skill Proficiency
                            </h3>
                            <div className="h-[200px] w-full -ml-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={stats.radar_data}>
                                        <PolarGrid stroke="#e5e7eb" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar name="My Skills" dataKey="A" stroke="#ec4899" fill="#ec4899" fillOpacity={0.5} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-2 pt-4 border-t border-gray-100 space-y-3">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mastery Breakdown</h4>
                                {(stats.radar_data || []).slice(0, 3).map((skill, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-gray-700">{skill.subject}</span>
                                            <span className="font-black text-pink-600"><Counter target={skill.A} /></span>
                                        </div>
                                        <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill.A || 0}%` }}
                                                transition={{ duration: 1.5, ease: 'easeOut', delay: i * 0.1 }}
                                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Charts ── */}
                    <div className="lg:col-span-2 grid grid-cols-1 gap-6">
                        {stats.probability_chart_data && stats.probability_chart_data.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                            >
                                <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                                    <BarChart3 className="text-pink-500" size={20} /> Career Match Probabilities
                                </h3>
                                <div className="h-[220px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.probability_chart_data} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                            <YAxis dataKey="career" type="category" width={120} tick={{ fill: '#374151', fontSize: 12, fontWeight: 600 }} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} formatter={(v) => `${v.toFixed(1)}%`} />
                                            <Bar dataKey="probability" fill="#ec4899" radius={[0, 8, 8, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        )}

                        {stats.skill_comparison_data && stats.skill_comparison_data.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                            >
                                <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                                    <Target className="text-indigo-500" size={20} /> Your Skills vs Required
                                </h3>
                                <div className="h-[220px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.skill_comparison_data}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="skill" tick={{ fill: '#6b7280', fontSize: 11 }} />
                                            <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                            <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 600 }} />
                                            <Bar dataKey="yourScore" fill="#10b981" name="Your Score" radius={[8, 8, 0, 0]} />
                                            <Bar dataKey="required" fill="#6366f1" name="Required" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* ── Verified Skills Section ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 mb-8 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
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
                            const skillsInCategory = (stats.extracted_skills || []).filter(
                                s => s.category === category || (category === 'Tools' && s.category === 'Tools & Frameworks')
                            );
                            const iconMap = {
                                'Technical': <Layout className="text-indigo-600" />,
                                'Soft Skills': <Sparkles className="text-pink-600" />,
                                'Tools': <Target className="text-emerald-600" />
                            };
                            return (
                                <div key={category} className="space-y-5">
                                    <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-50">
                                        <div className="p-2 rounded-xl bg-gray-50">{iconMap[category]}</div>
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
                                                    className="group flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-100 rounded-2xl hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/10 transition-all text-left"
                                                >
                                                    <span className="font-bold text-gray-700 group-hover:text-pink-600">{skill.name}</span>
                                                    <Info size={14} className="text-gray-300 group-hover:text-pink-400" />
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

                {/* ── Gap Coverage: Skill → Tool → Project ── */}
                {(stats.missing_skills || []).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8"
                    >
                        <h3 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Learning Gap Coverage
                        </h3>
                        <p className="text-gray-500 text-sm mb-8">Your skill gaps and the path to close them.</p>

                        <div className="space-y-6">
                            {(stats.missing_skills || []).slice(0, 5).map((skill, i) => {
                                const skillName = typeof skill === 'object' ? skill.name : skill;
                                return (
                                    <div key={i} className="relative">
                                        {/* Connector line */}
                                        {i < Math.min((stats.missing_skills || []).length, 5) - 1 && (
                                            <div className="absolute left-5 top-full w-0.5 h-6 bg-gradient-to-b from-rose-300 to-pink-200 z-10" />
                                        )}
                                        <div className="flex items-stretch gap-0">
                                            {/* Skill node */}
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-2xl px-5 py-4 flex-1"
                                            >
                                                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 font-black text-sm shrink-0">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Gap Skill</p>
                                                    <p className="font-bold text-gray-900">{skillName}</p>
                                                </div>
                                            </motion.div>

                                            {/* Arrow */}
                                            <div className="flex items-center px-3">
                                                <div className="w-8 h-0.5 bg-gradient-to-r from-rose-300 to-pink-400" />
                                                <ChevronRight size={16} className="text-pink-400 -ml-1" />
                                            </div>

                                            {/* Tool node */}
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="flex items-center gap-3 bg-pink-50 border border-pink-100 rounded-2xl px-5 py-4 flex-1"
                                            >
                                                <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                                                    <Target size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-pink-500 font-bold uppercase tracking-wider">Learn via</p>
                                                    <p className="font-bold text-gray-900">Roadmap Phase {i + 1}</p>
                                                </div>
                                            </motion.div>

                                            {/* Arrow */}
                                            <div className="flex items-center px-3">
                                                <div className="w-8 h-0.5 bg-gradient-to-r from-pink-300 to-indigo-400" />
                                                <ChevronRight size={16} className="text-indigo-400 -ml-1" />
                                            </div>

                                            {/* Project node */}
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4 flex-1"
                                            >
                                                <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                                    <Award size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Build</p>
                                                    <p className="font-bold text-gray-900">Project {i + 1}</p>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Progress bar */}
                        <div className="mt-8 pt-6 border-t border-gray-50">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-bold text-gray-600">Gap Coverage Progress</p>
                                <p className="text-sm font-black text-pink-600">
                                    {Math.round(((stats.extracted_skills || []).length / Math.max((stats.extracted_skills || []).length + (stats.missing_skills || []).length, 1)) * 100)}%
                                </p>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${Math.round(((stats.extracted_skills || []).length / Math.max((stats.extracted_skills || []).length + (stats.missing_skills || []).length, 1)) * 100)}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>{(stats.extracted_skills || []).length} skills mastered</span>
                                <span>{(stats.missing_skills || []).length} gaps remaining</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── Bottom CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-8 text-white text-center shadow-xl shadow-pink-500/20"
                >
                    <h3 className="text-2xl font-black mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Ready to start your journey?
                    </h3>
                    <p className="text-white/80 mb-6">Your personalized roadmap is waiting. Start learning today.</p>
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/roadmap/overview', { state: { roadmap: stats.recommended_roadmap } })}
                        className="inline-flex items-center gap-3 bg-white text-pink-600 px-8 py-4 rounded-2xl font-black text-base shadow-lg hover:shadow-xl transition-all"
                    >
                        View My Roadmap <ArrowRight size={20} />
                    </motion.button>
                </motion.div>
            </div>

            {/* ── Skill Detail Modal ── */}
            <AnimatePresence>
                {selectedSkill && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setSelectedSkill(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative z-10"
                            onClick={e => e.stopPropagation()}
                        >
                            <button onClick={() => setSelectedSkill(null)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                            <div className="inline-flex p-4 rounded-3xl bg-pink-50 text-pink-600 mb-6 font-black text-sm uppercase tracking-widest border border-pink-100">
                                {selectedSkill.category}
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{selectedSkill.name}</h3>
                            <div className="h-1.5 w-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-8" />
                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <p className="text-lg text-gray-700 leading-relaxed font-medium italic">"{selectedSkill.description}"</p>
                            </div>
                            <div className="mt-8 flex justify-center">
                                <button onClick={() => setSelectedSkill(null)} className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-pink-600 transition-colors shadow-lg">
                                    Got it, thanks!
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Stat Detail Modal ── */}
            <AnimatePresence>
                {selectedStat && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setSelectedStat(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl relative z-10"
                            onClick={e => e.stopPropagation()}
                        >
                            <button onClick={() => setSelectedStat(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 pr-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{selectedStat.title}</h3>
                            <div className="max-h-[60vh] overflow-y-auto pr-2">
                                {selectedStat.type === 'match' && (
                                    <div className="space-y-4">
                                        <p className="text-gray-600 mb-4">A breakdown of how your profile matches this career path:</p>
                                        {selectedStat.data.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                                <span className="font-semibold text-gray-700">{item.subject}</span>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-pink-500" style={{ width: `${item.A}%` }} />
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
                                        <p className="text-gray-600 text-sm">Mastering this skill will significantly improve your match score. Check the roadmap for specific resources!</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ResultsPage;
