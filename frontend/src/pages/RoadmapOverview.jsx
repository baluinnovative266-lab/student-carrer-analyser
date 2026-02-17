import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ChevronRight, Star, Clock, BookOpen, ArrowRight, CheckCircle, Lock } from 'lucide-react';

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
                // For demo, we might trigger a re-prediction or fetch stored
                // We'll use a mocked flow if the user doesn't have one in context
                if (user?.predicted_career) {
                    // Re-fetch using the prediction logic to get the fresh dynamic roadmap
                    // This is a bit inefficient but works for the prototype without a DB persistence layer for roadmaps
                    const response = await axios.post('/api/predict-career', {
                        programming_score: 75, // These should come from user profile
                        math_score: 60,
                        communication_score: 80,
                        problem_solving_score: 70,
                        interest_design: 8,
                        interest_coding: 8,
                        interest_business: 5,
                        interest_public_speaking: 6
                    });
                    setRoadmap(response.data.recommended_roadmap);
                }
            } catch (err) {
                console.error("Failed to load roadmap", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoadmap();
    }, [user]);

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

                    {roadmap.map((phase, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedPhase(phase)}
                            className={`
                                relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl cursor-pointer
                                group hover:border-primary/50 transition-all duration-300
                                ${selectedPhase?.phase === phase.phase ? 'ring-2 ring-primary border-transparent' : ''}
                            `}
                        >
                            {/* Visual Connector / Number */}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center font-black text-lg z-20 group-hover:border-primary transition-colors">
                                {index + 1}
                            </div>

                            <div className="mt-6 text-center">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{phase.phase}</h3>
                                <div className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 inline-block mb-4">
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
                                    <div className="w-0 h-full bg-primary rounded-full"></div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
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
