import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, Loader2, Sparkles, Target, Zap } from 'lucide-react';
import { predictCareer } from '../services/api';

const InputField = ({ label, name, type = "number", value, onChange, max, icon: Icon }) => (
    <div className="space-y-2 group">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-400 transition-colors">
            {label}
        </label>
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                max={max}
                className={`w-full bg-slate-900/50 border border-slate-800 rounded-2xl ${Icon ? 'px-12' : 'px-6'} py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all shadow-xl placeholder:text-slate-700`}
                placeholder={`Enlist ${label.toLowerCase()}...`}
                required
            />
        </div>
    </div>
);

const CareerPrediction = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        math_score: '',
        programming_score: '',
        communication_score: '',
        problem_solving_score: '',
        interest_coding: '',
        interest_design: '',
        interest_management: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiData = Object.fromEntries(
                Object.entries(formData).map(([k, v]) => [k, parseInt(v) || 0])
            );
            const result = await predictCareer(apiData);
            navigate('/dashboard', { state: { predictionResults: result, inputData: apiData } });
        } catch (error) {
            console.error("Prediction failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-12 text-center"
            >
                <div className="inline-flex p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mb-8 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                    <Brain className="text-indigo-400" size={48} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)] leading-tight uppercase mb-4">
                    Career Intelligence Engine
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto font-medium">
                    Initialize your parameters. Our neural network will analyze your cognitive profile to determine your optimal professional trajectory.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-10 bg-slate-900/40 border-white/5 relative overflow-hidden ring-1 ring-white/5 shadow-2xl"
            >
                {/* Decorative background gradients */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />

                <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                            <h2 className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Cognitive Performance Assessment</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InputField label="Mathematics" name="math_score" value={formData.math_score} onChange={handleChange} max={100} icon={Target} />
                            <InputField label="Programming" name="programming_score" value={formData.programming_score} onChange={handleChange} max={100} icon={Zap} />
                            <InputField label="Linguistics" name="communication_score" value={formData.communication_score} onChange={handleChange} max={100} icon={Sparkles} />
                            <InputField label="Logic Engine" name="problem_solving_score" value={formData.problem_solving_score} onChange={handleChange} max={100} icon={Brain} />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                            <h2 className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Specialized Interest Matrices</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <InputField label="Cybernetics" name="interest_coding" value={formData.interest_coding} onChange={handleChange} max={10} />
                            <InputField label="Creative Design" name="interest_design" value={formData.interest_design} onChange={handleChange} max={10} />
                            <InputField label="Tactical Mgmt" name="interest_management" value={formData.interest_management} onChange={handleChange} max={10} />
                        </div>
                    </div>

                    <div className="pt-8 flex justify-center md:justify-end">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" /> Synthesizing Data...
                                </>
                            ) : (
                                <>
                                    Compute Path <ArrowRight size={20} />
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CareerPrediction;
