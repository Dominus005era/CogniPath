import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Coins, Sparkles, Check, ShoppingBag, Edit3, Award, Info, Trash2, AlertTriangle } from 'lucide-react';
import { sound } from '../lib/sound';

interface ProfileViewProps {
  userName: string;
  userAge: string;
  totalEXP: number;
  coins: number;
  unlockedAvatars: string[];
  unlockedBadges: string[];
  activeAvatar: string;
  activeBadge: string;
  onUpdateProfile: (name: string, age: string) => void;
  onPurchaseAvatar: (seed: string, price: number) => void;
  onPurchaseBadge: (badgeTitle: string, price: number) => void;
  onSelectAvatar: (seed: string) => void;
  onSelectBadge: (badgeTitle: string) => void;
  onClearAllData: () => void;
}

interface StoreItem {
  id: string;
  name: string;
  price: number;
  type: 'avatar' | 'badge';
  value: string; // seed for avatar, title for badge
  description: string;
}

const STORE_ITEMS: StoreItem[] = [
  // Avatars (at least 10 items, all prices >= 10 coins)
  { id: 'av_1', name: 'Mystic Sage', price: 10, type: 'avatar', value: 'Sage', description: 'A legendary master of computational logic.' },
  { id: 'av_2', name: 'Nebula Voyager', price: 15, type: 'avatar', value: 'Voyager', description: 'For cosmic scholars traversing deep data domains.' },
  { id: 'av_3', name: 'Quantum Pioneer', price: 20, type: 'avatar', value: 'Quantum', description: 'Observes multiple computational outcomes simultaneously.' },
  { id: 'av_4', name: 'Cyber Scholar', price: 25, type: 'avatar', value: 'Scholar', description: 'Equipped with neural-link acceleration visors.' },
  { id: 'av_5', name: 'Cognitive Guru', price: 35, type: 'avatar', value: 'Guru', description: 'The absolute pinnacle of educational ascendancy.' },
  { id: 'av_6', name: 'Chrono Sentinel', price: 40, type: 'avatar', value: 'Sentinel', description: 'Guardian of space-time and academic milestones.' },
  { id: 'av_7', name: 'Prism Alchemist', price: 50, type: 'avatar', value: 'Alchemist', description: 'Synthesizes pure light spectrums into critical thinking.' },
  { id: 'av_8', name: 'Void Archmage', price: 60, type: 'avatar', value: 'Archmage', description: 'Harnesses cosmic vacuum code to form logical pathways.' },
  { id: 'av_9', name: 'Solar Pathfinder', price: 75, type: 'avatar', value: 'Pathfinder', description: 'Navigates the solar learning tracks with absolute clarity.' },
  { id: 'av_10', name: 'Infinity Architect', price: 100, type: 'avatar', value: 'Architect', description: 'The legendary creator of infinite logical timelines.' },

  // Badges (at least 10 items, all prices >= 10 coins)
  { id: 'bd_1', name: 'Speed Learner', price: 10, type: 'badge', value: 'Speed Learner', description: 'Demonstrates rapid completion of cognitive tasks.' },
  { id: 'bd_2', name: 'Curiosity Master', price: 12, type: 'badge', value: 'Curiosity Master', description: 'Initiates multiple deep knowledge expeditions.' },
  { id: 'bd_3', name: 'Deep Thinker', price: 18, type: 'badge', value: 'Deep Thinker', description: 'Scores exceptionally high on testing assessments.' },
  { id: 'bd_4', name: 'Academic General', price: 25, type: 'badge', value: 'Academic General', description: 'Commands respect across all active curriculums.' },
  { id: 'bd_5', name: 'Omniscient Mind', price: 40, type: 'badge', value: 'Omniscient Mind', description: 'Exhibits complete knowledge of all subjects.' },
  { id: 'bd_6', name: 'Chrono Scholar', price: 15, type: 'badge', value: 'Chrono Scholar', description: 'Consistently completes learning chapters within hours.' },
  { id: 'bd_7', name: 'Logic Overlord', price: 22, type: 'badge', value: 'Logic Overlord', description: 'Achieves consecutive 100% scores on curriculum milestone tests.' },
  { id: 'bd_8', name: 'Knowledge Monarch', price: 30, type: 'badge', value: 'Knowledge Monarch', description: 'Has conquered multiple roadmaps in the library catalog.' },
  { id: 'bd_9', name: 'Apex Challenger', price: 45, type: 'badge', value: 'Apex Challenger', description: 'Daring scholar who climbs the leaderboard with relentless grit.' },
  { id: 'bd_10', name: 'Zenith Eternal', price: 65, type: 'badge', value: 'Zenith Eternal', description: 'Has achieved supreme mastery across every branch of learning.' },
];

