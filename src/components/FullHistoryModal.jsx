import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Loader2, ScrollText } from 'lucide-react';
import html2canvas from 'html2canvas';

const FullHistoryModal = ({ isOpen, onClose, history, questions, themeColor, mode }) => {
    const containerRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen) return null;

    const getTitle = () => {
        switch (mode) {
            case 'couple': return 'Our Love Story';
            case 'friend': return 'Friendship Log';
            case 'family': return 'Family History';
            case 'group': return 'Group Memories';
            default: return 'LongStory';
        }
    };

    const handleDownload = async () => {
        if (!containerRef.current) return;
        setIsGenerating(true);

        try {
            await document.fonts.ready;

            const canvas = await html2canvas(containerRef.current, {
                scale: 4,
                backgroundColor: null,
                useCORS: true,
                logging: false,
                windowWidth: containerRef.current.scrollWidth,
                windowHeight: containerRef.current.scrollHeight
            });

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `longstory-full-${new Date().getTime()}.png`;
            link.click();
        } catch (error) {
            console.error('Image generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-2xl bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-white/10 shrink-0">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <ScrollText size={18} />
                        전체 기록 저장
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Preview Area - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#121212] custom-scrollbar">
                    <div className="flex justify-center min-h-full">
                        <div
                            ref={containerRef}
                            className={`w-full max-w-lg bg-gradient-to-br ${themeColor} p-1 shadow-2xl rounded-xl`}
                        >
                            <div className="bg-white/95 backdrop-blur-sm min-h-full rounded-lg p-8 md:p-12 relative overflow-hidden">
                                {/* Decorative Header */}
                                <div className="text-center mb-12 relative z-10">
                                    <span className="inline-block px-3 py-1 rounded-full border border-gray-300 text-gray-500 text-xs font-bold tracking-widest uppercase mb-3">
                                        {new Date().toLocaleDateString()}
                                    </span>
                                    <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-2 font-serif">
                                        {getTitle()}
                                    </h1>
                                    <div className="w-16 h-1 bg-gray-800 mx-auto rounded-full" />
                                </div>

                                {/* Content List */}
                                <div className="space-y-10 relative z-10">
                                    {history.map((item, index) => (
                                        <div key={index} className="relative pl-6 border-l-2 border-gray-200">
                                            <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-gray-300" />

                                            <div className="mb-2 flex items-center gap-2 text-xs text-gray-500 font-mono uppercase tracking-wide">
                                                <span>#{index + 1}</span>
                                                <span>•</span>
                                                <span>{item.d}</span>
                                                <span>•</span>
                                                <span className="font-bold text-gray-700">{item.n || '익명'}</span>
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-800 mb-3 leading-snug">
                                                {questions[item.q]}
                                            </h3>

                                            <p className="text-xl text-gray-600 leading-relaxed whitespace-pre-wrap font-['Nanum_Pen_Script']">
                                                {item.a}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="mt-16 pt-8 border-t border-gray-200 text-center relative z-10">
                                    <p className="text-gray-400 text-xs font-mono tracking-widest uppercase">
                                        Created with LongStory
                                    </p>
                                </div>

                                {/* Background Texture/Pattern */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                    style={{
                                        backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                                        backgroundSize: '20px 20px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-white/10 bg-[#1a1a1a] shrink-0">
                    <button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="w-full py-3 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                전체 기록 생성 중...
                            </>
                        ) : (
                            <>
                                <Download size={18} />
                                전체 기록 이미지로 저장
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default FullHistoryModal;
