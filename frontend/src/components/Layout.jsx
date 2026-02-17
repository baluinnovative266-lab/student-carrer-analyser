import React from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';
import ChatBot from './ChatBot';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-900 font-sans text-white">
            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="pt-20" // Add padding for fixed navbar
            >
                {children}
            </motion.main>
            <ChatBot />
        </div>
    );
};

export default Layout;
