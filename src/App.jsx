import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { decodeHistory, getCurrentUrlWithHistory } from './utils/urlManager';
import Timeline from './components/Timeline';
import QuestionCard from './components/QuestionCard';
import ShareButton from './components/ShareButton';
import { Sparkles } from 'lucide-react';

function App() {
  const [history, setHistory] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    // 1. Load history from URL on mount
    const params = new URLSearchParams(window.location.search);
    const encodedHistory = params.get('history');
    console.log("Encoded History:", encodedHistory);
    if (encodedHistory) {
      const decoded = decodeHistory(encodedHistory);
      console.log("Decoded History:", decoded);
      setHistory(decoded);
    }
  }, []);

  const handleAnswer = (questionId, answerText) => {
    const newItem = {
      q: questionId,
      a: answerText,
      d: new Date().toLocaleDateString('ko-KR', { year: '2-digit', month: 'numeric', day: 'numeric' })
    };

    const updatedHistory = [...history, newItem];
    setHistory(updatedHistory);

    // Generate new URL
    const nextUrl = getCurrentUrlWithHistory(updatedHistory);
    setNewUrl(nextUrl);
    setHasAnswered(true);

    // Update browser URL without reload
    window.history.pushState({ path: nextUrl }, '', nextUrl);
  };

  return (
    <div className="min-h-screen text-white p-6 md:p-12 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center mb-16 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4"
        >
          <Sparkles size={14} className="text-yellow-300" />
          <span className="text-xs font-medium tracking-widest text-gray-300 uppercase">
            Serverless Exchange Diary
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-white to-indigo-200 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
        >
          LongStory
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-gray-400 text-sm md:text-base font-light"
        >
          우리의 이야기가 길어질수록, 이 링크도 자라납니다.
        </motion.p>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Timeline of previous answers */}
        <Timeline history={history} />

        {/* Interaction Area */}
        {!hasAnswered ? (
          <QuestionCard
            onAnswer={handleAnswer}
            usedQuestionIds={history.map(h => h.q)}
          />
        ) : (
          <div className="text-center py-20">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-20 h-20 mx-auto bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.5)] mb-8"
            >
              <Sparkles size={40} className="text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">기록되었습니다!</h2>
            <p className="text-gray-400 mb-12">이제 이 긴 이야기를 친구에게 보내보세요.</p>
          </div>
        )}
      </main>

      {/* Share Button (Fixed at bottom when answered) */}
      <AnimatePresence>
        {hasAnswered && <ShareButton url={newUrl} />}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-600 text-xs pb-8">
        <p>© 2026 LongStory. No Server, Just URL.</p>
      </footer>
    </div>
  );
}

export default App;
