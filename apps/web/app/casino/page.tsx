"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Gamepad2, BadgeCheck, Coins, ChevronLeft, ChevronRight,
  LayoutGrid, Flame, Tv, Sparkles, Inbox, Crown, ChevronDown
} from "lucide-react";

type CategoryId = 
  | "lobby" 
  | "originals" 
  | "slots" 
  | "pasa-picks" 
  | "mini-games" 
  | "live-casino";

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
  categories: CategoryId[];
}

/* Category Navigation Pills */
const CATEGORIES: { id: CategoryId; label: string; icon: React.ElementType }[] = [
  { id: "lobby", label: "Lobby", icon: LayoutGrid },
  { id: "originals", label: "Originals", icon: Gamepad2 },
  { id: "slots", label: "Slots", icon: Coins },
  { id: "pasa-picks", label: "Pasa Picks", icon: BadgeCheck },
  { id: "mini-games", label: "Mini Games", icon: Flame },
  { id: "live-casino", label: "Live Casino", icon: Tv },
];

/* Gold Coin SVG Icon for Payouts */
function GoldCoinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="7.5" stroke="#FDE047" strokeWidth="1" strokeDasharray="2 2" />
      <text x="12" y="15.5" textAnchor="middle" fill="#713F12" fontSize="9" fontWeight="900" fontFamily="sans-serif">₹</text>
    </svg>
  );
}

/* Winning Information Live Feed dataset */
const LIVE_WINNINGS = [
  {
    id: "w1",
    gameName: "Crazy Pachinko",
    user: "MEM***3417",
    payout: "2,310.00",
    badgeBg: "from-emerald-700 to-green-900",
    badgeLabel: "PACHINKO",
    emoji: "🎡",
  },
  {
    id: "w2",
    gameName: "Infinite Blackjack",
    user: "MEM***7525",
    payout: "1,349.00",
    badgeBg: "from-blue-700 to-indigo-950",
    badgeLabel: "BLACKJACK",
    emoji: "♠️",
  },
  {
    id: "w3",
    gameName: "Race Track",
    user: "MEM***7479",
    payout: "1,570.00",
    badgeBg: "from-sky-700 to-blue-900",
    badgeLabel: "TRACK",
    emoji: "🏇",
  },
  {
    id: "w4",
    gameName: "Heads and Tails",
    user: "MEM***5181",
    payout: "1,620.00",
    badgeBg: "from-amber-600 to-yellow-800",
    badgeLabel: "HEADS",
    emoji: "🪙",
  },
  {
    id: "w5",
    gameName: "TowerRush",
    user: "MEM***3626",
    payout: "1,620.00",
    badgeBg: "from-orange-600 to-amber-900",
    badgeLabel: "TOWER",
    emoji: "🏰",
  },
];

