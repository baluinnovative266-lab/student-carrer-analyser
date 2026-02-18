import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    MarkerType,
    Handle,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Target, Zap, Book, ShieldCheck, X, Award, Sparkles } from 'lucide-react';

// Custom Node Component for a more "Figma/Miro" look
const CustomNode = ({ data, selected }) => {
    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ y: -8, scale: 1.05 }}
            className={`
                px-6 py-4 rounded-[20px] border-2 shadow-2xl backdrop-blur-xl transition-all duration-500 relative group min-w-[180px]
                ${selected ? 'ring-4 ring-pink-500/30 border-pink-500 scale-105' : 'border-white/10'}
                ${data.isCenter
                    ? 'bg-gradient-to-br from-pink-600 to-rose-600 text-white border-pink-400'
                    : data.isTool
                        ? 'bg-indigo-900/40 border-indigo-500/50 text-indigo-100'
                        : data.isProject
                            ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100'
                            : 'bg-white/5 border-pink-500/30 text-white'}
            `}
        >
            <Handle type="target" position={Position.Top} className="opacity-0" />

            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl ${data.isCenter ? 'bg-white/20' : 'bg-pink-500/20'}`}>
                    {data.isCenter ? <Target size={18} /> : data.isTool ? <Zap size={18} className="text-indigo-400" /> : <Book size={18} className="text-pink-400" />}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    {data.label_type || 'Skill'}
                </div>
            </div>

            <div className="text-sm font-black tracking-tight leading-tight">
                {data.label}
            </div>

            {data.subtext && (
                <div className="text-[10px] mt-2 opacity-60 font-medium leading-relaxed line-clamp-2">
                    {data.subtext}
                </div>
            )}

            {/* Selection Glow */}
            {selected && (
                <motion.div
                    layoutId="glow"
                    className="absolute -inset-1 bg-pink-500/20 blur-xl rounded-[24px] -z-10"
                />
            )}

            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </motion.div>
    );
};

const nodeTypes = {
    custom: CustomNode,
};

const MindMap = ({ phaseData, career }) => {
    // Generate nodes and edges based on phaseData
    const { initialNodes, initialEdges } = useMemo(() => {
        if (!phaseData) return { initialNodes: [], initialEdges: [] };

        const nodes = [];
        const edges = [];

        // 1. Center Node (Career + Phase)
        nodes.push({
            id: 'center',
            type: 'custom',
            data: {
                label: phaseData.phase,
                label_type: career,
                isCenter: true,
                subtext: "Mastery Hub"
            },
            position: { x: 250, y: 250 },
        });

        // 2. Radial Construction
        const skills = phaseData.steps || [];
        const tools = phaseData.tools || [];
        const projects = phaseData.examples || [];

        const items = [
            ...skills.map(s => ({ type: 'Skill', label: s.title || s.name || s, subtext: s.outcome || s.description })),
            ...tools.map(t => ({ type: 'Tool', label: t.name || t, subtext: t.desc || t.description || 'Essential Software' })),
            ...projects.map(p => ({ type: 'Project', label: p.title || p.name || p, subtext: p.desc || p.description || 'Real-world Example' }))
        ];

        const radius = 350; // Increased radius
        const angleStep = (2 * Math.PI) / items.length;

        items.forEach((item, index) => {
            const angle = index * angleStep;
            const x = 500 + radius * Math.cos(angle);
            const y = 300 + radius * Math.sin(angle);
            const id = `node-${index}`;

            nodes.push({
                id,
                type: 'custom',
                data: {
                    label: item.label,
                    label_type: item.type,
                    isTool: item.type === 'Tool',
                    isProject: item.type === 'Project',
                    subtext: item.subtext,
                    difficulty: item.type === 'Skill' ? 'Intermediate' : 'Professional',
                    importance: 'High'
                },
                position: { x, y },
            });

            edges.push({
                id: `edge-${index}`,
                source: 'center',
                target: id,
                animated: true,
                style: {
                    stroke: item.type === 'Tool' ? '#818cf8' : item.type === 'Project' ? '#10b981' : '#ec4899',
                    strokeWidth: 3,
                    opacity: 0.4
                },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: item.type === 'Tool' ? '#818cf8' : item.type === 'Project' ? '#10b981' : '#ec4899',
                },
            });
        });

        return { initialNodes: nodes, initialEdges: edges };
    }, [phaseData, career]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const onNodeClick = useCallback((event, node) => {
        setSelectedNode(node);
    }, []);

    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

    return (
        <div className={`
            flex w-full bg-slate-950/90 rounded-3xl border border-white/5 overflow-hidden relative group transition-all duration-500
            ${isFullscreen ? 'fixed inset-4 z-[100] h-[calc(100vh-32px)]' : 'h-full'}
        `}>
            <div className="flex-1 relative">
                <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                    <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 text-xs text-white/60 font-black uppercase tracking-widest shadow-2xl">
                        Career Path Visualization • {career}
                    </div>
                </div>

                <div className="absolute top-6 right-6 z-10 flex gap-2">
                    <button
                        onClick={toggleFullscreen}
                        className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all shadow-xl"
                        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                        {isFullscreen ? <X size={18} /> : <Sparkles size={18} />}
                    </button>
                </div>

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    nodeTypes={nodeTypes}
                    fitView
                    minZoom={0.1}
                    maxZoom={2}
                    style={{ background: 'transparent' }}
                >
                    <Background color="#ec4899" gap={40} size={1} opacity={0.1} />
                    <Controls className="!bg-slate-900/80 !border-white/10 !fill-white rounded-xl overflow-hidden shadow-2xl" />
                    <MiniMap
                        style={{
                            background: 'rgba(15, 23, 42, 0.8)',
                            borderRadius: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                        nodeColor={(n) => {
                            if (n.data.isCenter) return '#ec4899';
                            if (n.data.isTool) return '#818cf8';
                            if (n.data.isProject) return '#10b981';
                            return '#4b5563';
                        }}
                        maskColor="rgba(0, 0, 0, 0.3)"
                    />
                </ReactFlow>
            </div>

            {/* Right Panel */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="w-[320px] bg-slate-900/80 backdrop-blur-2xl border-l border-white/10 p-8 flex flex-col gap-6 z-20 shadow-2xl"
                    >
                        <div className="flex justify-between items-center">
                            <div className="p-3 bg-pink-500/20 rounded-2xl text-pink-400">
                                <Sparkles size={24} />
                            </div>
                            <button
                                onClick={() => setSelectedNode(null)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/40"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div>
                            <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] mb-2">Module Detail</p>
                            <h2 className="text-2xl font-black text-white tracking-tight leading-none mb-4">
                                {selectedNode.data.label}
                            </h2>
                            <p className="text-sm text-white/60 leading-relaxed font-medium">
                                {selectedNode.data.subtext || "No description available for this module."}
                            </p>
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="flex items-center gap-2 mb-2 text-indigo-400">
                                    <ShieldCheck size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Difficulty</span>
                                </div>
                                <p className="text-sm font-bold text-white">{selectedNode.data.difficulty || 'Intermediate'}</p>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                                    <Award size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Importance</span>
                                </div>
                                <p className="text-sm font-bold text-white">Essential for Career Success</p>
                            </div>
                        </div>

                        <button className="mt-auto w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all">
                            Explore Module
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MindMap;
