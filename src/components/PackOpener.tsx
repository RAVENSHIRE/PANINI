import React, { useState } from 'react';
import { Sticker, PackType } from '../types';
import { getAllStickers } from '../data/stickers';
import { StickerCard } from './StickerCard';
import { Sparkles, Loader2, RefreshCw, Archive, Globe, Shield, Coins, Star, Layers, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioSynth } from '../utils/audio';

interface PackOpenerProps {
  onStickersOpened: (stickers: Sticker[]) => void;
  recycleTokens: number;
  onSpendTokens: (amount: number) => boolean;
}

interface PackConfig {
  id: PackType;
  title: string;
  badge: string;
  description: string;
  cost: number;
  colorClass: string;
  borderColor: string;
  bgGradient: string;
  accentGlow: string;
  teamsIncluded: string[];
}

export const PackOpener: React.FC<PackOpenerProps> = ({
  onStickersOpened,
  recycleTokens,
  onSpendTokens
}) => {
  const [openingState, setOpeningState] = useState<'IDLE' | 'RIPPING' | 'REVEALED'>('IDLE');
  const [currentPack, setCurrentPack] = useState<Sticker[]>([]);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [activePackId, setActivePackId] = useState<PackType>('standard');

  const packsList: PackConfig[] = [
    {
      id: 'standard',
      title: 'Standard Booster Pack',
      badge: 'Free Refresh',
      description: 'Contains 5 randomized digital stickers of the qualifying 2026 World Cup teams. Features standard rates for special shiny collectibles!',
      cost: 0,
      colorClass: 'from-emerald-600 via-green-500 to-emerald-700',
      borderColor: 'border-green-400',
      bgGradient: 'bg-emerald-950/25',
      accentGlow: 'bg-emerald-500/10',
      teamsIncluded: ['ALL']
    },
    {
      id: 'shiny',
      title: 'Championship Shiny Pack',
      badge: 'Guaranteed 2+ Shinies',
      description: 'Perfect for completing rare badges and legendary player slots. Guarantees 5 cards with at least 2 highly-sought shiny foils!',
      cost: 10,
      colorClass: 'from-amber-500 via-yellow-400 to-amber-600',
      borderColor: 'border-yellow-200',
      bgGradient: 'bg-amber-950/20',
      accentGlow: 'bg-yellow-500/15',
      teamsIncluded: ['ALL']
    },
    {
      id: 'north_america',
      title: 'Americas Hub Booster',
      badge: 'Regional Pack',
      description: 'Direct regional focus. Features star players exclusively from the Americas qualifying giants: USA, Mexico, Canada, Brazil, and Argentina!',
      cost: 6,
      colorClass: 'from-sky-500 via-indigo-500 to-purple-600',
      borderColor: 'border-sky-300',
      bgGradient: 'bg-indigo-950/25',
      accentGlow: 'bg-sky-500/10',
      teamsIncluded: ['USA', 'MEX', 'CAN', 'ARG', 'BRA']
    },
    {
      id: 'europe',
      title: 'European Hub Booster',
      badge: 'Regional Pack',
      description: 'Euro championship roster. Guarantees 5 players exclusively from the European football giants: France, England, Spain, Germany, and Italy!',
      cost: 6,
      colorClass: 'from-red-600 via-rose-500 to-orange-600',
      borderColor: 'border-red-400',
      bgGradient: 'bg-rose-950/25',
      accentGlow: 'bg-red-500/10',
      teamsIncluded: ['FRA', 'ENG', 'ESP', 'GER', 'ITA']
    },
    {
      id: 'south_america',
      title: 'Afro-Asian Hub Booster',
      badge: 'Regional Pack',
      description: 'Exclusive talent pool from the Moroccan Atlas Lions and Japanese Samurai Blue rosters. Incredible potential for rare star cards!',
      cost: 5,
      colorClass: 'from-red-700 via-rose-600 to-red-800',
      borderColor: 'border-rose-500/60',
      bgGradient: 'bg-rose-900/10',
      accentGlow: 'bg-rose-500/5',
      teamsIncluded: ['MAR', 'JPN']
    }
  ];

  const generatePackByType = (type: PackType): Sticker[] => {
    const all = getAllStickers();
    let filterPool = [...all];

    // Handle regional filters
    if (type === 'north_america') {
      filterPool = all.filter(s => ['USA', 'MEX', 'CAN', 'ARG', 'BRA'].includes(s.teamCode));
    } else if (type === 'europe') {
      filterPool = all.filter(s => ['FRA', 'ENG', 'ESP', 'GER', 'ITA'].includes(s.teamCode));
    } else if (type === 'south_america') {
      filterPool = all.filter(s => ['MAR', 'JPN'].includes(s.teamCode));
    }

    const pack: Sticker[] = [];
    const poolCopy = [...filterPool];

    // Pick 5 random
    for (let i = 0; i < 5; i++) {
      if (poolCopy.length === 0) break;
      const idx = Math.floor(Math.random() * poolCopy.length);
      pack.push(poolCopy[idx]);
      poolCopy.splice(idx, 1);
    }

    // Handle Shiny Pack requirement: Guarantees 2 or more Shiny/Badge cards
    if (type === 'shiny') {
      let shinyCount = pack.filter(s => s.isShiny).length;
      if (shinyCount < 2) {
        // Find existing non-shinies and replace with random shinies
        const shinyStickers = all.filter(s => s.isShiny);
        for (let idx = 0; idx < pack.length; idx++) {
          if (!pack[idx].isShiny) {
            const randShiny = shinyStickers[Math.floor(Math.random() * shinyStickers.length)];
            // Avoid duplicate in pack
            if (!pack.some(p => p.id === randShiny.id)) {
              pack[idx] = randShiny;
              shinyCount++;
              if (shinyCount >= 2) break;
            }
          }
        }
      }
    }

    return pack;
  };

  const handleOpenPack = (config: PackConfig) => {
    if (config.cost > 0) {
      if (recycleTokens < config.cost) {
        return;
      }
      onSpendTokens(config.cost);
    }

    // Play ripping sound effects
    audioSynth.playTear();

    setOpeningState('RIPPING');
    setFlippedCards({});
    setActivePackId(config.id);

    // Simulate ripping delay
    setTimeout(() => {
      const pack = generatePackByType(config.id);
      setCurrentPack(pack);
      setOpeningState('REVEALED');
      onStickersOpened(pack);
    }, 1400);
  };

  const handleCardFlip = (index: number, isStickerShiny: boolean) => {
    if (!flippedCards[index]) {
      // Card flipped for the first time
      if (isStickerShiny) {
        audioSynth.playShinyCelebration();
      } else {
        audioSynth.playFlip();
      }
    }
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleReset = () => {
    setOpeningState('IDLE');
    setCurrentPack([]);
    setFlippedCards({});
  };

  const allFlipped = currentPack.length > 0 && currentPack.every((_, idx) => flippedCards[idx]);

  return (
    <div id="pack-opener-module" className="flex flex-col items-center py-6 w-full max-w-5xl mx-auto px-4">
      <AnimatePresence mode="wait">
        {openingState === 'IDLE' && (
          <motion.div
            key="idle-packs"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-6 w-full"
          >
            {/* Header info bar */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-yellow-500/10 rounded-xl border border-yellow-500/25">
                  <Coins className="w-5 h-5 text-yellow-400 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-sans text-sm font-black text-slate-100 uppercase tracking-wider">
                    Pack Store & Arena
                  </h4>
                  <p className="font-sans text-xs text-slate-400">
                    Siphon duplicate stickers in the Quest Corner to acquire more Recycling Tokens!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <span className="font-mono text-xs text-slate-400 font-bold uppercase">RECYCLING TOKENS:</span>
                <span className="font-mono text-sm font-black text-yellow-400">{recycleTokens}</span>
              </div>
            </div>

            {/* Pack Cards Shelf */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packsList.map((pack) => {
                const canAfford = recycleTokens >= pack.cost;
                const isFree = pack.cost === 0;

                return (
                  <motion.div
                    key={pack.id}
                    id={`pack-card-${pack.id}`}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="bg-slate-900/80 border border-slate-800/80 hover:border-slate-750 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-[390px] relative overflow-hidden transition-all"
                  >
                    {/* Decorative Background */}
                    <div className={`absolute top-0 right-0 w-24 h-24 ${pack.accentGlow} blur-2xl rounded-full`} />
                    
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                          {pack.id === 'standard' && <Layers className="w-3.5 h-3.5 text-emerald-400" />}
                          {pack.id === 'shiny' && <Shield className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />}
                          {pack.id !== 'standard' && pack.id !== 'shiny' && <Globe className="w-3.5 h-3.5 text-sky-400" />}
                          {pack.id.toUpperCase()}
                        </span>
                        
                        <span className={`font-mono text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full border ${
                          isFree
                            ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25'
                        }`}>
                          {pack.badge}
                        </span>
                      </div>
                      
                      <h3 className="font-sans text-xl font-black text-slate-100 tracking-tight">
                        {pack.title}
                      </h3>
                      <p className="font-sans text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {pack.description}
                      </p>
                    </div>

                    {/* Physical Mock Pack Wrapper Card */}
                    <div className="my-3 flex justify-center items-center">
                      <div className={`w-40 h-20 bg-linear-to-r ${pack.colorClass} text-slate-950 rounded-xl shadow-lg border-2 ${pack.borderColor} flex flex-col items-center justify-center font-sans tracking-widest uppercase relative shadow-yellow-500/5`}>
                        <div className="flex items-center gap-1">
                          {pack.id === 'shiny' && <Sparkles className="w-4 h-4 text-amber-950 animate-bounce" />}
                          <span className="text-slate-950 font-black font-serif text-sm drop-shadow-sm select-none">
                            {pack.id === 'standard' ? 'WM 2026' : pack.id === 'shiny' ? "CHAMPION '26" : "HUB '26"}
                          </span>
                        </div>
                        <span className="text-[8px] tracking-normal font-mono font-black text-slate-950 bg-white/70 px-1.5 rounded-md mt-1 scale-90">
                          {isFree ? '5 CARDS' : `${pack.cost} TOKENS`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id={`rip-pack-btn-${pack.id}`}
                        onClick={() => handleOpenPack(pack)}
                        disabled={!canAfford}
                        className={`w-full py-2.5 font-sans text-xs font-bold rounded-xl shadow-md border flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                          canAfford
                            ? pack.id === 'shiny'
                              ? 'bg-linear-to-r from-amber-400 to-yellow-500 text-amber-950 border-yellow-300 hover:from-amber-300 hover:to-yellow-400'
                              : pack.id === 'standard'
                              ? 'bg-linear-to-r from-emerald-500 to-emerald-600 text-white border-emerald-400 hover:opacity-90'
                              : 'bg-linear-to-r from-sky-500 to-indigo-650 text-white border-sky-400 hover:opacity-90'
                            : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed shadow-none'
                        }`}
                      >
                        {pack.id === 'shiny' && <Sparkles className="w-3.5 h-3.5" />}
                        {isFree ? 'Rip Free Booster' : `Purchase for ${pack.cost} Tokens`}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {openingState === 'RIPPING' && (
          <motion.div
            key="ripping-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-16 h-[340px]"
          >
            <motion.div
              animate={{ 
                rotate: [0, -3, 3, -3, 3, 0],
                scale: [1, 1.05, 1.05, 1.05, 1.05, 1]
              }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className={`w-52 h-28 rounded-2xl flex flex-col items-center justify-center shadow-2xl relative border-2 ${
                packsList.find(p => p.id === activePackId)?.colorClass.includes('from-amber')
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-650 border-yellow-250 shadow-yellow-500/30' 
                  : 'bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 border-green-400 shadow-emerald-500/30'
              }`}
            >
              <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
              <p className="font-serif font-black tracking-widest text-white uppercase text-xs">
                Ripping Foil Seals...
              </p>
            </motion.div>
          </motion.div>
        )}

        {openingState === 'REVEALED' && (
          <motion.div
            key="revealed-cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center w-full animate-fade-in"
          >
            <div className="text-center mb-6">
              <span className="bg-emerald-950/10 text-emerald-450 font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/10">
                Foil Pack Rip Result
              </span>
              <h3 className="font-sans text-2xl font-black text-slate-100 tracking-tight mt-2">
                Click cards one-by-one to flip and reveal!
              </h3>
              <p className="font-sans text-sm text-slate-400 mt-1">
                Any duplicate copies collected will automatically be stored for trades or token recycling codes!
              </p>
            </div>

            {/* Grid of 5 Opened Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 w-full my-4">
              {currentPack.map((sticker, idx) => {
                const isFlipped = flippedCards[idx] || false;
                
                return (
                  <div
                    key={`${sticker.id}-${idx}`}
                    className="relative cursor-pointer transition-transform h-[210px] w-full"
                    style={{ perspective: '1000px' }}
                    onClick={() => handleCardFlip(idx, sticker.isShiny)}
                  >
                    <motion.div
                      className="w-full h-full relative"
                      style={{ transformStyle: 'preserve-3d' }}
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, type: 'spring', stiffness: 90 }}
                    >
                      {/* Card Back */}
                      <div
                        className="absolute inset-0 rounded-xl overflow-hidden bg-slate-900 border-2 border-emerald-500/40 flex flex-col justify-between p-3 select-none hover:border-emerald-400/80 transition-all shadow-md"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="w-full flex justify-between">
                          <span className="font-mono text-[9px] text-emerald-500 font-bold">PANINI</span>
                          <span className="font-mono text-[9px] text-emerald-500 font-bold">2026</span>
                        </div>
                        <div className="flex-grow flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full border border-dashed border-emerald-500/30 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-emerald-500/40 animate-pulse" />
                          </div>
                        </div>
                        <span className="text-center text-[9px] font-mono font-black tracking-widest text-emerald-400">
                          CLICK TO REVEAL
                        </span>
                      </div>

                      {/* Card Front */}
                      <div
                        className="absolute inset-0"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <StickerCard sticker={sticker} isGlued={true} size="md" />
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 mt-8 w-full sm:w-auto">
              <button
                id="flip-all-btn"
                onClick={() => {
                  const allFlippedMap: Record<number, boolean> = {};
                  currentPack.forEach((st, idx) => {
                    allFlippedMap[idx] = true;
                    // Play a shiny swell sound if there is any shiny foil in the pack
                    if (st.isShiny) {
                      audioSynth.playShinyCelebration();
                    }
                  });
                  setFlippedCards(allFlippedMap);
                }}
                disabled={allFlipped}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-sans text-xs font-bold border cursor-pointer transition-all ${
                  allFlipped
                    ? 'bg-slate-850/50 border-slate-700 text-slate-500'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-705'
                }`}
              >
                Reveal All Cards
              </button>

              <button
                id="done-opening-btn"
                onClick={handleReset}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold rounded-xl shadow-lg border border-emerald-400 cursor-pointer active:scale-95"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
