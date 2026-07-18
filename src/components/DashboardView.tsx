import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, BookOpen, Star, HelpCircle, Loader2 } from 'lucide-react';

interface DashboardViewProps {
  prompt: string;
  setPrompt: (v: string) => void;
  generateRoadmap: (name: string, age: string, topic: string) => void;
  loading: boolean;
  userName: string;
  setUserName: (v: string) => void;
  userAge: string;
  setUserAge: (v: string) => void;
}

export default function DashboardView({
  prompt,
  setPrompt,
  generateRoadmap,
  loading,
  userName,
  setUserName,
  userAge,
  setUserAge,
}: DashboardViewProps) {
  const [localName, setLocalName] = useState(userName || '');
  const [localAge, setLocalAge] = useState(userAge || '');
  const [localPrompt, setLocalPrompt] = useState(prompt || '');
  const [error, setError] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  // Sync state back
  useEffect(() => {
    setLocalName(userName);
  }, [userName]);

  useEffect(() => {
    setLocalAge(userAge);
  }, [userAge]);

  // Loading step simulation for the processing UI
  useEffect(() => {
    if (!loading) {
      setLoadingStep(0);
      return;
    }

    const steps = [
      "Establishing link with Gemini intelligence network...",
      "Scouring reference indexes and web archives for relevant context...",
      "Structuring 9 core cognitive learning milestones...",
      "Generating substantial lessons and practical takeaway articles...",
      "Forging adaptive multiple-choice testing questions...",
      "Rendering custom zigzag visualization route and extracting cover graphics..."
    ];

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 4500);

    return () => clearInterval(interval);
  }, [loading]);

  const stepsText = [
    "Establishing link with Gemini intelligence network...",
    "Scouring reference indexes and web archives for relevant context...",
    "Structuring 9 core cognitive learning milestones...",
    "Generating substantial lessons and practical takeaway articles...",
    "Forging adaptive multiple-choice testing questions...",
    "Rendering custom zigzag visualization route and extracting cover graphics..."
  ];

  const handleStart = () => {
    if (!localName.trim()) {
      setError("Please introduce yourself by entering your name.");
      return;
    }
    if (!localAge.trim() || isNaN(Number(localAge))) {
      setError("Please enter a valid age.");
      return;
    }
    if (!localPrompt.trim()) {
      setError("Please enter a topic, book, movie, or web link to begin.");
      return;
    }
    setError('');
    setUserName(localName.trim());
    setUserAge(localAge.trim());
    setPrompt(localPrompt.trim());
    generateRoadmap(localName.trim(), localAge.trim(), localPrompt.trim());
  };

  const handleQuickSelect = (topic: string) => {
    setLocalPrompt(topic);
    setPrompt(topic);
  };

  return (
    <div id="dashboard_view" className="max-w-4xl mx-auto py-8 px-4">
      <AnimatePresence mode="wait">
        {loading ? (
          /* Processing Screen */
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[500px] bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden"
          >
            {/* Holographic glowing backgrounds */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>

            {/* Glowing Orbiting Loader */}
            <div className="relative mb-8 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="w-24 h-24 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-16 h-16 border border-purple-500/30 border-r-purple-500 rounded-full"
                ></motion.div>
              </motion.div>
              <Compass className="absolute text-indigo-400 animate-pulse" size={28} />
            </div>

            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-white to-purple-200 mb-2"
            >
              Synthesizing Cognitive Pathway
            </motion.h3>
            <p className="text-indigo-300 text-sm tracking-wider uppercase font-mono mb-8">
              System is running fast and secure
            </p>

            {/* Loading Steps Tracker */}
            <div className="w-full max-w-lg bg-slate-950/60 border border-slate-800 rounded-2xl p-6 text-left space-y-4">
              {stepsText.map((step, idx) => {
                const isCurrent = idx === loadingStep;
                const isCompleted = idx < loadingStep;
                return (
                  <div key={idx} className="flex items-center gap-3 transition-all duration-300">
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-5 h-5 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-[10px] text-emerald-400 font-bold">✓</span>
                        </div>
                      ) : isCurrent ? (
                        <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                      ) : (
                        <div className="w-5 h-5 border border-slate-700 rounded-full flex items-center justify-center">
                          <span className="text-[10px] text-slate-500 font-bold">{idx + 1}</span>
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isCurrent
                          ? "text-indigo-200"
                          : isCompleted
                          ? "text-slate-400 line-through"
                          : "text-slate-500"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-slate-400 mt-8 max-w-sm">
              Please wait while Gemini processes the material, creates customized educational text, and structures 9 progressive levels.
            </p>
          </motion.div>
        ) : (
          /* Normal Dashboard Welcome & Input Box */
          <motion.div
            key="dashboard_form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Highly engaging explorer greeting */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-900/40 dark:to-indigo-950/20 border border-indigo-100/30 dark:border-indigo-950/50 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-2xl flex items-center justify-center shadow-md text-white flex-shrink-0">
                <Compass className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Hello, Explorer!
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                  Would you like to explore hidden wisdom or conquer new knowledge fields with an enhanced, hyper-personalized cognitive path today? Let us guide your learning journey.
                </p>
              </div>
            </div>

            {/* Main Journey Creator Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-600 to-purple-500"></div>
              
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-indigo-600 dark:text-indigo-400" size={24} />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Your Journey</h2>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Explorer Name</label>
                  <input
                    type="text"
                    value={localName}
                    onChange={(e) => {
                      setLocalName(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your name..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Explorer Age</label>
                  <input
                    type="number"
                    value={localAge}
                    onChange={(e) => {
                      setLocalAge(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your age..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Knowledge Source / Subject</span>
                  <span className="text-xs text-slate-400">(Topic, book name, movie, or webpage link)</span>
                </label>
                <textarea
                  value={localPrompt}
                  onChange={(e) => {
                    setLocalPrompt(e.target.value);
                    setError('');
                  }}
                  rows={3}
                  placeholder="e.g. Astrophysics, Dune, Interstellar movie, or https://en.wikipedia.org/wiki/Special_relativity"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Instructions Panel inside Card */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-6 mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                  <BookOpen size={16} /> How It Works
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-mono text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">1</div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      <strong>Define your goal:</strong> Supply any topic, book title, film title, or enter a webpage link in the text area above.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-mono text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">2</div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      <strong>Generate Roadmap:</strong> Click the button to launch the cosmic roadmap process, building <strong>exactly 9 custom chapters</strong> with a genuine cover.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-mono text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">3</div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      <strong>Walk the path:</strong> View your curriculum in a curvy path. Select chapters to review lessons. Saving happens automatically as you progress.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-mono text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">4</div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      <strong>Conquer final testing:</strong> Complete all chapters to open the Testing stage, complete the 9-question quiz, and save your Certificate to the Achievement Wall!
                    </p>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={handleStart}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-5 h-5 animate-spin-slow" />
                <span>Begin Cognitive Expedition</span>
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Star size={14} className="text-amber-500" /> Inspired Concepts
              </h4>
              <div className="flex flex-wrap gap-3">
                {[
                  "Special Relativity by Albert Einstein",
                  "Interstellar (2014 movie lessons)",
                  "Introduction to Quantum Computing",
                  "Sapiens book major insights",
                  "https://en.wikipedia.org/wiki/Photosynthesis"
                ].map((concept, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickSelect(concept)}
                    className="px-4 py-2 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 dark:bg-slate-800 dark:hover:bg-slate-800/80 dark:text-slate-300 text-xs rounded-full border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                  >
                    {concept}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
