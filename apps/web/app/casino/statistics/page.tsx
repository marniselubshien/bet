"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, BarChart2, TrendingUp, Award, Zap, Trophy, 
  Gamepad2, Percent, ArrowUpRight, ShieldCheck, ChevronRight
} from "lucide-react";

export default function StatisticsPage() {
  const [timeframe, setTimeframe] = useState<"today" | "week" | "month" | "all">("all");

  const STATS_DATA = {
    today: {
      bets: 48,
      wagered: 2450.00,
      won: 2980.00,
      profit: 530.00,
      winRate: "62.5%",
      highestMult: "45.00x",
      bestGame: "Aviator",
    },
    week: {
      bets: 312,
      wagered: 14200.00,
      won: 16850.00,
      profit: 2650.00,
      winRate: "59.2%",
      highestMult: "180.00x",
      bestGame: "Wingo 30s",
    },
    month: {
      bets: 940,
      wagered: 48500.00,
      won: 54100.00,
      profit: 5600.00,
      winRate: "58.1%",
      highestMult: "450.00x",
      bestGame: "Limbo",
    },
    all: {
      bets: 1482,
      wagered: 78500.00,
      won: 89450.00,
      profit: 10950.00,
      winRate: "58.4%",
      highestMult: "850.00x",
      bestGame: "Aviator",
    },
  };

  const current = STATS_DATA[timeframe];

  const GAME_PERFORMANCES = [
    { name: "Aviator", bets: 512, wagered: "₹28,400", profit: "+₹6,150", positive: true, mult: "850x" },
    { name: "Wingo 30s", bets: 420, wagered: "₹22,100", profit: "+₹3,820", positive: true, mult: "4.5x" },
    { name: "Limbo", bets: 280, wagered: "₹14,000", profit: "+₹1,940", positive: true, mult: "450x" },
    { name: "Mines", bets: 160, wagered: "₹9,200", profit: "-₹480", positive: false, mult: "18.2x" },
    { name: "Crash", bets: 110, wagered: "₹4,800", profit: "+₹520", positive: true, mult: "32.0x" },
  ];

  return (
    <div className="w-full flex flex-col pt-2 pb-10 px-3.5 select-none text-[#8F97A6]">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1A1E2F]">
        <Link 
          href="/casino" 
          className="flex items-center gap-1.5 text-xs font-semibold text-[#8F97A6] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Casino</span>
        </Link>
        <span className="text-xs font-black uppercase tracking-wider text-white">
          Player Statistics
        </span>
      </div>

      {/* Timeframe Selector */}
      <div className="flex bg-[#121524] p-1 rounded-xl border border-[#21263B] mb-4">
        {(["today", "week", "month", "all"] as const).map((period) => (
          <button
            key={period}
            onClick={() => setTimeframe(period)}
            className={`flex-1 py-1.5 rounded-lg font-bold text-xs capitalize transition-all cursor-pointer ${
              timeframe === period
                ? "bg-[#7C3AED] text-white shadow-sm"
                : "text-[#8F97A6] hover:text-white"
            }`}
          >
            {period === "all" ? "All Time" : period}
          </button>
        ))}
      </div>

      {/* Net Profit Big Banner Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1A1633] via-[#121526] to-[#0D101C] border border-[#2C234E] p-4.5 mb-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#A78BFA] uppercase tracking-wider">
              Net Profit
            </span>
            <span className="text-2xl font-black text-emerald-400 font-sans mt-0.5">
              +₹{current.profit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#23273D] text-xs">
          <div>
            <span className="text-[#8F97A6] text-[11px]">Total Wagered: </span>
            <div className="font-bold text-white font-sans text-sm">
              ₹{current.wagered.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[#8F97A6] text-[11px]">Total Won: </span>
            <div className="font-bold text-emerald-300 font-sans text-sm">
              ₹{current.won.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {/* Total Bets */}
        <div className="rounded-xl bg-[#131625] border border-[#20253B] p-3 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-[#8F97A6] uppercase">Total Bets</span>
            <Gamepad2 className="w-3.5 h-3.5 text-[#A78BFA]" />
          </div>
          <span className="text-base font-black text-white font-sans">
            {current.bets.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Win Rate */}
        <div className="rounded-xl bg-[#131625] border border-[#20253B] p-3 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-[#8F97A6] uppercase">Win Rate</span>
            <Percent className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-base font-black text-emerald-400 font-sans">
            {current.winRate}
          </span>
        </div>

        {/* Highest Multiplier */}
        <div className="rounded-xl bg-[#131625] border border-[#20253B] p-3 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-[#8F97A6] uppercase">Highest Multiplier</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-base font-black text-amber-400 font-sans">
            {current.highestMult}
          </span>
        </div>

        {/* Best Game */}
        <div className="rounded-xl bg-[#131625] border border-[#20253B] p-3 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-[#8F97A6] uppercase">Top Game</span>
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
          </div>
          <span className="text-sm font-black text-white truncate">
            {current.bestGame}
          </span>
        </div>
      </div>

      {/* Game Breakdown List */}
      <div className="rounded-2xl bg-[#131625] border border-[#20253B] p-4 mb-4 shadow-md">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
          Performance by Game
        </h3>
        <div className="flex flex-col gap-2.5">
          {GAME_PERFORMANCES.map((game) => (
            <div 
              key={game.name}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D0F1B] border border-[#1A1F33] text-xs"
            >
              <div className="flex flex-col">
                <span className="font-bold text-white">{game.name}</span>
                <span className="text-[10px] text-[#768095]">
                  {game.bets} bets • Peak {game.mult}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className={`font-sans font-bold ${game.positive ? "text-emerald-400" : "text-rose-400"}`}>
                  {game.profit}
                </span>
                <span className="text-[10px] text-[#768095] font-sans">
                  {game.wagered}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VIP Status Progress */}
      <div className="rounded-2xl bg-[#131625] border border-[#20253B] p-4 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#A78BFA]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              VIP Tier Progress
            </span>
          </div>
          <span className="text-xs font-black text-[#A78BFA]">VIP 3</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#0D0F1B] overflow-hidden mb-1.5 border border-[#1E2338]">
          <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] w-[68%]" />
        </div>
        <div className="flex justify-between text-[10px] text-[#768095]">
          <span>₹78,500 / ₹1,00,000 Wagered</span>
          <span>68% to VIP 4</span>
        </div>
      </div>
    </div>
  );
}
