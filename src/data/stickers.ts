import { Team, Sticker } from '../types';

// Simple LCG pseudo-random generator to make roster generation fully deterministic
function createSeededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return function() {
    h = (h * 1664525 + 1013904223) | 0;
    return (h >>> 0) / 4294967296;
  };
}

export const TEAMS_DATA: Omit<Team, 'stickers'>[] = [
  // Group A
  { code: 'USA', name: 'United States', group: 'Group A', flag: '🇺🇸', primaryColor: 'blue-700', accentColor: 'red-500' },
  { code: 'MEX', name: 'Mexico', group: 'Group A', flag: '🇲🇽', primaryColor: 'emerald-700', accentColor: 'red-600' },
  { code: 'CAN', name: 'Canada', group: 'Group A', flag: '🇨🇦', primaryColor: 'red-600', accentColor: 'white' },
  { code: 'HON', name: 'Honduras', group: 'Group A', flag: '🇭🇳', primaryColor: 'sky-600', accentColor: 'white' },
  // Group B
  { code: 'ARG', name: 'Argentina', group: 'Group B', flag: '🇦🇷', primaryColor: 'sky-400', accentColor: 'amber-400' },
  { code: 'BRA', name: 'Brazil', group: 'Group B', flag: '🇧🇷', primaryColor: 'yellow-400', accentColor: 'green-600' },
  { code: 'URU', name: 'Uruguay', group: 'Group B', flag: '🇺🇾', primaryColor: 'sky-600', accentColor: 'white' },
  { code: 'COL', name: 'Colombia', group: 'Group B', flag: '🇨🇴', primaryColor: 'yellow-550', accentColor: 'blue-700' },
  // Group C
  { code: 'FRA', name: 'France', group: 'Group C', flag: '🇫🇷', primaryColor: 'blue-800', accentColor: 'red-600' },
  { code: 'ENG', name: 'England', group: 'Group C', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', primaryColor: 'slate-100', accentColor: 'blue-900' },
  { code: 'ESP', name: 'Spain', group: 'Group C', flag: '🇪🇸', primaryColor: 'red-600', accentColor: 'yellow-500' },
  { code: 'GER', name: 'Germany', group: 'Group C', flag: '🇩🇪', primaryColor: 'zinc-900', accentColor: 'yellow-500' },
  // Group D
  { code: 'ITA', name: 'Italy', group: 'Group D', flag: '🇮🇹', primaryColor: 'indigo-700', accentColor: 'emerald-500' },
  { code: 'JPN', name: 'Japan', group: 'Group D', flag: '🇯🇵', primaryColor: 'blue-900', accentColor: 'red-600' },
  { code: 'MAR', name: 'Morocco', group: 'Group D', flag: '🇲🇦', primaryColor: 'red-700', accentColor: 'emerald-600' },
  { code: 'SEN', name: 'Senegal', group: 'Group D', flag: '🇸🇳', primaryColor: 'green-700', accentColor: 'yellow-500' },
  // Group E
  { code: 'POR', name: 'Portugal', group: 'Group E', flag: '🇵🇹', primaryColor: 'rose-700', accentColor: 'emerald-600' },
  { code: 'BEL', name: 'Belgium', group: 'Group E', flag: '🇧🇪', primaryColor: 'red-700', accentColor: 'yellow-550' },
  { code: 'CRO', name: 'Croatia', group: 'Group E', flag: '🇭🇷', primaryColor: 'red-600', accentColor: 'white' },
  { code: 'NED', name: 'Netherlands', group: 'Group E', flag: '🇳🇱', primaryColor: 'orange-500', accentColor: 'blue-850' },
  // Group F
  { code: 'SUI', name: 'Switzerland', group: 'Group F', flag: '🇨🇭', primaryColor: 'red-600', accentColor: 'white' },
  { code: 'DEN', name: 'Denmark', group: 'Group F', flag: '🇩🇰', primaryColor: 'red-600', accentColor: 'white' },
  { code: 'POL', name: 'Poland', group: 'Group F', flag: '🇵🇱', primaryColor: 'red-600', accentColor: 'white' },
  { code: 'SWE', name: 'Sweden', group: 'Group F', flag: '🇸🇪', primaryColor: 'blue-600', accentColor: 'yellow-400' },
  // Group G
  { code: 'ECU', name: 'Ecuador', group: 'Group G', flag: '🇪🇨', primaryColor: 'yellow-450', accentColor: 'blue-800' },
  { code: 'PAR', name: 'Paraguay', group: 'Group G', flag: '🇵🇾', primaryColor: 'red-600', accentColor: 'blue-800' },
  { code: 'GHA', name: 'Ghana', group: 'Group G', flag: '🇬🇭', primaryColor: 'yellow-500', accentColor: 'red-600' },
  { code: 'KOR', name: 'South Korea', group: 'Group G', flag: '🇰🇷', primaryColor: 'red-600', accentColor: 'blue-800' },
  // Group H
  { code: 'AUS', name: 'Australia', group: 'Group H', flag: '🇦🇺', primaryColor: 'green-800', accentColor: 'yellow-400' },
  { code: 'CMR', name: 'Cameroon', group: 'Group H', flag: '🇨🇲', primaryColor: 'green-700', accentColor: 'red-600' },
  { code: 'TUN', name: 'Tunisia', group: 'Group H', flag: '🇹🇳', primaryColor: 'red-600', accentColor: 'white' },
  { code: 'EGY', name: 'Egypt', group: 'Group H', flag: '🇪🇬', primaryColor: 'red-600', accentColor: 'black' },
  // Group I
  { code: 'NGA', name: 'Nigeria', group: 'Group I', flag: '🇳🇬', primaryColor: 'emerald-600', accentColor: 'white' },
  { code: 'ALG', name: 'Algeria', group: 'Group I', flag: '🇩🇿', primaryColor: 'green-600', accentColor: 'red-600' },
  { code: 'KSA', name: 'Saudi Arabia', group: 'Group I', flag: '🇸🇦', primaryColor: 'emerald-800', accentColor: 'white' },
  { code: 'PAN', name: 'Panama', group: 'Group I', flag: '🇵🇦', primaryColor: 'red-600', accentColor: 'blue-800' },
  // Group J
  { code: 'AUT', name: 'Austria', group: 'Group J', flag: '🇦🇹', primaryColor: 'red-600', accentColor: 'white' },
  { code: 'TUR', name: 'Turkey', group: 'Group J', flag: '🇹🇷', primaryColor: 'red-600', accentColor: 'white' },
  { code: 'UKR', name: 'Ukraine', group: 'Group J', flag: '🇺🇦', primaryColor: 'sky-400', accentColor: 'yellow-400' },
  { code: 'SCO', name: 'Scotland', group: 'Group J', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', primaryColor: 'blue-900', accentColor: 'white' },
  // Group K
  { code: 'WAL', name: 'Wales', group: 'Group K', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', primaryColor: 'red-650', accentColor: 'green-600' },
  { code: 'CZE', name: 'Czechia', group: 'Group K', flag: '🇨🇿', primaryColor: 'red-600', accentColor: 'blue-800' },
  { code: 'PER', name: 'Peru', group: 'Group K', flag: '🇵🇪', primaryColor: 'red-600', accentColor: 'white' },
  { code: 'CHI', name: 'Chile', group: 'Group K', flag: '🇨🇱', primaryColor: 'blue-800', accentColor: 'red-600' },
  // Group L
  { code: 'CRC', name: 'Costa Rica', group: 'Group L', flag: '🇨🇷', primaryColor: 'blue-800', accentColor: 'red-600' },
  { code: 'NZL', name: 'New Zealand', group: 'Group L', flag: '🇳🇿', primaryColor: 'gray-950', accentColor: 'white' },
  { code: 'CIV', name: 'Ivory Coast', group: 'Group L', flag: '🇨🇮', primaryColor: 'orange-500', accentColor: 'green-600' },
  { code: 'RSA', name: 'South Africa', group: 'Group L', flag: '🇿🇦', primaryColor: 'green-700', accentColor: 'yellow-500' }
];

export const TEAM_FLAGS: Record<string, string> = {};
TEAMS_DATA.forEach(t => {
  TEAM_FLAGS[t.code] = t.flag;
});
TEAM_FLAGS['SPC'] = '✨';
TEAM_FLAGS['XTR'] = '🏆';

// Pre-defined superstar player references we can hook to the correct teams
const ORIGINAL_PLAYERS: Record<string, { name: string; position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'; isShiny: boolean; rating: number; club: string }[]> = {
  USA: [
    { name: 'Matt Turner', position: 'Goalkeeper', isShiny: false, rating: 80, club: 'Crystal Palace' },
    { name: 'Antonee Robinson', position: 'Defender', isShiny: false, rating: 82, club: 'Fulham' },
    { name: 'Weston McKennie', position: 'Midfielder', isShiny: false, rating: 83, club: 'Juventus' },
    { name: 'Christian Pulisic', position: 'Forward', isShiny: true, rating: 88, club: 'AC Milan' },
    { name: 'Folarin Balogun', position: 'Forward', isShiny: false, rating: 81, club: 'Monaco' }
  ],
  MEX: [
    { name: 'Luis Malagón', position: 'Goalkeeper', isShiny: false, rating: 81, club: 'Club América' },
    { name: 'César Montes', position: 'Defender', isShiny: false, rating: 80, club: 'Al-Shabab' },
    { name: 'Edson Álvarez', position: 'Midfielder', isShiny: false, rating: 84, club: 'West Ham' },
    { name: 'Santiago Giménez', position: 'Forward', isShiny: true, rating: 85, club: 'Feyenoord' },
    { name: 'Hirving Lozano', position: 'Forward', isShiny: false, rating: 83, club: 'San Diego FC' }
  ],
  CAN: [
    { name: 'Maxime Crépeau', position: 'Goalkeeper', isShiny: false, rating: 78, club: 'Portland Timbers' },
    { name: 'Alphonso Davies', position: 'Defender', isShiny: true, rating: 87, club: 'Bayern Munich' },
    { name: 'Stephen Eustáquio', position: 'Midfielder', isShiny: false, rating: 81, club: 'Porto' },
    { name: 'Alistair Johnston', position: 'Defender', isShiny: false, rating: 79, club: 'Celtic' },
    { name: 'Jonathan David', position: 'Forward', isShiny: false, rating: 84, club: 'Lille' }
  ],
  ARG: [
    { name: 'Emiliano Martínez', position: 'Goalkeeper', isShiny: true, rating: 89, club: 'Aston Villa' },
    { name: 'Cristian Romero', position: 'Defender', isShiny: false, rating: 88, club: 'Tottenham' },
    { name: 'Rodrigo De Paul', position: 'Midfielder', isShiny: false, rating: 86, club: 'Atlético Madrid' },
    { name: 'Lionel Messi', position: 'Forward', isShiny: true, rating: 97, club: 'Inter Miami' },
    { name: 'Lautaro Martínez', position: 'Forward', isShiny: false, rating: 88, club: 'Inter Milan' }
  ],
  BRA: [
    { name: 'Alisson Becker', position: 'Goalkeeper', isShiny: true, rating: 89, club: 'Liverpool' },
    { name: 'Marquinhos', position: 'Defender', isShiny: false, rating: 87, club: 'PSG' },
    { name: 'Bruno Guimarães', position: 'Midfielder', isShiny: false, rating: 87, club: 'Newcastle' },
    { name: 'Vinícius Júnior', position: 'Forward', isShiny: true, rating: 94, club: 'Real Madrid' },
    { name: 'Rodrygo Silva', position: 'Forward', isShiny: false, rating: 86, club: 'Real Madrid' }
  ],
  FRA: [
    { name: 'Mike Maignan', position: 'Goalkeeper', isShiny: false, rating: 86, club: 'AC Milan' },
    { name: 'William Saliba', position: 'Defender', isShiny: false, rating: 89, club: 'Arsenal' },
    { name: 'Antoine Griezmann', position: 'Midfielder', isShiny: false, rating: 88, club: 'Atlético Madrid' },
    { name: 'Kylian Mbappé', position: 'Forward', isShiny: true, rating: 95, club: 'Real Madrid' },
    { name: 'Ousmane Dembélé', position: 'Forward', isShiny: false, rating: 85, club: 'PSG' }
  ],
  ENG: [
    { name: 'Jordan Pickford', position: 'Goalkeeper', isShiny: false, rating: 84, club: 'Everton' },
    { name: 'John Stones', position: 'Defender', isShiny: false, rating: 86, club: 'Manchester City' },
    { name: 'Declan Rice', position: 'Midfielder', isShiny: false, rating: 88, club: 'Arsenal' },
    { name: 'Jude Bellingham', position: 'Midfielder', isShiny: true, rating: 93, club: 'Real Madrid' },
    { name: 'Harry Kane', position: 'Forward', isShiny: true, rating: 91, club: 'Bayern Munich' }
  ],
  ESP: [
    { name: 'Unai Simón', position: 'Goalkeeper', isShiny: false, rating: 85, club: 'Athletic Bilbao' },
    { name: 'Aymeric Laporte', position: 'Defender', isShiny: false, rating: 84, club: 'Al-Nassr' },
    { name: 'Rodri', position: 'Midfielder', isShiny: true, rating: 94, club: 'Manchester City' },
    { name: 'Lamine Yamal', position: 'Forward', isShiny: true, rating: 92, club: 'Barcelona' },
    { name: 'Nico Williams', position: 'Forward', isShiny: false, rating: 86, club: 'Athletic Bilbao' }
  ],
  GER: [
    { name: 'Marc-André ter Stegen', position: 'Goalkeeper', isShiny: false, rating: 87, club: 'Barcelona' },
    { name: 'Antonio Rüdiger', position: 'Defender', isShiny: false, rating: 88, club: 'Real Madrid' },
    { name: 'Florian Wirtz', position: 'Midfielder', isShiny: true, rating: 90, club: 'Bayer Leverkusen' },
    { name: 'Jamal Musiala', position: 'Midfielder', isShiny: true, rating: 90, club: 'Bayern Munich' },
    { name: 'Kai Havertz', position: 'Forward', isShiny: false, rating: 85, club: 'Arsenal' }
  ],
  ITA: [
    { name: 'Gianluigi Donnarumma', position: 'Goalkeeper', isShiny: true, rating: 88, club: 'PSG' },
    { name: 'Alessandro Bastoni', position: 'Defender', isShiny: false, rating: 87, club: 'Inter Milan' },
    { name: 'Nicolò Barella', position: 'Midfielder', isShiny: true, rating: 89, club: 'Inter Milan' },
    { name: 'Federico Chiesa', position: 'Forward', isShiny: false, rating: 84, club: 'Liverpool' },
    { name: 'Gianluca Scamacca', position: 'Forward', isShiny: false, rating: 81, club: 'Atalanta' }
  ],
  JPN: [
    { name: 'Zion Suzuki', position: 'Goalkeeper', isShiny: false, rating: 77, club: 'Parma' },
    { name: 'Takehiro Tomiyasu', position: 'Defender', isShiny: false, rating: 81, club: 'Arsenal' },
    { name: 'Wataru Endo', position: 'Midfielder', isShiny: false, rating: 81, club: 'Liverpool' },
    { name: 'Kaoru Mitoma', position: 'Forward', isShiny: true, rating: 84, club: 'Brighton' },
    { name: 'Ayase Ueda', position: 'Forward', isShiny: false, rating: 79, club: 'Feyenoord' }
  ],
  MAR: [
    { name: 'Yassine Bounou', position: 'Goalkeeper', isShiny: true, rating: 84, club: 'Al-Hilal' },
    { name: 'Achraf Hakimi', position: 'Defender', isShiny: true, rating: 88, club: 'PSG' },
    { name: 'Nayef Aguerd', position: 'Defender', isShiny: false, rating: 80, club: 'Real Sociedad' },
    { name: 'Sofyan Amrabat', position: 'Midfielder', isShiny: false, rating: 81, club: 'Fenerbahçe' },
    { name: 'Youssef En-Nesyri', position: 'Forward', isShiny: false, rating: 81, club: 'Fenerbahçe' }
  ]
};

const FIRST_NAMES = ['Luka', 'Kevin', 'Robert', 'David', 'Luis', 'Alexis', 'Christian', 'Angel', 'Federico', 'Sadio', 'Antoine', 'Frenkie', 'Virgil', 'Jan', 'Romelu', 'Heung-min', 'Mohamed', 'Bruno', 'Thomas', 'Mateo', 'Ivan', 'Dušan', 'Sergej', 'Sandro', 'Piotr', 'Krzysztof', 'Memphis', 'Cody', 'Dejan', 'Josip', 'Breel', 'Granit', 'Xherdan', 'Yann', 'Pierre', 'Sebastien'];
const LAST_NAMES = ['Modrić', 'De Bruyne', 'Lewandowski', 'Alaba', 'Suárez', 'Sánchez', 'Pulisic', 'Di María', 'Valverde', 'Mané', 'Griezmann', 'de Jong', 'van Dijk', 'Oblak', 'Lukaku', 'Son', 'Salah', 'Fernandes', 'Müller', 'Kovačić', 'Perišić', 'Tadić', 'Milinković-Savić', 'Tonali', 'Zieliński', 'Piątek', 'Depay', 'Gakpo', 'Lovren', 'Stanišić', 'Embolo', 'Xhaka', 'Shaqiri', 'Sommer', 'Aubameyang', 'Haller'];
const CLUBS = ['Real Madrid', 'Barcelona', 'Manchester City', 'Arsenal', 'Liverpool', 'PSG', 'Bayern Munich', 'Juventus', 'AC Milan', 'Inter Milan', 'Atletico Madrid', 'Borussia Dortmund'];

// 20 Superstar names for the Ultra-Rare "Extra Stickers"
const EXTRA_PLAYERS = [
  'Erling Haaland', 'Lionel Messi', 'Kylian Mbappé', 'Jude Bellingham', 'Vinícius Júnior',
  'Harry Kane', 'Lamine Yamal', 'Kevin De Bruyne', 'Cristiano Ronaldo', 'Mohamed Salah',
  'Bruno Fernandes', 'Rodri', 'Robert Lewandowski', 'Antoine Griezmann', 'Luka Modrić',
  'Alisson Becker', 'Bukayo Saka', 'Florian Wirtz', 'Jamal Musiala', 'Achraf Hakimi'
];

// 68 Special Foil Edition Descriptions/Themes
const SPECIAL_FOILS_THEMES = [
  // 12 Captain Foils
  ...TEAMS_DATA.slice(0, 12).map(t => `${t.name} Captain Foil`),
  // 16 World Cup Legends
  'Pele Tribute', 'Maradona Tribute', 'Zidane Tribute', 'Cruyff Tribute', 'Ronaldo R9 Tribute', 'Ronaldinho Tribute', 'Beckenbauer Tribute', 'Bobby Charlton Tribute', 'Roberto Baggio Tribute', 'Miroslav Klose Tribute', 'Yashin Tribute', 'Buffon Tribute', 'Pirlo Tribute', 'Inesta Tribute', 'Henry Tribute', 'Cafu Tribute',
  // 16 Golden Boot Winners
  'Lineker Highlight', 'Fontaine Highlight', 'Müller Highlight', 'Kempes Highlight', 'Rossi Highlight', 'Schillaci Highlight', 'Salenko Highlight', 'Suker Highlight', 'Klose Highlight', 'James Rodríguez Highlight', 'Kane Highlight', 'Mbappé Highlight', 'Ademir Highlight', 'Stábile Highlight', 'Léonidas Highlight', 'Lato Highlight',
  // 24 Host Cities / Stadiums highlight
  'MetLife Stadium Gold', 'Estadio Azteca Gold', 'BC Place Gold', 'SoFi Stadium Gold', 'Hard Rock Stadium Gold', 'AT&T Stadium Gold', 'Mercedes-Benz Stadium Gold', 'Gillette Stadium Gold', 'Lincoln Financial Field Gold', 'NRG Stadium Gold', 'Arrowhead Stadium Gold', 'Lumen Field Gold', 'Levi Stadium Gold', 'Subaru Park Gold', 'Bank of America Stadium Gold', 'Inter&Co Stadium Gold', 'Los Angeles City Foil', 'Miami City Foil', 'Toronto City Foil', 'Mexico City Foil', 'Vancouver City Foil', 'Dallas City Foil', 'New York City Foil', 'Guadalajara City Foil'
];

let cachedAllStickers: Sticker[] | null = null;
export function getAllStickers(): Sticker[] {
  if (cachedAllStickers) return cachedAllStickers;

  const all: Sticker[] = [];

  // --- 1. TOURNAMENT SPECIALS (Numbers 1 to 6) ---
  const tournamentSpecials = [
    { id: 'TRN_01', number: 1, name: '2026 FIFA World Cup Trophy', position: 'Badge' as const, isShiny: true, rating: 99, club: 'FIFA World Cup', teamCode: 'USA', teamName: 'United States' },
    { id: 'TRN_02', number: 2, name: 'Official Match Ball', position: 'Badge' as const, isShiny: true, rating: 98, club: 'FIFA World Cup', teamCode: 'MEX', teamName: 'Mexico' },
    { id: 'TRN_03', number: 3, name: 'Atiba Hutchinson Stadium (CAN)', position: 'Badge' as const, isShiny: true, rating: 95, club: 'Vancouver', teamCode: 'CAN', teamName: 'Canada' },
    { id: 'TRN_04', number: 4, name: 'Estadio Azteca (MEX)', position: 'Badge' as const, isShiny: true, rating: 96, club: 'Mexico City', teamCode: 'MEX', teamName: 'Mexico' },
    { id: 'TRN_05', number: 5, name: 'MetLife Stadium (USA)', position: 'Badge' as const, isShiny: true, rating: 97, club: 'New York/New Jersey', teamCode: 'USA', teamName: 'United States' },
    { id: 'TRN_06', number: 6, name: 'Opening Ceremony Mascot', position: 'Badge' as const, isShiny: true, rating: 94, club: 'FIFA Mascot', teamCode: 'USA', teamName: 'United States' }
  ];
  all.push(...tournamentSpecials);

  // --- 2. 48 TEAMS (Set numbers 7 to 630 - exactly 13 per team) ---
  TEAMS_DATA.forEach((team, teamIdx) => {
    const baseNum = 7 + teamIdx * 13;
    const rng = createSeededRandom(team.code);

    // Build exactly 13 slots
    for (let slot = 0; slot < 13; slot++) {
      const stickerNumber = baseNum + slot;
      const stickerId = `${team.code}_${slot.toString().padStart(2, '0')}`;

      if (slot === 0) {
        // Team Crest slot
        all.push({
          id: stickerId,
          number: stickerNumber,
          name: `${team.name} Crest`,
          position: 'Badge' as const,
          isShiny: true,
          rating: 90 + Math.floor(rng() * 8),
          club: 'FIFA Federation',
          teamCode: team.code,
          teamName: team.name
        });
      } else {
        // Find if we have handcrafted player matching this position class
        const posClass = slot === 1 ? 'Goalkeeper' :
                         (slot >= 2 && slot <= 4) ? 'Defender' :
                         (slot >= 5 && slot <= 8) ? 'Midfielder' : 'Forward';

        const handcrafedPool = ORIGINAL_PLAYERS[team.code] || [];
        const matchingHPlayerIdx = handcrafedPool.findIndex(p => p.position === posClass);

        if (matchingHPlayerIdx !== -1) {
          // Consume handcrafted player
          const [player] = handcrafedPool.splice(matchingHPlayerIdx, 1);
          all.push({
            id: stickerId,
            number: stickerNumber,
            name: player.name,
            position: player.position,
            isShiny: player.isShiny,
            rating: player.rating,
            club: player.club,
            teamCode: team.code,
            teamName: team.name
          });
        } else {
          // Seeded realistic generation
          const nameIdx = Math.floor(rng() * FIRST_NAMES.length);
          const lastIdx = Math.floor(rng() * LAST_NAMES.length);
          const clubIdx = Math.floor(rng() * CLUBS.length);
          const pName = `${FIRST_NAMES[nameIdx]} ${LAST_NAMES[lastIdx]}`;
          
          all.push({
            id: stickerId,
            number: stickerNumber,
            name: pName,
            position: posClass,
            isShiny: rng() < 0.12, // 12% chance of generic foil
            rating: 78 + Math.floor(rng() * 12),
            club: CLUBS[clubIdx],
            teamCode: team.code,
            teamName: team.name
          });
        }
      }
    }
  });

  // --- 3. 68 SPECIAL EDITION PREMIUM STICKERS (Sticker numbers 631 to 698) ---
  for (let i = 0; i < 68; i++) {
    const stickerNumber = 631 + i;
    const stickerId = `SPC_${(i + 1).toString().padStart(2, '0')}`;
    const name = SPECIAL_FOILS_THEMES[i] || `Premium Foil Highlight #${i + 1}`;
    
    // Choose realistic host team for legends/stadiums
    const rng = createSeededRandom(name);
    const rating = 92 + Math.floor(rng() * 7);

    all.push({
      id: stickerId,
      number: stickerNumber,
      name,
      position: 'Badge' as const,
      isShiny: true,
      rating,
      club: 'FIFA Elite',
      teamCode: 'SPC',
      teamName: 'Special Foils Set'
    });
  }

  // --- 4. 20 ULTRA-RARE EXTRA STICKERS (Sticker numbers 699 to 778 - 4 variants each) ---
  EXTRA_PLAYERS.forEach((player, playerIdx) => {
    const startNum = 699 + playerIdx * 4;
    const variants: ('Base' | 'Bronze' | 'Silver' | 'Gold')[] = ['Base', 'Bronze', 'Silver', 'Gold'];

    variants.forEach((v, vIdx) => {
      const stickerNumber = startNum + vIdx;
      const stickerId = `XTR_${(playerIdx + 1).toString().padStart(2, '0')}_${v.toUpperCase()}`;
      
      const ratingBonus = v === 'Gold' ? 4 : v === 'Silver' ? 2 : v === 'Bronze' ? 1 : 0;
      const baseRating = 91 + Math.min(5, playerIdx); // Messi, Haaland, Mbappe have higher base
      
      all.push({
        id: stickerId,
        number: stickerNumber,
        name: `${player} [${v}]`,
        position: playerIdx === 15 ? 'Goalkeeper' : playerIdx === 19 ? 'Defender' : playerIdx >= 10 ? 'Midfielder' : 'Forward',
        isShiny: true,
        rating: baseRating + ratingBonus,
        club: 'Extra Selection',
        teamCode: 'XTR',
        teamName: 'Ultra-Rare Extras'
      });
    });
  });

  cachedAllStickers = all.sort((a, b) => a.number - b.number);
  return cachedAllStickers;
}

let cachedTeams: Team[] | null = null;
export function getTeams(): Team[] {
  if (cachedTeams) return cachedTeams;

  const allStickers = getAllStickers();
  const list: Team[] = [];

  // Add 48 base teams
  TEAMS_DATA.forEach(teamInfo => {
    list.push({
      ...teamInfo,
      stickers: allStickers.filter(s => s.teamCode === teamInfo.code)
    } as Team);
  });

  // Append virtual "Special Edition Premium Foils" section (page)
  list.push({
    code: 'SPC',
    name: 'Premium Special Foils',
    group: 'Edition Set',
    flag: '✨',
    primaryColor: 'amber-900',
    accentColor: 'yellow-400',
    stickers: allStickers.filter(s => s.teamCode === 'SPC')
  });

  // Append virtual "Ultra-Rare Extras" section (page)
  list.push({
    code: 'XTR',
    name: 'Ultra-Rare Extras',
    group: 'Bonus Set',
    flag: '🏆',
    primaryColor: 'rose-900',
    accentColor: 'pink-500',
    stickers: allStickers.filter(s => s.teamCode === 'XTR')
  });

  cachedTeams = list;
  return cachedTeams;
}

// Generate pack of 5 random stickers.
// To make it fun, let's roll a special weighted algorithm:
// - 75% chance for a sticker to be a standard main-set card (1 to 630)
// - 20% chance to be a Premium Special Foil (631 to 698)
// - 5% ultra-rare chance to represent any of the 4 variations of the 20 "Extra Stickers"!
export function generatePack(): Sticker[] {
  const all = getAllStickers();
  const mainSet = all.filter(s => s.number <= 630);
  const specSet = all.filter(s => s.number >= 631 && s.number <= 698);
  const extraSet = all.filter(s => s.number >= 699);

  const pack: Sticker[] = [];
  
  // Pick 5 random items
  for (let i = 0; i < 5; i++) {
    const roll = Math.random();
    let selected: Sticker;

    if (roll < 0.05 && extraSet.length > 0) {
      // Extra Sticker (5% slot chance)
      const idx = Math.floor(Math.random() * extraSet.length);
      selected = extraSet[idx];
    } else if (roll < 0.25 && specSet.length > 0) {
      // Foil Special sticker (20% slot chance)
      const idx = Math.floor(Math.random() * specSet.length);
      selected = specSet[idx];
    } else {
      // Standard regular sticker
      const idx = Math.floor(Math.random() * mainSet.length);
      selected = mainSet[idx];
    }

    // Guard against duplicates within the same pack if possible
    if (pack.some(p => p.id === selected.id)) {
      // fallback to another random completely
      const fallbackIdx = Math.floor(Math.random() * all.length);
      pack.push(all[fallbackIdx]);
    } else {
      pack.push(selected);
    }
  }
  
  return pack;
}

export function generateSmartTrade(
  userDuplicates: Sticker[],
  userMissing: Sticker[]
 ): { offered: Sticker; requested: Sticker } | null {
  if (userDuplicates.length === 0 || userMissing.length === 0) {
    return null;
  }

  const requestedIdx = Math.floor(Math.random() * userDuplicates.length);
  const requested = userDuplicates[requestedIdx];

  let offeredCandidates = userMissing.filter(s => s.isShiny === requested.isShiny);
  if (offeredCandidates.length === 0) {
    offeredCandidates = userMissing;
  }

  const offered = offeredCandidates[Math.floor(Math.random() * offeredCandidates.length)];
  return { offered, requested };
}
