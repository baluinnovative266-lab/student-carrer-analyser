import { motion } from 'framer-motion';
import { Search, MapPin, ChevronRight, Briefcase, FileText, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Hero Section */}
            <div className="relative h-[500px] w-full bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')] bg-cover bg-center">
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
                    >
                        Career<span className="italic font-light">Sense</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/90 text-xl md:text-2xl max-w-3xl font-light mb-10"
                    >
                        Discover the best career path for your skills and interests
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full max-w-3xl bg-white rounded-xl p-3 flex items-center shadow-2xl"
                    >
                        <div className="flex items-center gap-2 px-4 border-r border-gray-200 text-gray-500 w-1/3 py-2 hidden md:flex">
                            <MapPin size={20} className="text-primary" />
                            <span>Global Opportunities</span>
                            <ChevronRight size={16} className="ml-auto" />
                        </div>
                        <div className="flex-1 flex items-center px-4 gap-3">
                            <Search size={24} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for jobs, skills, or companies..."
                                className="w-full outline-none text-lg text-gray-700 placeholder-gray-400"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-gray-800 mb-12">How it works</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: <FileText size={32} />, title: "Resume Analysis", desc: "AI-powered extraction of your skills and experience from PDF/DOCX.", color: "bg-blue-50 text-blue-600" },
                        { icon: <Briefcase size={32} />, title: "Career Prediction", desc: "Machine learning model predicts the best fitted roles for you.", color: "bg-green-50 text-green-600" },
                        { icon: <TrendingUp size={32} />, title: "Skill Gap Analysis", desc: "Identify what you're missing for your dream job.", color: "bg-purple-50 text-purple-600" },
                        { icon: <Award size={32} />, title: "Smart Roadmap", desc: "Get a personalized learning path to bridge the gap.", color: "bg-orange-50 text-orange-600" }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300"
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${feature.color}`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-100 py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to accelerate your career?</h2>
                    <p className="text-xl text-gray-600 mb-10">Join thousands of students and professionals using CareerSense to find their path.</p>
                    <Link to="/register" className="inline-block bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
                        Get Started - It's Free
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
