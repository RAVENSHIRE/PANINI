import { Sticker } from '../types';

export type RarityTier = 'LEGENDARY' | 'EPIC' | 'RARE' | 'COMMON';

interface RarityConfig {
  name: string;
  colorClass: string;
  bgClass: string;
  badgeClass: string;
}

export const RARITY_META: Record<RarityTier, RarityConfig> = {
  LEGENDARY: {
    name: 'Legendary',
    colorClass: 'text-amber-450 border-amber-500/30',
    bgClass: 'from-amber-950/20 to-amber-900/10 border-amber-500/30',
    badgeClass: 'bg-amber-500/15 text-yellow-250 border-amber-500/35',
  },
  EPIC: {
    name: 'Epic',
    colorClass: 'text-purple-400 border-purple-500/20',
    bgClass: 'from-purple-950/20 to-purple-900/10 border-purple-500/20',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
  },
  RARE: {
    name: 'Rare',
    colorClass: 'text-cyan-400 border-cyan-500/20',
    bgClass: 'from-cyan-950/20 to-cyan-900/10 border-cyan-500/20',
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
  },
  COMMON: {
    name: 'Common',
    colorClass: 'text-slate-400 border-slate-500/10',
    bgClass: 'from-slate-950/20 to-slate-900/10 border-slate-550/15',
    badgeClass: 'bg-slate-500/10 text-slate-350 border-slate-550/15',
  },
};

export function getRarity(rating: number): RarityTier {
  if (rating >= 93) return 'LEGENDARY';
  if (rating >= 88) return 'EPIC';
  if (rating >= 83) return 'RARE';
  return 'COMMON';
}

export interface CollectionStats {
  uniqueOwnedCount: number;
  gluedCount: number;
  shiniesGlued: number;
  completionPercentage: number;
  duplicatesCount: number;
}

export function computeCollectionStats(
  allStickers: Sticker[],
  userCopies: Record<string, number>,
  userGlued: Record<string, boolean>
): CollectionStats {
  let uniqueOwnedCount = 0;
  let gluedCount = 0;
  let shiniesGlued = 0;
  let duplicatesCount = 0;

  allStickers.forEach((s) => {
    const copies = userCopies[s.id] || 0;
    const isGlued = !!userGlued[s.id];

    if (copies > 0) {
      uniqueOwnedCount++;
    }

    if (isGlued) {
      gluedCount++;
      if (s.isShiny) {
        shiniesGlued++;
      }
    }

    const extra = isGlued ? Math.max(0, copies - 1) : Math.max(0, copies);
    duplicatesCount += extra;
  });

  const completionPercentage = allStickers.length > 0
    ? Math.round((gluedCount / allStickers.length) * 100)
    : 0;

  return {
    uniqueOwnedCount,
    gluedCount,
    shiniesGlued,
    completionPercentage,
    duplicatesCount,
  };
}
