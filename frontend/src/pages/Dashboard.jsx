import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { CheckCircle, XCircle, TrendingUp, BookOpen, Target, Award } from 'lucide-react';

const Dashboard = () => {
    const location = useLocation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data or data passed from ResumeAnalysis
        const data = location.state?.resumeResults || location.state?.predictionResults;

        if (data) {
            setStats(data);
            setLoading(false);
        } else {
            // No data passed, stop loading to show "Get Started"
            setLoading(false);
        }
    }, [location.state]);

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading your career insights...</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 flex items-center justify-center">
                <div className="max-w-4xl w-full text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100"
                    >
                        <Award className="w-20 h-20 text-indigo-500 mx-auto mb-6" />
                        <h1 className="text-4xl font-black text-gray-900 mb-4">Ready to Launch Your Career?</h1>
                        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
                            Unlock AI-powered insights. Analyze your resume or predict your career path to get started.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                            <a href="/career-prediction" className="group p-6 rounded-2xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all duration-300">
                                <Target className="w-10 h-10 text-indigo-600 group-hover:text-white mb-4" />
                                <h3 className="text-lg font-bold mb-2">Career Predictor</h3>
                                <p className="text-sm opacity-80">Input your academic scores & interests</p>
                            </a>
                            <a href="/resume-analysis" className="group p-6 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all duration-300">
                                <BookOpen className="w-10 h-10 text-emerald-600 group-hover:text-white mb-4" />
                                <h3 className="text-lg font-bold mb-2">Resume Analyzer</h3>
                                <p className="text-sm opacity-80">Upload your CV to find skill gaps</p>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Career Dashboard</h1>
                    <p className="text-gray-500">Track your progress and skill mastery</p>
                </div>

                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        title="Match Score"
                        value="72%"
                        icon={<Target />}
                        color="text-primary"
                        bg="bg-red-50"
                    />
                    <StatCard
                        title="Skills Found"
                        value={stats.extracted_skills.length}
                        icon={<CheckCircle />}
                        color="text-green-600"
                        bg="bg-green-50"
                    />
                    <StatCard
                        title="Skills Gap"
                        value={stats.missing_skills.length}
                        icon={<XCircle />}
                        color="text-orange-600"
                        bg="bg-orange-50"
                    />
                    <StatCard
                        title="Next Goal"
                        value="Cloud"
                        icon={<TrendingUp />}
                        color="text-blue-600"
                        bg="bg-blue-50"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Skills Radar Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Award className="text-primary" size={20} /> Skill Proficiency
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.radar_data}>
                                    <PolarGrid stroke="#e5e7eb" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="My Skills"
                                        dataKey="A"
                                        stroke="#E23744"
                                        fill="#E23744"
                                        fillOpacity={0.6}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Flow-Path Roadmap */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            <BookOpen className="text-indigo-600" size={20} /> Your Career Roadmap
                        </h3>
                        <div className="relative">
                            {stats.recommended_roadmap.map((step, index) => {
                                const isLast = index === stats.recommended_roadmap.length - 1;
                                const colors = [
                                    { bg: 'bg-indigo-500', ring: 'ring-indigo-100', accent: 'border-indigo-200', lightBg: 'bg-indigo-50' },
                                    { bg: 'bg-violet-500', ring: 'ring-violet-100', accent: 'border-violet-200', lightBg: 'bg-violet-50' },
                                    { bg: 'bg-blue-500', ring: 'ring-blue-100', accent: 'border-blue-200', lightBg: 'bg-blue-50' },
                                    { bg: 'bg-cyan-500', ring: 'ring-cyan-100', accent: 'border-cyan-200', lightBg: 'bg-cyan-50' },
                                    { bg: 'bg-emerald-500', ring: 'ring-emerald-100', accent: 'border-emerald-200', lightBg: 'bg-emerald-50' },
                                ];
                                const c = colors[index % colors.length];
                                const durations = ['2-3 weeks', '3-4 weeks', '2 weeks', '4 weeks', '3 weeks'];
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 * index }}
                                        className="flex items-start gap-5 mb-0"
                                    >
                                        {/* Flow node + connector */}
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full ${c.bg} ring-4 ${c.ring} text-white flex items-center justify-center font-bold text-sm shadow-lg z-10 flex-shrink-0`}>
                                                {index + 1}
                                            </div>
                                            {!isLast && (
                                                <div className="w-0.5 h-14 bg-gradient-to-b from-gray-300 to-gray-200" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className={`flex-1 pb-6 ${isLast ? '' : ''}`}>
                                            <div className={`p-4 rounded-xl ${c.lightBg} border ${c.accent} hover:shadow-md transition-all cursor-default`}>
                                                <p className="text-gray-800 font-semibold text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{step}</p>
                                                <p className="text-xs text-gray-400 mt-1.5 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                    ⏱ Estimated: {durations[index % durations.length]}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            {/* Final checkpoint */}
                            <div className="flex items-center gap-5 ml-0">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 ring-4 ring-green-100 text-white flex items-center justify-center shadow-lg">
                                    <CheckCircle size={20} />
                                </div>
                                <p className="text-sm font-bold text-emerald-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Career Ready! 🎯</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Extracted Skills Tags */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                >
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Verified Skills</h3>
                    <div className="flex flex-wrap gap-3">
                        {stats.extracted_skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold border border-green-100"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, bg }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
    >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bg} ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </motion.div>
);

export default Dashboard;
