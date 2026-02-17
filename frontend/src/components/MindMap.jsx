import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';

// Custom Node Component for a more "Figma/Miro" look
const CustomNode = ({ data }) => {
    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}
            className={`px-4 py-2 rounded-xl border-2 shadow-2xl backdrop-blur-md transition-all duration-300
        ${data.isCenter ? 'bg-blue-600/20 border-blue-500 text-blue-100 min-w-[150px]' :
                    data.isTool ? 'bg-purple-600/20 border-purple-500 text-purple-100' :
                        data.isProject ? 'bg-emerald-600/20 border-emerald-500 text-emerald-100' :
                            'bg-slate-800/40 border-slate-700 text-slate-200'}`}
        >
            <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-50">
                {data.label_type || 'Skill'}
            </div>
            <div className="text-sm font-bold truncate">
                {data.label}
            </div>
            {data.subtext && (
                <div className="text-[10px] mt-1 opacity-70 italic whitespace-normal max-w-[140px]">
                    {data.subtext}
                </div>
            )}

            {/* Animated Glow Effect on Hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
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
            ...skills.map(s => ({ type: 'Skill', label: s.title, subtext: s.outcome })),
            ...tools.map(t => ({ type: 'Tool', label: t, subtext: 'Essential Software' })),
            ...projects.map(p => ({ type: 'Project', label: p, subtext: 'Real-world Example' }))
        ];

        const radius = 250;
        const angleStep = (2 * Math.PI) / items.length;

        items.forEach((item, index) => {
            const angle = index * angleStep;
            const x = 250 + radius * Math.cos(angle);
            const y = 250 + radius * Math.sin(angle);
            const id = `node-${index}`;

            nodes.push({
                id,
                type: 'custom',
                data: {
                    label: item.label,
                    label_type: item.type,
                    isTool: item.type === 'Tool',
                    isProject: item.type === 'Project',
                    subtext: item.subtext
                },
                position: { x, y },
            });

            edges.push({
                id: `edge-${index}`,
                source: 'center',
                target: id,
                animated: true,
                style: {
                    stroke: item.type === 'Tool' ? '#a855f7' : item.type === 'Project' ? '#10b981' : '#3b82f6',
                    strokeWidth: 2,
                    opacity: 0.6
                },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: item.type === 'Tool' ? '#a855f7' : item.type === 'Project' ? '#10b981' : '#3b82f6',
                },
            });
        });

        return { initialNodes: nodes, initialEdges: edges };
    }, [phaseData, career]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    return (
        <div className="h-[500px] w-full bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden relative shadow-inner">
            <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-400 font-medium">
                Interactive Knowledge Map • {career}
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                snapToGrid={true}
                snapGrid={[15, 15]}
                style={{ background: 'transparent' }}
            >
                <Background color="#334155" gap={20} size={1} />
                <Controls showInteractive={false} className="bg-slate-800 border-slate-700 !fill-white" />
                <MiniMap
                    nodeColor={(n) => {
                        if (n.data.isCenter) return '#3b82f6';
                        if (n.data.isTool) return '#a855f7';
                        if (n.data.isProject) return '#10b981';
                        return '#475569';
                    }}
                    maskColor="rgba(15, 23, 42, 0.7)"
                    className="bg-slate-800 !border-slate-700 rounded-lg"
                />
            </ReactFlow>
        </div>
    );
};

export default MindMap;