/* All games in the casino */
const ALL_GAMES: GameItem[] = [
  {
    slug: "dice",
    name: "DICE",
    playing: "2,179",
    image: "/games/dice.png",
    bgGradient: "from-[#8B5CF6] to-[#581C87]",
    hasTextInImage: true,
    isPlayable: true,
    categories: ["originals", "mini-games", "pasa-picks"],
  },
  {
    slug: "mines",
    name: "MINES",
    playing: "1,931",
    image: "/games/mines.png",
    bgGradient: "from-[#0284C7] to-[#0369A1]",
    hasTextInImage: true,
    isPlayable: true,
    categories: ["originals", "pasa-picks", "mini-games"],
  },
  {
    slug: "plinko",
    name: "PLINKO",
    playing: "1,015",
    image: "/games/plinko.png",
    bgGradient: "from-[#9333EA] to-[#6B21A8]",
    hasTextInImage: true,
    isPlayable: true,
    badge: "10000 x",
    badgePosition: "top-left",
    categories: ["originals", "pasa-picks", "mini-games"],
  },
  {
    slug: "crash",
    name: "CRASH",
    playing: "963",
    image: "/games/crash.png",
    bgGradient: "from-[#F59E0B] to-[#1E3A8A]",
    hasTextInImage: true,
    isPlayable: true,
    categories: ["originals", "pasa-picks"],
  },
  {
    slug: "limbo",
    name: "LIMBO",
    playing: "1,661",
    image: "/games/limbo.png",
    bgGradient: "from-[#F59E0B] to-[#B45309]",
    hasTextInImage: true,
    isPlayable: true,
    badge: "900x",
    badgePosition: "top-left",
    categories: ["originals", "pasa-picks", "mini-games"],
  },
  {
    slug: "coinflip",
    name: "COINFLIP",
    playing: "752",
    image: "/games/coinflip.png",
    bgGradient: "from-[#059669] to-[#064E3B]",
    hasTextInImage: true,
    isPlayable: true,
    categories: ["originals", "mini-games"],
  },
  {
    slug: "slide",
    name: "SLIDE",
    playing: "256",
    image: "/games/slide.png",
    bgGradient: "from-[#06B6D4] to-[#0F766E]",
    hasTextInImage: true,
    isPlayable: false,
    categories: ["originals", "mini-games"],
  },
  {
    slug: "chicken",
    name: "CHICKEN",
    playing: "289",
    image: "/games/chicken.png",
    bgGradient: "from-[#2563EB] to-[#4338CA]",
    hasTextInImage: true,
    isPlayable: false,
    categories: ["originals", "mini-games"],
  },
  {
    slug: "keno",
    name: "KENO",
    playing: "1,316",
    image: "/games/keno.png",
    bgGradient: "from-[#0EA5E9] to-[#0369A1]",
    hasTextInImage: true,
    isPlayable: false,
    categories: ["originals"],
  },
  {
    slug: "hilo",
    name: "HILO",
    playing: "580",
    image: "/games/hilo.png",
    bgGradient: "from-[#DC2626] to-[#7F1D1D]",
    hasTextInImage: true,
    isPlayable: false,
    categories: ["originals", "mini-games"],
  },
  {
    slug: "gates-of-olympus",
    name: "GATES OF OLYMPUS 1000",
    playing: "2,420",
    image: "/games/wheel.png",
    bgGradient: "from-[#3B82F6] to-[#1D4ED8]",
    isPlayable: false,
    categories: ["slots", "pasa-picks"],
  },
  {
    slug: "waylanders-forge",
    name: "WAYLANDERS FORGE",
    playing: "542",
    image: "/games/drill.png",
    bgGradient: "from-[#D97706] to-[#78350F]",
    isPlayable: false,
    categories: ["slots"],
  },
  {
    slug: "sweet-bonanza",
    name: "SWEET BONANZA 1000",
    playing: "1,883",
    image: "/games/pump.png",
    bgGradient: "from-[#EC4899] to-[#831843]",
    isPlayable: false,
    categories: ["slots", "pasa-picks"],
  },
  {
    slug: "wanted-dead-or-a-wild",
    name: "WANTED DEAD OR A WILD",
    playing: "1,120",
    image: "/games/chicken.png",
    bgGradient: "from-[#B45309] to-[#451A03]",
    isPlayable: false,
    categories: ["slots"],
  },
  {
    slug: "le-catcher",
    name: "LE CATCHER",
    playing: "482",
    image: "/games/slide.png",
    bgGradient: "from-[#0284C7] to-[#0E7490]",
    isPlayable: false,
    categories: ["slots"],
  },
  {
    slug: "sugar-rush",
    name: "SUGAR RUSH 1000",
    playing: "1,340",
    image: "/games/plinko.png",
    bgGradient: "from-[#F43F5E] to-[#9F1239]",
    isPlayable: false,
    categories: ["slots"],
  },
  {
    slug: "dragonspire-frostfall",
    name: "DRAGONSPIRE FROSTFALL",
    playing: "431",
    image: "/games/snakes.png",
    bgGradient: "from-[#2563EB] to-[#1E3A8A]",
    isPlayable: false,
    categories: ["slots"],
  },
  {
    slug: "gates-of-olympus-super-scatter",
    name: "GATES OF OLYMPUS SUPER SCATTER",
    playing: "895",
    image: "/games/wheel.png",
    bgGradient: "from-[#EAB308] to-[#854D0E]",
    isPlayable: false,
    categories: ["slots"],
  },
];

