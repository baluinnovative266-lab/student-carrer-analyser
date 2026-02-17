import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Target,
    Wrench,
    Briefcase,
    BookOpen,
    CheckCircle,
    ArrowRight,
    TrendingUp,
    Layout,
    Lightbulb
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';
import MindMap from '../components/MindMap';

const PhaseDetail = () => {
    const { phaseId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    // Attempt to get roadmap from state, fallback to re-fetching logic or "Not Found"
    const [phaseData, setPhaseData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const roadmap = location.state?.roadmap || JSON.parse(localStorage.getItem('current_roadmap') || '[]');
        const index = parseInt(phaseId?.split('-')[1]) - 1;

        if (roadmap && roadmap[index]) {
            setPhaseData(roadmap[index]);
        }
        setLoading(false);
    }, [phaseId, location.state]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!phaseData) {
        return (
            <div className="min-h-screen bg-slate-900 pt-24 px-4 text-center">
                <div className="max-w-md mx-auto bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                    <Layout className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Phase Data Not Found</h2>
                    <p className="text-slate-400 mb-6">We couldn't find the details for this roadmap phase. Please return to your dashboard.</p>
                    <Link to="/dashboard" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all inline-block">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Navigation Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <Breadcrumbs />
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mt-2"
                        >
                            {phaseData.phase}
                        </motion.h1>
                        <p className="text-slate-400 mt-2 max-w-2xl">
                            {phaseData.description}
                        </p>
                    </div>
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 transition-all self-start md:self-center"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Overview
                    </Link>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    {/* Left Column: Visual Map */}
                    <motion.div variants={itemVariants} className="lg:col-span-8 space-y-8">
                        {/* Interactive Mind Map */}
                        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-1">
                            <MindMap phaseData={phaseData} career={user?.predicted_career || "Your Career"} />
                        </div>

                        {/* Objectives & Outcomes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <Target className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-bold">Phase Objectives</h3>
                                </div>
                                <ul className="space-y-3">
                                    {phaseData.objectives?.map((obj, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                            {obj}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <h3 className="text-lg font-bold">Real-world Examples</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {phaseData.examples?.map((ex, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-300">
                                            {ex}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Detailed Breakdown */}
                    <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
                        {/* Summary Action Card */}
                        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 p-6 rounded-2xl border border-blue-500/30 shadow-2xl">
                            <h3 className="text-xl font-black mb-3 italic">Industry Expectation</h3>
                            <p className="text-blue-100 text-sm leading-relaxed mb-4">
                                "{phaseData.expectations}"
                            </p>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-blue-500 w-1/4 animate-pulse"></div>
                            </div>
                            <p className="text-[10px] text-blue-300 uppercase font-black">Status: Phase Active</p>
                        </div>

                        {/* Tools Section */}
                        <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
                            <div className="flex items-center gap-3 mb-5">
                                <Wrench className="w-5 h-5 text-amber-400" />
                                <h3 className="font-bold">Required Tools</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {phaseData.tools?.map((tool, i) => (
                                    <div key={i} className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-xl border border-slate-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                        <span className="text-xs font-semibold text-slate-200">{tool}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Learning Resources */}
                        <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
                            <div className="flex items-center gap-3 mb-5">
                                <BookOpen className="w-5 h-5 text-emerald-400" />
                                <h3 className="font-bold">Suggested Resources</h3>
                            </div>
                            <div className="space-y-3">
                                {phaseData.resources?.map((res, i) => (
                                    <div key={i} className="group p-3 bg-slate-900/50 hover:bg-slate-900 rounded-xl border border-slate-700 transition-all cursor-pointer">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-slate-300 group-hover:text-white">{res}</span>
                                            <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Tip */}
                        <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 flex gap-4">
                            <Lightbulb className="w-8 h-8 text-emerald-400 shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-emerald-400 mb-1">Expert Tip</h4>
                                <p className="text-xs text-slate-400">
                                    Focus on building one deep project this phase rather than three simple ones. Quality wins in interviews.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default PhaseDetail;
