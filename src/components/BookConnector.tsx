import React, { useState } from 'react';
import { Smartphone, Share2, Download, Copy, Import, Check, Key, QrCode } from 'lucide-react';
import { getTeams } from '../data/stickers';
import { Sticker } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { audioSynth } from '../utils/audio';

interface BookConnectorProps {
  userCopies: Record<string, number>;
  userGlued: Record<string, boolean>;
  recycleTokens: number;
  onImportState: (newStateJson: string) => void;
}

export const BookConnector: React.FC<BookConnectorProps> = ({
  userCopies,
  userGlued,
  recycleTokens,
  onImportState
}) => {
  const [friendCode, setFriendCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [friendPassport, setFriendPassport] = useState<{
    ownerName: string;
    gluedCount: number;
    copiesMap: Record<string, number>;
    gluedMap: Record<string, boolean>;
    percentage: number;
  } | null>(null);

  const teams = getTeams();
  const allStickers = teams.flatMap(t => t.stickers);
  const totalStickersCount = allStickers.length;
  const totalGluedCount = allStickers.filter(s => userGlued[s.id]).length;
  const progressPercent = Math.round((totalGluedCount / totalStickersCount) * 105); // cap at 100 below
  const truePercent = Math.min(100, progressPercent);

  // Generate serialized string representation of the user state
  const handleGeneratePassportCode = (): string => {
    const sObj = {
      v: 2, // version
      g: Object.keys(userGlued).filter(k => userGlued[k]), // glued ids
      c: Object.keys(userCopies).reduce((acc, k) => {
        if (userCopies[k] > 0) acc[k] = userCopies[k];
        return acc;
      }, {} as Record<string, number>),
      t: recycleTokens,
      n: 'Master Collector'
    };
    // Return Base64 of JSON
    try {
      return btoa(JSON.stringify(sObj));
    } catch {
      return JSON.stringify(sObj);
    }
  };

  const passportCode = handleGeneratePassportCode();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(passportCode);
    setCopied(true);
    audioSynth.playChaching();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendCode) return;

    try {
      // Decode Base64 or standard JSON
      let decodedStr = '';
      try {
        decodedStr = atob(friendCode.trim());
      } catch {
        decodedStr = friendCode.trim();
      }

      const parsed = JSON.parse(decodedStr);
      
      // If version is valid (or has valid keys)
      if (parsed.g && parsed.c) {
        // Build readable friend passport overview
        const friendGluedCount = parsed.g.length;
        const friendPercentage = Math.round((friendGluedCount / totalStickersCount) * 100);

        setFriendPassport({
          ownerName: parsed.n || 'Co-Collector',
          gluedCount: friendGluedCount,
          copiesMap: parsed.c,
          gluedMap: parsed.g.reduce((acc: Record<string, boolean>, k: string) => {
            acc[k] = true;
            return acc;
          }, {}),
          percentage: friendPercentage
        });

        // Trigger State Integration callback inside App context
        onImportState(decodedStr);
        setImportStatus('SUCCESS');
        audioSynth.playShinyCelebration();
        setFriendCode('');
        
        setTimeout(() => setImportStatus('IDLE'), 4000);
      } else {
        setImportStatus('ERROR');
      }
    } catch {
      setImportStatus('ERROR');
    }
  };

  // Compare Lists to Find Matching Swap Trades!
  const getMutualTradePotential = () => {
    if (!friendPassport) return null;

    // What I have extra duplicates of, that the FRIEND has missing!
    const iCanGiveToFriend = allStickers.filter(
      st => (userCopies[st.id] || 0) > 1 && !friendPassport.gluedMap[st.id]
    );

    // What the FRIEND has extra duplicates of, that I have missing!
    const friendCanGiveToMe = allStickers.filter(
      st => (friendPassport.copiesMap[st.id] || 0) > 1 && !userGlued[st.id]
    );

    return {
      gives: iCanGiveToFriend,
      receives: friendCanGiveToMe
    };
  };

  const matchPotential = getMutualTradePotential();

  return (
    <div id="book-connector-module" className="w-full max-w-5xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* LEFT: User's Digital Passport Card */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden h-[480px]">
        {/* Artistic details */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-cyan-600/5 blur-3xl rounded-full" />

        <div>
          <div className="flex justify-between items-center mb-5 relative z-10">
            <h3 className="font-sans text-xl font-black text-slate-100 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-500 animate-pulse" />
              Digital Book Passport
            </h3>
            <span className="bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-[9px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full">
              Book Companion Activated
            </span>
          </div>

          <p className="font-sans text-xs text-slate-400 leading-relaxed mb-6">
            Generate and copy your Album Passport Code. Bring this code to another device or share it with a classmate to compare progress, swap inventory instantly, and merge albums!
          </p>

          {/* Wallet Portrait Ticket Card Graphics */}
          <div className="bg-linear-to-br from-emerald-600/90 via-emerald-700 to-teal-850 text-white rounded-2xl p-5 border border-emerald-400 shadow-xl relative overflow-hidden flex flex-col justify-between h-[230px]">
            {/* Watermark Logo */}
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
              <QrCode className="w-48 h-48 stroke-[1]" />
            </div>

            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[9px] text-emerald-200 uppercase tracking-widest block">PASS PASS_SEC</span>
                <span className="font-sans text-base font-black uppercase tracking-tight">Panini Digital Guide #2026</span>
              </div>
              <div className="bg-slate-950/20 px-2 py-0.5 rounded text-[10px] font-mono border border-white/10">
                ACTIVE
              </div>
            </div>

            {/* Passport Statistics Row */}
            <div className="grid grid-cols-3 gap-2 border-t border-b border-white/10 py-3.5 my-2 text-center">
              <div>
                <span className="block text-[8px] font-mono text-emerald-250 uppercase tracking-widest">GLUED STICKERS</span>
                <span className="block font-sans text-lg font-black">{totalGluedCount}</span>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-emerald-250 uppercase tracking-widest">COMPLETION</span>
                <span className="block font-sans text-lg font-black text-yellow-300">{truePercent}%</span>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-emerald-250 uppercase tracking-widest">RECYCLED CACHE</span>
                <span className="block font-sans text-lg font-black">{recycleTokens}T</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-emerald-250">
              <span>HOLDER: COMPANION APPLET</span>
              <span className="flex items-center gap-1">
                <Key className="w-3 h-3 text-yellow-300" />
                KEY ID: 0x{passportCode.substring(0, 6)}...
              </span>
            </div>
          </div>
        </div>

        {/* Action Button to copy passport block */}
        <button
          id="copy-passport-btn"
          onClick={handleCopyCode}
          className="w-full relative z-10 py-3 font-sans text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all border flex items-center justify-center gap-2 bg-slate-950 border-slate-800 hover:bg-slate-850 text-slate-205"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              Passport Clipboard Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-emerald-500" />
              Copy Book Passport Code
            </>
          )}
        </button>
      </div>

      {/* RIGHT: Connect Friend Album State */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 flex flex-col justify-between min-h-[480px]">
        <div>
          <h3 className="font-sans text-xl font-black text-slate-100 flex items-center gap-2 mb-2">
            <Import className="w-5 h-5 text-indigo-500" />
            Connect / Load Digital Book
          </h3>
          <p className="font-sans text-xs text-slate-400 leading-relaxed mb-5">
            Connect a companion book to synchronize. Paste a friend's passport config signature below to discover what extra swaps you can automatically trade direct!
          </p>

          <form onSubmit={handleImportCode} className="space-y-3">
            <div className="relative">
              <textarea
                id="friend-passport-area"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                placeholder="Paste Book Passport cryptographic signature code here..."
                rows={4}
                className="w-full p-3 bg-slate-950 border border-slate-850 focus:border-indigo-650 rounded-xl text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-hidden"
                required
              />
            </div>

            <div className="flex justify-between items-center">
              {importStatus === 'SUCCESS' && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                  <Check className="w-3.5 h-3.5" />
                  Passport Decoded & Connected Successfully!
                </span>
              )}
              {importStatus === 'ERROR' && (
                <span className="text-xs text-rose-450 font-bold flex items-center gap-1">
                  Invalid signature passport detected.
                </span>
              )}
              <div />

              <button
                id="submit-connect-btn"
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-455 text-white font-sans text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-indigo-600/5 font-semibold"
              >
                Scan Code & Link
              </button>
            </div>
          </form>
        </div>

        {/* Decoded Friend Info Compare Grid */}
        <div className="mt-6 pt-5 border-t border-slate-850">
          <AnimatePresence mode="wait">
            {friendPassport ? (
              <motion.div
                key="friend-report"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-955 rounded-xl p-4 border border-slate-850 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-sans text-xs font-black text-slate-100 uppercase tracking-widest">
                      Connected Comparison Report
                    </h4>
                    <span className="text-[10px] text-zinc-500">Live compare results with <strong>{friendPassport.ownerName}</strong> ({friendPassport.percentage}% complete)</span>
                  </div>
                  <button
                    id="disconnect-friend-btn"
                    onClick={() => setFriendPassport(null)}
                    className="text-[9px] font-mono uppercase bg-slate-900 px-2 py-1 border border-slate-800 text-rose-400 hover:text-rose-350 rounded"
                  >
                    Disconnect
                  </button>
                </div>

                {/* Match Indicators */}
                <div className="grid grid-cols-2 gap-3 text-xs mt-1">
                  <div className="p-2.5 bg-slate-900 border border-slate-850 rounded-lg">
                    <span className="block text-[8px] font-mono text-zinc-550 uppercase tracking-wider mb-1">THEY CAN OFFER YOU</span>
                    <span className="font-sans font-bold text-slate-200">
                      {matchPotential?.receives.length || 0} missing cards
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-850 rounded-lg">
                    <span className="block text-[8px] font-mono text-zinc-550 uppercase tracking-wider mb-1">YOU CAN OFFER THEM</span>
                    <span className="font-sans font-bold text-slate-205">
                      {matchPotential?.gives.length || 0} missing cards
                    </span>
                  </div>
                </div>

                {/* Listing of trade matches */}
                {matchPotential && (matchPotential.gives.length > 0 || matchPotential.receives.length > 0) ? (
                  <div className="max-h-[80px] overflow-y-auto font-mono text-[9px] text-slate-400 space-y-1 no-scrollbar">
                    {matchPotential.receives.slice(0, 3).map(st => (
                      <div key={st.id} className="flex justify-between text-emerald-400">
                        <span>They have extra: #{st.number} {st.name}</span>
                        <span>(You Need)</span>
                      </div>
                    ))}
                    {matchPotential.gives.slice(0, 3).map(st => (
                      <div key={st.id} className="flex justify-between text-yellow-405">
                        <span>You have extra: #{st.number} {st.name}</span>
                        <span>(They Need)</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-500 italic text-center">
                    No matching direct duplicate matches detected. Sync up on global store feed to match wider needs!
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs italic">
                *No connected book companion detected. Link one above!
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
};
