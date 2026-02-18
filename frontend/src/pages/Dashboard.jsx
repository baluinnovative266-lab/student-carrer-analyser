import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, BookOpen, BarChart3, Award, ArrowRight, Brain, Sparkles, TrendingUp, Play } from 'lucide-react';
import FAQSection from '../components/FAQSection';
import DemoAutoFill from '../components/DemoAutoFill';
import GuidedTour from '../components/GuidedTour';

// ─── Page transition variants ─────────────────────────────────────────────────
const pageVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.25, ease: 'easeIn' } },
};

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [isTourOpen, setIsTourOpen] = useState(false);

    // If prediction/resume data arrives here, redirect to /results
    useEffect(() => {
        const data = location.state?.resumeResults || location.state?.predictionResults;
        if (data) {
            navigate('/results', { state: location.state, replace: true });
        } else {
            const cached = localStorage.getItem('career_stats');
            if (cached) setStats(JSON.parse(cached));
        }
    }, [location.state, navigate]);


    // Feature cards for the hub
    const features = [
        {
            icon: <Target size={28} />,
            title: 'Career Predictor',
            desc: 'Input your academic scores & interests to get your best-fit career.',
            color: 'text-pink-600',
            bg: 'bg-pink-50',
            border: 'border-pink-100',
            hover: 'hover:bg-pink-600',
            link: '/career-prediction',
            cta: 'Predict My Career',
        },
        {
            icon: <BookOpen size={28} />,
            title: 'Resume Analyzer',
            desc: 'Upload your CV to extract skills and identify gaps automatically.',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            hover: 'hover:bg-emerald-600',
            link: '/resume-analysis',
            cta: 'Analyze Resume',
        },
        {
            icon: <BarChart3 size={28} />,
            title: 'My Results',
            desc: 'View your career match score, skill gaps, and AI-powered insights.',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
            hover: 'hover:bg-indigo-600',
            link: '/results',
            cta: 'View Results',
        },
        {
            icon: <Award size={28} />,
            title: 'My Roadmap',
            desc: 'Follow your personalized learning path to reach your career goal.',
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            hover: 'hover:bg-amber-600',
            link: '/roadmap/overview',
            cta: 'View Roadmap',
        },
    ];

    const steps = [
        { num: '01', label: 'Predict Career', sub: 'Enter your scores', icon: <Brain size={20} />, link: '/career-prediction' },
        { num: '02', label: 'View Results', sub: 'See your match score', icon: <Sparkles size={20} />, link: '/results' },
        { num: '03', label: 'Follow Roadmap', sub: 'Learn phase by phase', icon: <TrendingUp size={20} />, link: '/roadmap/overview' },
    ];

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-gray-50 pt-24 pb-16 px-6"
        >
            <div className="max-w-7xl mx-auto">

                {/* ── Hero ── */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-14"
                >
                    <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 border border-pink-100 px-4 py-2 rounded-full text-sm font-bold mb-6">
                        <Brain size={16} /> AI-Powered Career Guidance
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">CareerSense</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
                        Your AI-powered career intelligence platform. Start by predicting your career or analyzing your resume.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsTourOpen(true)}
                            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"
                        >
                            <Play size={18} className="fill-white" /> Judge Walkthrough Mode
                        </motion.button>
                    </div>
                </motion.div>

                {/* ── Recent Analysis (Conditional) ── */}
                {stats && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl mb-14 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                            <div className="flex-1">
                                <p className="text-xs font-black text-pink-500 uppercase tracking-widest mb-2">Resume Insight</p>
                                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                                    Current Career Fit: <span className="text-pink-600">{stats.predicted_career}</span>
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {stats.extracted_skills?.slice(0, 4).map((skill, i) => (
                                        <div key={i} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600">
                                            {typeof skill === 'object' ? skill.name : skill}
                                        </div>
                                    ))}
                                    <div className="px-4 py-2 bg-pink-50 border border-pink-100 rounded-xl text-xs font-bold text-pink-600">
                                        +{(stats.extracted_skills?.length || 0) - 4} More
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center p-8 bg-pink-600 rounded-[2rem] text-white min-w-[200px] shadow-lg shadow-pink-500/20">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Match Score</p>
                                <div className="text-5xl font-black">{Math.round(stats.career_match_score || 0)}%</div>
                                <button
                                    onClick={() => navigate('/results')}
                                    className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white/20 hover:bg-white text-white hover:text-pink-600 px-4 py-2 rounded-lg transition-all"
                                >
                                    Deep Dive <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── User Journey Steps ── */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-14">
                    {steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Link to={step.link}>
                                <motion.div
                                    whileHover={{ y: -4, boxShadow: '0 12px 30px -8px rgba(236,72,153,0.2)' }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm cursor-pointer group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-colors">
                                        {step.icon}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step {step.num}</p>
                                        <p className="font-bold text-gray-900 text-sm">{step.label}</p>
                                        <p className="text-xs text-gray-400">{step.sub}</p>
                                    </div>
                                </motion.div>
                            </Link>
                            {i < steps.length - 1 && (
                                <ArrowRight size={20} className="text-gray-300 shrink-0 hidden md:block" />
                            )}
                        </div>
                    ))}
                </div>


                {/* ── Feature Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            whileHover={{ y: -6, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
                            whileTap={{ scale: 0.97 }}
                            className={`group bg-white border ${f.border} rounded-2xl p-8 shadow-sm cursor-pointer transition-all duration-300`}
                            onClick={() => navigate(f.link)}
                        >
                            <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{f.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">{f.desc}</p>
                            <div className={`inline-flex items-center gap-2 text-sm font-bold ${f.color} group-hover:gap-3 transition-all`}>
                                {f.cta} <ArrowRight size={16} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Quick Start CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-8 text-white text-center shadow-xl shadow-pink-500/20"
                >
                    <h3 className="text-2xl font-black mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Ready to discover your career path?
                    </h3>
                    <p className="text-white/80 mb-6">Takes less than 2 minutes. Get your personalized AI career analysis.</p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Link
                            to="/career-prediction"
                            className="inline-flex items-center gap-3 bg-white text-pink-600 px-8 py-4 rounded-2xl font-black text-base shadow-lg hover:shadow-xl transition-all"
                        >
                            Start Career Analysis <ArrowRight size={20} />
                        </Link>
                    </motion.div>
                </motion.div>

                <div className="mt-20">
                    <FAQSection />
                </div>
            </div>

            <DemoAutoFill targetPath="/results" />
            <GuidedTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
        </motion.div>
    );
};

export default Dashboard;
