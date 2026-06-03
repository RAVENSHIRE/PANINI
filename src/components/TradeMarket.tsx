import React, { useState, useEffect } from 'react';
import { Sticker, MarketOffer } from '../types';
import { getAllStickers } from '../data/stickers';
import { StickerCard } from './StickerCard';
import { RefreshCw, ArrowLeftRight, CheckCircle2, User, Globe, AlertCircle, Plus, Send, Coins, ShoppingBag, Trash2, Shield, Flame, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioSynth } from '../utils/audio';

interface TradeMarketProps {
  userCopies: Record<string, number>;
  userGlued: Record<string, boolean>;
  onExecuteTrade: (offeredId: string, requestedId: string) => void;
  recycleTokens: number;
  onBuyStickerFromBazaar: (stickerId: string, tokenCost: number) => void;
  onSellStickerForTokens: (stickerId: string, tokenReward: number) => void;
}

export const TradeMarket: React.FC<TradeMarketProps> = ({
  userCopies,
  userGlued,
  onExecuteTrade,
  recycleTokens,
  onBuyStickerFromBazaar,
  onSellStickerForTokens
}) => {
  const allStickers = getAllStickers();
  const [marketSubTab, setMarketSubTab] = useState<'P2P' | 'RECYCLE' | 'BAZAAR'>('P2P');
  const [activeOffers, setActiveOffers] = useState<MarketOffer[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [bazaarSearch, setBazaarSearch] = useState('');
  
  // Custom Offer Form State
  const [selectedMyDup, setSelectedMyDup] = useState<string>('');
  const [selectedMissing, setSelectedMissing] = useState<string>('');

  // Get user's current duplicates (available copies >= 2, or standard duplicates where count > 1)
  // Also, any copy where count > 0 and is already glued, which means they can trade/sell the extra!
  const userDuplicates = allStickers.filter(s => {
    const owned = userCopies[s.id] || 0;
    const isGlued = userGlued[s.id] || false;
    return isGlued ? owned > 1 : owned > 1; // standard duplicate
  });

  // Get user's missing stickers (not glued yet)
  const userMissingStickers = allStickers.filter(s => !userGlued[s.id]);

  // Generate simulated market trade offers other people are requesting
  const generateSimulatedOffers = () => {
    const collectors = [
      { name: 'Mateo', flag: '🇮🇹' },
      { name: 'Kaito', flag: '🇯🇵' },
      { name: 'Amina', flag: '🇲🇦' },
      { name: 'Lucas', flag: '🇩🇪' },
      { name: 'Sophie', flag: '🇫🇷' },
      { name: 'Diego', flag: '🇦🇷' },
      { name: 'Emma', flag: '🇺🇸' },
      { name: 'Santiago', flag: '🇲🇽' },
      { name: 'Liam', flag: '🇬🇧' },
      { name: 'Tyler', flag: '🇨🇦' },
      { name: 'Gabriel', flag: '🇧🇷' }
    ];

    const offers: MarketOffer[] = [];
    const dupPool = userDuplicates.length > 0 ? userDuplicates : allStickers.filter(s => !s.isShiny);
    const missingPool = userMissingStickers.length > 0 ? userMissingStickers : allStickers.filter(s => s.isShiny);

    // Generate 5 P2P offers on global stream
    for (let i = 0; i < 5; i++) {
      const collector = collectors[Math.floor(Math.random() * collectors.length)];
      const wantedSticker = dupPool[Math.floor(Math.random() * dupPool.length)];
      
      let offerPool = missingPool.filter(s => s.isShiny === wantedSticker.isShiny && s.id !== wantedSticker.id);
      if (offerPool.length === 0) {
        offerPool = missingPool.filter(s => s.id !== wantedSticker.id);
      }
      
      const offeredSticker = offerPool[Math.floor(Math.random() * offerPool.length)];

      if (wantedSticker && offeredSticker) {
        offers.push({
          id: `sim-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          offeredSticker: offeredSticker, 
          requestedSticker: wantedSticker, 
          source: 'AI_TRADER',
          status: 'PENDING',
          timestamp: 'Just now'
        });
      }
    }

    setActiveOffers(offers);
  };

  useEffect(() => {
    generateSimulatedOffers();
  }, [userDuplicates.length, userMissingStickers.length]);

  const handleRefreshOffers = () => {
    generateSimulatedOffers();
  };

  const handleAcceptTrade = (offer: MarketOffer) => {
    const userCopyCount = userCopies[offer.requestedSticker.id] || 0;
    if (userCopyCount < 2) {
      alert(`You no longer have an extra duplicate of ${offer.requestedSticker.name} to trade!`);
      return;
    }

    audioSynth.playChaching();
    onExecuteTrade(offer.requestedSticker.id, offer.offeredSticker.id);
    
    setActiveOffers(prev => prev.map(o => o.id === offer.id ? { ...o, status: 'COMPLETED' as const } : o));
    
    setTimeout(() => {
      setActiveOffers(prev => prev.filter(o => o.id !== offer.id));
    }, 1500);
  };

  const handleSubmitCustomOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMyDup || !selectedMissing) return;

    setIsBroadcasting(true);

    setTimeout(() => {
      audioSynth.playChaching();
      onExecuteTrade(selectedMyDup, selectedMissing);
      
      setIsBroadcasting(false);
      setSelectedMyDup('');
      setSelectedMissing('');
    }, 2000);
  };

  // Recycle duplicators directly for instant tokens
  const handleRecycleSticker = (stickerId: string, isShiny: boolean) => {
    const reward = isShiny ? 3 : 1;
    audioSynth.playChaching();
    onSellStickerForTokens(stickerId, reward);
  };

  // Buy missing player sticker with tokens
  const handleBuySticker = (sticker: Sticker, cost: number) => {
    if (recycleTokens < cost) return;
    audioSynth.playChaching();
    onBuyStickerFromBazaar(sticker.id, cost);
  };

  // Filter the bazaar listings for purchase matching search
  const filteredBazaarStickers = allStickers.filter(s => {
    // Only show stickers that user does not have glued yet
    const isGlued = userGlued[s.id] || false;
    if (isGlued) return false;

    if (!bazaarSearch) return true;
    return s.name.toLowerCase().includes(bazaarSearch.toLowerCase()) ||
           s.teamName.toLowerCase().includes(bazaarSearch.toLowerCase()) ||
           s.club.toLowerCase().includes(bazaarSearch.toLowerCase()) ||
           s.position.toLowerCase().includes(bazaarSearch.toLowerCase());
  });

  return (
    <div id="trade-market-module" className="w-full max-w-6xl mx-auto px-4 py-4">
      
      {/* Tab Navigator */}
      <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-850/80 mb-6 gap-1">
        <button
          id="btn-subtab-p2p"
          onClick={() => setMarketSubTab('P2P')}
          className={`flex-1 py-3 text-center rounded-xl font-sans text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
            marketSubTab === 'P2P'
              ? 'bg-slate-900 border border-slate-800 text-slate-100 shadow-lg'
              : 'text-slate-450 hover:bg-slate-900/50 hover:text-slate-205'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4 text-emerald-500" />
          P2P Cards Swapping
        </button>
        <button
          id="btn-subtab-recycle"
          onClick={() => setMarketSubTab('RECYCLE')}
          className={`flex-1 py-3 text-center rounded-xl font-sans text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
            marketSubTab === 'RECYCLE'
              ? 'bg-slate-900 border border-slate-800 text-slate-100 shadow-lg'
              : 'text-slate-450 hover:bg-slate-900/50 hover:text-slate-205'
          }`}
        >
          <Trash2 className="w-4 h-4 text-rose-500" />
          Trade Duplicates for Tokens
        </button>
        <button
          id="btn-subtab-bazaar"
          onClick={() => setMarketSubTab('BAZAAR')}
          className={`flex-1 py-3 text-center rounded-xl font-sans text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
            marketSubTab === 'BAZAAR'
              ? 'bg-slate-900 border border-slate-800 text-slate-100 shadow-lg'
              : 'text-slate-450 hover:bg-slate-900/50 hover:text-slate-205'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-yellow-500" />
          Purchase Missing with Tokens
        </button>
      </div>

      <AnimatePresence mode="wait">
        {marketSubTab === 'P2P' && (
          <motion.div
            key="p2p-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* LEFT: User's Duplicates Swap Pile */}
            <div className="lg:col-span-1 bg-slate-900 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between h-fit min-h-[400px]">
              <div>
                <h3 className="font-sans text-xl font-black text-slate-100 flex items-center gap-2">
                  <span className="p-1 px-1.5 rounded-md bg-rose-600/10 text-rose-500 font-mono text-xs leading-none">
                    SWAP
                  </span>
                  My Duplicate Swap Pile
                  <span className="font-mono text-xs font-normal text-slate-500">
                    ({userDuplicates.length} unique)
                  </span>
                </h3>
                <p className="font-sans text-xs text-slate-400 mt-1 mb-4">
                  Stickers you have extra copies of. These are high-value chips on the global market!
                </p>

                {userDuplicates.length === 0 ? (
                  <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500">
                    <AlertCircle className="w-10 h-10 mx-auto text-slate-705 mb-2" />
                    <p className="font-sans text-xs font-semibold">Your swap pile is empty.</p>
                    <p className="font-sans text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Collect duplicates in booster packs to start swapping with other collectors.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                    {userDuplicates.map(st => {
                      const count = userCopies[st.id] || 0;
                      const isGlued = userGlued[st.id] || false;
                      const dupCount = isGlued ? count - 1 : count;
                      
                      return (
                        <div key={st.id} className="relative group">
                          <StickerCard sticker={st} isGlued={true} duplicateCount={dupCount} size="sm" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Custom Trade Submission Form */}
              {userDuplicates.length > 0 && userMissingStickers.length > 0 && (
                <form onSubmit={handleSubmitCustomOffer} className="mt-6 pt-5 border-t border-slate-850 space-y-3">
                  <h4 className="font-sans text-xs font-black text-slate-300 uppercase tracking-wider">
                    Quick List Offer
                  </h4>
                  
                  <div className="space-y-2">
                    <select
                      id="my-dup-selector"
                      value={selectedMyDup}
                      onChange={(e) => setSelectedMyDup(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 py-2 px-3 rounded-lg text-xs text-slate-300 focus:outline-hidden cursor-pointer"
                      required
                    >
                      <option value="">-- Give duplicate --</option>
                      {userDuplicates.map(d => (
                        <option key={d.id} value={d.id}>
                          #{d.number} {d.name} ({d.teamCode})
                        </option>
                      ))}
                    </select>

                    <select
                      id="target-missing-selector"
                      value={selectedMissing}
                      onChange={(e) => setSelectedMissing(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-855 py-2 px-3 rounded-lg text-xs text-slate-300 focus:outline-hidden cursor-pointer"
                      required
                    >
                      <option value="">-- Receive missing --</option>
                      {userMissingStickers.map(m => (
                        <option key={m.id} value={m.id}>
                          #{m.number} {m.name} ({m.teamCode}) {m.isShiny ? '⭐' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    id="broadcast-trade-btn"
                    type="submit"
                    disabled={isBroadcasting || !selectedMyDup || !selectedMissing}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      isBroadcasting
                        ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white font-sans shadow-md border border-emerald-450'
                    }`}
                  >
                    {isBroadcasting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Matching Collectors...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Publish To Feed
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* RIGHT: Live Simulated Market Feed */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between min-h-[460px]">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-sans text-xl font-black text-slate-100 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-emerald-500 animate-spin" style={{ animationDuration: '40s' }} />
                      P2P Trade Block Feed
                    </h3>
                    <p className="font-sans text-xs text-slate-400 mt-1">
                      Simulated active trade requests from World Cup collectors around the globe.
                    </p>
                  </div>
                  
                  <button
                    id="refresh-trades-btn"
                    onClick={handleRefreshOffers}
                    className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer transition-colors"
                    title="Refresh Feed"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
                  {activeOffers.map(offer => {
                    const userHasDup = (userCopies[offer.requestedSticker.id] || 0) > 1;
                    const isCompleted = offer.status === 'COMPLETED';

                    const locations = [
                      { name: 'Gabriel', flag: '🇧🇷' },
                      { name: 'Ksenia', flag: '🇨🇦' },
                      { name: 'Leo', flag: '🇦🇷' },
                      { name: 'Oliver', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
                      { name: 'Youssef', flag: '🇲🇦' }
                    ];
                    const author = locations[Math.abs(offer.id.charCodeAt(5)) % locations.length];

                    return (
                      <div
                        key={offer.id}
                        id={`trade-offer-${offer.id}`}
                        className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                          isCompleted
                            ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                            : 'bg-slate-950 border-slate-850 hover:border-slate-805'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-grow">
                          <div className="flex items-center gap-2 min-w-32 border-b sm:border-b-0 sm:border-r border-slate-850 pb-2 sm:pb-0 pr-2">
                            <div className="w-8 h-8 rounded-full bg-slate-800/85 flex items-center justify-center text-sm font-bold text-slate-300">
                              {author.flag}
                            </div>
                            <div>
                              <p className="font-sans text-xs font-bold text-slate-200 leading-none">{author.name}</p>
                              <span className="font-sans text-[10px] text-slate-500">Global Collector</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-lg flex items-center gap-2">
                              <div className="text-left">
                                <span className="font-sans text-[9px] uppercase tracking-wider text-emerald-400 font-bold block">
                                  GIVES YOU
                                </span>
                                <p className="font-sans text-xs font-semibold text-slate-100 truncate max-w-28 sm:max-w-32">
                                  {offer.offeredSticker.name}
                                </p>
                              </div>
                              <span className="text-[10px] font-mono bg-emerald-950 px-1 rounded text-emerald-300">
                                #{offer.offeredSticker.number}
                              </span>
                            </div>

                            <ArrowLeftRight className="w-4 h-4 text-slate-500 shrink-0" />

                            <div className="bg-slate-905 border border-slate-850 px-3 py-1.5 rounded-lg flex items-center gap-2">
                              <div className="text-left">
                                <span className="font-sans text-[9px] uppercase tracking-wider text-rose-450 font-bold block">
                                  WANTS
                                </span>
                                <p className="font-sans text-xs font-semibold text-slate-100 truncate max-w-28 sm:max-w-32">
                                  {offer.requestedSticker.name}
                                </p>
                              </div>
                              <span className="text-[10px] font-mono bg-rose-955 px-1 rounded text-rose-350">
                                #{offer.requestedSticker.number}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          {isCompleted ? (
                            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold py-2 bg-emerald-500/10 px-3.5 rounded-lg border border-emerald-500/15">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Traded
                            </div>
                          ) : (
                            <button
                              id={`accept-trade-btn-${offer.id}`}
                              onClick={() => handleAcceptTrade(offer)}
                              disabled={!userHasDup}
                              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-sans text-xs font-bold transition-all cursor-pointer ${
                                userHasDup
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-950 font-semibold shadow-sm'
                                  : 'bg-slate-950 border border-slate-900 text-slate-600 cursor-not-allowed'
                              }`}
                            >
                              {userHasDup ? 'Accept Swap' : 'Missing Dup'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="font-sans text-[10px] text-slate-500 italic mt-4 text-center">
                *Trades simulate live P2P network transactions using specialized collector algorithms based in FIFA confederation regions.
              </p>
            </div>
          </motion.div>
        )}

        {marketSubTab === 'RECYCLE' && (
          <motion.div
            key="recycle-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900 border border-slate-850 rounded-2xl p-5"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-850 pb-5 mb-5">
              <div>
                <h3 className="font-sans text-xl font-black text-slate-100 flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-rose-500 animate-pulse" />
                  Instant Duplicate Recycling Plant
                </h3>
                <p className="font-sans text-sm text-slate-400 mt-1">
                  Exchange individual duplicates from your collection straight for Recycling Tokens.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2.5 rounded-xl border border-yellow-500/20">
                <Coins className="w-4 h-4 text-yellow-405" />
                <span className="font-sans text-xs text-slate-300 font-bold uppercase">Balance:</span>
                <span className="font-mono text-sm font-black text-yellow-400">{recycleTokens} Tokens</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-slate-950/55 border border-slate-850/60 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-sans text-sm font-black text-slate-200 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-yellow-550" />
                    Exchange Rates
                  </h4>
                  <p className="font-sans text-xs text-slate-400 leading-relaxed mb-4">
                    P2P transactions can be tedious. Use the direct system bank to melt down extra duplicates for clean spending cache:
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-850 rounded-xl">
                      <span className="font-semibold text-slate-300">Standard Card Dupe</span>
                      <span className="font-mono font-black text-yellow-400">+1 Token</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-850 rounded-xl">
                      <span className="font-semibold text-amber-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" />
                        Shiny foil/Badge Dupe
                      </span>
                      <span className="font-mono font-black text-yellow-400">+3 Tokens</span>
                    </div>
                  </div>
                </div>

                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs text-rose-400 mt-6 leading-relaxed">
                  <strong>Warning:</strong> Recycling is permanent. Once melted, the duplicate copy will be removed from your Swap Pile.
                </div>
              </div>

              {/* Duplicate List */}
              <div className="md:col-span-2">
                <h4 className="font-sans text-xs font-black text-slate-405 uppercase tracking-wider mb-3">
                  Select a Duplicate to Melt Down
                </h4>

                {userDuplicates.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
                    <AlertCircle className="w-12 h-12 mx-auto text-slate-700 mb-2" />
                    <p className="font-sans text-sm">No duplicate copies available in your pile.</p>
                    <p className="font-sans text-xs text-slate-505 mt-1">Open more packs first!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1 no-scrollbar">
                    {userDuplicates.map(st => {
                      const count = userCopies[st.id] || 0;
                      const isGlued = userGlued[st.id] || false;
                      const dupCount = isGlued ? count - 1 : count;

                      const rate = st.isShiny ? 3 : 1;

                      return (
                        <div 
                          key={st.id} 
                          className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-center justify-between gap-3 hover:border-slate-800 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">#{st.number}</span>
                            <div>
                              <p className="font-sans text-xs font-bold text-slate-200">{st.name}</p>
                              <p className="font-mono text-[9px] text-slate-500 uppercase">{st.teamName} • x{dupCount} dupe</p>
                            </div>
                          </div>

                          <button
                            id={`recycle-action-${st.id}`}
                            onClick={() => handleRecycleSticker(st.id, st.isShiny)}
                            className="bg-rose-600/10 hover:bg-rose-600/20 text-rose-450 border border-rose-550/20 hover:border-rose-500/40 px-3 py-1.5 rounded-lg text-xs font-mono font-bold font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shrink-0"
                          >
                            Recycle (+{rate}T)
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {marketSubTab === 'BAZAAR' && (
          <motion.div
            key="bazaar-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900 border border-slate-850 rounded-2xl p-5"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-850 pb-5 mb-5">
              <div>
                <h3 className="font-sans text-xl font-black text-slate-100 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-yellow-505" />
                  Elite Token Player Bazaar
                </h3>
                <p className="font-sans text-sm text-slate-400 mt-1">
                  Exchange Recycling Tokens to instantly acquire SPECIFIC, individual cards you have missing.
                </p>
              </div>

              <div className="flex gap-2 items-center">
                {/* Search in bazaar */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 text-slate-500" />
                  <input
                    id="bazaar-search-input"
                    type="text"
                    placeholder="Search missing bazaar..."
                    value={bazaarSearch}
                    onChange={(e) => setBazaarSearch(e.target.value)}
                    className="bg-slate-950 border border-slate-850 rounded-xl py-2 pl-8 pr-3 text-xs text-slate-100 placeholder-slate-550 focus:outline-hidden focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 font-sans w-48"
                  />
                </div>

                <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-xl border border-yellow-500/20 shrink-0">
                  <Coins className="w-4 h-4 text-yellow-405" />
                  <span className="font-mono text-xs font-black text-yellow-400">{recycleTokens} Tokens</span>
                </div>
              </div>
            </div>

            {/* Grid of Players with custom token buy triggers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
              {filteredBazaarStickers.map(st => {
                const cost = st.isShiny ? 12 : 5;
                const canAfford = recycleTokens >= cost;

                return (
                  <div 
                    key={st.id} 
                    className="bg-slate-950 border border-slate-850/80 hover:border-slate-800 rounded-xl p-3 flex flex-col justify-between h-[160px] hover:shadow-lg transition-all"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-bold">
                          #{st.number}
                        </span>
                        
                        <span className="font-mono font-bold text-[9px] text-slate-500">
                          {st.position.toUpperCase()}
                        </span>
                      </div>

                      <h4 className="font-sans text-sm font-extrabold text-slate-150 truncate leading-tight">
                        {st.name}
                      </h4>
                      <p className="font-mono text-[10px] text-slate-500 mt-1 truncate">
                        {st.teamName}
                      </p>

                      {st.isShiny && (
                        <span className="mt-1.5 inline-flex p-0.5 bg-linear-to-r from-yellow-500 to-amber-500 text-[8px] uppercase tracking-wide rounded font-black text-slate-950 px-1.5 font-mono scale-95 origin-left">
                          Shiny Foil
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <button
                        id={`buy-bazaar-btn-${st.id}`}
                        onClick={() => handleBuySticker(st, cost)}
                        disabled={!canAfford}
                        className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          canAfford
                            ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-semibold shadow-md shadow-yellow-500/5'
                            : 'bg-slate-900 border border-slate-850/20 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        Buy for {cost} Tokens
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredBazaarStickers.length === 0 && (
                <div className="col-span-full py-20 text-center text-slate-500">
                  <Shield className="w-12 h-12 mx-auto text-slate-705 mb-3" />
                  <p className="font-sans text-sm font-semibold">No missing players match your criteria here.</p>
                  <p className="font-sans text-xs text-slate-550 mt-1">Check search fields, filters, or congratulations, your album might be 100% complete!</p>
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
