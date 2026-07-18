import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Sparkles, Loader2 } from 'lucide-react';

// Lightweight markdown renderer - no external dependencies, no crashes
function SimpleMarkdown({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        // Blank line = spacing
        if (line.trim() === '') return <div key={i} className="h-1" />;

        // Headers
        if (line.startsWith('### ')) return <p key={i} className="font-bold text-sm mt-2">{renderInline(line.slice(4))}</p>;
        if (line.startsWith('## '))  return <p key={i} className="font-bold text-base mt-2">{renderInline(line.slice(3))}</p>;
        if (line.startsWith('# '))   return <p key={i} className="font-bold text-lg mt-2">{renderInline(line.slice(2))}</p>;

        // Bullet points (- or *)
        if (/^[\*\-] /.test(line)) {
          return (
            <div key={i} className="flex gap-2 items-start">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              <span>{renderInline(line.slice(2))}</span>
            </div>
          );
        }

        // Numbered lists
        const numMatch = line.match(/^(\d+)\. (.*)/);
        if (numMatch) {
          return (
            <div key={i} className="flex gap-2 items-start">
              <span className="font-bold text-indigo-500 flex-shrink-0">{numMatch[1]}.</span>
              <span>{renderInline(numMatch[2])}</span>
            </div>
          );
        }

        // Normal paragraph
        return <p key={i}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

// Renders bold, italic, and inline code within a single line
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // Pattern: **bold**, *italic*, `code`
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[2]) {
      // **bold**
      parts.push(<strong key={match.index} className="font-bold">{match[2]}</strong>);
    } else if (match[3]) {
      // *italic*
      parts.push(<em key={match.index} className="italic">{match[3]}</em>);
    } else if (match[4]) {
      // `code`
      parts.push(<code key={match.index} className="bg-slate-200 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 px-1 rounded text-xs font-mono">{match[4]}</code>);
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts.length > 0 ? parts : text;
}


interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface AIChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chapterContext: string;
  history: Message[];
  onSaveHistory: (newHistory: Message[]) => void;
}

export default function AIChatSidebar({ isOpen, onClose, chapterContext, history, onSaveHistory }: AIChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>(history || []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync history from parent when chapter changes
  useEffect(() => {
    setMessages(history || []);
  }, [history]);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          context: chapterContext || '',
          history: messages
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const replyText = data?.reply || 'No response from AI.';
      const aiMessage: Message = { role: 'ai', content: replyText };
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      try { onSaveHistory(finalMessages); } catch (e) { /* ignore save errors */ }

    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'ai',
        content: `⚠️ ${error?.message || "I'm having trouble connecting. Please try again."}`
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      try { onSaveHistory(finalMessages); } catch (e) { /* ignore */ }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 h-full w-full sm:w-96 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-[100] flex flex-col"
      style={{ animation: 'slideInLeft 0.25s ease-out' }}
    >
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-indigo-600 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Sparkles size={20} className="text-white" />
          <div>
            <h3 className="font-bold text-white text-sm">AI Tutor</h3>
            <p className="text-[10px] text-indigo-200">Ask anything about this chapter</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
          aria-label="Close AI Chat"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-60 py-12">
            <Bot size={40} className="text-indigo-400 mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">I'm your AI Tutor!</p>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
              Ask me to explain concepts, quiz you, or summarize the chapter.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400'
              }`}>
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
              </div>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-sm'
              }`}>
                {/* Render markdown safely */}
                <SimpleMarkdown text={msg.content || ''} />
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[88%]">
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={12} />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-sm flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-indigo-500" />
                <span className="text-sm text-slate-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about this chapter..."
            className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition text-slate-900 dark:text-white placeholder-slate-400"
            disabled={loading}
            autoComplete="off"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || loading}
            className="w-11 h-11 flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl flex items-center justify-center transition disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          Powered by Gemini AI · History auto-saved
        </p>
      </div>
    </div>
  );
}
