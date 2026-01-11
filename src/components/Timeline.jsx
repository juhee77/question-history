import React from 'react';
import { motion } from 'framer-motion';
import { questions } from '../data/questions';
import { Clock, MessageCircle } from 'lucide-react';

const Timeline = ({ history }) => {
    if (!history || history.length === 0) return null;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 pb-12">
            {history.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="relative pl-8 border-l-2 border-indigo-500/30 last:border-0"
                >
                    {/* Connector Dot */}
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />

                    <div className="glass-card p-6 rounded-2xl hover:bg-white/10 transition-colors duration-300">
                        <div className="flex items-center gap-2 text-indigo-300 text-sm mb-2">
                            <span className="font-mono">#{item.q + 1}</span>
                            <span className="w-1 h-1 rounded-full bg-indigo-300/50" />
                            <span className="flex items-center gap-1 opacity-70">
                                <Clock size={12} /> {item.d}
                            </span>
                        </div>

                        <h3 className="text-lg md:text-xl font-bold text-white mb-4 leading-relaxed">
                            {questions[item.q]}
                        </h3>

                        <div className="relative">
                            <MessageCircle className="absolute -left-1 top-1 w-4 h-4 text-indigo-400/50" />
                            <p className="pl-6 text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {item.a}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default Timeline;
