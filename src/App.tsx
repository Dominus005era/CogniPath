import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, BookOpen, BarChart3, Trophy, Search, Moon, Sun, Award, LogOut, Users, User, Coins, Menu, X
} from 'lucide-react';

import LandingView from './components/LandingView';
import DashboardView from './components/DashboardView';
import RoadmapView from './components/RoadmapView';
import QuizView from './components/QuizView';
import LibraryView from './components/LibraryView';
import AchievementWall from './components/AchievementWall';
import AnalyticsView from './components/AnalyticsView';
import LeaderboardView from './components/LeaderboardView';
import ProfileView from './components/ProfileView';

import { Roadmap, Certificate } from './types';
import { sound } from './lib/sound';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'library' | 'roadmap' | 'quiz' | 'analytics' | 'achievement' | 'leaderboard' | 'profile'>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  
  // Persistence States
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('cognipath_user_name') || '');
  const [userAge, setUserAge] = useState<string>(() => localStorage.getItem('cognipath_user_age') || '');
  
  const [library, setLibrary] = useState<Roadmap[]>(() => {
    const saved = localStorage.getItem('cognipath_library');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('cognipath_certificates');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('cognipath_stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.coins === undefined) {
        parsed.coins = Math.floor((parsed.totalEXP || 0) / 100);
      }
      return parsed;
    }
    return { roadmapsCount: 0, totalEXP: 0, coins: 0 };
  });

  const [unlockedAvatars, setUnlockedAvatars] = useState<string[]>(() => {
    const saved = localStorage.getItem('cognipath_unlocked_avatars');
    return saved ? JSON.parse(saved) : [];
  });

  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('cognipath_unlocked_badges');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeAvatar, setActiveAvatar] = useState<string>(() => {
    return localStorage.getItem('cognipath_active_avatar') || 'default';
  });

  const [activeBadge, setActiveBadge] = useState<string>(() => {
    return localStorage.getItem('cognipath_active_badge') || '';
  });

  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap | null>(null);

  // Streak & Learning Completion states
  const [streakCount, setStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem('cognipath_streak_count');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [lastLearnedDate, setLastLearnedDate] = useState<string>(() => {
    return localStorage.getItem('cognipath_last_learned_date') || '';
  });
  
  const [lastVisitDate, setLastVisitDate] = useState<string>(() => {
    return localStorage.getItem('cognipath_last_visit_date') || '';
  });

  const [completions, setCompletions] = useState<{ roadmapId: string; chapterIndex: number; date: string }[]>(() => {
    const saved = localStorage.getItem('cognipath_completions');
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyRewardNotification, setDailyRewardNotification] = useState<{
    show: boolean;
    type: 'visit' | 'streak';
    coinsEarned: number;
    message: string;
  } | null>(null);

  // Sync state back to local storage
  useEffect(() => {
    localStorage.setItem('cognipath_user_name', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('cognipath_user_age', userAge);
  }, [userAge]);

  useEffect(() => {
    localStorage.setItem('cognipath_library', JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem('cognipath_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('cognipath_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('cognipath_streak_count', String(streakCount));
  }, [streakCount]);

  useEffect(() => {
    localStorage.setItem('cognipath_last_learned_date', lastLearnedDate);
  }, [lastLearnedDate]);

  useEffect(() => {
    localStorage.setItem('cognipath_last_visit_date', lastVisitDate);
  }, [lastVisitDate]);

  useEffect(() => {
    localStorage.setItem('cognipath_completions', JSON.stringify(completions));
  }, [completions]);

  // Date utilities
  const getLocalDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getYesterdayDateString = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Daily Check-in & Streak audit on Mount
  useEffect(() => {
    const todayStr = getLocalDateString();
    const yesterdayStr = getYesterdayDateString();

    if (lastVisitDate !== todayStr) {
      setLastVisitDate(todayStr);

      // Award +5 coins for checking in today
      setStats((prev: any) => ({
        ...prev,
        coins: (prev.coins ?? 0) + 5,
      }));

      setDailyRewardNotification({
        show: true,
        type: 'visit',
        coinsEarned: 5,
        message: 'Daily Check-in Reward! Welcome back! Here is +5 Coins for visiting CogniPath today.'
      });

      // Play streak / visit chime
      sound.playStreakBonus();

      // Break streak if not active yesterday and not active today
      if (lastLearnedDate && lastLearnedDate !== todayStr && lastLearnedDate !== yesterdayStr) {
        setStreakCount(0);
      }
    }
  }, [lastVisitDate, lastLearnedDate]);

  const handleCompleteChapter = (roadmapId: string, chapterIndex: number) => {
    const todayStr = getLocalDateString();
    const yesterdayStr = getYesterdayDateString();

    // Play default chapter completion sound first
    sound.playChapterComplete();

    // 1. Log chapter completion for 7-day consistency graph
    setCompletions((prev) => [
      ...prev,
      { roadmapId, chapterIndex, date: todayStr }
    ]);

    // 2. Streak evaluation
    if (lastLearnedDate === todayStr) {
      // Already learned today, keep streak active but do not re-trigger reward coins today
      return;
    }

    let newStreak = 1;
    let rewardCoins = 10;
    let msg = "";

    if (lastLearnedDate === yesterdayStr) {
      newStreak = streakCount + 1;
      rewardCoins = 15;
      msg = `Awesome! You kept your learning streak alive for ${newStreak} days! Here is a streak bonus of +15 Coins!`;
    } else {
      newStreak = 1;
      rewardCoins = 10;
      msg = `Learning streak started! Complete at least one chapter every day to grow your streak. +10 Coins awarded!`;
    }

    setStreakCount(newStreak);
    setLastLearnedDate(todayStr);
    
    setStats((prev: any) => ({
      ...prev,
      coins: (prev.coins ?? 0) + rewardCoins,
    }));

    setDailyRewardNotification({
      show: true,
      type: 'streak',
      coinsEarned: rewardCoins,
      message: msg
    });

    // Play special streak milestone chime
    sound.playStreakBonus();
  };

  // Handle Dark mode DOM styling synchronization
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // EXP and Coin Management Engine
  const awardEXP = (amount: number) => {
    setStats((prev: any) => {
      const oldEXP = prev.totalEXP ?? 0;
      const newEXP = oldEXP + amount;
      // for every 100 jump one coin is awarded!
      const coinsEarned = Math.floor(newEXP / 100) - Math.floor(oldEXP / 100);
      const updatedCoins = (prev.coins ?? 0) + (coinsEarned > 0 ? coinsEarned : 0);
      return {
        ...prev,
        totalEXP: newEXP,
        coins: updatedCoins,
      };
    });
  };

  const handleUpdateProfile = (name: string, age: string) => {
    setUserName(name);
    setUserAge(age);
    localStorage.setItem('cognipath_user_name', name);
    localStorage.setItem('cognipath_user_age', age);
  };

  const handlePurchaseAvatar = (seed: string, price: number) => {
    setUnlockedAvatars((prev) => [...prev, seed]);
    setStats((prev: any) => ({
      ...prev,
      coins: Math.max(0, (prev.coins ?? 0) - price),
    }));
  };

  const handlePurchaseBadge = (badgeTitle: string, price: number) => {
    setUnlockedBadges((prev) => [...prev, badgeTitle]);
    setStats((prev: any) => ({
      ...prev,
      coins: Math.max(0, (prev.coins ?? 0) - price),
    }));
  };

  const handleSelectAvatar = (seed: string) => {
    setActiveAvatar(seed);
  };

  const handleSelectBadge = (badgeTitle: string) => {
    setActiveBadge(badgeTitle);
  };

  // Generate Cognitive Roadmap endpoint trigger
  const generateRoadmap = async (name: string, age: string, topic: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: topic }),
      });
      
      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const newRoadmap: Roadmap = {
        id: `RM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        title: data.title || topic,
        description: data.description || `Optimized 9-chapter cognitive path for "${topic}".`,
        coverImage: data.coverImage || "",
        chapters: (data.chapters || []).map((c: any) => ({ ...c, completed: false })),
        quiz: data.quiz || [],
        currentChapterIndex: 0,
        expEarned: 0,
        userName: name,
        userAge: age,
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
      };

      setLibrary((prev) => [newRoadmap, ...prev]);
      setActiveRoadmap(newRoadmap);
      setView('roadmap');

      setStats((prev) => ({
        ...prev,
        roadmapsCount: prev.roadmapsCount + 1,
      }));
    } catch (e: any) {
      console.error("Roadmap generation error:", e);
      setGlobalError(`Expedition generation failed: ${e.message}. Please try again with a different learning subject or webpage link.`);
    } finally {
      setLoading(false);
    }
  };

  // Update a specific roadmap state in library (progress, completeness)
  const handleUpdateRoadmap = (updated: Roadmap) => {
    setActiveRoadmap(updated);
    setLibrary((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  // Complete assessment quiz & grant rewards
  const handleCompleteQuiz = (score: number, certificate: Certificate) => {
    if (!activeRoadmap) return;

    const updatedRoadmap: Roadmap = {
      ...activeRoadmap,
      completedQuiz: true,
      quizScore: score,
      expEarned: certificate.expEarned,
      lastAccessed: new Date().toISOString(),
    };

    handleUpdateRoadmap(updatedRoadmap);
    setCertificates((prev) => [certificate, ...prev]);

    awardEXP(certificate.expEarned);
    
    // Play achievement unlocked sound for earning a credential/certificate!
    sound.playAchievementUnlocked();
  };

  // Resume a selected saved journey
  const handleSelectRoadmap = (roadmap: Roadmap) => {
    setActiveRoadmap(roadmap);
    setView('roadmap');
  };

  // Remove a roadmap record
  const handleRemoveRoadmap = (id: string) => {
    setLibrary((prev) => prev.filter((r) => r.id !== id));
    if (activeRoadmap?.id === id) {
      setActiveRoadmap(null);
    }
  };

  // Remove certificate
  const handleRemoveCertificate = (id: string) => {
    setCertificates((prev) => prev.filter((c) => c.id !== id));
  };

  // Clear ALL platform data (nuclear reset)
  const handleClearAllData = () => {
    const keys = [
      'cognipath_library',
      'cognipath_certificates',
      'cognipath_stats',
      'cognipath_user_name',
      'cognipath_user_age',
      'cognipath_streak_count',
      'cognipath_last_learned_date',
      'cognipath_last_visit_date',
      'cognipath_completions',
      'cognipath_unlocked_avatars',
      'cognipath_unlocked_badges',
      'cognipath_active_avatar',
      'cognipath_active_badge',
    ];
    keys.forEach((k) => localStorage.removeItem(k));

    // Reset all React state
    setLibrary([]);
    setCertificates([]);
    setStats({ roadmapsCount: 0, totalEXP: 0, coins: 0 });
    setUserName('');
    setUserAge('');
    setStreakCount(0);
    setLastLearnedDate('');
    setLastVisitDate('');
    setCompletions([]);
    setUnlockedAvatars([]);
    setUnlockedBadges([]);
    setActiveAvatar('default');
    setActiveBadge('');
    setActiveRoadmap(null);
    setView('landing');
  };

  // Sidebar link item renderer
  const SidebarItem = ({ icon: Icon, label, target }: { icon: any, label: string, target: typeof view }) => {
    const isSelected = view === target;
    return (
      <div 
        onClick={() => {
          setView(target);
          setIsSidebarOpen(false);
        }}
        className={`p-3.5 rounded-2xl flex items-center gap-3 transition-all duration-200 cursor-pointer ${
          isSelected 
            ? "bg-white text-indigo-700 font-extrabold shadow-md shadow-indigo-950/10" 
            : "text-indigo-100 hover:bg-white/10"
        }`}
      >
        <Icon size={18} />
        <span className="text-sm font-semibold">{label}</span>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {view === 'landing' ? (
        /* Uncluttered static informative Landing Page */
        <LandingView setView={(v) => setView(v as any)} darkMode={darkMode} setDarkMode={setDarkMode} />
      ) : (
        /* Workspace Application Layout */
        <>
          {/* Mobile Overlay backdrop */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Unified Sidebar Nav Panel */}
          <aside className={`fixed inset-y-0 left-0 w-64 bg-indigo-700 dark:bg-indigo-950 flex flex-col text-white shadow-xl z-40 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex flex-shrink-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
            <div 
              onClick={() => {
                setView('landing');
                setIsSidebarOpen(false);
              }}
              className="p-6 border-b border-indigo-500/20 flex items-center justify-between cursor-pointer hover:bg-white/5 transition"
              title="Go to Landing Page"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white dark:bg-indigo-900 rounded-xl flex items-center justify-center shadow-md">
                  <div className="w-5 h-5 bg-indigo-600 rounded-sm rotate-45"></div>
                </div>
                <span className="text-lg font-black tracking-tight">CogniPath</span>
              </div>
              {/* Close button on mobile */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSidebarOpen(false);
                }}
                className="md:hidden p-1.5 rounded-lg hover:bg-white/10 text-indigo-200 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" target="dashboard" />
              <SidebarItem icon={BookOpen} label="My Library" target="library" />
              <SidebarItem icon={Users} label="Leaderboard" target="leaderboard" />
              <SidebarItem icon={BarChart3} label="Analytics" target="analytics" />
              <SidebarItem icon={Trophy} label="Achievement Wall" target="achievement" />
              <SidebarItem icon={User} label="My Profile" target="profile" />
            </nav>

            {/* Sidebar Bottom Profile/Logoff */}
            <div className="p-4 border-t border-indigo-500/20 space-y-2">
              {userName && (
                <div 
                  onClick={() => {
                    setView('profile');
                    setIsSidebarOpen(false);
                  }}
                  className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl cursor-pointer transition border border-white/5 bg-white/5"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${activeAvatar === 'default' ? userName : activeAvatar}`}
                    alt={userName}
                    className="w-9 h-9 rounded-xl bg-white/10 p-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black truncate">{userName}</p>
                    <p className="text-[10px] text-indigo-200 font-mono truncate">{stats.totalEXP} EXP</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setView('landing')}
                className="w-full py-2.5 hover:bg-white/10 rounded-xl flex items-center justify-center gap-2 text-indigo-100 text-xs font-bold transition cursor-pointer"
              >
                <LogOut size={14} />
                <span>Exit Workspace</span>
              </button>
            </div>
          </aside>

          {/* Core App Main Frame */}
          <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
            {/* Standard Uniform Header bar */}
            <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between text-slate-900 dark:text-white flex-shrink-0 gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Mobile Menu Toggle Button */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer flex-shrink-0"
                  title="Open Navigation Menu"
                >
                  <Menu size={18} />
                </button>
                <span className="text-base md:text-xl font-black text-slate-950 dark:text-white tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-indigo-200 bg-clip-text text-transparent truncate">
                  Journey Center
                </span>
              </div>

              {/* Header Right toggles */}
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 sm:p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  title="Toggle Light/Dark Theme"
                >
                  {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                
                {/* Score EXP and Coins status tracker in header */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Daily Learning Streak Badge */}
                  <div 
                    className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-mono text-[10px] sm:text-xs font-bold px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl flex items-center gap-1 shadow-sm hover:scale-105 transition cursor-pointer"
                    title="Your daily learning streak! Complete a chapter every day to grow it."
                  >
                    <span>🔥</span>
                    <span>{streakCount}<span className="hidden sm:inline"> Day{streakCount !== 1 ? 's' : ''}</span><span className="sm:hidden">d</span></span>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-[10px] sm:text-xs font-bold px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl flex items-center gap-1 shadow-sm">
                    <Trophy size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span>{stats.totalEXP}<span className="hidden sm:inline"> EXP</span><span className="sm:hidden"> XP</span></span>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-mono text-[10px] sm:text-xs font-bold px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl flex items-center gap-1 shadow-sm">
                    <Coins className="text-yellow-500 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{stats.coins ?? 0}<span className="hidden sm:inline"> Coins</span></span>
                  </div>
                </div>
              </div>
            </header>

            {/* Dynamic Content Main View Area */}
            <div className="flex-1 p-6 md:p-8">
              <AnimatePresence mode="wait">
                {view === 'dashboard' && (
                  <DashboardView
                    prompt={prompt}
                    setPrompt={setPrompt}
                    generateRoadmap={generateRoadmap}
                    loading={loading}
                    userName={userName}
                    setUserName={setUserName}
                    userAge={userAge}
                    setUserAge={setUserAge}
                  />
                )}

                {view === 'library' && (
                  <LibraryView
                    library={library}
                    onSelectRoadmap={handleSelectRoadmap}
                    onRemoveRoadmap={handleRemoveRoadmap}
                  />
                )}

                {view === 'roadmap' && activeRoadmap && (
                  <RoadmapView
                    roadmap={activeRoadmap}
                    onBack={() => setView('dashboard')}
                    onUpdateRoadmap={handleUpdateRoadmap}
                    onStartQuiz={() => setView('quiz')}
                    onAwardEXP={awardEXP}
                    onCompleteChapter={handleCompleteChapter}
                  />
                )}

                {view === 'quiz' && activeRoadmap && (
                  <QuizView
                    roadmap={activeRoadmap}
                    onCompleteQuiz={handleCompleteQuiz}
                    onBackToRoadmap={() => setView('roadmap')}
                    onNavigate={setView}
                  />
                )}

                {view === 'achievement' && (
                  <AchievementWall
                    certificates={certificates}
                    onRemoveCertificate={handleRemoveCertificate}
                  />
                )}

                {view === 'leaderboard' && (
                  <LeaderboardView
                    userName={userName}
                    totalEXP={stats.totalEXP || 0}
                  />
                )}

                {view === 'profile' && (
                  <ProfileView
                    userName={userName}
                    userAge={userAge}
                    totalEXP={stats.totalEXP || 0}
                    coins={stats.coins ?? 0}
                    unlockedAvatars={unlockedAvatars}
                    unlockedBadges={unlockedBadges}
                    activeAvatar={activeAvatar}
                    activeBadge={activeBadge}
                    onUpdateProfile={handleUpdateProfile}
                    onPurchaseAvatar={handlePurchaseAvatar}
                    onPurchaseBadge={handlePurchaseBadge}
                    onSelectAvatar={handleSelectAvatar}
                    onSelectBadge={handleSelectBadge}
                    onClearAllData={handleClearAllData}
                  />
                )}

                {view === 'analytics' && (
                  <AnalyticsView
                    library={library}
                    certificates={certificates}
                    stats={stats}
                    completions={completions}
                  />
                )}
              </AnimatePresence>
            </div>
          </main>
        </>
      )}

      {/* Daily Reward Notification Toast */}
      <AnimatePresence>
        {dailyRewardNotification && dailyRewardNotification.show && (
          <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pointer-events-none">
            <motion.div
              id="daily_reward_notification_toast"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-slate-950/95 dark:bg-slate-900 border border-yellow-500/30 text-white max-w-md w-full p-5 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto"
            >
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-400 flex-shrink-0 text-2xl">
                🔥
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-sm text-yellow-400">
                  {dailyRewardNotification.type === 'visit' ? 'Daily Check-in Bonus!' : 'Streak Bonus Activated!'}
                </p>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {dailyRewardNotification.message}
                </p>
              </div>
              <button
                onClick={() => setDailyRewardNotification(null)}
                className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg cursor-pointer transition text-white flex-shrink-0"
              >
                Awesome
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modern custom modal error overlay */}
      <AnimatePresence>
        {globalError && (
          <motion.div
            id="global_error_backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div
              id="global_error_card"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-red-500/30 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
              
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    Expedition Warning
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {globalError}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  id="global_error_close_btn"
                  onClick={() => setGlobalError(null)}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition shadow-lg cursor-pointer"
                >
                  Acknowledge
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
