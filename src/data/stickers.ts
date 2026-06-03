import { Team, Sticker } from '../types';

export const TEAMS_DATA: Omit<Team, 'stickers'>[] = [
  {
    code: 'USA',
    name: 'United States',
    group: 'Group A',
    flag: '🇺🇸',
    primaryColor: 'blue-700',
    accentColor: 'red-500'
  },
  {
    code: 'MEX',
    name: 'Mexico',
    group: 'Group A',
    flag: '🇲🇽',
    primaryColor: 'emerald-700',
    accentColor: 'red-600'
  },
  {
    code: 'CAN',
    name: 'Canada',
    group: 'Group A',
    flag: '🇨🇦',
    primaryColor: 'red-600',
    accentColor: 'gray-100'
  },
  {
    code: 'ARG',
    name: 'Argentina',
    group: 'Group B',
    flag: '🇦🇷',
    primaryColor: 'sky-400',
    accentColor: 'amber-400'
  },
  {
    code: 'BRA',
    name: 'Brazil',
    group: 'Group B',
    flag: '🇧🇷',
    primaryColor: 'yellow-400',
    accentColor: 'green-600'
  },
  {
    code: 'FRA',
    name: 'France',
    group: 'Group B',
    flag: '🇫🇷',
    primaryColor: 'blue-800',
    accentColor: 'red-600'
  },
  {
    code: 'ENG',
    name: 'England',
    group: 'Group C',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    primaryColor: 'slate-100',
    accentColor: 'blue-900'
  },
  {
    code: 'ESP',
    name: 'Spain',
    group: 'Group C',
    flag: '🇪🇸',
    primaryColor: 'red-600',
    accentColor: 'yellow-500'
  },
  {
    code: 'GER',
    name: 'Germany',
    group: 'Group C',
    flag: '🇩🇪',
    primaryColor: 'zinc-900',
    accentColor: 'yellow-500'
  },
  {
    code: 'ITA',
    name: 'Italy',
    group: 'Group D',
    flag: '🇮🇹',
    primaryColor: 'indigo-700',
    accentColor: 'emerald-500'
  },
  {
    code: 'JPN',
    name: 'Japan',
    group: 'Group D',
    flag: '🇯🇵',
    primaryColor: 'blue-900',
    accentColor: 'red-600'
  },
  {
    code: 'MAR',
    name: 'Morocco',
    group: 'Group D',
    flag: '🇲🇦',
    primaryColor: 'red-700',
    accentColor: 'emerald-600'
  }
];

