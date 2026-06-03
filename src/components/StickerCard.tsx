import React, { useState } from 'react';
import { Sticker } from '../types';
import { Star, Shield, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StickerCardProps {
  sticker: Sticker;
  isGlued?: boolean;
  duplicateCount?: number;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  canGlue?: boolean;
  onGlue?: () => void;
}

export const StickerCard: React.FC<StickerCardProps> = ({
  sticker,
  isGlued = true,
  duplicateCount = 0,
  onClick,
  size = 'md',
  canGlue = false,
  onGlue
}) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Mouse move effect for holographic reflection
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  const getCardStyle = () => {
    if (!isGlued) {
      return 'border-2 border-dashed border-emerald-800/40 bg-emerald-950/10 text-emerald-800/40';
    }
    
    if (sticker.isShiny) {
      return 'bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-500 text-black border-2 border-yellow-200 shadow-[0_0_15px_rgba(251,191,36,0.3)] duration-300';
    }
    
    // Regular sticker
    return 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-950 border border-slate-300 shadow-sm duration-300';
  };

  // Holographic shimmer radial gradient style
  const shimmerStyle: React.CSSProperties = isHovered && sticker.isShiny && isGlued
    ? {
        background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(255, 255, 255, 0.4) 0%, rgba(245, 158, 11, 0.2) 30%, rgba(255, 255, 255, 0) 70%)`,
      }
    : {};

  if (!isGlued) {
    return (
      <div 
        id={`slot-${sticker.id}`}
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center rounded-xl p-3 select-none text-center h-full min-h-[160px] md:min-h-[220px] transition-all ${getCardStyle()}`}
      >
        <span className="font-mono text-xs font-semibold bg-emerald-950/10 px-2 py-0.5 rounded-full mb-1">
          #{sticker.number}
        </span>
        <div className="w-10 h-10 rounded-full bg-emerald-950/5 flex items-center justify-center mb-2">
          {sticker.position === 'Badge' ? (
            <Shield className="w-5 h-5 opacity-40 text-emerald-800/50" />
          ) : (
            <Star className="w-5 h-5 opacity-40 text-emerald-800/50" />
          )}
        </div>
        <p className="font-sans text-xs font-medium text-emerald-850/80 leading-tight line-clamp-1 max-w-[90%]">
          {sticker.name}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-800/50 mt-1 font-bold">
          {sticker.position}
        </p>

        {canGlue && (
          <motion.button
            id={`glue-btn-${sticker.id}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              if (onGlue) onGlue();
            }}
            className="absolute bottom-2 left-2 right-2 bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold py-1 px-2 rounded-lg shadow-md border border-emerald-400 cursor-pointer animate-pulse"
          >
            Glue Me!
          </motion.button>
        )}
      </div>
    );
  }

  return (
    <div
      id={`sticker-card-${sticker.id}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-xl overflow-hidden cursor-pointer select-none border shadow-md transition-all h-full flex flex-col justify-between ${getCardStyle()} ${
        size === 'sm' ? 'p-1.5 md:p-2 min-h-[120px]' : size === 'lg' ? 'p-4 min-h-[260px]' : 'p-3 min-h-[180px] md:min-h-[210px]'
      }`}
    >
      {/* Glinting/Shiny Reflection Layer */}
      {sticker.isShiny && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-200 opacity-80" 
          style={shimmerStyle}
        />
      )}

      {/* Foil Grid Texture on Shiny */}
      {sticker.isShiny && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 bg-repeat bg-center"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "6px 6px"
          }}
        />
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between w-full z-10">
        <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
          sticker.isShiny ? 'bg-amber-950/20 text-yellow-950' : 'bg-slate-300/40 text-slate-800'
        }`}>
          #{sticker.number}
        </span>
        <div className="flex items-center gap-1">
          {sticker.isShiny && <Trophy className="w-3.5 h-3.5 text-amber-950 animate-bounce" />}
          <span className={`font-mono text-xs font-black ${sticker.isShiny ? 'text-amber-900' : 'text-slate-700'}`}>
            {sticker.rating}
          </span>
        </div>
      </div>

      {/* Sticker artwork profile element */}
      <div className="flex-grow flex flex-col items-center justify-center my-1 z-10">
        <div className={`relative rounded-full flex items-center justify-center transition-transform ${
          size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-20 h-20' : 'w-14 h-14'
        } ${
          sticker.isShiny 
            ? 'bg-gradient-to-br from-yellow-300 to-amber-600 ring-2 ring-yellow-100 shadow-md' 
            : 'bg-gradient-to-br from-indigo-100 to-indigo-300 ring-2 ring-slate-100'
        }`}>
          {sticker.position === 'Badge' ? (
            <Shield className={`w-1/2 h-1/2 ${sticker.isShiny ? 'text-yellow-100' : 'text-indigo-950'}`} />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <span className={`font-black text-center leading-none ${size === 'lg' ? 'text-2xl' : 'text-sm'} ${sticker.isShiny ? 'text-yellow-150 text-white' : 'text-slate-900'}`}>
                {sticker.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}

          {/* Micro flag layer inside slot */}
          {sticker.position !== 'Badge' && (
            <div className="absolute -bottom-1 -right-1 bg-white text-xs px-1 rounded shadow-sm leading-none flex items-center">
              {sticker.teamName === 'United States' ? '🇺🇸' : 
               sticker.teamName === 'Mexico' ? '🇲🇽' :
               sticker.teamName === 'Canada' ? '🇨🇦' :
               sticker.teamName === 'Argentina' ? '🇦🇷' :
               sticker.teamName === 'Brazil' ? '🇧🇷' :
               sticker.teamName === 'France' ? '🇫🇷' :
               sticker.teamName === 'England' ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿' :
               sticker.teamName === 'Spain' ? '🇪🇸' :
               sticker.teamName === 'Germany' ? '🇩🇪' :
               sticker.teamName === 'Italy' ? '🇮🇹' :
               sticker.teamName === 'Japan' ? '🇯🇵' : '🇲🇦'}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full text-center z-10 mt-1">
        <h4 className={`font-sans font-bold leading-tight line-clamp-1 truncate ${
          size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs'
        } ${sticker.isShiny ? 'text-amber-950' : 'text-slate-950'}`}>
          {sticker.name}
        </h4>
        <div className="flex items-center justify-between mt-1 pt-1 border-t border-black/5">
          <span className={`font-sans text-[9px] uppercase tracking-wider font-semibold ${
            sticker.isShiny ? 'text-amber-900/80' : 'text-slate-650'
          }`}>
            {sticker.teamCode}
          </span>
          <span className={`font-mono text-[9px] font-medium ${
            sticker.isShiny ? 'text-amber-900/80' : 'text-slate-650'
          }`}>
            {sticker.position}
          </span>
        </div>
      </div>

      {/* Duplicate Badge */}
      <AnimatePresence>
        {duplicateCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-mono font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center border border-white shadow-md z-30"
          >
            +{duplicateCount}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gold foil reflection overlay */}
      {sticker.isShiny && (
        <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none opacity-20 bg-linear-to-tl from-white to-transparent" />
      )}
    </div>
  );
};
