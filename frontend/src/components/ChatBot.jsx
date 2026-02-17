import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { sendChatMessage } from '../services/chatApi';

const ChatBot = ({ career, skills }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hi, I’m your CareerSense AI Assistant. Ask me about your career, skills, or roadmap.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (userMsg) => {
        const messageToSend = typeof userMsg === 'string' ? userMsg : input;
        if (!messageToSend.trim() || isLoading) return;

        setInput('');
        setMessages(prev => [...prev, {
            role: 'user',
            content: messageToSend,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsLoading(true);

        try {
            const response = await sendChatMessage(messageToSend, career, skills);
            setMessages(prev => [...prev, {
                role: 'bot',
                content: response.reply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'bot',
                content: "I'm having trouble connecting to the brain right now. Please try again later.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestions = [
        "Explain my career",
        "What skills do I need?",
        "Give me a roadmap"
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Trigger Button with Tooltip & Pulse */}
            {!isOpen && (
                <div className="relative">
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, y: -40 }}
                                animate={{ opacity: 1, x: 0, y: -60 }}
                                exit={{ opacity: 0, x: 20, y: -40 }}
                                className="absolute right-0 bg-gray-900 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-xl whitespace-nowrap border border-gray-700 pointer-events-none"
                            >
                                CareerSense AI Assistant
                                <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-gray-900 border-r border-b border-gray-700 rotate-45" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(236, 72, 153, 0.4)" }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 8
                        }}
                        onClick={() => setIsOpen(true)}
                        className="w-14 h-14 bg-gradient-to-br from-pink-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg relative overflow-hidden group"
                    >
                        <motion.div
                            className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                            initial={false}
                        />
                        <MessageSquare size={28} />
                    </motion.button>
                </div>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="w-[350px] sm:w-[400px] h-[550px] bg-white/95 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-pink-500 to-indigo-600 p-6 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    className="p-2 bg-white/20 rounded-2xl"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Bot size={24} />
                                </motion.div>
                                <div>
                                    <h3 className="font-bold text-base">CareerSense AI</h3>
                                    <p className="text-[10px] opacity-80 flex items-center gap-1 font-medium tracking-wider uppercase">
                                        <Sparkles size={10} className="text-yellow-300" /> Advanced AI Active
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/30">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-pink-600 border border-pink-100'
                                                }`}>
                                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                            </div>
                                            <div className={`p-4 rounded-3xl text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-200'
                                                : 'bg-white text-gray-800 border border-gray-100 shadow-md rounded-tl-none'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-400 px-2 font-medium">{msg.timestamp}</span>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white border border-pink-100 p-4 rounded-3xl shadow-sm flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                                            <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                            <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI is thinking</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggestions Area */}
                        <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-gray-50 bg-white">
                            {suggestions.map((suggest, sIdx) => (
                                <motion.button
                                    key={sIdx}
                                    whileHover={{ scale: 1.05, backgroundColor: '#fdf2f8' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSend(suggest)}
                                    className="px-3 py-1.5 bg-gray-50 text-indigo-600 rounded-full text-xs font-bold border border-indigo-50 transition-colors hover:border-pink-200"
                                >
                                    {suggest}
                                </motion.button>
                            ))}
                        </div>

                        {/* Input Form */}
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="p-6 bg-white border-t border-gray-100"
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask your career AI..."
                                    className="w-full pl-5 pr-14 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl text-sm font-medium transition-all outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-pink-600 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatBot;
