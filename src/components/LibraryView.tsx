import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Calendar, ChevronRight, Play, Trash2, CheckCircle2, Award } from 'lucide-react';
import { Roadmap } from '../types';

interface LibraryViewProps {
  library: Roadmap[];
  onSelectRoadmap: (roadmap: Roadmap) => void;
  onRemoveRoadmap: (id: string) => void;
}

export default function LibraryView({
  library,
  onSelectRoadmap,
  onRemoveRoadmap,
}: LibraryViewProps) {
  const [roadmapToContinue, setRoadmapToContinue] = useState<Roadmap | null>(null);

  return (
    <div id="library_view" className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">
            Expedition Archives
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            My Library
          </h2>
        </div>
        <div className="bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-xl text-xs font-mono font-bold">
          TOTAL SOURCES: {library.length}
        </div>
      </div>

      {library.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-sm"
        >
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-600 mx-auto">
            <BookOpen size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">
            Library is Empty
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
            You haven't initiated any cognitive journeys yet. Head back to the Dashboard to create your first 9-chapter custom pathway.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {library.map((item, idx) => {
            const completedCount = item.chapters.filter((c) => c.completed).length;
            const remainingCount = item.chapters.length - completedCount;
            const progressPct = Math.round((completedCount / item.chapters.length) * 100);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setRoadmapToContinue(item)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all duration-300 flex flex-col h-[380px] relative group cursor-pointer"
              >
                {/* Delete button overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRoadmap(item.id);
                  }}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-red-600/90 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                  title="Remove Roadmap"
                >
                  <Trash2 size={16} />
                </button>

                {/* Cover visual banner */}
                <div className="h-40 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                  {item.coverImage ? (
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                      onError={(e: any) => {
                        e.target.src = "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-indigo-700 to-purple-600 flex items-center justify-center text-white">
                      <BookOpen size={36} />
                    </div>
                  )}
                  {/* Progress tag overlay */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/70 text-white backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono">
                    {progressPct === 100 ? "Finished" : "In Progress"}
                  </div>
                </div>

                {/* Card text content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-base md:text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Progress tracker metrics */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                      <span className="font-mono">{completedCount} / {item.chapters.length} CHAPTERS</span>
                      <span>{progressPct}%</span>
                    </div>
                    {/* Tiny visual progress bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar size={10} />
                        Accessed {new Date(item.lastAccessed).toLocaleDateString()}
                      </span>
                      {item.completedQuiz ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-1 rounded-md font-mono flex items-center gap-1">
                          <Award size={10} /> Score: {item.quizScore}/9
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded-md font-mono">
                          Quiz Locked
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Resume Button */}
                  <div className="w-full mt-4 py-3 bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800 dark:group-hover:bg-indigo-600 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition flex items-center justify-center gap-2 text-xs">
                    <Play size={12} className="fill-current" />
                    <span>{progressPct === 100 ? "Review Material" : "Continue Cognitive Expedition"}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Confirmation Popup Modal */}
      <AnimatePresence>
        {roadmapToContinue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative space-y-6"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
                  <Play size={28} className="fill-current ml-1" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Want to continue the path?
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  You are about to resume your cognitive expedition for <strong className="text-slate-900 dark:text-white font-bold">"{roadmapToContinue.title}"</strong>. All progress is saved and ready for study.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setRoadmapToContinue(null)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  No, Go Back
                </button>
                <button
                  onClick={() => {
                    const selected = roadmapToContinue;
                    setRoadmapToContinue(null);
                    onSelectRoadmap(selected);
                  }}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition cursor-pointer"
                >
                  Yes, Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
