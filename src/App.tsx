import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Sticker } from './types';
import { getAllStickers } from './data/stickers';
import { AlbumGrid } from './components/AlbumGrid';
import { ErrorBoundary } from './components/ErrorBoundary';
import { computeCollectionStats } from './utils/collection';
import { BookOpen, Package, Globe2, Trophy, Award, Trash2, Shield, RefreshCcw, Sparkles, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Code-split/Lazy load secondary tabs (keeps initial load ultra-light)
const PackOpener = lazy(() => import('./components/PackOpener').then(m => ({ default: m.PackOpener })));
const TradeMarket = lazy(() => import('./components/TradeMarket').then(m => ({ default: m.TradeMarket })));
const BookConnector = lazy(() => import('./components/BookConnector').then(m => ({ default: m.BookConnector })));
const QuestCorner = lazy(() => import('./components/QuestCorner').then(m => ({ default: m.QuestCorner })));

const TabLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[350px] text-slate-500 py-10">
    <RefreshCcw className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
    <span className="font-mono text-xs uppercase tracking-widest text-slate-450 animate-pulse">
      Synchronizing Ledger...
    </span>
  </div>
);

export default function App() {
  const allStickers = getAllStickers();

  // --- PERSISTENT STATE LOADING ---
  const [userCopies, setUserCopies] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('panini26_user_copies');
    return saved ? JSON.parse(saved) : {};
  });

  const [userGlued, setUserGlued] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('panini26_user_glued');
    return saved ? JSON.parse(saved) : {};
  });

  const [recycleTokens, setRecycleTokens] = useState<number>(() => {
    const saved = localStorage.getItem('panini26_recycle_tokens');
    return saved ? parseInt(saved, 10) : 10; // Start with 10 tokens to allow testing regional/shiny packs immediately!
  });

  const [packsOpened, setPacksOpened] = useState<number>(() => {
    const saved = localStorage.getItem('panini26_packs_opened');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [tradesCompleted, setTradesCompleted] = useState<number>(() => {
    const saved = localStorage.getItem('panini26_trades_completed');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [freePackCooldown, setFreePackCooldown] = useState<number>(() => {
    const saved = localStorage.getItem('panini26_free_pack_cooldown');
    return saved ? parseInt(saved, 10) : Date.now();
  });

  const [activeTab, setActiveTab] = useState<'album' | 'booster' | 'traders' | 'companion' | 'quests'>('album');
  const [isNewUser, setIsNewUser] = useState(() => Object.keys(userCopies).length === 0);

  // --- SAVE STATE TO LOCAL STORAGE ---
  useEffect(() => {
    localStorage.setItem('panini26_user_copies', JSON.stringify(userCopies));
  }, [userCopies]);

  useEffect(() => {
    localStorage.setItem('panini26_user_glued', JSON.stringify(userGlued));
  }, [userGlued]);

  useEffect(() => {
    localStorage.setItem('panini26_recycle_tokens', recycleTokens.toString());
  }, [recycleTokens]);

  useEffect(() => {
    localStorage.setItem('panini26_packs_opened', packsOpened.toString());
  }, [packsOpened]);

  useEffect(() => {
    localStorage.setItem('panini26_trades_completed', tradesCompleted.toString());
  }, [tradesCompleted]);

  useEffect(() => {
    localStorage.setItem('panini26_free_pack_cooldown', freePackCooldown.toString());
  }, [freePackCooldown]);

  // --- STATS COMPUTING (Optimized single pass) ---
  const stats = computeCollectionStats(allStickers, userCopies, userGlued);
  
  const uniqueStickersOwnedCount = stats.uniqueOwnedCount;
  const totalStickersGluedCount = stats.gluedCount;
  const totalShiniesGluedCount = stats.shiniesGlued;
  const completionPercentage = stats.completionPercentage;
  const totalDuplicates = stats.duplicatesCount;

  // --- STATE ACTION COOLDOWNS & HANDLERS ---
  
  // Claim Starter Packs (3 packs)
  const handleClaimStarterPacks = useCallback(() => {
    setUserCopies(prev => {
      const baseCopies = { ...prev };
      const initialPacksCount = 3;
      for (let p = 0; p < initialPacksCount; p++) {
        // Pick 5 random stickers per pack
        const available = [...allStickers];
        for (let i = 0; i < 5; i++) {
          const rIdx = Math.floor(Math.random() * available.length);
          const card = available[rIdx];
          baseCopies[card.id] = (baseCopies[card.id] || 0) + 1;
          available.splice(rIdx, 1);
        }
      }
      return baseCopies;
    });

    setPacksOpened(prev => prev + 3);
    setIsNewUser(false);
  }, [allStickers]);

  // Glue individual sticker to album
  const handleGlueSticker = useCallback((id: string) => {
    setUserGlued(prev => {
      if (prev[id]) return prev; // already glued
      return {
        ...prev,
        [id]: true
      };
    });
  }, []);

  // Glue all available owned counters for a team
  const handleGlueAllTeam = useCallback((teamCode: string) => {
    setUserGlued(prev => {
      const updated = { ...prev };
      let changed = false;
      allStickers.forEach(s => {
        if (s.teamCode === teamCode) {
          const owned = userCopies[s.id] || 0;
          if (owned > 0 && !updated[s.id]) {
            updated[s.id] = true;
            changed = true;
          }
        }
      });
      return changed ? updated : prev;
    });
  }, [allStickers, userCopies]);

  // Spend tokens
  const handleSpendTokens = useCallback((amount: number): boolean => {
    let success = false;
    setRecycleTokens(prev => {
      if (prev < amount) {
        success = false;
        return prev;
      }
      success = true;
      return prev - amount;
    });
    return success;
  }, []);

  // When stickers are drawn from a pack
  const handleStickersOpened = useCallback((stickers: Sticker[]) => {
    setUserCopies(prev => {
      const updated = { ...prev };
      stickers.forEach(s => {
        updated[s.id] = (updated[s.id] || 0) + 1;
      });
      return updated;
    });
    setPacksOpened(prev => prev + 1);
  }, []);

  // Execute trade
  const handleExecuteTrade = useCallback((offeredId: string, requestedId: string) => {
    setUserCopies(prev => {
      const updated = { ...prev };
      // User loses requestedId (because another collector wanted it)
      if (updated[requestedId] > 0) {
        updated[requestedId] = updated[requestedId] - 1;
      }
      // User gains offeredId (because other collector offers it)
      updated[offeredId] = (updated[offeredId] || 0) + 1;
      return updated;
    });

    setTradesCompleted(prev => prev + 1);
  }, []);

  // Recycle duplicates
  const handleRecycleDuplicates = useCallback((amountSpend: number) => {
    setUserCopies(prev => {
      const updated = { ...prev };
      let reducedCount = 0;

      for (const st of allStickers) {
        const copies = updated[st.id] || 0;
        const isGlued = userGlued[st.id] || false;
        const dups = isGlued ? Math.max(0, copies - 1) : Math.max(0, copies);

        if (dups > 0) {
          const spendFromThis = Math.min(dups, amountSpend - reducedCount);
          updated[st.id] = copies - spendFromThis;
          reducedCount += spendFromThis;
        }

        if (reducedCount >= amountSpend) break;
      }

      return updated;
    });

    setRecycleTokens(prev => prev + 1);
  }, [allStickers, userGlued]);

  // Buy SPECIFIC player sticker from Token player Bazaar
  const handleBuyStickerFromBazaar = useCallback((stickerId: string, tokenCost: number) => {
    setRecycleTokens(prev => {
      if (prev < tokenCost) return prev;
      setUserCopies(cPrev => ({
        ...cPrev,
        [stickerId]: (cPrev[stickerId] || 0) + 1
      }));
      return prev - tokenCost;
    });
  }, []);

  // SELL specific duplicate sticker directly for tokens reward
  const handleSellStickerForTokens = useCallback((stickerId: string, tokenReward: number) => {
    setUserCopies(prev => {
      const owned = prev[stickerId] || 0;
      if (owned <= 1) return prev; // must be a duplicate

      setRecycleTokens(rPrev => rPrev + tokenReward);
      return {
        ...prev,
        [stickerId]: owned - 1
      };
    });
  }, []);

  // Import companion passport code to link, sync state with friends
  const handleImportState = useCallback((decodedJsonStr: string) => {
    try {
      const parsed = JSON.parse(decodedJsonStr);
      if (parsed.g && parsed.c) {
        // Merge glued list
        setUserGlued(prev => {
          const merged = { ...prev };
          parsed.g.forEach((k: string) => {
            merged[k] = true;
          });
          return merged;
        });

        // Merge duplicates pool so they have access to friends' extra copies for swaps
        setUserCopies(prev => {
          const merged = { ...prev };
          Object.keys(parsed.c).forEach(k => {
            if (parsed.c[k] > (prev[k] || 0)) {
              merged[k] = parsed.c[k];
            }
          });
          return merged;
        });

        // Grant slight sync token bonus!
        setRecycleTokens(prev => prev + 3);
      }
    } catch (err) {
      console.error("Link integration failure", err);
    }
  }, []);

  // Claim achievement rewards
  const handleRewardClaim = useCallback((packs: number, tokens: number) => {
    setRecycleTokens(prev => prev + tokens);
    
    // Auto populate random packs
    setUserCopies(prev => {
      const updated = { ...prev };
      for (let p = 0; p < packs; p++) {
        const available = [...allStickers];
        for (let i = 0; i < 5; i++) {
          const rIdx = Math.floor(Math.random() * available.length);
          const st = available[rIdx];
          updated[st.id] = (updated[st.id] || 0) + 1;
          available.splice(rIdx, 1);
        }
      }
      return updated;
    });
    setPacksOpened(prev => prev + packs);
  }, [allStickers]);

  // Free pack claims
  const handleFreePackClaim = useCallback(() => {
    // Grant pack instantly
    setUserCopies(prev => {
      const updated = { ...prev };
      const available = [...allStickers];
      for (let i = 0; i < 5; i++) {
        const rIdx = Math.floor(Math.random() * available.length);
        const card = available[rIdx];
        updated[card.id] = (updated[card.id] || 0) + 1;
        available.splice(rIdx, 1);
      }
      return updated;
    });

    setPacksOpened(prev => prev + 1);
    
    // Cooldown is 30 seconds for quick engagement and showcase inside builder
    setFreePackCooldown(Date.now() + 30000);
  }, [allStickers]);

  // Reset entire collection
  const handleForceReset = useCallback(() => {
    if (confirm("Are you absolutely sure you want to reset your entire digital sticker collection? This will delete all collected stickers, duplicates, and milestones.")) {
      setUserCopies({});
      setUserGlued({});
      setRecycleTokens(10);
      setPacksOpened(0);
      setTradesCompleted(0);
      setFreePackCooldown(Date.now());
      setIsNewUser(true);
      setActiveTab('album');
      localStorage.removeItem('panini_claimed_achievements');
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none selection:bg-emerald-500/30 selection:text-emerald-250 print:bg-white print:text-black">
      
      {/* HEADER BANNER */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center border border-yellow-250 shadow-md">
              <Shield className="w-5 h-5 text-black animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-sans text-lg font-black tracking-tight text-white">
                  Panini World Cup 2026
                </h1>
                <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-mono font-bold uppercase leading-none">
                  Digital Sticker Tracker
                </span>
              </div>
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                Co-Hosted by USA • MEX • CAN
              </p>
            </div>
          </div>

          {/* Core Applet Statistics Bar */}
          <div className="flex items-center gap-4 bg-slate-900/50 p-2.5 px-4 rounded-xl border border-slate-850">
            <div className="text-center min-w-[70px]">
              <span className="font-mono text-xs text-slate-550 block">ALBUM</span>
              <p className="font-mono text-sm font-black text-slate-100">
                {totalStickersGluedCount} / {allStickers.length}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-805" />
            
            <div className="text-center min-w-[50px]">
              <span className="font-mono text-xs text-slate-550 block">SHINIES</span>
              <p className="font-mono text-sm font-black text-yellow-400 flex items-center justify-center gap-0.5">
                <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                {totalShiniesGluedCount}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-805" />

            <div className="text-center min-w-[45px]">
              <span className="font-mono text-xs text-slate-550 block">SWAP</span>
              <p className="font-mono text-sm font-black text-rose-450">
                {totalDuplicates}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-805" />

            <div className="text-center min-w-[50px]">
              <span className="font-mono text-xs text-slate-550 block">TOKENS</span>
              <p className="font-mono text-sm font-black text-emerald-450">
                {recycleTokens}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* NEW USER STARTER ONBOARDING DIALOGUE */}
      <AnimatePresence>
        {isNewUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto px-4 mt-6 w-full print:hidden"
          >
            <div className="bg-gradient-to-r from-emerald-990 via-emerald-950 to-lime-950/10 border-2 border-emerald-500/20 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-lg">
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full" />
              
              <div className="z-10 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span className="font-sans text-xs font-black uppercase text-emerald-400 tracking-wider">
                    Welcome Package Included
                  </span>
                </div>
                <h3 className="font-sans text-2xl font-black text-slate-100 tracking-tight">
                  Start Your Official 2026 Collection!
                </h3>
                <p className="font-sans text-slate-350 text-sm mt-1 leading-relaxed max-w-xl">
                  Get your collection off the ground with 3 free general booster packs (15 random cards)! Claim them, glue star players to the pages, and start trading now.
                </p>
              </div>

              <button
                id="claim-starter-packs-btn"
                onClick={handleClaimStarterPacks}
                className="z-10 w-full md:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02] text-white font-sans text-sm font-bold rounded-xl shadow-lg border border-emerald-400 cursor-pointer transition-all shrink-0 font-bold"
              >
                Claim 3 Starter Packs
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE STATS OVERVIEW BENTO */}
      <div className="max-w-7xl mx-auto px-4 mt-6 w-full grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden">
        {/* Dynamic overall ProgressBar */}
        <div className="md:col-span-2 bg-slate-900/55 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest">
                Overall Book Completion
              </span>
              <span className="font-mono text-sm font-black text-emerald-450 font-extrabold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-850">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full transition-all duration-700 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <p className="font-sans text-[11px] text-slate-500 mt-2.5">
            Collect, glue, and trade cards to complete all 12 confederation teams before kick-off!
          </p>
        </div>

        {/* Unique owned count */}
        <div className="bg-slate-900/55 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
          <span className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest">
            Uniquely Discovered
          </span>
          <div className="mt-2">
            <h4 className="font-mono text-2xl font-black text-slate-100">
              {uniqueStickersOwnedCount} <span className="text-xs font-normal text-slate-550">/ {allStickers.length}</span>
            </h4>
          </div>
          <p className="font-sans text-[11px] text-slate-500 mt-1">
            Different stickers located across booster pulls.
          </p>
        </div>

        {/* Total pack opened metric */}
        <div className="bg-slate-900/55 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
          <span className="font-sans text-xs font-bold text-slate-300 uppercase tracking-widest">
            Booster Openings
          </span>
          <div className="mt-2">
            <h4 className="font-mono text-2xl font-black text-slate-100 flex items-center gap-1.5">
              {packsOpened}
              <span className="text-xs font-normal text-slate-550">total packs</span>
            </h4>
          </div>
          <p className="font-sans text-[11px] text-slate-500 mt-1">
            Opening boosters earns Recycling Tokens!
          </p>
        </div>
      </div>

      {/* TAB NAVIGATION PANEL */}
      <nav id="app-navigation-bar" className="max-w-7xl mx-auto px-4 mt-6 w-full flex border-b border-slate-900 print:hidden" role="tablist">
        <div className="flex gap-1 overflow-x-auto select-none no-scrollbar pb-px">
          {/* TAB 1: Visual Album Book */}
          <button
            id="tab-album-btn"
            role="tab"
            aria-selected={activeTab === 'album'}
            onClick={() => setActiveTab('album')}
            className={`flex items-center gap-2 px-5 py-3 font-sans text-sm font-bold border-b-2 cursor-pointer transition-all shrink-0 ${
              activeTab === 'album'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/30'
                : 'border-transparent text-slate-400 hover:text-slate-205 hover:bg-slate-900/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Album Book & Posters
          </button>

          {/* TAB 2: Foil Wrapper Opener */}
          <button
            id="tab-booster-btn"
            role="tab"
            aria-selected={activeTab === 'booster'}
            onClick={() => setActiveTab('booster')}
            className={`flex items-center gap-2 px-5 py-3 font-sans text-sm font-bold border-b-2 cursor-pointer transition-all shrink-0 ${
              activeTab === 'booster'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/30'
                : 'border-transparent text-slate-400 hover:text-slate-205 hover:bg-slate-900/10'
            }`}
          >
            <Package className="w-4 h-4" />
            Booster Store
          </button>

          {/* TAB 3: Global Swap Traders */}
          <button
            id="tab-traders-btn"
            role="tab"
            aria-selected={activeTab === 'traders'}
            onClick={() => setActiveTab('traders')}
            className={`flex items-center gap-2 px-5 py-3 font-sans text-sm font-bold border-b-2 cursor-pointer transition-all shrink-0 ${
              activeTab === 'traders'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/30'
                : 'border-transparent text-slate-400 hover:text-slate-205 hover:bg-slate-900/10'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            Tokens & Trading
          </button>

          {/* TAB 4: Companion Sync Code */}
          <button
            id="tab-companion-btn"
            role="tab"
            aria-selected={activeTab === 'companion'}
            onClick={() => setActiveTab('companion')}
            className={`flex items-center gap-2 px-5 py-3 font-sans text-sm font-bold border-b-2 cursor-pointer transition-all shrink-0 ${
              activeTab === 'companion'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/30'
                : 'border-transparent text-slate-400 hover:text-slate-205 hover:bg-slate-900/10'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Digital Sync Guide
          </button>

          {/* TAB 5: Quests Corner */}
          <button
            id="tab-quests-btn"
            role="tab"
            aria-selected={activeTab === 'quests'}
            onClick={() => setActiveTab('quests')}
            className={`flex items-center gap-2 px-5 py-3 font-sans text-sm font-bold border-b-2 cursor-pointer transition-all shrink-0 ${
              activeTab === 'quests'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/30'
                : 'border-transparent text-slate-400 hover:text-slate-205 hover:bg-slate-900/10'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Milestones & Quests
          </button>
        </div>
      </nav>

      {/* DYNAMIC VIEW CONTAINER */}
      <main className="flex-grow py-4 print:py-0">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            {activeTab === 'album' && (
              <motion.div
                key="view-album"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AlbumGrid
                  userCopies={userCopies}
                  userGlued={userGlued}
                  onGlueSticker={handleGlueSticker}
                  onGlueAllTeam={handleGlueAllTeam}
                />
              </motion.div>
            )}

            {activeTab === 'booster' && (
              <motion.div
                key="view-booster"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Suspense fallback={<TabLoadingFallback />}>
                  <PackOpener
                    onStickersOpened={handleStickersOpened}
                    recycleTokens={recycleTokens}
                    onSpendTokens={handleSpendTokens}
                  />
                </Suspense>
              </motion.div>
            )}

            {activeTab === 'traders' && (
              <motion.div
                key="view-traders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Suspense fallback={<TabLoadingFallback />}>
                  <TradeMarket
                    userCopies={userCopies}
                    userGlued={userGlued}
                    onExecuteTrade={handleExecuteTrade}
                    recycleTokens={recycleTokens}
                    onBuyStickerFromBazaar={handleBuyStickerFromBazaar}
                    onSellStickerForTokens={handleSellStickerForTokens}
                  />
                </Suspense>
              </motion.div>
            )}

            {activeTab === 'companion' && (
              <motion.div
                key="view-companion"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Suspense fallback={<TabLoadingFallback />}>
                  <BookConnector
                    userCopies={userCopies}
                    userGlued={userGlued}
                    recycleTokens={recycleTokens}
                    onImportState={handleImportState}
                  />
                </Suspense>
              </motion.div>
            )}

            {activeTab === 'quests' && (
              <motion.div
                key="view-quests"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Suspense fallback={<TabLoadingFallback />}>
                  <QuestCorner
                    questStats={{
                      packsOpened,
                      stickersGlued: totalStickersGluedCount,
                      shiniesGlued: totalShiniesGluedCount,
                      tradesCompleted
                    }}
                    recycleTokens={recycleTokens}
                    userCopies={userCopies}
                    userGlued={userGlued}
                    onRecycleDuplicates={handleRecycleDuplicates}
                    onRewardClaim={handleRewardClaim}
                    onFreePackClaim={handleFreePackClaim}
                    freePackCooldown={freePackCooldown}
                  />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      {/* CORE FOOTER BRAND & RESET CONTROLS */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-slate-500 text-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans">
            © 2026 FIFA World Cup digital sticker companion applet. Crafted with precision for global soccer fans.
          </p>

          <button
            id="wipe-collection-btn"
            onClick={handleForceReset}
            className="px-3.5 py-1.5 hover:bg-rose-955 border border-transparent hover:border-rose-900/40 rounded-lg text-rose-500 hover:text-rose-450 transition-all cursor-pointer font-sans text-xs flex items-center gap-1.5 font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete All Progress
          </button>
        </div>
      </footer>

    </div>
  );
}
