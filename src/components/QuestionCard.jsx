import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RefreshCw } from 'lucide-react';

const QuestionCard = ({ onAnswer, usedQuestionIds, questions, themeColor, targetQuestionId }) => {
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [nickname, setNickname] = useState(localStorage.getItem('longstory_nickname') || '');
    const [isAnimating, setIsAnimating] = useState(false);

    // Pick a random question that hasn't been used yet (if possible)
    const pickRandomQuestion = () => {
        // If a specific question is targeted, don't pick a random one
        if (targetQuestionId !== null && targetQuestionId !== undefined) return;

        if (!questions || questions.length === 0) return;
        setIsAnimating(true);
        setTimeout(() => {
            let availableIds = questions.map((_, idx) => idx).filter(id => !usedQuestionIds.includes(id));

            // If all questions used, just pick any random one
            if (availableIds.length === 0) {
                availableIds = questions.map((_, idx) => idx);
            }

            const randomId = availableIds[Math.floor(Math.random() * availableIds.length)];
            setCurrentQIndex(randomId);
            setIsAnimating(false);
        }, 300);
    };

    // Handle target question changes
    useEffect(() => {
        if (targetQuestionId !== null && targetQuestionId !== undefined) {
            setCurrentQIndex(targetQuestionId);
        } else {
            // Only pick random if we're not targeting a specific question
            // and we haven't set an initial question yet (or usedQuestionIds changed)
            pickRandomQuestion();
        }
    }, [targetQuestionId, usedQuestionIds]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!answer.trim()) return;

        // Save nickname for next time
        if (nickname.trim()) {
            localStorage.setItem('longstory_nickname', nickname.trim());
        }

        onAnswer(currentQIndex, answer, nickname.trim() || '익명');
        setAnswer('');
    };

    if (!questions || questions.length === 0) {
        return <div className="text-white text-center p-10">질문을 불러오는 중...</div>;
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-12 mb-20">
            <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card p-8 rounded-3xl border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.1)]"
                >
                    <div className="flex justify-between items-start mb-6">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold tracking-wider uppercase border border-indigo-500/30">
                            To. You
                        </span>
                        <button
                            onClick={pickRandomQuestion}
                            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="다른 질문 보기"
                        >
                            <RefreshCw size={18} className={isAnimating ? "animate-spin" : ""} />
                        </button>
                    </div>

                    <AnimatePresence mode='wait'>
                        <motion.h2
                            key={currentQIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight min-h-[4rem]"
                        >
                            {questions[currentQIndex]}
                        </motion.h2>
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="이름 (선택)"
                                className="w-full p-3 rounded-xl glass-input text-base placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 transition-all mb-2"
                                maxLength={10}
                            />
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="당신의 이야기를 들려주세요..."
                                className="w-full h-32 p-4 rounded-xl glass-input resize-none text-lg placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                maxLength={300}
                            />
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500 px-1">
                            <span>{answer.length} / 300</span>
                            <button
                                type="submit"
                                disabled={!answer.trim()}
                                className={`group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${themeColor} text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/25`}
                            >
                                <span>기록하기</span>
                                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default QuestionCard;
