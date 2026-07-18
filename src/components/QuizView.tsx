import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, CheckCircle, XCircle, ChevronRight, Share2, Shield, Sparkles, BookOpen, Clock, Zap } from 'lucide-react';
import { Roadmap, QuizQuestion, Certificate } from '../types';

interface QuizViewProps {
  roadmap: Roadmap;
  onCompleteQuiz: (score: number, certificate: Certificate) => void;
  onBackToRoadmap: () => void;
  onNavigate: (view: 'dashboard' | 'achievement') => void;
}

export default function QuizView({
  roadmap,
  onCompleteQuiz,
  onBackToRoadmap,
  onNavigate,
}: QuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answersStatus, setAnswersStatus] = useState<boolean[]>([]); // Tracks true/false for each question
  const [quizFinished, setQuizFinished] = useState(false);
  const [generatedCert, setGeneratedCert] = useState<Certificate | null>(null);

  const quizQuestions = roadmap.quiz;
  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOptionIndex(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null || isSubmitted) return;
    
    const isCorrect = selectedOptionIndex === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setAnswersStatus((prev) => [...prev, isCorrect]);
    setIsSubmitted(true);
  };

  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShare = () => {
    if (!generatedCert) return;
    const text = `🎓 I just mastered "${generatedCert.roadmapTitle}" on CogniPath with a score of ${generatedCert.quizScore}/${generatedCert.totalQuestions} and earned ${generatedCert.expEarned} EXP! Build your interactive paths with AI: ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'CogniPath Certificate of Mastery',
        text: text,
        url: window.location.origin,
      }).catch(err => console.log('Share error:', err));
    } else {
      navigator.clipboard.writeText(text);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  const handleNextQuestion = () => {
    setIsSubmitted(false);
    setSelectedOptionIndex(null);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Quiz complete! Generate certificate
      const finalScore = score + (selectedOptionIndex === currentQuestion.correctAnswerIndex ? 1 : 0);
      const uniqueId = `CP-${Math.floor(10000 + Math.random() * 90000)}-${roadmap.userAge}`;
      const cert: Certificate = {
        id: uniqueId,
        userName: roadmap.userName,
        userAge: roadmap.userAge,
        roadmapId: roadmap.id,
        roadmapTitle: roadmap.title,
        quizScore: finalScore,
        totalQuestions: quizQuestions.length,
        dateEarned: new Date().toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        }),
        expEarned: finalScore * 100 + 500, // 100 EXP per correct answer + 500 EXP bonus
      };
      
      setGeneratedCert(cert);
      setQuizFinished(true);
      // Automatically save to the wall and award EXP/coins instantly
      onCompleteQuiz(finalScore, cert);
    }
  };

  return (
    <div id="quiz_view" className="max-w-4xl mx-auto py-8 px-6">
      <AnimatePresence mode="wait">
        {!quizFinished ? (
          /* Active Question Form */
          <motion.div
            key="quiz_form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header progress info */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">
                  Final Testing Round
                </span>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Cognitive Assessment
                </h2>
              </div>
              
              <button
                onClick={onBackToRoadmap}
                className="text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition font-bold"
              >
                ← Return to Pathway
              </button>
            </div>

            {/* Dynamic Step indicator */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-400 mb-2">
                <span>QUESTION {currentQuestionIndex + 1} OF {quizQuestions.length}</span>
                <span>SCORE: {score}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex gap-0.5">
                {quizQuestions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 h-full rounded-full transition-all duration-300 ${
                      idx < currentQuestionIndex
                        ? answersStatus[idx] ? "bg-emerald-500" : "bg-red-500"
                        : idx === currentQuestionIndex
                        ? "bg-indigo-600 animate-pulse"
                        : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
              <span className="text-xs font-bold text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                Milestone {currentQuestionIndex + 1} Test
              </span>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQuestion.question}
              </h3>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-4 pt-4">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  const isCorrect = idx === currentQuestion.correctAnswerIndex;
                  
                  let optionStyle = "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300";
                  let Icon = null;

                  if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle = "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400";
                      Icon = <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />;
                    } else if (isSelected) {
                      optionStyle = "border-red-500 bg-red-50/20 dark:bg-red-950/20 text-red-700 dark:text-red-400";
                      Icon = <XCircle size={18} className="text-red-500 flex-shrink-0" />;
                    } else {
                      optionStyle = "border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-60";
                    }
                  } else if (isSelected) {
                    optionStyle = "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 ring-2 ring-indigo-500";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-5 rounded-2xl border text-left font-semibold transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {Icon}
                    </button>
                  );
                })}
              </div>

              {/* Action Trigger */}
              <div className="pt-4 flex justify-end">
                {!isSubmitted ? (
                  <button
                    disabled={selectedOptionIndex === null}
                    onClick={handleSubmitAnswer}
                    className={`px-8 py-3.5 rounded-xl font-bold transition shadow-md flex items-center gap-2 cursor-pointer ${
                      selectedOptionIndex === null
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-0.5"
                    }`}
                  >
                    <span>Validate Answer</span>
                    <Shield size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                  >
                    <span>{currentQuestionIndex === quizQuestions.length - 1 ? "Generate Certificate" : "Next Milestone"}</span>
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Certificate Award Screen */
          <motion.div
            key="certificate_screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 flex flex-col items-center"
          >
            {/* Visual celebration particles banner */}
            <div className="text-center space-y-3">
              <div className="inline-flex p-3 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-500 animate-bounce mb-2">
                <Award size={36} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Academic Victory Achieved!
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
                Outstanding! You have successfully answered all testing questions representing each chapter and generated your certified credentials.
              </p>
            </div>

            {/* CLASSICAL PHYSICAL CERTIFICATE COMPONENT */}
            <div className="w-full max-w-3xl p-4 bg-amber-50/30 dark:bg-slate-900/40 rounded-3xl border border-amber-500/20 shadow-xl overflow-x-auto">
              <div className="min-w-[640px] p-12 bg-stone-50 border-[12px] border-double border-amber-400 text-stone-900 rounded-2xl relative shadow-inner overflow-hidden select-none font-serif">
                
                {/* Classical intricate security background marks */}
                <div className="absolute inset-0 opacity-5 pointer-events-none border-[1px] border-stone-800 m-2"></div>
                <div className="absolute top-4 left-4 text-[10px] font-mono opacity-35 tracking-widest text-stone-700 uppercase">
                  ID: {generatedCert?.id}
                </div>
                <div className="absolute top-4 right-4 text-[10px] font-mono opacity-35 tracking-widest text-stone-700 uppercase">
                  VERIFIED COGNITIVE RECORD
                </div>

                {/* Main Content Layout */}
                <div className="flex flex-col items-center text-center space-y-6">
                  
                  {/* Title Header */}
                  <div className="space-y-1">
                    <span className="text-xs font-sans font-black tracking-widest text-amber-600 uppercase font-mono">
                      COGNIPATH KNOWLEDGE CONCORDIA
                    </span>
                    <h1 className="text-3xl font-black tracking-wide text-stone-800 border-b-2 border-stone-300 pb-2 px-10">
                      CERTIFICATE OF COGNITIVE MASTERY
                    </h1>
                  </div>

                  {/* Body Statement */}
                  <div className="space-y-3 max-w-xl">
                    <p className="text-xs tracking-wider uppercase text-stone-500 font-sans">
                      This formal scroll honors the academic expedition of
                    </p>
                    <p className="text-3xl font-black italic text-indigo-900 underline decoration-amber-400 decoration-wavy px-6">
                      {generatedCert?.userName}
                    </p>
                    <p className="text-xs text-stone-500 font-sans font-medium">
                      Age: {generatedCert?.userAge} years
                    </p>
                    <p className="text-sm leading-relaxed text-stone-700 font-sans px-4">
                      who has successfully navigated the comprehensive curriculum of
                    </p>
                    <p className="text-lg font-black text-stone-800 font-sans tracking-tight">
                      "{generatedCert?.roadmapTitle}"
                    </p>
                    <p className="text-sm leading-relaxed text-stone-700 font-sans">
                      and demonstrated exceptional critical reasoning, passing the final assessment with a record score of
                    </p>
                    <p className="text-xl font-black text-emerald-700 font-sans">
                      {generatedCert?.quizScore} of 9 Milestones Correct ({Math.round((generatedCert?.quizScore || 0) / 9 * 100)}%)
                    </p>
                  </div>

                  {/* Seals & Signatures Grid */}
                  <div className="w-full grid grid-cols-3 items-end pt-8 font-sans">
                    {/* Left authority */}
                    <div className="text-center space-y-2 flex flex-col items-center">
                      <div className="w-24 h-0.5 bg-stone-300"></div>
                      <span className="text-[10px] font-bold text-stone-600 block uppercase font-mono">
                        GEMINI AI ARCHITECT
                      </span>
                      <span className="text-[8px] font-mono text-stone-400 tracking-wider">
                        Ver. 3.5 Synthesis
                      </span>
                    </div>

                    {/* Middle Gold Seal of Excellence */}
                    <div className="flex flex-col items-center justify-center relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 border-4 border-amber-300 shadow flex items-center justify-center relative animate-spin-slow">
                        {/* Intricate seal ridges */}
                        <div className="absolute inset-1 rounded-full border border-dashed border-white/60"></div>
                        <Shield className="text-amber-950 w-8 h-8 opacity-85" />
                      </div>
                      <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mt-2 font-mono">
                        GOLD EXCELLENCE
                      </span>
                    </div>

                    {/* Right authority */}
                    <div className="text-center space-y-2 flex flex-col items-center">
                      <div className="w-24 h-0.5 bg-stone-300"></div>
                      <span className="text-[10px] font-bold text-stone-600 block uppercase font-mono">
                        COGNIPATH DIRECTOR
                      </span>
                      <span className="text-[8px] font-mono text-stone-400 tracking-wider">
                        Authorized Blockchain signature
                      </span>
                    </div>
                  </div>

                  {/* Footer date earned */}
                  <div className="pt-4 text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                    Conferred on {generatedCert?.dateEarned} • EXP Conferred: +{generatedCert?.expEarned} EXP
                  </div>

                </div>
              </div>
            </div>

            {/* Exp Bonus Reward Alert */}
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 px-6 py-4 rounded-2xl flex items-center gap-3 font-semibold text-sm max-w-md w-full justify-center shadow-sm">
              <Zap size={18} className="text-amber-500 animate-pulse" />
              <span>EXP Reward Unlocked: +{generatedCert?.expEarned} EXP earned!</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 w-full max-w-md">
              <button
                onClick={() => onNavigate('achievement')}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award size={18} />
                <span>Go to Achievement Wall</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