/* Reusable Game Card component (border-none, exact original styling) */
function GameCardComponent({ game }: { game: GameItem }) {
  return (
    <Link 
      href={game.isPlayable ? `/casino/games/${game.slug}` : `/casino/games/dice`}
      className="group flex flex-col focus:outline-hidden"
    >
      <div className={`relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-gradient-to-b ${game.bgGradient} border-none shadow-md transition-all duration-200 group-hover:scale-[1.03] group-active:scale-95`}>
        <img 
          src={game.image} 
          alt={game.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      {/* Playing count with green dot */}
      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#8F97A6] mt-1.5 pl-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00E701] shrink-0" />
        <span>{game.playing} Playing</span>
      </div>
    </Link>
  );
}

export default function CasinoLobbyPage() {
  const [activeTab, setActiveTab] = useState<CategoryId>("lobby");

  // Pagination states for Lobby sections (0 = first 3, 1 = next 3, etc.)
  const [pages, setPages] = useState<Record<string, number>>({
    originals: 0,
    "pasa-picks": 0,
    slots: 0,
    "mini-games": 0,
  });

  // View all expansion states for Lobby sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const handleNext = (sectionKey: string, totalItems: number) => {
    const maxPages = Math.ceil(totalItems / 3) || 1;
    setPages((prev) => ({
      ...prev,
      [sectionKey]: ((prev[sectionKey] || 0) + 1) % maxPages,
    }));
  };

  const handlePrev = (sectionKey: string, totalItems: number) => {
    const maxPages = Math.ceil(totalItems / 3) || 1;
    setPages((prev) => ({
      ...prev,
      [sectionKey]: ((prev[sectionKey] || 0) - 1 + maxPages) % maxPages,
    }));
  };

  const toggleExpand = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Helper to get visible cards in carousel mode
  const getCarouselCards = (games: GameItem[], sectionKey: string) => {
    if (expandedSections[sectionKey]) return games;
    const page = pages[sectionKey] || 0;
    const startIndex = (page % Math.ceil(games.length / 3)) * 3;
    return games.slice(startIndex, startIndex + 3);
  };

  // Filtered games for currently active tab
  const currentTabCategory = CATEGORIES.find((c) => c.id === activeTab);
  const activeTabGames = activeTab === "lobby" 
    ? ALL_GAMES 
    : ALL_GAMES.filter((g) => g.categories.includes(activeTab));

  // Curated Lobby sections
  const originalsGames = ALL_GAMES.filter((g) => g.categories.includes("originals"));
  const picksGames = ALL_GAMES.filter((g) => g.categories.includes("pasa-picks"));
  const slotsGames = ALL_GAMES.filter((g) => g.categories.includes("slots"));
  const miniGames = ALL_GAMES.filter((g) => g.categories.includes("mini-games"));

  return (
    <div className="w-full flex flex-col pb-6 select-none">
      
      {/* Category Tab Bar — soft pill segmented controls */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] whitespace-nowrap transition-all duration-150 cursor-pointer rounded-xl font-semibold shrink-0 select-none active:scale-95 ${
                isActive 
                  ? "bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] text-white border-t border-white/20 shadow-[0_2px_8px_rgba(124,58,237,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]" 
                  : "bg-gradient-to-b from-[#131726] to-[#0D101C] border border-[#1E263D] hover:border-[#2F3C5C] text-[#8391A8] hover:text-[#CBD5E1] shadow-xs"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${ isActive ? "text-white" : "text-[#586884]" }`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW 1: LOBBY (HOME) - Shows all main sections with 3-card carousels */}
      {activeTab === "lobby" && (
        <div className="w-full flex flex-col gap-5 mt-2">
          
          {/* Section 1: Originals */}
          <section className="px-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-[#8B5CF6]" />
                <h2 className="text-[13px] font-bold text-slate-100 tracking-tight">Originals</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleExpand("originals")}
                  className="text-[11px] font-semibold text-[#8B98B2] hover:text-white bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1F273E] hover:border-[#303E60] px-2.5 py-1 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  {expandedSections["originals"] ? "Collapse" : "View all"}
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePrev("originals", originalsGames.length)}
                    className="w-6.5 h-6.5 rounded-lg bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1F273E] hover:border-[#303E60] text-[#8B98B2] hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleNext("originals", originalsGames.length)}
                    className="w-6.5 h-6.5 rounded-lg bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1F273E] hover:border-[#303E60] text-[#8B98B2] hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {getCarouselCards(originalsGames, "originals").map((game) => (
                <GameCardComponent key={game.slug} game={game} />
              ))}
            </div>
          </section>

          {/* Section 2: Pasa Picks */}
          <section className="px-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-[#8B5CF6]" />
                <h2 className="text-[13px] font-bold text-slate-100 tracking-tight">Pasa Picks</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => toggleExpand("pasa-picks")} 
                  className="text-[11px] font-semibold text-[#8B98B2] hover:text-white bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1F273E] hover:border-[#303E60] px-2.5 py-1 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  {expandedSections["pasa-picks"] ? "Collapse" : "View all"}
                </button>
                <div className="flex items-center gap-1">
                  <button onClick={() => handlePrev("pasa-picks", picksGames.length)} className="w-6.5 h-6.5 rounded-lg bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1F273E] hover:border-[#303E60] text-[#8B98B2] hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95" aria-label="Previous">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleNext("pasa-picks", picksGames.length)} className="w-6.5 h-6.5 rounded-lg bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1F273E] hover:border-[#303E60] text-[#8B98B2] hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95" aria-label="Next">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {getCarouselCards(picksGames, "pasa-picks").map((game) => (
                <GameCardComponent key={game.slug} game={game} />
              ))}
            </div>
          </section>

          {/* Section 3: Slots */}
          <section className="px-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#8B5CF6]" />
                <h2 className="text-[13px] font-bold text-slate-100 tracking-tight">Slots</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => toggleExpand("slots")} 
                  className="text-[11px] font-semibold text-[#8B98B2] hover:text-white bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1F273E] hover:border-[#303E60] px-2.5 py-1 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  {expandedSections["slots"] ? "Collapse" : "View all"}
                </button>
                <div className="flex items-center gap-1">
                  <button onClick={() => handlePrev("slots", slotsGames.length)} className="w-6.5 h-6.5 rounded-lg bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1F273E] hover:border-[#303E60] text-[#8B98B2] hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95" aria-label="Previous">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleNext("slots", slotsGames.length)} className="w-6.5 h-6.5 rounded-lg bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1F273E] hover:border-[#303E60] text-[#8B98B2] hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95" aria-label="Next">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {getCarouselCards(slotsGames, "slots").map((game) => (
                <GameCardComponent key={game.slug} game={game} />
              ))}
            </div>
          </section>

          {/* Section 4: Mini Games */}
          <section className="px-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#8B5CF6]" />
                <h2 className="text-[13px] font-bold text-slate-100 tracking-tight">Mini Games</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => toggleExpand("mini-games")} 
                  className="text-[11px] font-semibold text-[#8B98B2] hover:text-white bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1F273E] hover:border-[#303E60] px-2.5 py-1 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  {expandedSections["mini-games"] ? "Collapse" : "View all"}
                </button>
                <div className="flex items-center gap-1">
                  <button onClick={() => handlePrev("mini-games", miniGames.length)} className="w-6.5 h-6.5 rounded-lg bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1F273E] hover:border-[#303E60] text-[#8B98B2] hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95" aria-label="Previous">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleNext("mini-games", miniGames.length)} className="w-6.5 h-6.5 rounded-lg bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1F273E] hover:border-[#303E60] text-[#8B98B2] hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95" aria-label="Next">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {getCarouselCards(miniGames, "mini-games").map((game) => (
                <GameCardComponent key={game.slug} game={game} />
              ))}
            </div>
          </section>

          {/* Section 5: Winning Information (Live Feed) */}
          <section className="px-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#A855F7]" />
                <h3 className="text-[13px] font-bold text-slate-100 tracking-tight">Winning Information</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                <span className="text-[10px] font-bold text-emerald-400">LIVE</span>
              </div>
            </div>

            {/* Winning Table */}
            <div className="bg-gradient-to-b from-[#0F1322] to-[#0A0D18] border border-[#182136] rounded-xl overflow-hidden shadow-xs">
              {/* Header */}
              <div className="px-4 py-2.5 flex items-center justify-between text-[10px] font-bold text-[#556585] uppercase tracking-wider border-b border-[#141A2B] bg-[#0D101C]/50">
                <span>Game</span>
                <span>Payout</span>
              </div>
              {/* Rows */}
              <div className="divide-y divide-[#141A2B]">
                {LIVE_WINNINGS.map((win) => (
                  <div key={win.id} className="px-4 py-3 flex items-center justify-between hover:bg-[#141A2E]/60 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${win.badgeBg} flex flex-col items-center justify-center shrink-0 shadow-xs`}>
                        <span className="text-[11px] leading-none">{win.emoji}</span>
                        <span className="text-[5.5px] font-black tracking-tight text-white/90 uppercase mt-0.5 leading-none">{win.badgeLabel}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-semibold text-slate-100 leading-snug">{win.gameName}</span>
                        <span className="text-[10px] text-[#556585] font-mono leading-none mt-0.5">{win.user}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[12px] font-bold text-slate-100 tracking-tight">₹{win.payout}</span>
                      <GoldCoinIcon className="w-4 h-4 shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-2 pt-6 border-t border-[#141A2B] flex flex-col items-center text-center px-4 gap-3">
            <p className="text-[11px] text-[#556585] font-semibold">
              © 2026 7xpasa.com · All Rights Reserved
            </p>
            <p className="text-[10px] leading-relaxed text-[#3B4760] max-w-xs">
              7XPASA is owned and operated by Medium Max N.V., registration number: 1453578, registered address: Seru Loraweg 18 B, Curaçao. Contact us at{" "}
              <a href="mailto:support@7xpasa.com" className="text-[#64748B] hover:text-[#94A3B8] underline">support@7xpasa.com</a>.
            </p>
            <p className="text-[10px] text-[#3B4760]">
              7X PASA is committed to responsible gambling.{" "}
              <a href="https://www.gamblingtherapy.org" target="_blank" rel="noopener noreferrer" className="text-[#64748B] hover:text-[#94A3B8] underline">Gamblingtherapy.org</a>
            </p>
            <button 
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-b from-[#131726] to-[#0D101C] border border-[#1E263D] text-[11px] font-medium text-[#8B98B2] hover:text-white hover:border-[#2F3C5C] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span className="text-sm">🇺🇸</span>
              <span>English</span>
              <ChevronDown className="w-3 h-3 text-[#556585] ml-0.5" />
            </button>
            <div className="pb-4">
              <Link href="/casino" className="flex items-center gap-1 select-none">
                <span className="text-xl font-black italic tracking-tighter text-[#8B5CF6] leading-none">7X</span>
                <div className="flex flex-col ml-0.5 justify-center text-left">
                  <span className="text-[16px] font-black tracking-wide text-white leading-none">PASA</span>
                  <span className="text-[6px] font-extrabold tracking-widest text-[#556585] uppercase leading-none mt-0.5">PLAY 7X WIN 7X</span>
                </div>
              </Link>
            </div>
          </footer>

        </div>
      )}

      {/* VIEW 2: SPECIFIC CATEGORY TAB */}
      {activeTab !== "lobby" && (
        <div className="w-full flex flex-col mt-4 px-4">
          
          {/* Category Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {currentTabCategory && (
                <currentTabCategory.icon className="w-4 h-4 text-[#8B5CF6]" />
              )}
              <h2 className="text-[13px] font-bold text-slate-100 tracking-tight">
                {currentTabCategory?.label}
              </h2>
              {activeTabGames.length > 0 && (
                <span className="text-[10px] font-semibold text-[#8B98B2] bg-[#121626] border border-[#1E263D] px-2 py-0.5 rounded-md">
                  {activeTabGames.length}
                </span>
              )}
            </div>
            <button
              onClick={() => setActiveTab("lobby")}
              className="text-[11px] font-semibold text-[#8B98B2] hover:text-white bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1F273E] hover:border-[#303E60] px-2.5 py-1 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
            >
              ← Back
            </button>
          </div>

          {activeTabGames.length > 0 ? (
            <div className="grid grid-cols-3 gap-2.5">
              {activeTabGames.map((game) => (
                <GameCardComponent key={game.slug} game={game} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1E263D] flex items-center justify-center text-[#64748B] mb-4 shadow-inner">
                {currentTabCategory ? (
                  <currentTabCategory.icon className="w-6 h-6" />
                ) : (
                  <Inbox className="w-6 h-6" />
                )}
              </div>
              <h3 className="text-[14px] font-bold text-slate-100 mb-1.5">No {currentTabCategory?.label} Yet</h3>
              <p className="text-[11px] text-[#64748B] max-w-[240px] leading-relaxed">
                We're adding exciting new games to this section. Check back soon!
              </p>
              <button
                onClick={() => setActiveTab("lobby")}
                className="mt-5 px-5 py-2 rounded-xl bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] hover:from-[#8B5CF6] hover:to-[#6D28D9] text-white text-[12px] font-bold border-t border-white/20 shadow-[0_2px_8px_rgba(124,58,237,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all cursor-pointer active:scale-95"
              >
                Browse Lobby
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
