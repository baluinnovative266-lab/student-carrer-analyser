import { motion } from 'framer-motion';

const Logo = ({ className = "" }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="relative w-10 h-10 bg-primary rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-primary/30"
            >
                <div className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 translate-x-[-50%]"></div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </motion.div>
            <div className="flex flex-col leading-none">
                <span className="text-xl font-extrabold tracking-tight text-gray-900">
                    Career<span className="text-primary">Sense</span>
                </span>
                <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    AI Guidance
                </span>
            </div>
        </div>
    );
};

export default Logo;
