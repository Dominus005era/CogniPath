import { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, ArrowUp, Sparkles, User, Search, Flame } from 'lucide-react';

interface LeaderboardViewProps {
  userName: string;
  totalEXP: number;
}

interface LeaderboardEntry {
  rank?: number;
  name: string;
  exp: number;
  avatarSeed: string;
  isUser?: boolean;
}

// Pre-generated 50 top learners
const baseMockUsers: LeaderboardEntry[] = [
  // Top 10: Elite Scholars (Extremely wide gaps, simulating 6+ months of hard climb to rank 1)
  { name: "Alexander Wright", exp: 1100000, avatarSeed: "Alex" },
  { name: "Siddharth Sharma", exp: 900000, avatarSeed: "Sid" },
  { name: "Elena Rostova", exp: 740000, avatarSeed: "Elena" },
  { name: "Marcus Aurelius", exp: 610000, avatarSeed: "Marcus" },
  { name: "Yuki Tanaka", exp: 500000, avatarSeed: "Yuki" },
  { name: "Zainab Al-Farsi", exp: 410000, avatarSeed: "Zain" },
  { name: "Oliver Bennett", exp: 340000, avatarSeed: "Oliver" },
  { name: "Aisha Diallo", exp: 285000, avatarSeed: "Aisha" },
  { name: "Mateo Silva", exp: 240000, avatarSeed: "Mateo" },
  { name: "Sophia Martinez", exp: 205000, avatarSeed: "Sophia" },

  // Ranks 11-20: Dedicated Experts (Gaps of 10k to 23k)
  { name: "Liam O'Connor", exp: 175100, avatarSeed: "Liam" },
  { name: "Chloe Dupont", exp: 152100, avatarSeed: "Chloe" },
  { name: "Lucas Novak", exp: 132100, avatarSeed: "Lucas" },
  { name: "Hannah Abbott", exp: 114100, avatarSeed: "Hannah" },
  { name: "Arjun Mehta", exp: 98100, avatarSeed: "Arjun" },
  { name: "Isabella Rossi", exp: 84100, avatarSeed: "Bella" },
  { name: "Ji-Woo Park", exp: 72100, avatarSeed: "Park" },
  { name: "Gabriel Dubois", exp: 62100, avatarSeed: "Gabe" },
  { name: "Emma Watson", exp: 53100, avatarSeed: "Emma" },
  { name: "Nathan Drake", exp: 45100, avatarSeed: "Nathan" },

  // Ranks 21-30: Active Journeyers (Gaps of 1.2k to 7k)
  { name: "Seraphina Vance", exp: 38100, avatarSeed: "Sera" },
  { name: "Kofi Mensah", exp: 32100, avatarSeed: "Kofi" },
  { name: "Maya Angelou", exp: 27100, avatarSeed: "Maya" },
  { name: "Arthur Pendragon", exp: 23100, avatarSeed: "Arthur" },
  { name: "Freja Nielsen", exp: 19600, avatarSeed: "Freja" },
  { name: "Diego Rivera", exp: 16600, avatarSeed: "Diego" },
  { name: "Chen Wei", exp: 14100, avatarSeed: "Chen" },
  { name: "Zara Larsson", exp: 12100, avatarSeed: "Zara" },
  { name: "Ryan Reynolds", exp: 10600, avatarSeed: "Ryan" },
  { name: "Lila Ibrahim", exp: 9400, avatarSeed: "Lila" },

  // Ranks 31-40: Regular Learners (Gaps of 300 to 1000)
  { name: "Nils Holgersson", exp: 8400, avatarSeed: "Nils" },
  { name: "Kenji Sato", exp: 7500, avatarSeed: "Kenji" },
  { name: "Sasha Grey", exp: 6700, avatarSeed: "Sasha" },
  { name: "Priya Patel", exp: 6000, avatarSeed: "Priya" },
  { name: "Omar Sy", exp: 5400, avatarSeed: "Omar" },
  { name: "Nadia Comaneci", exp: 4900, avatarSeed: "Nadia" },
  { name: "Leo Tolstoy", exp: 4450, avatarSeed: "Leo" },
  { name: "Amelia Earhart", exp: 4050, avatarSeed: "Amelia" },
  { name: "Viktor Frankl", exp: 3700, avatarSeed: "Viktor" },
  { name: "Fatima Khan", exp: 3400, avatarSeed: "Fatima" },

  // Ranks 41-50: Early Users (Gaps are intentionally tiny - 100 to 280 EXP so early climbs are fast & satisfying)
  { name: "Sven Lindqvist", exp: 3120, avatarSeed: "Sven" },
  { name: "Mei Ling", exp: 2860, avatarSeed: "Mei" },
  { name: "Rajesh Koothra", exp: 2620, avatarSeed: "Rajesh" },
  { name: "Carlos Santana", exp: 2400, avatarSeed: "Carlos" },
  { name: "Aline Weber", exp: 2200, avatarSeed: "Aline" },
  { name: "Devid Miller", exp: 2020, avatarSeed: "Devid" },
  { name: "Yusuf Demir", exp: 1860, avatarSeed: "Yusuf" },
  { name: "Evelyn Reed", exp: 1720, avatarSeed: "Evelyn" },
  { name: "Hiroshi Tanaka", exp: 1600, avatarSeed: "Hiroshi" },
  { name: "Siddharth Roy", exp: 1500, avatarSeed: "SiddRoy" },
];

