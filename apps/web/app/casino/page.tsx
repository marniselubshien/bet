import Link from "next/link";
import { 
  Search, Flame, ChevronRight, Headphones, Layers, User, Sparkles, Coins, Tv
} from "lucide-react";

interface GameItem {
  slug: string;
  name: string;
  playing: string;
  image: string;
  bgGradient: string;
  badge?: string;
  badgePosition?: "top-left" | "top-right" | "top-center";
  hasTextInImage?: boolean;
  isPlayable: boolean;
}

const STAKE_ORIGINALS: GameItem[] = [
  // Row 1 (8 cards matching screenshot)
  {
    slug: "dice",
    name: "DICE",
    playing: "2,050",
    image: "/games/dice.png",
    bgGradient: "from-[#8B5CF6] to-[#581C87]",
    hasTextInImage: true,
    isPlayable: true,
  },
  {
    slug: "mines",
    name: "MINES",
    playing: "2,366",
    image: "/games/mines.png",
    bgGradient: "from-[#0284C7] to-[#0369A1]",
    hasTextInImage: true,
    isPlayable: true,
  },
  {
    slug: "plinko",
    name: "PLINKO",
    playing: "1,212",
    image: "/games/plinko.png",
    bgGradient: "from-[#9333EA] to-[#6B21A8]",
    hasTextInImage: true,
    isPlayable: true,
  },
  {
    slug: "crash",
    name: "CRASH",
    playing: "938",
    image: "/games/crash.png",
    bgGradient: "from-[#F59E0B] to-[#1E3A8A]",
    hasTextInImage: true,
    isPlayable: true,
  },
  {
    slug: "slide",
    name: "SLIDE",
    playing: "285",
    image: "/games/slide.png",
    bgGradient: "from-[#06B6D4] to-[#0F766E]",
    hasTextInImage: true,
    isPlayable: false,
  },
  {
    slug: "chicken",
    name: "CHICKEN",
    playing: "339",
    image: "/games/chicken.png",
    bgGradient: "from-[#2563EB] to-[#4338CA]",
    hasTextInImage: true,
    isPlayable: false,
  },
  {
    slug: "keno",
    name: "KENO",
    playing: "1,538",
    image: "/games/keno.png",
    bgGradient: "from-[#0EA5E9] to-[#0369A1]",
    hasTextInImage: true,
    isPlayable: false,
  },
  {
    slug: "limbo",
    name: "LIMBO",
    playing: "1,642",
    image: "/games/limbo.png",
    bgGradient: "from-[#F59E0B] to-[#B45309]",
    hasTextInImage: true,
    isPlayable: true,
  },

  // Row 2 (8 cards matching screenshot)
  {
    slug: "hilo",
    name: "HILO",
    playing: "448",
    image: "/games/hilo.png",
    bgGradient: "from-[#10B981] to-[#047857]",
    hasTextInImage: true,
    isPlayable: false,
  },
  {
    slug: "moles",
    name: "MOLES",
    playing: "301",
    image: "/games/mines.png",
    bgGradient: "from-[#3B82F6] to-[#1D4ED8]",
    isPlayable: false,
  },
  {
    slug: "packs",
    name: "PACKS",
    playing: "37",
    image: "/games/dice.png",
    bgGradient: "from-[#F97316] to-[#C2410C]",
    isPlayable: false,
  },
  {
    slug: "pump",
    name: "PUMP",
    playing: "120",
    image: "/games/pump.png",
    bgGradient: "from-[#2563EB] to-[#DC2626]",
    hasTextInImage: true,
    isPlayable: false,
  },
  {
    slug: "wheel",
    name: "WHEEL",
    playing: "31",
    image: "/games/wheel.png",
    bgGradient: "from-[#15803D] to-[#166534]",
    hasTextInImage: true,
    isPlayable: false,
  },
  {
    slug: "drill",
    name: "DRILL",
    playing: "48",
    image: "/games/drill.png",
    bgGradient: "from-[#DC2626] to-[#991B1B]",
    hasTextInImage: true,
    isPlayable: false,
  },
  {
    slug: "snakes",
    name: "SNAKES",
    playing: "177",
    image: "/games/snakes.png",
    bgGradient: "from-[#0284C7] to-[#1E3A8A]",
    hasTextInImage: true,
    isPlayable: false,
  },
  {
    slug: "coinflip",
    name: "FLIP",
    playing: "204",
    image: "/games/flip.png",
    bgGradient: "from-[#10B981] to-[#065F46]",
    hasTextInImage: true,
    isPlayable: true,
  },
];

