import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ChevronRight, Star, Clock, BookOpen, ArrowRight, CheckCircle, Lock } from 'lucide-react';

const phaseColors = [
    { border: 'border-indigo-500/40', bg: 'bg-indigo-500/10', numberBg: 'bg-indigo-600', glow: 'shadow-indigo-500/20', text: 'text-indigo-400', ring: 'ring-indigo-500' },
    { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', numberBg: 'bg-emerald-600', glow: 'shadow-emerald-500/20', text: 'text-emerald-400', ring: 'ring-emerald-500' },
    { border: 'border-amber-500/40', bg: 'bg-amber-500/10', numberBg: 'bg-amber-600', glow: 'shadow-amber-500/20', text: 'text-amber-400', ring: 'ring-amber-500' },
    { border: 'border-pink-500/40', bg: 'bg-pink-500/10', numberBg: 'bg-pink-600', glow: 'shadow-pink-500/20', text: 'text-pink-400', ring: 'ring-pink-500' },
];

const RoadmapOverview = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [roadmap, setRoadmap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhase, setSelectedPhase] = useState(null);

    useEffect(() => {
        // In a real app, we'd fetch the generated roadmap from an endpoint
        // For now, we might need to rely on what was predicted or re-fetch.
        // Assuming /predict-career response was saved or we can re-generate.
        // For this demo, let's try to fetch user's roadmap if saved, or hitting predict endpoint again if needed.
        // Ideally, we should have a persistence layer. 
        // Let's assume the user object or a specific endpoint gives us the current roadmap.

        const fetchRoadmap = async () => {
            // Mocking the fetch for now based on what the backend WOULD return
            // In production, this comes from /api/roadmap/current
            try {
                // 1. Try to get from location state (after prediction)
                const stateData = location.state?.roadmap;
                if (stateData) {
                    setRoadmap(stateData);
                    return;
                }

                // 2. Try to get from API (persistence)
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch('/api/get-roadmap', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data.roadmap && data.roadmap.length > 0) {
                            setRoadmap(data.roadmap);
                            return;
                        }
                    }
                }

                // 3. Fallback to localStorage (legacy/guest)
                const cached = localStorage.getItem('current_roadmap');
                if (cached) {
                    setRoadmap(JSON.parse(cached));
                }
            } catch (err) {
                console.error("Failed to load roadmap:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoadmap();
    }, [location.state]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Generating your personalized path...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-12">
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <span className="text-sm font-bold tracking-wider uppercase">Your Journey</span>
                        <ChevronRight size={16} />
                        <span className="text-sm font-bold tracking-wider uppercase text-white/50">{user?.predicted_career || "Career Path"}</span>
                    </div>
                    <h1 className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Interactive Roadmap
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl">
                        A personalized 4-phase journey tailored to your unique profile.
                        Click on any phase to explore specialized modules and mentorship resources.
                    </p>
                </header>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
                >
                    {/* Connection Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-blue-500/50 to-purple-500/50 -translate-y-1/2 z-0 transform scale-x-[0.9]"></div>

                    {roadmap.map((phase, index) => {
                        const color = phaseColors[index % phaseColors.length];
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -10, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedPhase(phase)}
                                className={`
                                relative z-10 ${color.bg} backdrop-blur-xl ${color.border} border p-6 rounded-3xl cursor-pointer
                                group hover:border-opacity-80 transition-all duration-300 shadow-lg ${color.glow}
                                ${selectedPhase?.phase === phase.phase ? `ring-2 ${color.ring} border-transparent` : ''}
                            `}
                            >
                                {/* Visual Connector / Number */}
                                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full ${color.numberBg} border-4 border-slate-800 flex items-center justify-center font-black text-lg z-20 text-white shadow-lg ${color.glow}`}>
                                    {index + 1}
                                </div>

                                <div className="mt-6 text-center">
                                    <h3 className={`text-xl font-bold mb-2 ${color.text} group-hover:text-white transition-colors`}>{phase.phase}</h3>
                                    <div className={`text-xs font-medium px-3 py-1 rounded-full ${color.bg} ${color.text} inline-block mb-4 border ${color.border}`}>
                                        {phase.steps.length} Modules
                                    </div>
                                    <p className="text-sm text-white/50 line-clamp-3">
                                        {phase.description || "Master the core skills required for this level."}
                                    </p>
                                </div>

                                {/* Mini Progress Bar */}
                                <div className="mt-6">
                                    <div className="flex justify-between text-xs mb-1 opacity-60">
                                        <span>Progress</span>
                                        <span>0%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className={`w-0 h-full ${color.numberBg} rounded-full`}></div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* Slide-over Panel */}
            <AnimatePresence>
                {selectedPhase && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPhase(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-slate-900 border-l border-white/10 z-50 p-8 overflow-y-auto shadow-2xl"
                        >
                            <button
                                onClick={() => setSelectedPhase(null)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <ArrowRight size={24} />
                            </button>

                            <div className="mt-8">
                                <span className="text-primary font-bold tracking-wider text-sm uppercase">Phase Overview</span>
                                <h2 className="text-3xl font-black mt-2 mb-4">{selectedPhase.phase}</h2>
                                <p className="text-white/70 leading-relaxed mb-8">
                                    {selectedPhase.description}
                                </p>

                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold border-b border-white/10 pb-4">Modules</h3>
                                    {selectedPhase.steps.map((step, idx) => (
                                        <div key={idx} className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-lg">{step.title}</h4>
                                                {step.status === 'completed' && <CheckCircle size={18} className="text-green-500" />}
                                                {step.status === 'fast-track' && <Star size={18} className="text-yellow-500" />}
                                            </div>
                                            <p className="text-sm text-white/50 mb-3">{step.outcome}</p>
                                            <div className="flex items-center gap-4 text-xs font-medium text-white/40">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {step.duration}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <BookOpen size={12} />
                                                    {step.skill}
                                                </div>
                                            </div>
                                            {step.custom_description && (
                                                <div className="mt-3 p-2 bg-primary/10 border border-primary/20 rounded-lg text-xs text-primary/80">
                                                    {step.status === 'critical' ? '⚠️ ' : '💡 '}
                                                    {step.custom_description}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(`/roadmap/phase/${selectedPhase.phase.replace(/\s/g, '-').toLowerCase()}`)}
                                    className="w-full mt-8 bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    Start This Phase <ArrowRight size={20} />
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RoadmapOverview;
