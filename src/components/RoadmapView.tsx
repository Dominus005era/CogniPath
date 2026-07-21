import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft, CheckCircle2, Lock, Sparkles, BookOpen, 
  HelpCircle, ChevronRight, Bookmark, Award, Star
} from 'lucide-react';
import { Roadmap, Chapter } from '../types';
import ChapterView from './ChapterView';

interface RoadmapViewProps {
  roadmap: Roadmap;
  onBack: () => void;
  onUpdateRoadmap: (updated: Roadmap) => void;
  onStartQuiz: () => void;
  onAwardEXP: (amount: number) => void;
  onCompleteChapter: (roadmapId: string, chapterIndex: number) => void;
}

export default function RoadmapView({
  roadmap,
  onBack,
  onUpdateRoadmap,
  onStartQuiz,
  onAwardEXP,
  onCompleteChapter,
}: RoadmapViewProps) {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(null);
  const [showFinalTestingPopup, setShowFinalTestingPopup] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop speech when chapter changes or modal closes
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  }, [selectedChapterIndex]);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleStartSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    if (selectedChapterIndex === null) return;
    const rawContent = chapters[selectedChapterIndex].content || "";
    
    // Clean markdown characters for pleasant speech reading
    const cleanText = rawContent
      .replace(/[#*`_~-]/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    setIsSpeaking(true);
    setIsPaused(false);
    window.speechSynthesis.speak(utterance);
  };

  const handlePauseResumeSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStopSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const chapters = roadmap.chapters;
  const completedCount = chapters.filter((c) => c.completed).length;
  const remainingCount = chapters.length - completedCount;

  // Track if all chapters completed
  const allCompleted = completedCount === chapters.length;

  useEffect(() => {
    if (allCompleted) {
      setShowFinalTestingPopup(true);
    } else {
      setShowFinalTestingPopup(false);
    }
  }, [allCompleted]);

  // Handle outside click of modal
  const handleOutsideClick = (e: any) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSelectedChapterIndex(null);
    }
  };

  const handleCompleteChapter = (idx: number) => {
    const updatedChapters = chapters.map((chap, cIdx) => {
      if (cIdx === idx) {
        return { ...chap, completed: true };
      }
      return chap;
    });

    const isLastChapter = idx === chapters.length - 1;
    let nextIdx = idx + 1;

    const updatedRoadmap: Roadmap = {
      ...roadmap,
      chapters: updatedChapters,
      currentChapterIndex: isLastChapter ? idx : nextIdx,
      lastAccessed: new Date().toISOString(),
    };

    onUpdateRoadmap(updatedRoadmap);
    onAwardEXP(50);
    onCompleteChapter(roadmap.id, idx);

    if (!isLastChapter) {
      setSelectedChapterIndex(nextIdx);
    } else {
      setSelectedChapterIndex(null);
      setShowFinalTestingPopup(true);
    }
  };

  const handleSaveChatHistory = (idx: number, newHistory: any[]) => {
    const updatedChapters = chapters.map((chap, cIdx) => {
      if (cIdx === idx) {
        return { ...chap, chatHistory: newHistory };
      }
      return chap;
    });
    
    const updatedRoadmap = {
      ...roadmap,
      chapters: updatedChapters
    };
    onUpdateRoadmap(updatedRoadmap);
  };

  if (selectedChapterIndex !== null) {
    return (
      <ChapterView 
        chapter={chapters[selectedChapterIndex]}
        chapterIndex={selectedChapterIndex}
        totalChapters={chapters.length}
        onCloseToRoadmap={() => setSelectedChapterIndex(null)}
        onGoToDashboard={onBack}
        onCompleteChapter={() => handleCompleteChapter(selectedChapterIndex)}
        onSaveChatHistory={(history) => handleSaveChatHistory(selectedChapterIndex, history)}
      />
    );
  }

  return (
    <div id="roadmap_view" className="relative max-w-5xl mx-auto py-8 px-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-start gap-4">
          <button
            onClick={onBack}
            className="p-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition flex items-center gap-2 cursor-pointer text-sm font-semibold self-start"
          >
            <ArrowLeft size={16} />
            <span>Go to Dashboard</span>
          </button>
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono block mb-1">
              Iterative Cognitive Path
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {roadmap.title}
            </h1>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="bg-slate-900 text-white dark:bg-indigo-950/40 dark:border dark:border-indigo-500/30 px-6 py-4 rounded-2xl flex items-center gap-4 self-start md:self-auto shadow-sm">
          <div className="text-right">
            <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 dark:text-indigo-300">
              Curriculum Progress
            </p>
            <p className="text-sm font-bold">
              {completedCount} / {chapters.length} Milestones
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-lg font-mono relative">
            {Math.round((completedCount / chapters.length) * 100)}%
            {/* Glowing ring if completed */}
            {allCompleted && (
              <span className="absolute -inset-1 rounded-xl border border-emerald-500 animate-ping opacity-60"></span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Info Sidebar + Curvy Path */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Topic Cover & Information card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            {roadmap.coverImage ? (
              <img
                src={roadmap.coverImage}
                alt={roadmap.title}
                className="w-full h-48 object-cover object-center bg-slate-100 border-b border-slate-200 dark:border-slate-800"
                referrerPolicy="no-referrer"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(roadmap.title + ' cinematic poster')}`;
                }}
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-tr from-indigo-700 to-purple-600 flex flex-col items-center justify-center text-white p-6">
                <BookOpen size={48} className="mb-2 opacity-80" />
                <span className="font-bold text-center text-sm">{roadmap.title}</span>
              </div>
            )}
            
            <div className="p-6 space-y-4">
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {roadmap.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2 text-xs font-medium font-mono text-slate-500">
                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                  User: {roadmap.userName} ({roadmap.userAge} yrs)
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                  Chapters Remaining: {remainingCount}
                </div>
              </div>
            </div>
          </div>

          {/* Quick instructions box */}
          <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-indigo-100 p-6 rounded-3xl shadow-md border border-indigo-500/10">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-indigo-300">
              <Sparkles size={16} /> Expedition Guide
            </h3>
            <ul className="text-xs space-y-2 leading-relaxed text-indigo-200">
              <li>• Chapters must be unlocked in linear sequence.</li>
              <li>• Click any active or finished node to open popup.</li>
              <li>• Complete each checkpoint to unlock the subsequent milestone automatically.</li>
              <li>• Review finished chapters at any time by selecting them again.</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Curved / Zigzag Trail */}
        <div className="lg:col-span-8 relative flex flex-col items-center py-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-12 shadow-sm overflow-hidden">
          
          {/* Curvy Winding Path Connector SVG (Desktop & Mobile) */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[300px] block pointer-events-none select-none z-0">
            <svg className="w-full h-full" viewBox="0 0 300 1200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {/* Zigzag curved path connecting chapters */}
              <path
                d="M 150,50 
                   C 320,180 300,180 150,230 
                   C -20,280 10,320 150,380 
                   C 320,440 310,480 150,530 
                   C -20,580 10,620 150,680
                   C 320,740 310,780 150,830
                   C -20,880 10,920 150,980
                   C 320,1040 310,1080 150,1130"
                fill="transparent"
                stroke="url(#curveGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="10 10"
                className="animate-dash"
              />
            </svg>
          </div>

          {/* Chapters Winding Map */}
          <div className="w-full relative z-10 space-y-16 md:space-y-24">
            {chapters.map((chapter, index) => {
              const isCompleted = chapter.completed;
              // An item is unlocked if it's chapter 1, or the previous one is completed
              const isUnlocked = index === 0 || chapters[index - 1].completed;
              const isActive = isUnlocked && !isCompleted;

              // Alternating layout offsets for zigzag visual motion (Left, Center, Right)
              // index % 3 === 0: Left, index % 3 === 1: Center, index % 3 === 2: Right
              const zigzagClasses = [
                "mr-auto ml-1 sm:ml-12 translate-x-0", // Leftish
                "mx-auto translate-x-0",              // Centerish
                "ml-auto mr-1 sm:mr-12 -translate-x-0"  // Rightish
              ];
              const alignmentClass = zigzagClasses[index % 3];

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 sm:gap-6 max-w-[280px] sm:max-w-md ${alignmentClass} relative`}
                >
                  {/* Node Connector Point */}
                  <div className="relative flex-shrink-0 z-20">
                    <button
                      disabled={!isUnlocked}
                      onClick={() => setSelectedChapterIndex(index)}
                      className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-all duration-300 relative cursor-pointer ${
                        isCompleted
                          ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 hover:scale-110"
                          : isActive
                          ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 hover:scale-110"
                          : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={24} />
                      ) : !isUnlocked ? (
                        <Lock size={18} />
                      ) : (
                        <span>{index + 1}</span>
                      )}

                      {/* Active pulsating beacon halo */}
                      {isActive && (
                        <span className="absolute -inset-2 rounded-full border border-indigo-500 animate-ping opacity-75 pointer-events-none"></span>
                      )}
                    </button>
                  </div>

                  {/* Card description details */}
                  <div
                    onClick={() => isUnlocked && setSelectedChapterIndex(index)}
                    className={`flex-1 p-5 rounded-2xl border transition-all duration-300 ${
                      isUnlocked ? "cursor-pointer" : "opacity-60 cursor-not-allowed"
                    } ${
                      isActive
                        ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60 shadow-md shadow-indigo-500/5"
                        : isCompleted
                        ? "bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
                    } hover:border-indigo-400 dark:hover:border-indigo-800`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-mono">
                        Milestone {index + 1}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-mono">
                          Completed
                        </span>
                      )}
                      {isActive && (
                        <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping"></span>
                          Active
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white line-clamp-2">
                      {chapter.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating testing ready round mini-popup at bottom right */}
      <AnimatePresence>
        {showFinalTestingPopup && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 max-w-sm bg-gradient-to-tr from-emerald-600 to-indigo-700 text-white p-6 rounded-3xl shadow-2xl border border-white/20 flex flex-col gap-4"
          >
            <div className="flex items-start gap-3">
              <Award className="w-10 h-10 text-amber-300 flex-shrink-0 animate-pulse" />
              <div>
                <h4 className="font-black text-lg">Testing Phase Unlocked!</h4>
                <p className="text-xs text-indigo-100 leading-relaxed mt-1">
                  Incredible performance, Explorer! You have conquered all 9 cognitive checkpoints. Take the final assessment to secure your certificate.
                </p>
              </div>
            </div>
            <button
              onClick={onStartQuiz}
              className="w-full py-3 bg-white hover:bg-slate-50 text-indigo-700 font-bold rounded-xl transition shadow-md hover:scale-[1.02] flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Sparkles size={16} className="text-indigo-600" />
              <span>Face testing Round</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