export default function LeaderboardView({ userName, totalEXP }: LeaderboardViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Assemble dynamic board with current user included and sorted
  const dynamicEntries: LeaderboardEntry[] = [
    ...baseMockUsers,
    {
      name: userName || "Scholar",
      exp: totalEXP,
      avatarSeed: userName || "Scholar",
      isUser: true,
    }
  ]
    .sort((a, b) => b.exp - a.exp)
    .map((user, idx) => ({
      ...user,
      rank: idx + 1,
    }));

  const userRankEntry = dynamicEntries.find(entry => entry.isUser);
  const userRank = userRankEntry?.rank || 51;

  // Calculate ranks to climb
  const nextTargetUser = userRank > 1 ? dynamicEntries[userRank - 2] : null;
  const expToNext = nextTargetUser ? nextTargetUser.exp - totalEXP : 0;

  const filteredEntries = dynamicEntries.filter(entry =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="leaderboard_view" className="max-w-4xl mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">
            Global Rankings
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Hall of Scholars
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare your learning accomplishments with students worldwide.
          </p>
        </div>

        {/* User Rank Display Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-5 rounded-3xl shadow-lg flex items-center justify-between gap-6 self-start md:self-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-200">
              Your Current Rank
            </span>
            <h4 className="text-2xl font-black">Rank #{userRank}</h4>
            <p className="text-xs text-indigo-100 flex items-center gap-1">
              <Sparkles size={12} className="text-yellow-300" />
              <span>{totalEXP} Total EXP</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center font-bold text-xl relative">
            🏆
          </div>
        </div>
      </div>

      {/* Climb Motivation Banner */}
      {userRank > 1 && nextTargetUser && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <ArrowUp size={20} className="animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                You are climbing the leaderboard!
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Gain <strong className="text-amber-600 dark:text-amber-400">{expToNext} EXP</strong> to overtake <strong className="text-indigo-600 dark:text-indigo-400">{nextTargetUser.name}</strong> (Rank #{nextTargetUser.rank}).
              </p>
            </div>
          </div>
          <div className="text-xs font-mono font-black text-amber-700 dark:text-amber-400 flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <Flame size={12} className="text-amber-500" />
            <span>TOP RANK REQUIRES ~6 MONTHS TRAINING</span>
          </div>
        </motion.div>
      )}

      {/* Table & Filtering */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {/* Search Input */}
        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search scholar name..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            Showing {filteredEntries.length} of 51 Scholars
          </div>
        </div>

        {/* Scrollable Rankings List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[550px] overflow-y-auto">
          {filteredEntries.map((user) => {
            const isTop3 = user.rank && user.rank <= 3;
            const rankBg = user.rank === 1 
              ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" 
              : user.rank === 2 
              ? "bg-slate-300/25 text-slate-500 dark:text-slate-300" 
              : user.rank === 3 
              ? "bg-amber-600/10 text-amber-700 dark:text-amber-500" 
              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400";

            return (
              <div
                key={`${user.rank}-${user.name}`}
                className={`flex items-center justify-between py-4 px-6 transition duration-200 ${
                  user.isUser 
                    ? "bg-indigo-50/50 dark:bg-indigo-950/20 font-bold border-l-4 border-l-indigo-600" 
                    : "hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                }`}
              >
                {/* Left: Rank, Avatar, Name */}
                <div className="flex items-center gap-4">
                  {/* Rank indicator */}
                  <div className={`w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center ${rankBg}`}>
                    {isTop3 ? (
                      <Medal size={14} />
                    ) : (
                      <span>{user.rank}</span>
                    )}
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.avatarSeed}`}
                      alt={user.name}
                      className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm ${user.isUser ? "text-indigo-700 dark:text-indigo-400 font-extrabold" : "text-slate-900 dark:text-white font-semibold"}`}>
                          {user.name}
                        </span>
                        {user.isUser && (
                          <span className="text-[9px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-mono uppercase font-black">
                            You
                          </span>
                        )}
                        {user.rank && user.rank <= 5 && (
                          <span className="text-[9px] bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full font-mono font-bold">
                            Elite
                          </span>
                        )}
                      </div>
                      {/* Subtitle for early fast climb feedback */}
                      {user.rank && user.rank >= 40 && user.rank <= 50 && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                          Fast Climb Zone (+250 difference)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: EXP value */}
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm font-mono font-black text-slate-800 dark:text-slate-200">
                    {user.exp.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">EXP</span>
                </div>
              </div>
            );
          })}

          {filteredEntries.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No matching scholars found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
