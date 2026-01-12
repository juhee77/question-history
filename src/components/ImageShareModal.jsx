import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

const ImageShareModal = ({ isOpen, onClose, data, themeColor }) => {
    const cardRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen) return null;

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);

        try {
            // Wait for fonts to load
            await document.fonts.ready;

            const canvas = await html2canvas(cardRef.current, {
                scale: 4, // Higher resolution for better quality
                backgroundColor: null,
                useCORS: true,
                logging: false,
            });

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `longstory-${new Date().getTime()}.png`;
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
                className="relative w-full max-w-md bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <ImageIcon size={18} />
                        이미지로 저장
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Preview Area */}
                <div className="p-6 bg-[#121212] flex justify-center overflow-y-auto max-h-[60vh]">
                    <div
                        ref={cardRef}
                        className={`w-full aspect-[4/5] relative overflow-hidden rounded-xl bg-gradient-to-br ${themeColor} p-1 shadow-2xl`}
                    >
                        <div className="absolute inset-0 bg-black/20" />

                        {/* Content Container */}
                        <div className="relative h-full bg-white/10 backdrop-blur-md rounded-lg p-6 flex flex-col justify-between border border-white/20">
                            {/* Top: Branding & Date */}
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-bold tracking-widest text-white/80 uppercase border border-white/30 px-2 py-1 rounded-full">
                                    LongStory
                                </span>
                                <span className="text-xs text-white/60 font-mono">
                                    {data.date}
                                </span>
                            </div>

                            {/* Middle: Question & Answer */}
                            <div className="space-y-6 my-4">
                                <div>
                                    <h2 className="text-xl font-bold text-white leading-tight mb-4 drop-shadow-md">
                                        {data.question}
                                    </h2>
                                    <div className="w-10 h-1 bg-white/50 rounded-full" />
                                </div>

                                <div className="relative">
                                    <p className="text-2xl text-white/90 leading-relaxed whitespace-pre-wrap font-['Nanum_Pen_Script']">
                                        "{data.answer}"
                                    </p>
                                </div>
                            </div>

                            {/* Bottom: Nickname */}
                            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/10">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                                    ✏️
                                </div>
                                <span className="font-bold text-white text-sm">
                                    {data.nickname || '익명'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-[#1a1a1a]">
                    <button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="w-full py-3 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                저장 중...
                            </>
                        ) : (
                            <>
                                <Download size={18} />
                                이미지 저장하기
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ImageShareModal;