export default function ProfileView({
  userName,
  userAge,
  totalEXP,
  coins,
  unlockedAvatars,
  unlockedBadges,
  activeAvatar,
  activeBadge,
  onUpdateProfile,
  onPurchaseAvatar,
  onPurchaseBadge,
  onSelectAvatar,
  onSelectBadge,
  onClearAllData,
}: ProfileViewProps) {
  const [nameInput, setNameInput] = useState(userName);
  const [ageInput, setAgeInput] = useState(userAge);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'store'>('details');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setErrorMsg("Name cannot be empty.");
      return;
    }
    if (!ageInput.trim() || isNaN(Number(ageInput))) {
      setErrorMsg("Please enter a valid age.");
      return;
    }
    setErrorMsg('');
    onUpdateProfile(nameInput.trim(), ageInput.trim());
    setIsEditing(false);
    showToast("Profile details updated successfully!");
  };

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleBuyItem = (item: StoreItem) => {
    if (coins < item.price) {
      setErrorMsg(`Insufficient coins! You need ${item.price - coins} more gold coins.`);
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    if (item.type === 'avatar') {
      if (unlockedAvatars.includes(item.value)) {
        setErrorMsg("You already own this Avatar!");
        setTimeout(() => setErrorMsg(''), 3000);
        return;
      }
      onPurchaseAvatar(item.value, item.price);
      showToast(`Successfully purchased and unlocked avatar: "${item.name}"!`);
    } else {
      if (unlockedBadges.includes(item.value)) {
        setErrorMsg("You already own this Badge!");
        setTimeout(() => setErrorMsg(''), 3000);
        return;
      }
      onPurchaseBadge(item.value, item.price);
      showToast(`Successfully purchased and unlocked badge: "${item.name}"!`);
    }

    // Play synthesized achievement sound on successful purchase
    sound.playAchievementUnlocked();
  };

  return (
    <div id="profile_view" className="max-w-4xl mx-auto py-8 px-4 relative">
      {/* Dynamic Toasts */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[120] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 text-xs"
          >
            <Check size={16} />
            <span>{successMsg}</span>
          </motion.div>
        )}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[120] bg-rose-600 text-white px-5 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 text-xs"
          >
            <Info size={16} />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Overview Header Card */}
      <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white p-8 rounded-3xl shadow-xl border border-indigo-500/10 mb-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="flex flex-col sm:flex-row items-center gap-6 relative">
          <div className="relative">
            <img
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${activeAvatar === 'default' ? userName : activeAvatar}`}
              alt={userName}
              className="w-24 h-24 rounded-3xl bg-white/10 p-1.5 shadow-lg border border-white/10"
            />
            {activeBadge && (
              <span className="absolute -bottom-2 -right-2 bg-amber-500 text-amber-950 font-bold text-[9px] px-2 py-1 rounded-full border border-stone-900 shadow-md flex items-center gap-1">
                <Award size={10} /> {activeBadge}
              </span>
            )}
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <h3 className="text-2xl font-black tracking-tight">{userName || "Scholar"}</h3>
            <p className="text-indigo-200 text-xs font-semibold">
              Age: {userAge || "18"} years • Rank: Class-A Learner
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <span className="bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-400" />
                {totalEXP} EXP
              </span>
              <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
                <Coins size={12} className="text-yellow-400" />
                {coins} Coins
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <Edit3 size={12} />
            <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
          </button>
        </div>

        {/* Edit profile form inside card */}
        <AnimatePresence>
          {isEditing && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleSaveChanges}
              className="mt-6 pt-6 border-t border-white/10 space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-indigo-300 font-bold">
                    Edit Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs outline-none text-white focus:border-indigo-500"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-indigo-300 font-bold">
                    Edit Your Age
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs outline-none text-white focus:border-indigo-500"
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                Save Profile Changes
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-3.5 px-4 text-xs font-bold transition-all relative cursor-pointer ${
            activeTab === 'details'
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-600"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <User size={14} />
            <span>Inventory & Wardrobe</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('store')}
          className={`pb-3.5 px-4 text-xs font-bold transition-all relative cursor-pointer ${
            activeTab === 'store'
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-600"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <ShoppingBag size={14} />
            <span>Avatar & Badge Store</span>
          </div>
        </button>
      </div>

      {/* Wardrobe (Inventory) Tab */}
      {activeTab === 'details' && (
        <div className="space-y-8">
          {/* Custom alert explaining the 100 EXP jump = 1 Coin rule */}
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/40 p-4 rounded-2xl flex items-start gap-3">
            <Coins size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="text-xs text-yellow-800 dark:text-yellow-300 space-y-0.5">
              <p className="font-extrabold">Cognitive Minting System</p>
              <p>For every <strong>100 EXP</strong> points you accumulate, you are automatically minted <strong>1 gold coin</strong>. Completed chapters award 50 EXP reward points, while passing assessments awards up to 1400 EXP!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* unlocked avatars */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
              <h4 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-1.5">
                <User size={14} className="text-indigo-600" />
                <span>Unlocked Avatars</span>
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {/* Default Avatar (Always available) */}
                <div
                  onClick={() => onSelectAvatar('default')}
                  className={`p-3 rounded-2xl border-2 text-center cursor-pointer transition ${
                    activeAvatar === 'default'
                      ? "border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20"
                      : "border-slate-100 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${userName}`}
                    alt="Default"
                    className="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800"
                  />
                  <span className="text-[10px] font-bold block mt-1 text-slate-700 dark:text-slate-300">Default</span>
                </div>

                {unlockedAvatars.map((seed) => (
                  <div
                    key={seed}
                    onClick={() => onSelectAvatar(seed)}
                    className={`p-3 rounded-2xl border-2 text-center cursor-pointer transition ${
                      activeAvatar === seed
                        ? "border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20"
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`}
                      alt={seed}
                      className="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800"
                    />
                    <span className="text-[10px] font-bold block mt-1 text-slate-700 dark:text-slate-300">{seed}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* unlocked badges */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
              <h4 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-1.5">
                <Shield size={14} className="text-indigo-600" />
                <span>Equipped Badges</span>
              </h4>

              {unlockedBadges.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No custom badges unlocked yet. Visit the Store tab to unlock badges!
                </div>
              ) : (
                <div className="space-y-2">
                  {/* None selection */}
                  <div
                    onClick={() => onSelectBadge('')}
                    className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                      activeBadge === ''
                        ? "border-indigo-600 bg-indigo-50/10 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400"
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                    }`}
                  >
                    <span>No Badge Equipped</span>
                    {activeBadge === '' && <Check size={14} />}
                  </div>

                  {unlockedBadges.map((badge) => (
                    <div
                      key={badge}
                      onClick={() => onSelectBadge(badge)}
                      className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition flex items-center justify-between ${
                        activeBadge === badge
                          ? "border-indigo-600 bg-indigo-50/10 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400"
                          : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Award size={14} className="text-amber-500" />
                        {badge}
                      </span>
                      {activeBadge === badge && <Check size={14} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Store Tab */}
      {activeTab === 'store' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black text-slate-950 dark:text-white">
              Cognitive Expansion Store
            </h4>
            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
              <Coins size={14} />
              <span>{coins} COINS AVAILABLE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avatar products */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Exclusive Avatars
              </h5>
              <div className="space-y-3">
                {STORE_ITEMS.filter(i => i.type === 'avatar').map(item => {
                  const isOwned = unlockedAvatars.includes(item.value);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm border transition ${
                        isOwned 
                          ? "bg-slate-50/60 dark:bg-slate-950/25 border-slate-100 dark:border-slate-800/60 opacity-80" 
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${item.value}`}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 p-1"
                        />
                        <div>
                          <h6 className="text-xs font-extrabold text-slate-900 dark:text-white">{item.name}</h6>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.description}</p>
                        </div>
                      </div>

                      {isOwned ? (
                        <button
                          disabled
                          id={`purchase_btn_${item.id}`}
                          className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-not-allowed border border-slate-200/50 dark:border-slate-700/50"
                        >
                          <Check size={12} className="text-emerald-500" />
                          <span>Purchased</span>
                        </button>
                      ) : (
                        <button
                          id={`purchase_btn_${item.id}`}
                          onClick={() => handleBuyItem(item)}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Coins size={12} className="text-yellow-300" />
                          <span>{item.price}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Badge products */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Reputation Badges
              </h5>
              <div className="space-y-3">
                {STORE_ITEMS.filter(i => i.type === 'badge').map(item => {
                  const isOwned = unlockedBadges.includes(item.value);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm border transition ${
                        isOwned 
                          ? "bg-slate-50/60 dark:bg-slate-950/25 border-slate-100 dark:border-slate-800/60 opacity-80" 
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                          <Award size={20} />
                        </div>
                        <div>
                          <h6 className="text-xs font-extrabold text-slate-900 dark:text-white">{item.name}</h6>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.description}</p>
                        </div>
                      </div>

                      {isOwned ? (
                        <button
                          disabled
                          id={`purchase_btn_${item.id}`}
                          className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-not-allowed border border-slate-200/50 dark:border-slate-700/50"
                        >
                          <Check size={12} className="text-emerald-500" />
                          <span>Purchased</span>
                        </button>
                      ) : (
                        <button
                          id={`purchase_btn_${item.id}`}
                          onClick={() => handleBuyItem(item)}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Coins size={12} className="text-yellow-300" />
                          <span>{item.price}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Danger Zone ── */}
      <div className="mt-10 border border-red-200 dark:border-red-900/50 rounded-3xl overflow-hidden">
        <div className="bg-red-50 dark:bg-red-950/20 px-6 py-4 flex items-center gap-3 border-b border-red-200 dark:border-red-900/50">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-red-700 dark:text-red-400 text-sm">Danger Zone</h3>
            <p className="text-xs text-red-500 dark:text-red-500">These actions are permanent and cannot be undone.</p>
          </div>
        </div>
        <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Clear All Platform Data</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Deletes all your journeys, certificates, progress, stats, coins, and streaks. Your account is reset to zero.
            </p>
          </div>
          <button
            id="clear_all_data_btn"
            onClick={() => setShowClearConfirm(true)}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-red-500/20 cursor-pointer"
          >
            <Trash2 size={14} />
            Clear All Data
          </button>
        </div>
      </div>

      {/* ── Clear All Confirmation Modal ── */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-red-200 dark:border-red-900/50 max-w-md w-full overflow-hidden"
            >
              {/* Red top bar */}
              <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500 w-full" />

              <div className="p-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center flex-shrink-0">
                    <Trash2 size={26} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Are you absolutely sure?</h3>
                    <p className="text-xs text-slate-500 mt-0.5">This action is irreversible.</p>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-4 mb-6">
                  <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
                    The following will be <strong>permanently deleted</strong>:
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-red-600 dark:text-red-400">
                    <li>• All learning journeys &amp; roadmaps</li>
                    <li>• All earned certificates</li>
                    <li>• All EXP, coins, and streaks</li>
                    <li>• All chapter progress and chat history</li>
                    <li>• Your profile name and age</li>
                    <li>• All purchased avatars and badges</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="confirm_clear_all_btn"
                    onClick={() => {
                      setShowClearConfirm(false);
                      onClearAllData();
                    }}
                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    Yes, Delete Everything
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
