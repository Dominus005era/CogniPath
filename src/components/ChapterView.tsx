import React, { useState } from 'react';
import { X, LayoutDashboard, Sparkles, ChevronRight, CheckCircle2, Type } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Chapter } from '../types';
import AIChatSidebar from './AIChatSidebar';

interface ChapterViewProps {
  chapter: Chapter;
  chapterIndex: number;
  totalChapters: number;
  onCloseToRoadmap: () => void;
  onGoToDashboard: () => void;
  onCompleteChapter: () => void;
  onSaveChatHistory: (history: any[]) => void;
}

export default function ChapterView({
  chapter,
  chapterIndex,
  totalChapters,
  onCloseToRoadmap,
  onGoToDashboard,
  onCompleteChapter,
  onSaveChatHistory
}: ChapterViewProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [textScale, setTextScale] = useState(2); // 0=sm, 1=base, 2=lg, 3=xl, 4=2xl
  
  const getProseClass = (scale: number) => {
    switch (scale) {
      case 0: return 'prose-sm';
      case 1: return 'prose';
      case 2: return 'prose-lg';
      case 3: return 'prose-xl';
      case 4: return 'prose-2xl';
      default: return 'prose-lg';
    }
  };

  return (
    <div className={`fixed inset-0 bg-slate-50 dark:bg-slate-950 z-50 overflow-y-auto flex flex-col w-full h-full transition-all duration-300 ${isChatOpen ? 'sm:pl-96' : ''}`}>
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onCloseToRoadmap}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center gap-2 font-semibold text-sm shadow-sm"
          >
            <X size={16} />
            <span>Close Chapter</span>
          </button>
        </div>
        
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-mono block mb-1">
            Milestone {chapterIndex + 1} of {totalChapters}
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-md block">
            {chapter.title}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 shadow-sm mr-2">
              <button 
                onClick={() => setTextScale(s => Math.max(0, s - 1))}
                className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition"
                title="Decrease Text Size"
              >
                <Type size={14} />
              </button>
              <span className="text-xs font-bold px-2 text-slate-400">A</span>
              <button 
                onClick={() => setTextScale(s => Math.min(4, s + 1))}
                className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition"
                title="Increase Text Size"
              >
                <Type size={18} />
              </button>
            </div>
            
            <button
              onClick={onGoToDashboard}
              className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 transition flex items-center gap-2 font-semibold text-sm border border-indigo-200 dark:border-indigo-800 shadow-sm"
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto pb-32">
        {/* Cover Image (if available) */}
        {chapter.coverImage && (
          <div className="w-full h-64 md:h-96 w-full object-cover">
            <img 
              src={chapter.coverImage} 
              alt={chapter.title} 
              className="w-full h-full object-cover rounded-b-[2rem] shadow-sm"
              referrerPolicy="no-referrer"
              onError={(e: any) => {
                e.target.onerror = null; // prevent infinite loops
                e.target.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(chapter.title + " high quality illustration")}`;
              }}
            />
          </div>
        )}

        <div className={`px-6 md:px-12 ${chapter.coverImage ? 'pt-12' : 'pt-24'}`}>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-12">
            {chapter.title}
          </h1>

          <div className={`prose ${getProseClass(textScale)} dark:prose-invert prose-indigo max-w-none text-slate-700 dark:text-slate-300 leading-relaxed markdown-body transition-all duration-300`}>
            {chapter.content ? <ReactMarkdown>{chapter.content}</ReactMarkdown> : <p className="text-slate-400">No content available.</p>}
          </div>

          {/* AI Key Takeaways (Bullet Points) */}
          {chapter.bulletPoints && chapter.bulletPoints.length > 0 && (
            <div className="mt-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-[2rem] p-8 md:p-12 border border-indigo-100 dark:border-indigo-900/30 shadow-inner">
              <h3 className="flex items-center gap-3 text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-6">
                <Sparkles className="text-indigo-500" /> Key Takeaways
              </h3>
              <ul className="space-y-4">
                {chapter.bulletPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 text-lg">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3"
            >
              <Sparkles size={20} />
              AI Discussion
            </button>
            <button
              onClick={onCompleteChapter}
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3 ${
                chapter.completed
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30"
              }`}
            >
              {chapter.completed ? (
                <>
                  <CheckCircle2 size={20} /> Chapter Completed
                </>
              ) : (
                <>
                  Complete & Move Forward <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* AI Chat Sidebar */}
      <AIChatSidebar 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        chapterContext={chapter.content || ''}
        history={chapter.chatHistory || []}
        onSaveHistory={(history) => { try { onSaveChatHistory(history); } catch(e) { console.error('Failed to save chat:', e); } }}
      />
    </div>
  );
}
