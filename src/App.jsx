import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { decodeHistory, getCurrentUrlWithHistory } from './utils/urlManager';
import Timeline from './components/Timeline';
import QuestionCard from './components/QuestionCard';
import ShareButton from './components/ShareButton';
import { Sparkles, Heart, Users, Home } from 'lucide-react';
import { questionSets, defaultQuestions } from './data/questions';

function App() {
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState(null); // 'couple', 'friend', 'family'
  const [newUrl, setNewUrl] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedHistory = params.get('history');

    if (encodedHistory) {
      const decoded = decodeHistory(encodedHistory);
      setHistory(decoded.history);
      setMode(decoded.mode || 'couple'); // Default to couple for legacy links
    }
    setIsLoaded(true);
  }, []);

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
  };

  const handleAnswer = (questionId, answerText, nickname) => {
    const newItem = {
      q: questionId,
      a: answerText,
      n: nickname, // Nickname
      d: new Date().toLocaleDateString('ko-KR', { year: '2-digit', month: 'numeric', day: 'numeric' })
    };

    const updatedHistory = [...history, newItem];
    setHistory(updatedHistory);

    // Generate new URL with mode info
    const nextUrl = getCurrentUrlWithHistory(updatedHistory, mode);
    setNewUrl(nextUrl);
    setHasAnswered(true);

    window.history.pushState({ path: nextUrl }, '', nextUrl);
  };

  // Get current questions based on mode
  const currentQuestions = mode ? questionSets[mode]?.questions : defaultQuestions;
  const themeColor = mode ? questionSets[mode]?.color : "from-indigo-500 to-purple-500";

  if (!isLoaded) return null;

  // Landing Screen (Mode Selection)
  if (!mode && history.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-white to-indigo-200">
              LongStory
            </h1>
            <p className="text-gray-400">누구와 이야기를 시작하나요?</p>
          </div>

          <div className="grid gap-4">
            <button
              onClick={() => handleModeSelect('couple')}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 hover:border-pink-500/50 transition-all active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-2xl shadow-lg shadow-pink-500/20">
                  ❤️
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-pink-100">연인과 함께</h3>
                  <p className="text-sm text-pink-200/60">설렘 가득한 우리만의 이야기</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeSelect('friend')}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/50 transition-all active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20">
                  🤜🤛
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-blue-100">친구와 함께</h3>
                  <p className="text-sm text-blue-200/60">우정의 깊이를 더하는 대화</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeSelect('family')}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/50 transition-all active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
                  🏡
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-amber-100">가족과 함께</h3>
                  <p className="text-sm text-amber-200/60">소중한 가족과의 따뜻한 기록</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeSelect('group')}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 hover:border-purple-500/50 transition-all active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/20">
                  🎉
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-purple-100">모임/단체</h3>
                  <p className="text-sm text-purple-200/60">우리 모임의 분위기를 UP!</p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-4 md:p-12 max-w-4xl mx-auto pb-32">
      {/* Header */}
      <header className="text-center mb-12 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-sm"
        >
          {mode === 'couple' && <Heart size={14} className="text-pink-400 fill-pink-400" />}
          {mode === 'friend' && <Users size={14} className="text-blue-400 fill-blue-400" />}
          {mode === 'family' && <Home size={14} className="text-amber-400 fill-amber-400" />}
          {mode === 'group' && <span className="text-sm">🎉</span>}
          <span className="text-xs font-medium tracking-widest text-gray-300 uppercase">
            {mode ? questionSets[mode].label : 'LongStory'} Mode
          </span>
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
          LongStory
        </h1>
      </header>

      {/* Main Content */}
      <main className="relative z-10 space-y-12">
        <Timeline history={history} questions={currentQuestions} />

        {!hasAnswered ? (
          <QuestionCard
            questions={currentQuestions}
            onAnswer={handleAnswer}
            usedQuestionIds={history.map(h => h.q)}
            themeColor={themeColor}
          />
        ) : (
          <div className="text-center py-12 px-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className={`w-20 h-20 mx-auto bg-gradient-to-tr ${themeColor} rounded-full flex items-center justify-center shadow-lg mb-6`}
            >
              <Sparkles size={40} className="text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">기록되었습니다!</h2>
            <p className="text-gray-400">아래 버튼을 눌러 링크를 공유하세요.</p>
          </div>
        )}
      </main>

      <AnimatePresence>
        {hasAnswered && (
          <ShareButton
            url={newUrl}
            questionText={currentQuestions[history[history.length - 1]?.q]}
            mode={mode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