const STICKERS_BY_TEAM: Record<string, Omit<Sticker, 'teamName' | 'teamCode'>[]> = {
  USA: [
    { id: 'USA_01', number: 1, name: 'USA Crest', position: 'Badge', isShiny: true, rating: 90, club: 'US Soccer' },
    { id: 'USA_02', number: 2, name: 'Christian Pulisic', position: 'Forward', isShiny: true, rating: 88, club: 'AC Milan' },
    { id: 'USA_03', number: 3, name: 'Weston McKennie', position: 'Midfielder', isShiny: false, rating: 83, club: 'Juventus' },
    { id: 'USA_04', number: 4, name: 'Antonee Robinson', position: 'Defender', isShiny: false, rating: 82, club: 'Fulham' },
    { id: 'USA_05', number: 5, name: 'Matt Turner', position: 'Goalkeeper', isShiny: false, rating: 80, club: 'Crystal Palace' },
    { id: 'USA_06', number: 6, name: 'Folarin Balogun', position: 'Forward', isShiny: false, rating: 81, club: 'Monaco' }
  ],
  MEX: [
    { id: 'MEX_01', number: 7, name: 'Mexico Crest', position: 'Badge', isShiny: true, rating: 90, club: 'FMF' },
    { id: 'MEX_02', number: 8, name: 'Santiago Giménez', position: 'Forward', isShiny: true, rating: 85, club: 'Feyenoord' },
    { id: 'MEX_03', number: 9, name: 'Edson Álvarez', position: 'Midfielder', isShiny: false, rating: 84, club: 'West Ham' },
    { id: 'MEX_04', number: 10, name: 'César Montes', position: 'Defender', isShiny: false, rating: 80, club: 'Al-Shabab' },
    { id: 'MEX_05', number: 11, name: 'Luis Malagón', position: 'Goalkeeper', isShiny: false, rating: 81, club: 'Club América' },
    { id: 'MEX_06', number: 12, name: 'Hirving Lozano', position: 'Forward', isShiny: false, rating: 83, club: 'San Diego FC' }
  ],
  CAN: [
    { id: 'CAN_01', number: 13, name: 'Canada Crest', position: 'Badge', isShiny: true, rating: 90, club: 'Canada Soccer' },
    { id: 'CAN_02', number: 14, name: 'Alphonso Davies', position: 'Defender', isShiny: true, rating: 87, club: 'Bayern Munich' },
    { id: 'CAN_03', number: 15, name: 'Stephen Eustáquio', position: 'Midfielder', isShiny: false, rating: 81, club: 'Porto' },
    { id: 'CAN_04', number: 16, name: 'Alistair Johnston', position: 'Defender', isShiny: false, rating: 79, club: 'Celtic' },
    { id: 'CAN_05', number: 17, name: 'Maxime Crépeau', position: 'Goalkeeper', isShiny: false, rating: 78, club: 'Portland Timbers' },
    { id: 'CAN_06', number: 18, name: 'Jonathan David', position: 'Forward', isShiny: false, rating: 84, club: 'Lille' }
  ],
  ARG: [
    { id: 'ARG_01', number: 19, name: 'Argentina Crest', position: 'Badge', isShiny: true, rating: 95, club: 'AFA' },
    { id: 'ARG_02', number: 20, name: 'Lionel Messi', position: 'Forward', isShiny: true, rating: 97, club: 'Inter Miami' },
    { id: 'ARG_03', number: 21, name: 'Rodrigo De Paul', position: 'Midfielder', isShiny: false, rating: 86, club: 'Atlético Madrid' },
    { id: 'ARG_04', number: 22, name: 'Cristian Romero', position: 'Defender', isShiny: false, rating: 88, club: 'Tottenham' },
    { id: 'ARG_05', number: 23, name: 'Emiliano Martínez', position: 'Goalkeeper', isShiny: true, rating: 89, club: 'Aston Villa' },
    { id: 'ARG_06', number: 24, name: 'Lautaro Martínez', position: 'Forward', isShiny: false, rating: 88, club: 'Inter Milan' }
  ],
  BRA: [
    { id: 'BRA_01', number: 25, name: 'Brazil Crest', position: 'Badge', isShiny: true, rating: 94, club: 'CBF' },
    { id: 'BRA_02', number: 26, name: 'Vinícius Júnior', position: 'Forward', isShiny: true, rating: 94, club: 'Real Madrid' },
    { id: 'BRA_03', number: 27, name: 'Bruno Guimarães', position: 'Midfielder', isShiny: false, rating: 87, club: 'Newcastle' },
    { id: 'BRA_04', number: 28, name: 'Marquinhos', position: 'Defender', isShiny: false, rating: 87, club: 'PSG' },
    { id: 'BRA_05', number: 29, name: 'Alisson Becker', position: 'Goalkeeper', isShiny: true, rating: 89, club: 'Liverpool' },
    { id: 'BRA_06', number: 30, name: 'Rodrygo Silva', position: 'Forward', isShiny: false, rating: 86, club: 'Real Madrid' }
  ],
  FRA: [
    { id: 'FRA_01', number: 31, name: 'France Crest', position: 'Badge', isShiny: true, rating: 94, club: 'FFF' },
    { id: 'FRA_02', number: 32, name: 'Kylian Mbappé', position: 'Forward', isShiny: true, rating: 95, club: 'Real Madrid' },
    { id: 'FRA_03', number: 33, name: 'Antoine Griezmann', position: 'Midfielder', isShiny: false, rating: 88, club: 'Atlético Madrid' },
    { id: 'FRA_04', number: 34, name: 'William Saliba', position: 'Defender', isShiny: false, rating: 89, club: 'Arsenal' },
    { id: 'FRA_05', number: 35, name: 'Mike Maignan', position: 'Goalkeeper', isShiny: false, rating: 86, club: 'AC Milan' },
    { id: 'FRA_06', number: 36, name: 'Ousmane Dembélé', position: 'Forward', isShiny: false, rating: 85, club: 'PSG' }
  ],
  ENG: [
    { id: 'ENG_01', number: 37, name: 'England Crest', position: 'Badge', isShiny: true, rating: 93, club: 'FA' },
    { id: 'ENG_02', number: 38, name: 'Jude Bellingham', position: 'Midfielder', isShiny: true, rating: 93, club: 'Real Madrid' },
    { id: 'ENG_03', number: 39, name: 'Declan Rice', position: 'Midfielder', isShiny: false, rating: 88, club: 'Arsenal' },
    { id: 'ENG_04', number: 40, name: 'John Stones', position: 'Defender', isShiny: false, rating: 86, club: 'Manchester City' },
    { id: 'ENG_05', number: 41, name: 'Jordan Pickford', position: 'Goalkeeper', isShiny: false, rating: 84, club: 'Everton' },
    { id: 'ENG_06', number: 42, name: 'Harry Kane', position: 'Forward', isShiny: true, rating: 91, club: 'Bayern Munich' }
  ],
  ESP: [
    { id: 'ESP_01', number: 43, name: 'Spain Crest', position: 'Badge', isShiny: true, rating: 93, club: 'RFEF' },
    { id: 'ESP_02', number: 44, name: 'Lamine Yamal', position: 'Forward', isShiny: true, rating: 92, club: 'Barcelona' },
    { id: 'ESP_03', number: 45, name: 'Rodri', position: 'Midfielder', isShiny: true, rating: 94, club: 'Manchester City' },
    { id: 'ESP_04', number: 46, name: 'Aymeric Laporte', position: 'Defender', isShiny: false, rating: 84, club: 'Al-Nassr' },
    { id: 'ESP_05', number: 47, name: 'Unai Simón', position: 'Goalkeeper', isShiny: false, rating: 85, club: 'Athletic Bilbao' },
    { id: 'ESP_06', number: 48, name: 'Nico Williams', position: 'Forward', isShiny: false, rating: 86, club: 'Athletic Bilbao' }
  ],
  GER: [
    { id: 'GER_01', number: 49, name: 'Germany Crest', position: 'Badge', isShiny: true, rating: 92, club: 'DFB' },
    { id: 'GER_02', number: 50, name: 'Florian Wirtz', position: 'Midfielder', isShiny: true, rating: 90, club: 'Bayer Leverkusen' },
    { id: 'GER_03', number: 51, name: 'Jamal Musiala', position: 'Midfielder', isShiny: true, rating: 90, club: 'Bayern Munich' },
    { id: 'GER_04', number: 52, name: 'Antonio Rüdiger', position: 'Defender', isShiny: false, rating: 88, club: 'Real Madrid' },
    { id: 'GER_05', number: 53, name: 'Marc-André ter Stegen', position: 'Goalkeeper', isShiny: false, rating: 87, club: 'Barcelona' },
    { id: 'GER_06', number: 54, name: 'Kai Havertz', position: 'Forward', isShiny: false, rating: 85, club: 'Arsenal' }
  ],
  ITA: [
    { id: 'ITA_01', number: 55, name: 'Italy Crest', position: 'Badge', isShiny: true, rating: 91, club: 'FIGC' },
    { id: 'ITA_02', number: 56, name: 'Nicolò Barella', position: 'Midfielder', isShiny: true, rating: 89, club: 'Inter Milan' },
    { id: 'ITA_03', number: 57, name: 'Federico Chiesa', position: 'Forward', isShiny: false, rating: 84, club: 'Liverpool' },
    { id: 'ITA_04', number: 58, name: 'Alessandro Bastoni', position: 'Defender', isShiny: false, rating: 87, club: 'Inter Milan' },
    { id: 'ITA_05', number: 59, name: 'Gianluigi Donnarumma', position: 'Goalkeeper', isShiny: true, rating: 88, club: 'PSG' },
    { id: 'ITA_06', number: 60, name: 'Gianluca Scamacca', position: 'Forward', isShiny: false, rating: 81, club: 'Atalanta' }
  ],
  JPN: [
    { id: 'JPN_01', number: 61, name: 'Japan Crest', position: 'Badge', isShiny: true, rating: 88, club: 'JFA' },
    { id: 'JPN_02', number: 62, name: 'Kaoru Mitoma', position: 'Forward', isShiny: true, rating: 84, club: 'Brighton' },
    { id: 'JPN_03', number: 63, name: 'Wataru Endo', position: 'Midfielder', isShiny: false, rating: 81, club: 'Liverpool' },
    { id: 'JPN_04', number: 64, name: 'Takehiro Tomiyasu', position: 'Defender', isShiny: false, rating: 81, club: 'Arsenal' },
    { id: 'JPN_05', number: 65, name: 'Zion Suzuki', position: 'Goalkeeper', isShiny: false, rating: 77, club: 'Parma' },
    { id: 'JPN_06', number: 66, name: 'Ayase Ueda', position: 'Forward', isShiny: false, rating: 79, club: 'Feyenoord' }
  ],
  MAR: [
    { id: 'MAR_01', number: 67, name: 'Morocco Crest', position: 'Badge', isShiny: true, rating: 89, club: 'FRMF' },
    { id: 'MAR_02', number: 68, name: 'Achraf Hakimi', position: 'Defender', isShiny: true, rating: 88, club: 'PSG' },
    { id: 'MAR_03', number: 69, name: 'Sofyan Amrabat', position: 'Midfielder', isShiny: false, rating: 81, club: 'Fenerbahçe' },
    { id: 'MAR_04', number: 70, name: 'Nayef Aguerd', position: 'Defender', isShiny: false, rating: 80, club: 'Real Sociedad' },
    { id: 'MAR_05', number: 71, name: 'Yassine Bounou', position: 'Goalkeeper', isShiny: true, rating: 84, club: 'Al-Hilal' },
    { id: 'MAR_06', number: 72, name: 'Youssef En-Nesyri', position: 'Forward', isShiny: false, rating: 81, club: 'Fenerbahçe' }
  ]
};

