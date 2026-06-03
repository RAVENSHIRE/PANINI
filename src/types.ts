export interface Sticker {
  id: string;
  number: number;
  name: string;
  position: 'Badge' | 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  teamCode: string;
  teamName: string;
  isShiny: boolean;
  rating: number; // e.g., 85-99
  club: string;
}

export interface Team {
  code: string;
  name: string;
  group: string;
  flag: string; // Emoji flag or inline styled indicator
  primaryColor: string; // tailwind color prefix like 'blue-600', 'green-600'
  accentColor: string; // tailwind accent color
  stickers: Sticker[];
}

export interface UserCollection {
  [stickerId: string]: number; // stickerId -> owned count
}

export interface MarketOffer {
  id: string;
  offeredSticker: Sticker;
  requestedSticker: Sticker;
  source: 'AI_TRADER' | 'USER';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  timestamp: string;
}

export interface DailyQuest {
  id: string;
  description: string;
  target: number;
  current: number;
  rewardPacks: number;
  completed: boolean;
}

export interface PackOpeningHistory {
  id: string;
  timestamp: string;
  stickers: Sticker[];
  hasShiny: boolean;
}

export type PackType = 'standard' | 'shiny' | 'north_america' | 'europe' | 'south_america';
