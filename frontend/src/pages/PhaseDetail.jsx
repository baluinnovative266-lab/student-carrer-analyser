import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, Share2, MessageSquare, ThumbsUp,
    PlayCircle, FileText, Code, CheckCircle, ChevronDown, ChevronRight,
    Send, BookOpen, ExternalLink, Video, Lightbulb, Globe
} from 'lucide-react';
import ReactFlow, {
    Background,
    Controls,
    applyEdgeChanges,
    applyNodeChanges,
    MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';

const phaseColors = [
    { gradient: 'from-indigo-600 to-blue-500', accent: '#6366f1', glow: 'bg-indigo-500/20' },
    { gradient: 'from-emerald-600 to-teal-500', accent: '#10b981', glow: 'bg-emerald-500/20' },
    { gradient: 'from-orange-500 to-amber-500', accent: '#f59e0b', glow: 'bg-amber-500/20' },
    { gradient: 'from-pink-600 to-rose-500', accent: '#ec4899', glow: 'bg-pink-500/20' },
];

// -- Generate dynamic mindmap nodes from phase data --
function buildMindMapData(phaseName, modules) {
    const nodes = [
        {
            id: 'root',
            position: { x: 300, y: 0 },
            data: { label: phaseName },
            type: 'input',
            style: { background: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', padding: '14px 20px', fontWeight: 700, fontSize: '14px' },
        },
    ];
    const edges = [];

    modules.forEach((mod, i) => {
        const nodeId = `mod-${i}`;
        const x = 80 + i * 220;
        const y = 120;
        nodes.push({
            id: nodeId,
            position: { x, y },
            data: { label: mod.title },
            style: {
                background: mod.completed ? '#059669' : '#1e293b',
                color: 'white',
                border: mod.completed ? '2px solid #34d399' : '1px solid #334155',
                borderRadius: '10px',
                padding: '10px 16px',
                fontSize: '12px',
                fontWeight: 600,
            },
        });
        edges.push({
            id: `e-root-${nodeId}`,
            source: 'root',
            target: nodeId,
            animated: true,
            style: { stroke: mod.completed ? '#34d399' : '#6366f1', strokeWidth: 2 },
        });

        // Add sub-nodes for each module
        if (mod.topics) {
            mod.topics.forEach((topic, j) => {
                const subId = `${nodeId}-sub-${j}`;
                nodes.push({
                    id: subId,
                    position: { x: x - 40 + j * 120, y: y + 100 },
                    data: { label: topic },
                    style: {
                        background: '#0f172a',
                        color: '#94a3b8',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '11px',
                    },
                });
                edges.push({
                    id: `e-${nodeId}-${subId}`,
                    source: nodeId,
                    target: subId,
                    style: { stroke: '#334155', strokeWidth: 1 },
                });
            });
        }
    });

    return { nodes, edges };
}

// Resources data per phase type
const phaseResources = {
    default: [
        { type: 'video', title: 'Introduction to Career Development', url: 'https://www.youtube.com/results?search_query=career+development', platform: 'YouTube' },
        { type: 'article', title: 'Building a Strong Foundation', url: 'https://www.freecodecamp.org/', platform: 'freeCodeCamp' },
        { type: 'course', title: 'Professional Skills Bootcamp', url: 'https://www.coursera.org/', platform: 'Coursera' },
        { type: 'tool', title: 'Practice Coding Challenges', url: 'https://leetcode.com/', platform: 'LeetCode' },
        { type: 'article', title: 'Industry Best Practices', url: 'https://dev.to/', platform: 'DEV.to' },
        { type: 'video', title: 'Project Walkthrough Tutorial', url: 'https://www.youtube.com/results?search_query=project+tutorial', platform: 'YouTube' },
    ],
};

const resourceIcons = {
    video: <Video size={18} className="text-red-400" />,
    article: <FileText size={18} className="text-blue-400" />,
    course: <BookOpen size={18} className="text-green-400" />,
    tool: <Code size={18} className="text-purple-400" />,
    link: <Globe size={18} className="text-amber-400" />,
};

const PhaseDetail = () => {
    const { phaseId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('roadmap');

    // Determine phase index for color
    const phaseIndex = parseInt(phaseId?.match(/\d+/)?.[0] || '1', 10) - 1;
    const colors = phaseColors[phaseIndex % phaseColors.length];

    // Phase Data (dynamically built from phaseId)
    const phaseData = {
        title: phaseId ? phaseId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Phase Detail",
        description: "Review and master the core concepts required for this stage of your career journey.",
        progress: 35,
        modules: [
            { id: 1, title: "Module 1: Core Concepts", completed: true, topics: ['Fundamentals', 'Theory', 'Basics'] },
            { id: 2, title: "Module 2: Advanced Logic", completed: false, topics: ['Patterns', 'Algorithms', 'Architecture'] },
            { id: 3, title: "Module 3: Project Work", completed: false, topics: ['Planning', 'Implementation', 'Testing'] },
        ],
        faqs: [
            { q: "How long does this phase take?", a: "Typically 4-6 weeks depending on your pace." },
            { q: "Do I need prior experience?", a: "No, this phase is designed to build from the ground up." },
        ],
    };

    // ReactFlow Mind Map
    const { nodes: initNodes, edges: initEdges } = buildMindMapData(phaseData.title, phaseData.modules);
    const [nodes, setNodes] = useState(initNodes);
    const [edges, setEdges] = useState(initEdges);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []
    );

    // Comment State
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ content: '', pros: '', cons: '' });
    const [submitting, setSubmitting] = useState(false);

    // Fetch Comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/comments/${phaseId || 'general'}`);
                setComments(response.data);
            } catch (err) {
                console.error("Failed to fetch comments", err);
            }
        };
        if (activeTab === 'discussion') {
            fetchComments();
        }
    }, [activeTab, phaseId]);

    const handleCommentSubmit = async () => {
        if (!newComment.content && !newComment.pros && !newComment.cons) return;
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/comments', {
                phase_id: phaseId || 'general',
                content: newComment.content || '(no comment)',
                pros: newComment.pros,
                cons: newComment.cons,
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Refresh comments
            const refresh = await axios.get(`/api/comments/${phaseId || 'general'}`);
            setComments(refresh.data);
            setNewComment({ content: '', pros: '', cons: '' });
        } catch (err) {
            console.error("Failed to post comment", err);
        } finally {
            setSubmitting(false);
        }
    };

    const resources = phaseResources.default;

    return (
        <div className="min-h-screen bg-slate-900 text-white pb-20">
            {/* Header */}
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

                {/* Left Column */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Hero Section - Colored */}
                    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${colors.gradient} p-10 border border-white/10`}>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black mb-4">{phaseData.title}</h2>
                            <p className="text-lg text-white/70 mb-8 max-w-xl">{phaseData.description}</p>

                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold uppercase tracking-wider bg-black/30 px-3 py-1 rounded">In Progress</span>
                                <div className="h-2 w-32 bg-black/30 rounded-full overflow-hidden">
                                    <div style={{ width: `${phaseData.progress}%` }} className="h-full bg-green-400 rounded-full" />
                                </div>
                                <span className="text-xs font-mono">{phaseData.progress}%</span>
                            </div>
                        </div>
                        <div className={`absolute right-0 bottom-0 w-64 h-64 ${colors.glow} blur-[80px] rounded-full`} />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-8 border-b border-white/10">
                        {['roadmap', 'mindmap', 'resources', 'discussion'].map(tab => (
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

                            {/* ROADMAP TAB */}
                            {activeTab === 'roadmap' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                    {phaseData.modules.map(m => (
                                        <div key={m.id} className={`p-5 rounded-xl border transition-all ${m.completed
                                            ? 'bg-emerald-500/10 border-emerald-500/20'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                                            }`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-bold text-lg">{m.title}</h4>
                                                {m.completed && <CheckCircle size={18} className="text-emerald-400" />}
                                            </div>
                                            {m.topics && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {m.topics.map((topic, i) => (
                                                        <span key={i} className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/60">{topic}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* MINDMAP TAB - Full interactive ReactFlow */}
                            {activeTab === 'mindmap' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="h-[500px] bg-slate-800 rounded-xl overflow-hidden border border-white/10">
                                        <ReactFlow
                                            nodes={nodes}
                                            edges={edges}
                                            onNodesChange={onNodesChange}
                                            onEdgesChange={onEdgesChange}
                                            fitView
                                            style={{ background: '#0f172a' }}
                                        >
                                            <Background color="#1e293b" gap={20} />
                                            <Controls style={{ background: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }} />
                                            <MiniMap
                                                nodeStrokeColor="#6366f1"
                                                nodeColor="#1e293b"
                                                maskColor="rgb(15, 23, 42, 0.7)"
                                                style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                            />
                                        </ReactFlow>
                                    </div>
                                    <div className="mt-4 flex items-center gap-3 text-xs text-white/40">
                                        <Lightbulb size={14} className="text-amber-400" />
                                        <span>Drag nodes to rearrange • Scroll to zoom • Click and drag background to pan</span>
                                    </div>
                                </motion.div>
                            )}

                            {/* RESOURCES TAB - Full resource list */}
                            {activeTab === 'resources' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                    <p className="text-white/50 text-sm mb-6">Curated learning materials for this phase. Click any resource to explore.</p>
                                    {resources.map((res, i) => (
                                        <a
                                            key={i}
                                            href={res.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 p-5 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-white/15 transition-all group cursor-pointer"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                                {resourceIcons[res.type] || resourceIcons.link}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{res.title}</h4>
                                                <p className="text-xs text-white/40 mt-1">{res.platform} • {res.type.charAt(0).toUpperCase() + res.type.slice(1)}</p>
                                            </div>
                                            <ExternalLink size={16} className="text-white/20 group-hover:text-primary transition-colors" />
                                        </a>
                                    ))}
                                </motion.div>
                            )}

                            {/* DISCUSSION TAB */}
                            {activeTab === 'discussion' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-slate-800/50 rounded-2xl p-8 border border-white/10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                                        <h3 className="text-xl font-bold text-white mb-6 relative z-10">Community Feedback & Insights</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 relative z-10">
                                            <div className="space-y-2">
                                                <label className="text-xs text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                                    <ThumbsUp size={14} /> Pros
                                                </label>
                                                <textarea
                                                    value={newComment.pros}
                                                    onChange={e => setNewComment({ ...newComment, pros: e.target.value })}
                                                    className="w-full bg-slate-700/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500/50 outline-none resize-none"
                                                    rows="3"
                                                    placeholder="What works well?"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-rose-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                                    <MessageSquare size={14} /> Cons
                                                </label>
                                                <textarea
                                                    value={newComment.cons}
                                                    onChange={e => setNewComment({ ...newComment, cons: e.target.value })}
                                                    className="w-full bg-slate-700/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-rose-500/50 outline-none resize-none"
                                                    rows="3"
                                                    placeholder="What challenges did you face?"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-8 relative z-10">
                                            <label className="text-xs text-blue-400 font-bold uppercase tracking-widest">Suggestions & Questions</label>
                                            <textarea
                                                value={newComment.content}
                                                onChange={e => setNewComment({ ...newComment, content: e.target.value })}
                                                className="w-full bg-slate-700/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none"
                                                rows="3"
                                                placeholder="Share your ideas or ask for help..."
                                            />
                                        </div>

                                        <div className="flex justify-end relative z-10">
                                            <button
                                                onClick={handleCommentSubmit}
                                                disabled={submitting || (!newComment.content && !newComment.pros && !newComment.cons)}
                                                className="bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Send size={18} /> {submitting ? 'Posting...' : 'Submit Feedback'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Comments Feed */}
                                    <div className="space-y-6">
                                        <h4 className="font-bold text-white/50 uppercase tracking-widest text-sm">Recent Activity ({comments.length})</h4>
                                        {comments.length === 0 ? (
                                            <div className="text-center py-12">
                                                <MessageSquare size={40} className="text-white/10 mx-auto mb-4" />
                                                <p className="text-white/30 italic">No comments yet. Be the first to share your experience!</p>
                                            </div>
                                        ) : (
                                            comments.map((comment) => (
                                                <motion.div
                                                    key={comment.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg">
                                                            {(comment.user_name || 'U').charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-bold text-sm">{comment.user_name || 'Anonymous'}</p>
                                                            <p className="text-xs text-white/40">{comment.timestamp ? new Date(comment.timestamp).toLocaleDateString() : 'just now'}</p>
                                                        </div>
                                                    </div>

                                                    {(comment.pros || comment.cons) && (
                                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                            {comment.pros && (
                                                                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/10">
                                                                    <p className="text-xs text-emerald-400 font-bold mb-2 uppercase tracking-wider">✅ Pros</p>
                                                                    <p className="text-sm text-gray-300 leading-relaxed">{comment.pros}</p>
                                                                </div>
                                                            )}
                                                            {comment.cons && (
                                                                <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/10">
                                                                    <p className="text-xs text-rose-400 font-bold mb-2 uppercase tracking-wider">⚠️ Cons</p>
                                                                    <p className="text-sm text-gray-300 leading-relaxed">{comment.cons}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {comment.content && (
                                                        <div className="pl-3 border-l-2 border-white/10">
                                                            <p className="text-sm text-white/60 italic">"{comment.content}"</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                    {/* Quick Stats */}
                    <div className={`bg-gradient-to-br ${colors.gradient} rounded-2xl p-6 border border-white/10`}>
                        <h3 className="font-bold text-lg mb-4">Phase Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/70">Modules</span>
                                <span className="font-bold">{phaseData.modules.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/70">Completed</span>
                                <span className="font-bold">{phaseData.modules.filter(m => m.completed).length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/70">Progress</span>
                                <span className="font-bold">{phaseData.progress}%</span>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Widget */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h3 className="font-bold text-lg">FAQ</h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {phaseData.faqs.map((faq, i) => (
                                <div key={i} className="p-6 cursor-pointer hover:bg-white/5 transition-colors group">
                                    <h4 className="font-medium mb-2 text-sm text-primary group-hover:text-primary/80">{faq.q}</h4>
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
