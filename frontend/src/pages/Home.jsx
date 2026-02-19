import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ChevronRight, Briefcase, FileText, TrendingUp, Award, Brain, Navigation } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [locationName, setLocationName] = useState('Global Opportunities');
    const [isLocating, setIsLocating] = useState(false);

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
                    const data = await response.json();

                    if (data && data.address) {
                        const city = data.address.city || data.address.town || data.address.village || '';
                        const country = data.address.country || '';
                        setLocationName(city ? `${city}, ${country}` : 'Location Detected');
                    } else {
                        setLocationName('Location Detected');
                    }
                } catch (error) {
                    console.error("Home location fetch error:", error);
                    setLocationName('Location Active');
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                console.error("Home location error:", error);
                alert("Location access denied. Please enable it to see local opportunities.");
                setIsLocating(false);
            }
        );
    };
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Hero Section */}
            <div className="relative h-[560px] w-full bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')] bg-cover bg-center">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
                <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
                    {/* Logo + Brand */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-4 mb-8"
                    >
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/30">
                            <Brain className="text-white" size={36} strokeWidth={2} />
                        </div>
                        <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Career<span className="text-pink-400 italic font-light">Sense</span>
                            <span className="block text-sm md:text-base font-semibold text-pink-300/80 uppercase tracking-[0.25em] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>AI-Powered Career Guidance</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-white/85 text-xl md:text-2xl max-w-3xl font-light mb-10"
                        style={{ fontFamily: "'Inter', sans-serif" }}
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
                        <button
                            onClick={handleDetectLocation}
                            disabled={isLocating}
                            className={`flex items-center gap-2 px-4 border-r border-gray-200 text-gray-500 w-1/3 py-2 hidden md:flex hover:bg-gray-50 transition-colors rounded-l-xl ${isLocating ? 'animate-pulse' : ''}`}
                        >
                            {isLocating ? (
                                <Navigation size={20} className="text-primary animate-spin" />
                            ) : (
                                <MapPin size={20} className="text-primary" />
                            )}
                            <span className="truncate">{locationName}</span>
                            <ChevronRight size={16} className="ml-auto shrink-0" />
                        </button>
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
