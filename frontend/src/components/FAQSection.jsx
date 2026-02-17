import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "How does CareerSense AI predict careers?",
            answer: "Our engine uses a multi-layered Machine Learning model that analyzes your academic performance, cognitive interests, and technical aptitude to find the closest industry match based on successful professional benchmarks."
        },
        {
            question: "How accurate is the model?",
            answer: "The model currently boasts a 92% validation accuracy. However, we view these as 'guiding signals'. Your personal drive and project work (as analyzed in your resume) play a significant role in the final recommendation."
        },
        {
            question: "How does resume analysis work?",
            answer: "We use Natural Language Processing (NLP) to parse your CV, extract verified skills, and categorize them into Tech, Soft, and Tools. This allows us to identify exact skill gaps between your current profile and your target career."
        },
        {
            question: "Can I improve my predicted career?",
            answer: "Absolutely! CareerSense AI is dynamic. As you learn new skills and update your resume, our engine recalculates your match scores and roadmap. Growth is a core part of the platform logic."
        },
        {
            question: "Is my data secure?",
            answer: "Yes. We use industry-standard encryption for all user profiles and resume data. Your career insights are private and only accessible to you through your authenticated dashboard."
        }
    ];

    return (
        <section className="py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
                        <HelpCircle size={24} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-500 font-medium">Everything you need to know about our AI engine.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className={`bg-white rounded-2xl border transition-all duration-300 ${activeIndex === index ? 'border-indigo-400 shadow-lg shadow-indigo-100/50' : 'border-gray-100 shadow-sm'
                                }`}
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full p-6 text-left flex items-center justify-between gap-4"
                            >
                                <span className="font-bold text-gray-800 text-lg pr-4">{faq.question}</span>
                                <motion.div
                                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${activeIndex === index ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-400'
                                        }`}
                                >
                                    <ChevronDown size={20} />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 text-gray-600 leading-relaxed font-medium">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