export function getAllStickers(): Sticker[] {
  const all: Sticker[] = [];
  TEAMS_DATA.forEach(teamInfo => {
    const stickersRaw = STICKERS_BY_TEAM[teamInfo.code] || [];
    stickersRaw.forEach(st => {
      all.push({
        ...st,
        teamCode: teamInfo.code,
        teamName: teamInfo.name
      });
    });
  });
  return all.sort((a, b) => a.number - b.number);
}

export function getTeams(): Team[] {
  const allStickers = getAllStickers();
  return TEAMS_DATA.map(teamInfo => {
    return {
      ...teamInfo,
      stickers: allStickers.filter(s => s.teamCode === teamInfo.code)
    } as Team;
  });
}

// Generate pack of 5 random stickers.
// To make it fun, let's have a 12% chance for each card to be shiny,
// but ensure at least 1 player is over rating 84, or similar.
export function generatePack(): Sticker[] {
  const all = getAllStickers();
  const pack: Sticker[] = [];
  
  // Pick 5 random items without duplicating inside the same pack
  const available = [...all];
  for (let i = 0; i < 5; i++) {
    const idx = Math.floor(Math.random() * available.length);
    const sticker = available[idx];
    pack.push(sticker);
    available.splice(idx, 1);
  }
  
  return pack;
}

// Generate an AI trade offer based on what user has duplicates of
// and what the user is missing.
export function generateSmartTrade(
  userDuplicates: Sticker[],
  userMissing: Sticker[]
): { offered: Sticker; requested: Sticker } | null {
  if (userDuplicates.length === 0 || userMissing.length === 0) {
    return null;
  }

  // Choose a random duplicate the user has to request from them,
  // and offer them a random missing sticker that has a similar or slightly lower/higher rating
  const requestedIdx = Math.floor(Math.random() * userDuplicates.length);
  const requested = userDuplicates[requestedIdx];

  // Try to find a missing sticker with similar rating/type (e.g. shininess)
  let offeredCandidates = userMissing.filter(s => s.isShiny === requested.isShiny);
  if (offeredCandidates.length === 0) {
    offeredCandidates = userMissing;
  }

  const offered = offeredCandidates[Math.floor(Math.random() * offeredCandidates.length)];

  return { offered, requested };
}
