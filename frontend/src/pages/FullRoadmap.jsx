import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Flag,
    Award,
    Briefcase,
    Rocket,
    ChevronRight,
    Circle,
    CheckCircle,
    Calendar,
    Target,
    Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';

const FullRoadmap = () => {
    const location = useLocation();
    const { user } = useAuth();
    const [roadmap, setRoadmap] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = location.state?.roadmap || JSON.parse(localStorage.getItem('current_roadmap') || '[]');
        setRoadmap(data);
        setLoading(false);
    }, [location.state]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-20 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">

                {/* Header Section */}
                <div className="mb-12">
                    <Breadcrumbs />
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mt-4"
                    >
                        <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                            Career Odyssey
                        </h1>
                        <p className="text-slate-400 text-lg mt-4 max-w-3xl">
                            Your comprehensive journey from first principles to industry mastery. This path is dynamically mapped based on your
                            <span className="text-blue-400 font-bold ml-1">
                                {user?.predicted_career || "target career"}
                            </span> profile.
                        </p>
                    </motion.div>
                </div>

                {/* Vertical Timeline */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative ml-4 md:ml-12"
                >
                    {/* Main Timeline Pipe */}
                    <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-800 rounded-full opacity-30 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>

                    {roadmap.map((phase, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            className="relative mb-16 pl-20 group"
                        >
                            {/* Phase Marker */}
                            <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-slate-900 border-4 border-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] z-10 group-hover:scale-110 group-hover:border-blue-400 transition-all duration-300">
                                <span className="text-xs font-black text-indigo-400 group-hover:text-blue-400">{idx + 1}</span>
                            </div>

                            {/* Content Card */}
                            <div className="bg-slate-900/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-800 group-hover:border-slate-700 transition-all shadow-xl">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tighter">
                                            {phase.phase}
                                        </h2>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase">
                                                <Calendar className="w-3.5 h-3.5" />
                                                Approx. 3-4 Months
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider">
                                                Verified Track
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/roadmap/phase-${idx + 1}`}
                                        state={{ roadmap }}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl text-sm font-bold transition-all border border-blue-600/20"
                                    >
                                        Deep Dive
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    {phase.description}
                                </p>

                                {/* Steps Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {phase.steps?.slice(0, 4).map((step, sIdx) => (
                                        <div key={sIdx} className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400">
                                                <Zap className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-300">{step.title}</p>
                                                <p className="text-[10px] text-slate-500">{step.duration}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Milestone Badge for Phase 3/4 */}
                                {(idx === 2 || idx === 3) && (
                                    <div className="mt-6 pt-6 border-t border-slate-800/50 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                                <Award className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white tracking-widest uppercase">
                                                    {idx === 2 ? "Project Milestone: Full Portfolio Release" : "Career Milestone: Job Readiness Certification"}
                                                </p>
                                            </div>
                                        </div>
                                        <Flag className="w-5 h-5 text-slate-700" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {/* Final Goal */}
                    <motion.div
                        variants={itemVariants}
                        className="relative pl-20"
                    >
                        <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-emerald-600 border-4 border-white flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] z-10 animate-bounce">
                            <Rocket className="w-6 h-6 text-white" />
                        </div>
                        <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 p-8 rounded-3xl border border-emerald-500/30">
                            <h2 className="text-2xl font-black text-emerald-400 uppercase italic">Goal Reached: Industry Integration</h2>
                            <p className="text-slate-400 text-sm mt-2">
                                You are now equipped with the technical proficiency, mental resilience, and visual portfolio requested by top-tier tech organizations.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default FullRoadmap;
