import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, Share2, MessageSquare, ThumbsUp,
    PlayCircle, FileText, Code, CheckCircle, ChevronDown, ChevronRight
} from 'lucide-react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const PhaseDetail = () => {
    const { phaseId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('roadmap');

    // Mock Data (In reality, fetch from API based on phaseId)
    const phaseData = {
        title: phaseId ? phaseId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Phase Detail",
        description: "Review and master the core concepts required for this stage of your career.",
        progress: 35,
        modules: [
            { id: 1, title: "Module 1: Core Concepts", completed: true },
            { id: 2, title: "Module 2: Advanced Logic", completed: false },
            { id: 3, title: "Module 3: Project Work", completed: false }
        ],
        faqs: [
            { q: "How long does this phase take?", a: "Typically 4-6 weeks depending on your pace." },
            { q: "Do I need prior experience?", a: "No, this phase is designed to build from the ground up." }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white pb-20">
            {/* Header with Breadcrumb */}
            <div className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/roadmap/overview')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <div className="text-xs text-white/40 font-medium uppercase tracking-wider">Phase Detail</div>
                        <h1 className="text-xl font-bold">{phaseData.title}</h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Share2 size={20} /></button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Hero Section */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-800 p-10 border border-white/10">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black mb-4">{phaseData.title}</h2>
                            <p className="text-lg text-white/70 mb-8 max-w-xl">{phaseData.description}</p>

                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold uppercase tracking-wider bg-black/30 px-3 py-1 rounded">In Progress</span>
                                <div className="h-2 w-32 bg-black/30 rounded-full overflow-hidden">
                                    <div style={{ width: `${phaseData.progress}%` }} className="h-full bg-green-400"></div>
                                </div>
                                <span className="text-xs font-mono">{phaseData.progress}%</span>
                            </div>
                        </div>
                        <div className="absolute right-0 bottom-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full"></div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-8 border-b border-white/10">
                        {['roadmap', 'resources', 'discussion'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === tab ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'roadmap' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    {phaseData.modules.map((module) => (
                                        <div key={module.id} className="group flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${module.completed ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-white/40'}`}>
                                                {module.completed ? <CheckCircle size={24} /> : <Code size={24} />}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{module.title}</h3>
                                                <p className="text-sm text-white/50">Master the basics of specific structures.</p>
                                            </div>
                                            <ChevronRight size={20} className="text-white/20 group-hover:text-white transition-colors" />
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                            {activeTab === 'resources' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <h3 className="font-bold text-lg mb-4">Recommended Resources</h3>
                                        <div className="space-y-4">
                                            <a href="#" className="flex items-center gap-3 group">
                                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                    <PlayCircle size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold group-hover:text-blue-400 transition-colors">Video Tutorial</div>
                                                    <div className="text-xs text-white/40">24 mins</div>
                                                </div>
                                            </a>
                                            <a href="#" className="flex items-center gap-3 group">
                                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold group-hover:text-purple-400 transition-colors">Documentation</div>
                                                    <div className="text-xs text-white/40">Read Guide</div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>

                            )}

                            {activeTab === 'discussion' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <h3 className="text-xl font-bold mb-6">Community Discussion</h3>
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
                                        <textarea
                                            placeholder="Ask a question or share your progress..."
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors min-h-[100px]"
                                        ></textarea>
                                        <div className="flex justify-end mt-4">
                                            <button className="bg-primary hover:bg-red-600 px-6 py-2 rounded-lg font-bold text-sm transition-colors">Post Comment</button>
                                        </div>
                                    </div>

                                    {/* Mock Comments */}
                                    <div className="space-y-6">
                                        {[1, 2].map(i => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white/10"></div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-sm">Alex Chen</span>
                                                        <span className="text-xs text-white/40">2 hours ago</span>
                                                    </div>
                                                    <p className="text-white/70 text-sm">Has anyone found a good resource for the advanced logic module? I'm getting stuck on the second exercise.</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-8">
                    {/* FAQ Widget */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h3 className="font-bold text-lg">FAQ</h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {phaseData.faqs.map((faq, i) => (
                                <div key={i} className="p-6">
                                    <h4 className="font-medium mb-2 text-sm text-primary">{faq.q}</h4>
                                    <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PhaseDetail;
