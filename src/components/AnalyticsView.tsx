import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, BookOpen, Trophy, Award, CheckCircle2, Circle, AlertCircle, X, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Roadmap, Certificate } from '../types';

interface AnalyticsViewProps {
  library: Roadmap[];
  certificates: Certificate[];
  stats: {
    roadmapsCount: number;
    totalEXP: number;
  };
  completions?: { roadmapId: string; chapterIndex: number; date: string }[];
}

export default function AnalyticsView({
  library,
  certificates,
  stats,
  completions = [],
}: AnalyticsViewProps) {
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);

  const selectedSource = library.find((s) => s.id === selectedSourceId);
  const selectedSourceCert = certificates.find((c) => c.roadmapId === selectedSourceId);

  // Calculate completions over the last 7 days
  const getLast7DaysData = () => {
    const data = [];
    const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      
      const label = `${weekdayNames[d.getDay()]} ${d.getDate()}`;
      const count = completions.filter((c) => c.date === dateKey).length;
      
      data.push({
        date: dateKey,
        label,
        "Chapters Completed": count,
      });
    }
    return data;
  };

  const chartData = getLast7DaysData();

  // Computed Stats
  const activeCount = library.filter((r) => r.chapters.some((c) => !c.completed)).length;
  const fullyCompletedCount = library.filter((r) => r.chapters.every((c) => c.completed)).length;
  const quizFinishedCount = library.filter((r) => r.completedQuiz).length;
  
  const avgQuizScore = quizFinishedCount > 0
    ? Math.round((library.reduce((sum, r) => sum + (r.quizScore || 0), 0) / (quizFinishedCount * 9)) * 100)
    : 0;

  return (
    <div id="analytics_view" className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">
            System Records
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Analytics & Logs
          </h2>
        </div>
      </div>

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Total EXP</h3>
          <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-2">{stats.totalEXP}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Active Paths</h3>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{library.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Assessed Paths</h3>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{quizFinishedCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Avg Quiz Grade</h3>
          <p className="text-3xl font-black text-amber-500 mt-2">{avgQuizScore}%</p>
        </div>
      </div>

      {/* Trailing 7-day Consistency Bar Chart */}
      <div id="learning_consistency_chart_card" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="text-indigo-600 dark:text-indigo-400" size={20} />
              7-Day Learning Consistency
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Keep a steady rhythm. Track the total chapters you have conquered over the last 7 days.
            </p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold px-3 py-1.5 rounded-xl self-start sm:self-auto">
            TOTAL CONQUERED: {completions.length} CHAPTERS
          </div>
        </div>

        <div className="h-64 w-full" id="consistency_chart_container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
              <XAxis 
                dataKey="label" 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              />
              <Bar 
                dataKey="Chapters Completed" 
                fill="#4f46e5" 
                radius={[6, 6, 0, 0]} 
                maxBarSize={38}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Library Log Index */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="text-indigo-600" size={20} /> Cognitive Source Catalog
        </h3>

        {library.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center text-slate-500">
            No records cataloged yet. Start exploring to build learning metrics.
          </div>
        ) : (
          <div className="space-y-4">
            {library.map((item) => {
              const compCount = item.chapters.filter((c) => c.completed).length;
              const isComp = compCount === item.chapters.length;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedSourceId(item.id)}
                  className={`bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60 border ${
                    selectedSourceId === item.id ? "border-indigo-500" : "border-slate-200 dark:border-slate-800"
                  } rounded-2xl p-5 shadow-sm transition-all duration-200 flex flex-col sm:flex-row items-center gap-5 cursor-pointer`}
                >
                  {/* Small Cover image representative */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e: any) => {
                          e.target.src = "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=200";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-indigo-700 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        CP
                      </div>
                    )}
                  </div>

                  {/* Main Details */}
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Explorer: {item.userName} • Date Created: {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Metrics and score highlights */}
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-center sm:text-right">
                      <span className="text-[10px] font-bold font-mono text-slate-400 block uppercase">Progress</span>
                      <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                        {compCount} of {item.chapters.length} chapters
                      </span>
                    </div>

                    <div className="text-center sm:text-right border-l border-slate-200 dark:border-slate-800 pl-6">
                      <span className="text-[10px] font-bold font-mono text-slate-400 block uppercase">Quiz Results</span>
                      {item.completedQuiz ? (
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                          {item.quizScore} / 9 Correct
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expanded detailed auditing section */}
      <AnimatePresence>
        {selectedSourceId && selectedSource && (
          <div className="fixed inset-0 bg-slate-950/70 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 md:p-6 z-[100]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col relative overflow-hidden my-auto max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono">
                    Expedition Audit details
                  </span>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-tight mt-1">
                    {selectedSource.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSourceId(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 hover:text-slate-900 text-slate-500 dark:text-slate-400 flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable details contents */}
              <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh] space-y-6">
                
                {/* Chapters list completed auditor */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Milestone Completion Audit
                  </h4>
                  <div className="grid grid-cols-1 gap-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900">
                    {selectedSource.chapters.map((chap, cIdx) => (
                      <div key={cIdx} className="flex items-center justify-between text-sm py-1">
                        <div className="flex items-center gap-3">
                          {chap.completed ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          ) : (
                            <Circle size={16} className="text-slate-300 dark:text-slate-700" />
                          )}
                          <span className={`font-semibold ${chap.completed ? "text-slate-800 dark:text-slate-200" : "text-slate-400"}`}>
                            {chap.title}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {chap.completed ? "COMPLETED" : "LOCKED"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quiz answers result auditor */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                    Quiz Performance Audit
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-900 space-y-4">
                    {selectedSource.completedQuiz ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Award className="text-emerald-500 w-10 h-10" />
                          <div>
                            <p className="text-base font-extrabold text-slate-900 dark:text-white">Assessment Passed!</p>
                            <p className="text-xs text-slate-500">Conferred ID: {selectedSourceCert?.id || "Pending"}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-900 text-xs text-slate-500 font-medium">
                          <p>Grade Achieved: <strong className="text-emerald-600 dark:text-emerald-400">{Math.round((selectedSource.quizScore || 0) / 9 * 100)}% ({selectedSource.quizScore} of 9 correct)</strong></p>
                          <p>Date Tested: <strong>{selectedSourceCert ? selectedSourceCert.dateEarned : "Recently"}</strong></p>
                          <p>Score Registered: <strong>{selectedSource.quizScore} of 9 Questions</strong></p>
                          <p>Reward Points: <strong className="text-amber-500">+{selectedSourceCert?.expEarned} EXP</strong></p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 p-2 text-slate-500 text-sm">
                        <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-300">Assessment Pending</p>
                          <p className="text-xs text-slate-500 leading-relaxed mt-1">
                            The final testing round is currently locked. Complete all 9 chapters in the Winding Trail first, then return to take the mini-quiz and generate your physical certificate scroll.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-right">
                <button
                  onClick={() => setSelectedSourceId(null)}
                  className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
