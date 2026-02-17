import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, HelpCircle, ArrowRight, MessageCircle } from 'lucide-react';

const FAQItem = ({ question, answer, related, isOpen, onToggle }) => {
    return (
        <div className="mb-4">
            <button
                onClick={onToggle}
                className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all duration-300 text-left border-2 
                    ${isOpen ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-500/20' : 'bg-white border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30'}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${isOpen ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                        <HelpCircle size={20} />
                    </div>
                    <span className={`font-bold text-lg ${isOpen ? 'text-white' : 'text-gray-900'}`}>{question}</span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={isOpen ? 'text-white' : 'text-gray-400'}
                >
                    <ChevronDown size={24} />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, y: -10 }}
                        animate={{ height: 'auto', opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                    >
                        <div className="p-8 bg-gray-50 rounded-b-3xl border-x-2 border-b-2 border-gray-100 -mt-4 shadow-inner">
                            <p className="text-gray-700 leading-relaxed text-lg mb-8">
                                {answer}
                            </p>

                            {related && related.length > 0 && (
                                <div className="space-y-4 pt-6 border-t border-gray-200">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                                        <Sparkles size={14} className="text-indigo-500" /> Related Questions
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {related.map((rel, idx) => (
                                            <div
                                                key={idx}
                                                className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-indigo-300 transition-all cursor-pointer"
                                            >
                                                <span className="text-sm font-bold text-gray-600 group-hover:text-indigo-600">{rel}</span>
                                                <ArrowRight size={14} className="text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "How does CareerSense AI predict careers?",
            answer: "Our engine uses a multi-layered Random Forest Classifier trained on over 50,000 professional profiles. It analyzes your academic performance, specific technical skills, and behavioral interests to map out the highest probability career paths for your unique profile.",
            related: ["What algorithm is used?", "How accurate is the model?", "Can the prediction change over time?"]
        },
        {
            question: "Why is Phase 1 focused on Foundations?",
            answer: "Every elite career requires a solid logical bedrock. Whether it's Software Engineering or Data Science, missing the 'first principles' often leads to professional plateaus later. We ensure your core logic is industry-ready before moving to advanced tools.",
            related: ["What if I'm already an expert?", "How long does Phase 1 take?", "Can I skip directly to projects?"]
        },
        {
            question: "How can I improve my match score?",
            answer: "Your score is dynamic. By completing recommended skills in your roadmap and re-analyzing your updated resume, the AI adjusts your 'Experience Vectors'. Focus on the 'Skills Gap' section in your dashboard to find high-impact areas for improvement.",
            related: ["Which skills carry more weight?", "Does CGPA affect my score?", "Internal certification vs job ready?"]
        },
        {
            question: "Are the roadmap resources verified?",
            answer: "Yes, our team of industry experts and educational curators periodically vet all resource suggestions. We prioritize high-signal content from platforms like Coursera, MIT OpenCourseWare, and official documentation to ensure your learning is efficient.",
            related: ["Are there free resources?", "Can I suggest a resource?", "How often are roadmaps updated?"]
        },
        {
            question: "Can I manage multiple career roadmaps?",
            answer: "Currently, CareerSense AI focuses on your primary high-probability match to ensure depth of learning. However, you can re-calibrate your prediction at any time from the 'Settings' menu to explore alternative paths if your interests evolve.",
            related: ["How to reset my profile?", "Is my data private?", "Can I export my roadmap?"]
        },
        {
            question: "What does 'Industry Integration' mean?",
            answer: "This is the final stage where you transition from a 'learner' to a 'contributor'. It involves mastering collaborative tools like Git, understanding CI/CD pipelines, and polishing your portfolio to stand out in technical design reviews.",
            related: ["Will AI help with placements?", "How to build a portfolio?", "What is a mock interview?"]
        },
        {
            question: "How does the Resume Analyzer work?",
            answer: "We use SpaCy and transformer-based Named Entity Recognition (NER) to parse your CV. Our system doesn't just look for keywords; it understands the context of your projects and quantifies your proficiency based on industry benchmarks.",
            related: ["Format for best parsing?", "My skills weren't detected?", "Can I upload multiple resumes?"]
        },
        {
            question: "What is the 'Mind Map' visualization for?",
            answer: "The Mind Map is a Figma-style interactive board designed to help you visualize the 'Knowledge Hierarchy' of your career. It shows how core skills branch into specialized tools and real-world projects, giving you a mental model of your growth.",
            related: ["Can I edit the map?", "How to zoom in?", "Is the map mobile friendly?"]
        },
        {
            question: "Is CareerSense AI suitable for professionals?",
            answer: "While highly effective for students, professionals can use the tool to 'Pivot' their careers. By analyzing current skills and setting a new target career, the AI generates a 'Transition Roadmap' focusing specifically on the gap between your roles.",
            related: ["Transitioning from QA to Dev?", "Mid-career switch tips?", "Corporate training support?"]
        },
        {
            question: "How secure is my academic data?",
            answer: "Your security is our priority. All personal and academic data is encrypted at rest and in transit. We use industry-standard hashing for passwords and do not share your individual profiles with third-party aggregators without explicit consent.",
            related: ["Delete my account?", "Data sharing policy?", "Privacy settings?"]
        }
    ];

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-40 -mt-20 -ml-20" />

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Intelligent Support Hub
                        </h2>
                        <p className="text-gray-500 font-medium text-lg">
                            Everything you need to know about navigating your AI-powered career path.
                        </p>
                    </motion.div>
                </div>

                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            {...faq}
                            isOpen={openIndex === index}
                            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                        />
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 p-10 bg-gray-900 rounded-[3rem] text-center text-white shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] group-hover:bg-indigo-600/30 transition-all duration-700" />

                    <MessageCircle size={48} className="mx-auto mb-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <h3 className="text-3xl font-black mb-4">Still have questions?</h3>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto font-medium">
                        Our career experts and AI agents are available 24/7 to help you navigate your professional odyssey.
                    </p>
                    <button className="px-10 py-4 bg-white text-gray-900 rounded-2xl font-black hover:bg-indigo-100 transition-all transform hover:-translate-y-1">
                        Contact Expert Support
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQSection;
