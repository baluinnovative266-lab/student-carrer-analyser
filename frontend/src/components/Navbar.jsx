import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center gap-2 group">
                        <Logo size="small" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors">Home</Link>
                        {token ? (
                            <>
                                <Link to="/dashboard" className="text-gray-600 hover:text-primary font-medium transition-colors">Dashboard</Link>
                                <Link to="/resume-analysis" className="text-gray-600 hover:text-primary font-medium transition-colors">Resume Analysis</Link>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </motion.button>
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                                    JP
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">Log in</Link>
                                <Link to="/register" className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-primary">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden bg-white border-b border-gray-100 px-4 py-4 flex flex-col gap-4 shadow-lg"
                >
                    <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary font-medium p-2">Home</Link>
                    {token ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary font-medium p-2">Dashboard</Link>
                            <Link to="/resume-analysis" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary font-medium p-2">Resume Analysis</Link>
                            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-left text-red-600 font-medium p-2 flex items-center gap-2">
                                <LogOut size={20} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary font-medium p-2">Log in</Link>
                            <Link to="/register" onClick={() => setIsOpen(false)} className="bg-primary text-white px-5 py-3 rounded-lg font-medium text-center shadow-lg shadow-red-500/30">Sign up</Link>
                        </>
                    )}
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
