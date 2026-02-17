import { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight, ShieldCheck, FileType } from 'lucide-react';
import { analyzeResume } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ResumeAnalysis = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file) => {
        setError(null);
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            setError("File size exceeds 2MB limit.");
            return;
        }
        setFile(file);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await analyzeResume(file);
            navigate('/dashboard', { state: { resumeResults: result } });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.response?.data?.detail || "Failed to analyze resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
                        Resume <span className="text-primary">X-Ray</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Upload your resume to get an instant analysis of your skills, gaps, and career fit using our advanced AI engine.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                >
                    <div className="p-10 md:p-16 text-center relative">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-50 rounded-tr-full pointer-events-none" />

                        <div
                            className={`border-3 border-dashed rounded-3xl p-12 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center relative group min-h-[400px]
                            ${dragging
                                    ? 'border-primary bg-primary/5 scale-[1.02]'
                                    : error ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-upload').click()}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.txt"
                            />

                            <motion.div
                                animate={{ y: file ? 0 : [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className={`p-6 rounded-full mb-6 transition-all duration-500 shadow-xl 
                                ${file ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}
                            >
                                {file ? <CheckCircle size={48} /> : <UploadCloud size={48} />}
                            </motion.div>

                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                {file ? file.name : "Drag & Drop your Resume"}
                            </h3>
                            <p className="text-gray-500 font-medium mb-2">
                                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Supports PDF, DOCX, TXT (Max 2MB)"}
                            </p>
                            {!file && <p className="text-xs text-gray-400 mb-6">Note: For PDF, ensure it is text-based (not scanned).</p>}

                            {!file && (
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                                        <FileType size={14} /> PDF
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                                        <FileType size={14} /> DOCX
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center gap-3 text-red-600 font-medium"
                            >
                                <AlertCircle size={20} /> {error}
                            </motion.div>
                        )}

                        <div className="mt-10">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                                disabled={!file || loading}
                                className="w-full md:w-auto min-w-[200px] bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" /> Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Analyze Resume <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
                            <ShieldCheck size={16} /> Your data is secure and private
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ResumeAnalysis;