/* Custom Card Icon for Casino Home pill matching Stake design */
function CasinoCardMiniIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.5 3C3.67 3 3 3.67 3 4.5v10c0 .41.34.75.75.75s.75-.34.75-.75V5c0-.55.45-1 1-1h7c.41 0 .75-.34.75-.75S12.91 3 12.5 3H4.5z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 5C5.67 5 5 5.67 5 6.5v12C5 19.33 5.67 20 6.5 20h11c.83 0 1.5-.67 1.5-1.5v-12C19 5.67 18.33 5 17.5 5h-11zm5.5 4.5c-.35-.45-.88-.75-1.5-.75-1.1 0-2 .9-2 2 0 1.5 1.5 2.8 3.5 4.4 2-1.6 3.5-2.9 3.5-4.4 0-1.1-.9-2-2-2-.62 0-1.15.3-1.5.75z"
      />
    </svg>
  );
}

export default function CasinoLobbyPage() {
  return (
    <div className="px-6 md:px-12 lg:px-16 py-6 max-w-[1550px] mx-auto text-[#B1BAD3] font-sans">
      
      {/* 3 Top Promos Banners (Flush images, zero padding on images, exact Stake layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        
        {/* Banner 1: Mystic Match */}
        <div className="relative overflow-hidden rounded-lg bg-[#213743] h-32 md:h-36 flex items-center cursor-pointer hover:bg-[#27404e] transition-colors group shadow-sm">
          <div className="h-full aspect-square flex-shrink-0 relative overflow-hidden">
            <img 
              src="/promos/mystic_match.png" 
              alt="Mystic Match" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div className="px-4 py-3 flex flex-col justify-center flex-1 min-w-0">
            <span className="bg-[#1475E1]/20 text-[#2f8af5] px-2 py-0.5 rounded text-[10px] font-bold w-fit mb-1.5">
              Only on Stake
            </span>
            <h3 className="text-white font-bold text-base md:text-lg leading-tight truncate">
              Mystic Match
            </h3>
            <p className="text-xs text-[#8596A5] mt-1 leading-snug line-clamp-2">
              Some Wonders Are Worth the Patience
            </p>
          </div>
        </div>

        {/* Banner 2: 2x VIP Progress */}
        <div className="relative overflow-hidden rounded-lg bg-[#213743] h-32 md:h-36 flex items-center cursor-pointer hover:bg-[#27404e] transition-colors group shadow-sm">
          <div className="h-full aspect-square flex-shrink-0 relative overflow-hidden bg-blue-600">
            <img 
              src="/promos/vip.png" 
              alt="2x VIP Progress" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div className="px-4 py-3 flex flex-col justify-center flex-1 min-w-0">
            <span className="bg-white text-[#0F212E] px-2 py-0.5 rounded text-[10px] font-extrabold w-fit mb-1.5">
              Promotion
            </span>
            <h3 className="text-white font-bold text-base md:text-lg leading-tight truncate">
              2x VIP Progress
            </h3>
            <p className="text-xs text-[#8596A5] mt-1 leading-snug line-clamp-2">
              Boosted VIP progress on Only on Stake Games
            </p>
          </div>
        </div>

        {/* Banner 3: Daily Races */}
        <div className="relative overflow-hidden rounded-lg bg-[#213743] h-32 md:h-36 flex items-center cursor-pointer hover:bg-[#27404e] transition-colors group shadow-sm">
          <div className="h-full aspect-square flex-shrink-0 relative overflow-hidden bg-sky-500">
            <img 
              src="/promos/races.png" 
              alt="Daily Races" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div className="px-4 py-3 flex flex-col justify-center flex-1 min-w-0">
            <span className="bg-white text-[#0F212E] px-2 py-0.5 rounded text-[10px] font-extrabold w-fit mb-1.5">
              Promotion
            </span>
            <h3 className="text-white font-bold text-base md:text-lg leading-tight truncate">
              Daily Races
            </h3>
            <p className="text-xs text-[#8596A5] mt-1 leading-snug line-clamp-2">
              Race to the top for a share in $100,000
            </p>
          </div>
        </div>

      </div>

      {/* Search Stake.com (Seamless, zero border, rounded-lg) */}
      <div className="relative w-full mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#557086]" />
        <input 
          type="text" 
          placeholder="Search Stake.com"
          className="w-full bg-[#0F212E] rounded-lg py-3 pl-11 pr-20 text-sm font-semibold text-white placeholder-[#557086] outline-none transition-colors border-none shadow-inner"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <span className="text-xs font-bold text-[#8596A5] bg-[#213743] px-2 py-0.5 rounded">
            Ctrl + K
          </span>
        </div>
      </div>

      {/* Subnavigation Pills (Matching screenshot) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide select-none">
        <button className="bg-[#2F4553] text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm whitespace-nowrap border-none cursor-pointer">
          <CasinoCardMiniIcon className="w-3.5 h-3.5 text-white" />
          <span>Casino Home</span>
        </button>

        <button className="text-[#B1BAD3] hover:text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-[#213743] transition-colors whitespace-nowrap border-none cursor-pointer">
          <User className="w-3.5 h-3.5" />
          <span>My Casino</span>
        </button>

        <button className="text-[#B1BAD3] hover:text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-[#213743] transition-colors whitespace-nowrap border-none cursor-pointer">
          <div className="w-3.5 h-3.5 rounded-full bg-[#1475E1]/30 text-[#1475E1] flex items-center justify-center text-[9px] font-black">S</div>
          <span>Only on Stake</span>
        </button>

        <button className="text-[#B1BAD3] hover:text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-[#213743] transition-colors whitespace-nowrap border-none cursor-pointer">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Releases</span>
        </button>

        <button className="text-[#B1BAD3] hover:text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-[#213743] transition-colors whitespace-nowrap border-none cursor-pointer">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Stake Originals</span>
        </button>

        <button className="text-[#B1BAD3] hover:text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-[#213743] transition-colors whitespace-nowrap border-none cursor-pointer">
          <span className="text-[10px] font-black tracking-tighter bg-amber-400/20 text-amber-300 px-1 py-0.5 rounded">777</span>
          <span>Slots</span>
        </button>

        <button className="text-[#B1BAD3] hover:text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-[#213743] transition-colors whitespace-nowrap border-none cursor-pointer">
          <Tv className="w-3.5 h-3.5" />
          <span>Live Casino</span>
        </button>
      </div>

      {/* Stake Originals Section Header */}
      <div className="flex items-center gap-2 text-white font-bold text-base mb-3.5 select-none">
        <Flame className="w-5 h-5 text-[#B1BAD3]" />
        <span className="text-white font-bold">Stake Originals</span>
        <ChevronRight className="w-4 h-4 text-[#B1BAD3]" />
      </div>

      {/* 8-column Card Grid matching screenshot (Zero border, identical elevation & spacing) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-3.5 mb-10">
        {STAKE_ORIGINALS.map((game) => (
          <div key={game.slug} className="group flex flex-col">
            <Link href={game.isPlayable ? `/casino/games/${game.slug}` : `/casino/games/dice`}>
              <div className={`relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow-md transition-all duration-200 group-hover:-translate-y-1.5 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.5)] bg-gradient-to-b ${game.bgGradient} border-none`}>
                
                {/* Real High-Resolution Game Cover Image */}
                <img 
                  src={game.image} 
                  alt={game.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Optional Multiplier Badge with exact position (matching screenshot) */}
                {game.badge && !game.hasTextInImage && (
                  <div className={`absolute z-10 bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm ${
                    game.badgePosition === "top-right" 
                      ? "top-2 right-2" 
                      : game.badgePosition === "top-center"
                      ? "top-2 left-1/2 -translate-x-1/2"
                      : "top-2 left-2"
                  }`}>
                    {game.badge}
                  </div>
                )}

                {/* Gradient overlay for bottom title and text (only if not pre-baked into image) */}
                {!game.hasTextInImage && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-12 pb-3 px-2 text-center pointer-events-none">
                    <h3 className="text-white font-black tracking-wider text-sm sm:text-base leading-none drop-shadow-md">
                      {game.name}
                    </h3>
                    <div className="text-[8px] font-extrabold text-white/60 tracking-widest uppercase mt-1">
                      STAKE ORIGINALS
                    </div>
                  </div>
                )}

              </div>
            </Link>

            {/* Sub-card metadata: green dot + active players (exact match to screenshot) */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8596A5] mt-1.5 pl-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E701]" />
              <span>{game.playing} playing</span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Headset Support Icon (Bottom Right of screenshot, seamless elevation) */}
      <div className="fixed bottom-5 right-5 z-50 w-10 h-10 rounded-full bg-[#213743] hover:bg-[#2a4555] flex items-center justify-center text-white shadow-2xl cursor-pointer transition-transform hover:scale-105 border-none">
        <Headphones className="w-4 h-4 text-[#B1BAD3]" />
      </div>

    </div>
  );
}
