import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Check, Share2 } from 'lucide-react';

const ShareButton = ({ url }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-8 left-0 right-0 flex justify-center z-50 px-4"
        >
            <button
                onClick={handleCopy}
                className="relative group flex items-center gap-3 px-8 py-4 rounded-full bg-white text-indigo-900 font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 active:scale-95"
            >
                <div className="absolute inset-0 rounded-full bg-white blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <span className="relative flex items-center gap-2">
                    {copied ? (
                        <>
                            <Check size={20} className="text-green-600" />
                            <span className="text-indigo-900">링크 복사 완료!</span>
                        </>
                    ) : (
                        <>
                            <Link size={20} />
                            <span>친구에게 보내기</span>
                        </>
                    )}
                </span>
            </button>
        </motion.div>
    );
};

export default ShareButton;
