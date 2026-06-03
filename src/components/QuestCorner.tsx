import React, { useState } from 'react';
import { DailyQuest, Sticker } from '../types';
import { getAllStickers } from '../data/stickers';
import { Trophy, HelpCircle, Gift, Sparkles, CheckCircle, RefreshCw, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuestCornerProps {
  questStats: {
    packsOpened: number;
    stickersGlued: number;
    shiniesGlued: number;
    tradesCompleted: number;
  };
  recycleTokens: number;
  userCopies: Record<string, number>;
  userGlued: Record<string, boolean>;
  onRecycleDuplicates: (amountNeeded: number) => void;
  onRewardClaim: (packs: number, tokens: number) => void;
  onFreePackClaim: () => void;
  freePackCooldown: number; // timestamp until next free pack
}

export const QuestCorner: React.FC<QuestCornerProps> = ({
  questStats,
  recycleTokens,
  userCopies,
  userGlued,
  onRecycleDuplicates,
  onRewardClaim,
  onFreePackClaim,
  freePackCooldown
}) => {
  const allStickers = getAllStickers();
  const [claimProgressMsg, setClaimProgressMsg] = useState('');

  // Count total copies of duplicates
  const totalDuplicates = allStickers.reduce((total, s) => {
    const owned = userCopies[s.id] || 0;
    const isGlued = userGlued[s.id] || false;
    const extra = isGlued ? Math.max(0, owned - 1) : Math.max(0, owned);
    return total + extra;
  }, 0);

  // Define Achievements list
  const achievements = [
    {
      id: 'ach_01',
      title: 'First Step',
      description: 'Glue 5 stickers into the album',
      target: 5,
      current: questStats.stickersGlued,
      rewardPacks: 1,
      rewardTokens: 2,
    },
    {
      id: 'ach_02',
      title: 'Master Gluer',
      description: 'Glue 25 stickers into the album',
      target: 25,
      current: questStats.stickersGlued,
      rewardPacks: 3,
      rewardTokens: 4,
    },
    {
      id: 'ach_03',
      title: 'Holographic Visionary',
      description: 'Secure 5 shiny cards on album pages',
      target: 5,
      current: questStats.shiniesGlued,
      rewardPacks: 2,
      rewardTokens: 5,
    },
    {
      id: 'ach_04',
      title: 'Confederation Swapper',
      description: 'Complete 3 trades in the live market',
      target: 3,
      current: questStats.tradesCompleted,
      rewardPacks: 1,
      rewardTokens: 3,
    },
    {
      id: 'ach_05',
      title: 'Messiah Collector',
      description: 'Collect & glue the legendary Lionel Messi! (#20)',
      target: 1,
      current: userGlued['ARG_02'] ? 1 : 0,
      rewardPacks: 4,
      rewardTokens: 8,
    }
  ];

  // Local state to keep track of claimed achievements (simple mock array)
  const [claimedAchs, setClaimedAchs] = useState<string[]>(() => {
    const saved = localStorage.getItem('panini_claimed_achievements');
    return saved ? JSON.parse(saved) : [];
  });

  const handleClaimAchievement = (achId: string, packs: number, tokens: number) => {
    if (claimedAchs.includes(achId)) return;
    
    // Add to claimed lists
    const updated = [...claimedAchs, achId];
    setClaimedAchs(updated);
    localStorage.setItem('panini_claimed_achievements', JSON.stringify(updated));

    // Distribute rewards
    onRewardClaim(packs, tokens);
    
    setClaimProgressMsg(`Claimed reward: +${packs} Pack${packs !== 1 ? 's' : ''}, +${tokens} Recycle Token${tokens !== 1 ? 's' : ''}!`);
    setTimeout(() => setClaimProgressMsg(''), 4000);
  };

  // Recycle duplicates handler
  const handleRecycle = () => {
    // We spend 3 duplicates to get 1 Recycle Token
    if (totalDuplicates < 3) {
      alert("You need at least 3 duplicate stickers to recycle them!");
      return;
    }

    onRecycleDuplicates(3);
    
    setClaimProgressMsg(`Recycled duplicates! Gained +1 Recycle Token.`);
    setTimeout(() => setClaimProgressMsg(''), 3000);
  };

  // Free pack claims countdown rendering
  const now = Date.now();
  const secondsLeft = Math.max(0, Math.floor((freePackCooldown - now) / 1000));
  const canClaimFree = secondsLeft <= 0;

  const formatCooldown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div id="quest-corner-module" className="w-full max-w-5xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* LEFT: Rewards, Cooldowns & Recycler */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 flex flex-col justify-between h-fit space-y-6">
        <div>
          <h2 className="font-sans text-xl font-black text-slate-100 flex items-center gap-2">
            <Gift className="w-5 h-5 text-emerald-500" />
            Daily Rewards Hub
          </h2>
          <p className="font-sans text-xs text-slate-400 mt-1">
            Claim periodic bonuses and recycle duplicates into custom items.
          </p>
        </div>

        {/* Free Pack Claim Row */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-950/40 text-emerald-400 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-black text-slate-200">
                Bonus Booster Pack
              </h4>
              <p className="font-sans text-[11px] text-slate-500">
                Claim a free general booster reward pack.
              </p>
            </div>
          </div>

          <div>
            {canClaimFree ? (
              <button
                id="claim-free-daily-btn"
                onClick={onFreePackClaim}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold rounded-lg shadow-sm border border-emerald-450 cursor-pointer"
              >
                Claim Free Pack
              </button>
            ) : (
              <span className="font-mono text-xs text-slate-550 border border-slate-850 bg-slate-900 px-3 py-1.5 rounded-lg">
                Cooldown: {formatCooldown(secondsLeft)}
              </span>
            )}
          </div>
        </div>

        {/* Duplicate Recycler Row */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-950/40 text-rose-450 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <div>
                <h4 className="font-sans text-xs font-black text-slate-200">
                  Trash & Duplicates Recycler
                </h4>
                <p className="font-sans text-[11px] text-slate-500">
                  Trade in 3 duplicate stickers to craft 1 Recycle Token.
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-850">
                {totalDuplicates} Dups Owned
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-grow bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-850">
              <div 
                className="bg-rose-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, (totalDuplicates / 3) * 100)}%` }}
              />
            </div>
            
            <button
              id="recycle-dups-btn"
              onClick={handleRecycle}
              disabled={totalDuplicates < 3}
              className={`px-4 py-1.5 rounded-lg border font-sans text-[11px] font-bold transition-all cursor-pointer ${
                totalDuplicates >= 3
                  ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 shadow-sm'
                  : 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed'
              }`}
            >
              Recycle
            </button>
          </div>
        </div>

        {/* Global Feedback Notifications inside HUB */}
        <AnimatePresence>
          {claimProgressMsg && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-emerald-950/20 text-emerald-450 text-[11px] border border-emerald-800/30 p-2.5 rounded-lg flex items-center gap-2 font-semibold justify-center text-center"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              {claimProgressMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT: Achievements & Goals Ledger */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 flex flex-col min-h-[400px]">
        <div>
          <h2 className="font-sans text-xl font-black text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Collection Milestones
          </h2>
          <p className="font-sans text-xs text-slate-400 mt-1 mb-4">
            Earn premium booster packs and tokens by completing milestone goals.
          </p>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
          {achievements.map(ach => {
            const isCompleted = ach.current >= ach.target;
            const isClaimed = claimedAchs.includes(ach.id);
            const progressPct = Math.min(100, (ach.current / ach.target) * 100);

            return (
              <div 
                key={ach.id}
                id={`milestone-${ach.id}`}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                  isClaimed
                    ? 'bg-slate-950 border-slate-900 text-slate-600'
                    : isCompleted
                    ? 'bg-amber-950/20 border-amber-800/40 text-amber-300 shadow-md shadow-amber-500/5'
                    : 'bg-slate-950/60 border-slate-850 text-slate-300'
                }`}
              >
                {/* Left: Milestone detail */}
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-sans text-xs font-black ${
                      isClaimed ? 'text-slate-500 line-through' : 'text-slate-200'
                    }`}>
                      {ach.title}
                    </h4>
                    {isClaimed && <span className="text-[9px] uppercase font-mono font-bold text-slate-500">Claimed</span>}
                    {isCompleted && !isClaimed && (
                      <span className="text-[10px] bg-amber-500 text-amber-950 px-1.5 py-0.5 rounded font-mono font-bold animate-pulse">
                        READY!
                      </span>
                    )}
                  </div>
                  
                  <p className="font-sans text-[10px] text-slate-400 mt-0.5 leading-tight">
                    {ach.description}
                  </p>

                  {/* Progress segment if not complete */}
                  {!isCompleted && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-grow bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-850">
                        <div 
                          className="bg-amber-500 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className="font-mono text-[9px] font-bold text-slate-500 opacity-80 shrink-0">
                        {ach.current}/{ach.target}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Reward claim & badge */}
                <div>
                  {isClaimed ? (
                    <CheckCircle className="w-5 h-5 text-slate-600" />
                  ) : isCompleted ? (
                    <button
                      id={`claim-ach-btn-${ach.id}`}
                      onClick={() => handleClaimAchievement(ach.id, ach.rewardPacks, ach.rewardTokens)}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-sans text-[10px] font-black uppercase tracking-wide rounded-lg cursor-pointer transition-all hover:scale-105"
                    >
                      Claim
                    </button>
                  ) : (
                    <div className="flex flex-col items-center justify-center bg-slate-900 border border-slate-850 px-2.5 py-1 rounded-lg min-w-16">
                      <span className="font-mono text-[10px] font-bold text-amber-450 flex items-center gap-0.5">
                        +{ach.rewardPacks}P
                      </span>
                      <span className="font-mono text-[9px] text-emerald-450 flex items-center gap-0.5">
                        +{ach.rewardTokens}T
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};
