import React, { useState } from 'react';
import { Team, Sticker } from '../types';
import { getTeams } from '../data/stickers';
import { StickerCard } from './StickerCard';
import { Trophy, HelpCircle, CheckCircle2, ChevronLeft, ChevronRight, Search, Filter, Grid, LayoutGrid, Printer, Sparkles, Check, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioSynth } from '../utils/audio';

interface AlbumGridProps {
  userCopies: Record<string, number>;
  userGlued: Record<string, boolean>;
  onGlueSticker: (id: string) => void;
  onGlueAllTeam: (teamCode: string) => void;
}

export const AlbumGrid: React.FC<AlbumGridProps> = ({
  userCopies,
  userGlued,
  onGlueSticker,
  onGlueAllTeam
}) => {
  const teams = getTeams();
  const [viewMode, setViewMode] = useState<'ALBUM' | 'POSTER'>('ALBUM');
  const [selectedTeamIdx, setSelectedTeamIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'GLUED' | 'MISSING' | 'SHINY'>('ALL');

  const currentTeam = teams[selectedTeamIdx];

  const handlePrevTeam = () => {
    setSelectedTeamIdx(prev => (prev === 0 ? teams.length - 1 : prev - 1));
  };

  const handleNextTeam = () => {
    setSelectedTeamIdx(prev => (prev === teams.length - 1 ? 0 : prev + 1));
  };

  // Compute team-specific stats
  const getTeamProgress = (team: Team) => {
    const total = team.stickers.length;
    const gluedCount = team.stickers.filter(s => userGlued[s.id]).length;
    return {
      total,
      glued: gluedCount,
      percentage: Math.round((gluedCount / total) * 100),
      isCompleted: gluedCount === total
    };
  };

  const currentTeamStats = getTeamProgress(currentTeam);

  // Compute overall stats
  const allStickers = teams.flatMap(t => t.stickers);
  const totalGlued = allStickers.filter(s => userGlued[s.id]).length;
  const totalStickersCount = allStickers.length;
  const overallPercentage = Math.round((totalGlued / totalStickersCount) * 100);

  // Compute overall missing but owned (can glue) for the current team
  const canGlueAny = currentTeam.stickers.some(s => (userCopies[s.id] || 0) > 0 && !userGlued[s.id]);

  // Search and filter logic if a user searches for players
  const filteredStickers = allStickers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.club.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterType === 'GLUED') return userGlued[s.id];
    if (filterType === 'MISSING') return !userGlued[s.id];
    if (filterType === 'SHINY') return s.isShiny;
    return true;
  });

  const handleGlueWithAudio = (id: string) => {
    audioSynth.playGlue();
    onGlueSticker(id);
  };

  const handleGlueAllWithAudio = (teamCode: string) => {
    audioSynth.playChaching();
    onGlueAllTeam(teamCode);
  };

  // Function to print the poster tracker layout
  const handlePrintPoster = () => {
    window.print();
  };

  return (
    <div id="album-grid-module" className="w-full max-w-6xl mx-auto px-4 py-4 print:p-0">
      
      {/* Search / View Toggle Bar */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 mb-6 border border-slate-800/80 flex flex-col md:flex-row gap-4 items-center justify-between print:hidden">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            id="toggle-album-view"
            onClick={() => setViewMode('ALBUM')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-sans text-xs font-bold cursor-pointer transition-all ${
              viewMode === 'ALBUM'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                : 'bg-slate-950 text-slate-450 hover:bg-slate-850 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Standard Album Book
          </button>
          <button
            id="toggle-poster-view"
            onClick={() => setViewMode('POSTER')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-sans text-xs font-bold cursor-pointer transition-all ${
              viewMode === 'POSTER'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                : 'bg-slate-950 text-slate-450 hover:bg-slate-850 hover:text-slate-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            Etsy Poster Tracker Sheet
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 text-slate-500" />
          <input
            id="player-search-input"
            type="text"
            placeholder="Search players, clubs, teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-sans"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar py-1">
          {(['ALL', 'GLUED', 'MISSING', 'SHINY'] as const).map(type => (
            <button
              key={type}
              id={`filter-btn-${type}`}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold cursor-pointer whitespace-nowrap transition-all ${
                filterType === type
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-950/80 hover:bg-slate-800 text-slate-400 border border-slate-850'
              }`}
            >
              {type === 'ALL' ? 'All Stickers' : 
               type === 'GLUED' ? 'Glued In' : 
               type === 'MISSING' ? 'Missing' : 'Shiny Foil'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {searchQuery ? (
          // Search Results View
          <motion.div
            key="search-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-slate-900 border border-slate-850 rounded-2xl p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-sans text-lg font-black text-slate-100 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-500" />
                Search & Filter Result
                <span className="font-mono text-xs font-normal text-slate-500">
                  ({filteredStickers.length} found)
                </span>
              </h4>
              <button
                id="clear-search-btn"
                onClick={() => { setSearchQuery(''); setFilterType('ALL'); }}
                className="font-sans text-xs text-rose-500 hover:text-rose-450 font-bold cursor-pointer"
              >
                Clear Filters
              </button>
            </div>

            {filteredStickers.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <HelpCircle className="w-12 h-12 mx-auto text-slate-650 mb-3" />
                <p className="font-sans text-sm">No stickers match your active search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredStickers.map(st => {
                  const ownedCount = userCopies[st.id] || 0;
                  const isGlued = userGlued[st.id] || false;
                  const duplicateCount = isGlued ? Math.max(0, ownedCount - 1) : Math.max(0, ownedCount);
                  
                  return (
                    <StickerCard
                      key={st.id}
                      sticker={st}
                      isGlued={isGlued}
                      duplicateCount={duplicateCount}
                      canGlue={ownedCount > 0 && !isGlued}
                      onGlue={() => handleGlueWithAudio(st.id)}
                      size="sm"
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : viewMode === 'POSTER' ? (
          // ETSY INSPIRED PRINTABLE POSTER TRACKER SHEET
          <motion.div
            key="poster-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-zinc-950 text-slate-200 rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-2xl relative overflow-hidden font-sans print:bg-white print:text-black print:border-none print:shadow-none print:p-0"
          >
            {/* Retro background watermark for styling */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none print:hidden" />
            <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none print:hidden" />

            {/* Poster Header */}
            <div className="relative z-10 border-b border-zinc-805 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:border-zinc-300 print:mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 print:hidden">
                  <span className="px-2 py-0.5 bg-yellow-400 text-slate-950 font-mono text-[9px] font-black rounded-sm uppercase tracking-wide">
                    Premium Collector Poster
                  </span>
                  <span className="text-zinc-500 text-xs">2026 Edition</span>
                </div>
                <h1 className="font-sans text-3xl font-extrabold tracking-tight text-slate-50 uppercase print:text-black print:text-2xl">
                  Fussball WM 2026 Collection Tracker
                </h1>
                <p className="font-sans text-sm text-zinc-400 mt-1 max-w-xl print:text-zinc-600 print:text-xs">
                  Your official digital & printable completion map. Collect all 72 high-fidelity team stickers, glue them securely, and tracking your road to the World Cup grand stage!
                </p>
              </div>

              {/* Poster Progress Ring and Print Action */}
              <div className="flex items-center gap-4 w-full md:w-auto print:hidden">
                <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-3 flex items-center gap-3">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-95">
                      <circle cx="24" cy="24" r="20" fill="transparent" stroke="#222" strokeWidth="4" />
                      <circle cx="24" cy="24" r="20" fill="transparent" stroke="#10b981" strokeWidth="4" 
                        strokeDasharray={2 * Math.PI * 20}
                        strokeDashoffset={2 * Math.PI * 20 * (1 - overallPercentage / 100)}
                      />
                    </svg>
                    <span className="font-mono text-xs font-black text-emerald-400">{overallPercentage}%</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-zinc-400 tracking-wider">TOTAL GLUED</span>
                    <span className="block font-sans text-sm font-bold text-slate-205">{totalGlued} / {totalStickersCount}</span>
                  </div>
                </div>

                <button
                  id="print-poster-btn"
                  onClick={handlePrintPoster}
                  className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 text-slate-200 border border-zinc-800 px-4 py-3 rounded-xl font-sans text-xs font-bold cursor-pointer transition-all active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  Print Tracker
                </button>
              </div>
            </div>

            {/* Poster Sheet Big Grid - organized as beautiful posters checklists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 print:grid-cols-3 print:gap-4">
              {teams.map((t) => {
                const teamStats = getTeamProgress(t);
                return (
                  <div 
                    key={t.code} 
                    className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between hover:bg-zinc-900/70 transition-all print:bg-white print:border-zinc-300 print:text-black"
                  >
                    {/* Poster Team Row Header */}
                    <div className="flex items-center justify-between border-b border-zinc-850 pb-3 mb-4 print:border-zinc-200">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{t.flag}</span>
                        <div>
                          <h3 className="font-sans font-bold text-slate-100 text-sm print:text-black">
                            {t.name}
                          </h3>
                          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{t.group}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-emerald-400 print:text-emerald-700">
                          {teamStats.glued}/{teamStats.total}
                        </span>
                        <span className="block text-[8px] text-zinc-500 uppercase tracking-widest">GLUED</span>
                      </div>
                    </div>

                    {/* Checkbox Listing with subtle interactivity */}
                    <div className="flex flex-col gap-2.5">
                      {t.stickers.map((st) => {
                        const isGlued = userGlued[st.id] || false;
                        const ownedCount = userCopies[st.id] || 0;
                        const canGlueNow = ownedCount > 0 && !isGlued;

                        return (
                          <div 
                            key={st.id}
                            onClick={() => canGlueNow && handleGlueWithAudio(st.id)}
                            className={`flex items-center justify-between px-2.5 py-2 rounded-xl border transition-all text-xs font-sans ${
                              isGlued
                                ? 'bg-emerald-950/20 border-emerald-900/40 text-slate-200 print:bg-zinc-100 print:border-zinc-350 print:text-black'
                                : canGlueNow
                                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-250 cursor-pointer animate-pulse hover:bg-yellow-500/20'
                                : 'bg-transparent border-zinc-850 hover:border-zinc-800 text-zinc-400 print:border-zinc-200 print:text-zinc-600'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {/* Custom aesthetic checkboxes */}
                              <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                                isGlued 
                                  ? 'bg-emerald-500 text-slate-900 print:bg-emerald-600 print:text-white' 
                                  : canGlueNow 
                                  ? 'bg-yellow-500 text-slate-950' 
                                  : 'border border-zinc-750 print:border-zinc-400'
                              }`}>
                                {isGlued && <Check className="w-3 h-3 stroke-[3]" />}
                                {!isGlued && canGlueNow && <Sparkles className="w-2.5 h-2.5" />}
                              </div>

                              <span className="font-mono font-bold text-[10px] text-zinc-400">
                                #{st.number}
                              </span>
                              <span className="truncate font-semibold tracking-tight">
                                {st.name}
                              </span>
                              {st.isShiny && (
                                <span className="p-0.5 bg-linear-to-r from-amber-400 to-yellow-500 rounded text-[8px] font-black uppercase text-slate-950 scale-90 flex items-center gap-0.5 px-1 font-mono">
                                  <Flame className="w-2 h-2 fill-slate-950" />
                                  Foil
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] text-zinc-500 print:text-zinc-400">
                                {st.position.substring(0, 3).toUpperCase()}
                              </span>
                              
                              {/* Desktop interaction visual status */}
                              {!isGlued && ownedCount > 0 && (
                                <span className="text-[10px] bg-yellow-500 text-slate-950 px-1.5 py-0.5 rounded-md font-mono font-bold font-semibold uppercase animate-bounce print:hidden">
                                  GLUE!
                                </span>
                              )}
                              {isGlued && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 print:text-emerald-700" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Team Gluing Action */}
                    {!teamStats.isCompleted && (
                      <button
                        id={`poster-glue-all-${t.code}`}
                        onClick={() => handleGlueAllWithAudio(t.code)}
                        disabled={!t.stickers.some(s => (userCopies[s.id] || 0) > 0 && !userGlued[s.id])}
                        className="mt-4 py-2 w-full bg-zinc-950 hover:bg-zinc-850 disabled:bg-transparent disabled:text-zinc-650 disabled:border-transparent text-[11px] font-mono tracking-wider font-extrabold uppercase rounded-lg transition-all border border-zinc-800 disabled:cursor-not-allowed print:hidden flex items-center justify-center gap-1"
                      >
                        <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                        Glue Available ({t.stickers.filter(s => (userCopies[s.id] || 0) > 0 && !userGlued[s.id]).length})
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          // Regular Paginated Album View
          <motion.div
            key="team-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            {/* Team Navigation Banner */}
            <div className="bg-slate-900/80 border border-slate-850 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                <button
                  id="prev-team-btn"
                  onClick={handlePrevTeam}
                  className="p-2 bg-slate-950 hover:bg-slate-800 rounded-xl text-slate-300 border border-slate-800 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="text-3xl">{currentTeam.flag}</span>
                    <h2 className="font-sans text-2xl font-black text-slate-150 tracking-tight">
                      {currentTeam.name}
                    </h2>
                  </div>
                  <p className="font-mono text-xs text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                    {currentTeam.group} • CODENAME: {currentTeam.code}
                  </p>
                </div>

                <button
                  id="next-team-btn"
                  onClick={handleNextTeam}
                  className="p-2 bg-slate-950 hover:bg-slate-800 rounded-xl text-slate-300 border border-slate-800 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Progress and Glue Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <div className="flex flex-col w-full sm:w-40">
                  <div className="flex justify-between items-center mb-1 text-xs font-mono font-bold">
                    <span className="text-slate-405">PAGE PROGRESS</span>
                    <span className="text-emerald-400">{currentTeamStats.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${currentTeamStats.percentage}%` }}
                    />
                  </div>
                </div>

                {currentTeamStats.isCompleted ? (
                   <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-450 text-xs font-black uppercase tracking-wider px-3.5 py-2.5 rounded-xl border border-emerald-500/20 shadow-sm w-full sm:w-auto justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Complete!
                  </div>
                ) : (
                  <button
                    id={`glue-all-btn-${currentTeam.code}`}
                    onClick={() => handleGlueAllWithAudio(currentTeam.code)}
                    disabled={!canGlueAny}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-sans text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-all border flex items-center justify-center gap-1.5 ${
                      canGlueAny
                        ? 'bg-linear-to-r from-emerald-500 to-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-500/15'
                        : 'bg-slate-950 text-slate-600 border-slate-850 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <Trophy className="w-4 h-4" />
                    Glue Available Cards
                  </button>
                )}
              </div>
            </div>

            {/* Quick Country Selector Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1 bg-slate-950 p-2 rounded-xl border border-slate-850/80">
              {teams.map((t, index) => {
                const stats = getTeamProgress(t);
                const isSelected = index === selectedTeamIdx;
                
                return (
                  <button
                    key={t.code}
                    id={`country-selector-${t.code}`}
                    onClick={() => setSelectedTeamIdx(index)}
                    className={`p-1.5 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer border ${
                      isSelected 
                        ? 'bg-slate-900 border-slate-700 text-slate-105 shadow-sm'
                        : stats.isCompleted
                        ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-300'
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/40'
                    }`}
                  >
                    <span className="text-lg">{t.flag}</span>
                    <span className="font-mono text-[9px] uppercase font-bold mt-0.5">{t.code}</span>
                    {stats.isCompleted && (
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 6 Sticker Slots Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {currentTeam.stickers.map(st => {
                const ownedCount = userCopies[st.id] || 0;
                const isGlued = userGlued[st.id] || false;
                const duplicateCount = isGlued ? Math.max(0, ownedCount - 1) : Math.max(0, ownedCount);

                return (
                  <StickerCard
                    key={st.id}
                    sticker={st}
                    isGlued={isGlued}
                    duplicateCount={duplicateCount}
                    canGlue={ownedCount > 0 && !isGlued}
                    onGlue={() => handleGlueWithAudio(st.id)}
                    size="md"
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
