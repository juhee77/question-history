import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Check, Image as ImageIcon, ScrollText, MessageCircle } from 'lucide-react';
import ImageShareModal from './ImageShareModal';
import FullHistoryModal from './FullHistoryModal';

const ShareButton = ({ url, questionText, mode, lastAnswerData, themeColor, history, questions }) => {
    const [copied, setCopied] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showFullHistoryModal, setShowFullHistoryModal] = useState(false);

    useEffect(() => {
        // Initialize Kakao SDK
        // Replace 'YOUR_KAKAO_JAVASCRIPT_KEY' with your actual key from Kakao Developers
        if (window.Kakao && !window.Kakao.isInitialized()) {
            // window.Kakao.init('YOUR_KAKAO_JAVASCRIPT_KEY'); 
            // Example: window.Kakao.init('a1b2c3d4e5f6...');
            console.log('Kakao SDK not initialized. Please set your Javascript Key.');
        }
    }, []);

    const getShareText = () => {
        switch (mode) {
            case 'couple': return '연인에게 보내기';
            case 'friend': return '친구에게 보내기';
            case 'family': return '가족에게 보내기';
            case 'group': return '멤버들에게 공유하기';
            default: return '링크 공유하기';
        }
    };

    const handleCopy = async () => {
        try {
            const textToCopy = `
💌 [LongStory] 도착한 질문이 있어요!

"${questionText}"

이 질문에 대한 당신의 생각이 궁금해요.
아래 링크를 눌러 답장을 남겨주세요! 👇

🔗 ${url}

#LongStory #깊은대화 #마음기록
`.trim();
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'LongStory',
                    text: `💌 [LongStory] 도착한 질문이 있어요!\n\n"${questionText}"\n\n이 질문에 대한 당신의 이야기를 들려주세요.`,
                    url: url,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed bottom-8 left-0 right-0 flex justify-center z-50 px-4 gap-2 md:gap-3 flex-wrap"
            >
                <button
                    onClick={handleCopy}
                    className="relative group flex items-center gap-2 px-4 py-3 md:px-5 md:py-4 rounded-full bg-white text-indigo-900 font-bold text-sm md:text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 active:scale-95 shrink-0"
                >
                    <div className="absolute inset-0 rounded-full bg-white blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                    <span className="relative flex items-center gap-2">
                        {copied ? (
                            <>
                                <Check size={16} className="text-green-600" />
                                <span className="text-indigo-900">복사됨</span>
                            </>
                        ) : (
                            <>
                                <Link size={16} />
                                <span>링크 복사</span>
                            </>
                        )}
                    </span>
                </button>

                <button
                    onClick={handleKakaoShare}
                    className="relative group flex items-center gap-2 px-4 py-3 md:px-5 md:py-4 rounded-full bg-[#FEE500] text-[#3c1e1e] font-bold text-sm md:text-lg shadow-[0_0_30px_rgba(254,229,0,0.3)] hover:bg-[#fdd835] transition-all transform hover:-translate-y-1 active:scale-95 shrink-0"
                    title="카카오톡 공유"
                >
                    <MessageCircle size={18} fill="#3c1e1e" />
                    <span className="hidden md:inline">카카오톡</span>
                    <span className="md:hidden">카톡</span>
                </button>

                {navigator.share && (
                    <button
                        onClick={handleNativeShare}
                        className="relative group flex items-center gap-2 px-4 py-3 md:px-5 md:py-4 rounded-full bg-indigo-500 text-white font-bold text-sm md:text-lg shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:bg-indigo-400 transition-all transform hover:-translate-y-1 active:scale-95 shrink-0"
                        title="더보기"
                    >
                        <span className="text-white">📤</span>
                        <span className="hidden md:inline">공유</span>
                    </button>
                )}

                <button
                    onClick={() => setShowImageModal(true)}
                    className="relative group flex items-center gap-2 px-4 py-3 md:px-5 md:py-4 rounded-full bg-gray-800 text-white font-bold text-sm md:text-lg shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:bg-gray-700 transition-all transform hover:-translate-y-1 active:scale-95 border border-white/10 shrink-0"
                    title="이미지 저장"
                >
                    <ImageIcon size={18} />
                    <span className="hidden md:inline">이미지</span>
                </button>

                {history && history.length > 0 && (
                    <button
                        onClick={() => setShowFullHistoryModal(true)}
                        className="relative group flex items-center gap-2 px-4 py-3 md:px-5 md:py-4 rounded-full bg-indigo-600 text-white font-bold text-sm md:text-lg shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition-all transform hover:-translate-y-1 active:scale-95 border border-white/10 shrink-0"
                        title="전체 기록 저장"
                    >
                        <ScrollText size={18} />
                        <span className="hidden md:inline">전체</span>
                    </button>
                )}
            </motion.div>

            <AnimatePresence>
                {showImageModal && (
                    <ImageShareModal
                        isOpen={showImageModal}
                        onClose={() => setShowImageModal(false)}
                        data={lastAnswerData}
                        themeColor={themeColor}
                    />
                )}
                {showFullHistoryModal && (
                    <FullHistoryModal
                        isOpen={showFullHistoryModal}
                        onClose={() => setShowFullHistoryModal(false)}
                        history={history}
                        questions={questions}
                        themeColor={themeColor}
                        mode={mode}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default ShareButton;
