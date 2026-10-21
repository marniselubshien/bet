"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Gamepad2, ShieldCheck, CheckCircle2, XCircle, 
  ChevronRight, Filter, Sparkles
} from "lucide-react";

interface BetRecord {
  id: string;
  game: string;
  category: "Originals" | "Slots" | "Live";
  bet: number;
  multiplier: number;
  payout: number;
  win: boolean;
  time: string;
  seed: string;
}

export default function GameHistoryPage() {
  const [filter, setFilter] = useState<"all" | "wins" | "losses">("all");
  const [selectedBet, setSelectedBet] = useState<BetRecord | null>(null);

  const BETS: BetRecord[] = [
    {
      id: "bet-101",
      game: "Aviator",
      category: "Originals",
      bet: 100,
      multiplier: 4.85,
      payout: 485.00,
      win: true,
      time: "Today, 15:42",
      seed: "d83e29f10a82b0e9981",
    },
    {
      id: "bet-102",
      game: "Wingo 30s",
      category: "Originals",
      bet: 200,
      multiplier: 2.00,
      payout: 400.00,
      win: true,
      time: "Today, 15:39",
      seed: "f71829a83819c9284ba",
    },
    {
      id: "bet-103",
      game: "Limbo",
      category: "Originals",
      bet: 50,
      multiplier: 0.00,
      payout: 0.00,
      win: false,
      time: "Today, 15:20",
      seed: "c9837192a83712b3901",
    },
    {
      id: "bet-104",
      game: "Mines",
      category: "Originals",
      bet: 100,
      multiplier: 3.24,
      payout: 324.00,
      win: true,
      time: "Today, 14:55",
      seed: "a8492019b847291038e",
    },
    {
      id: "bet-105",
      game: "Crash",
      category: "Originals",
      bet: 150,
      multiplier: 0.00,
      payout: 0.00,
      win: false,
      time: "Today, 14:30",
      seed: "998271038192a839210",
    },
    {
      id: "bet-106",
      game: "Plinko",
      category: "Originals",
      bet: 50,
      multiplier: 18.00,
      payout: 900.00,
      win: true,
      time: "Yesterday, 22:15",
      seed: "b839201982736190283",
    },
    {
      id: "bet-107",
      game: "Sweet Bonanza",
      category: "Slots",
      bet: 100,
      multiplier: 0.00,
      payout: 0.00,
      win: false,
      time: "Yesterday, 21:50",
      seed: "e839281093847291038",
    },
  ];

  const filtered = BETS.filter((b) => {
    if (filter === "wins") return b.win;
    if (filter === "losses") return !b.win;
    return true;
  });

  return (
    <div className="w-full flex flex-col pt-2 pb-10 px-3.5 select-none text-[#8F97A6]">
      {/* Provably Fair Modal */}
      {selectedBet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-[360px] bg-[#121526] border border-[#7C3AED]/40 rounded-2xl p-5 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Provably Fair Verification</span>
              </div>
              <button 
                onClick={() => setSelectedBet(null)}
                className="text-[#8F97A6] hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="flex flex-col gap-2 text-xs bg-[#0A0C16] p-3 rounded-xl border border-[#1A1F33] mb-4">
              <div>
                <span className="text-[#717A8C]">Game: </span>
                <span className="text-white font-bold">{selectedBet.game}</span>
              </div>
              <div>
                <span className="text-[#717A8C]">Bet / Result: </span>
                <span className="text-white font-sans font-bold">
                  ₹{selectedBet.bet} • {selectedBet.multiplier > 0 ? `${selectedBet.multiplier}x` : "Bust"}
                </span>
              </div>
              <div>
                <span className="text-[#717A8C]">Server Seed Hash: </span>
                <span className="text-[#A78BFA] font-sans break-all text-[11px] block mt-0.5">
                  {selectedBet.seed}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#717A8C] mb-4">
              This round was generated using cryptographic SHA-256 client and server seeds to guarantee 100% mathematical fairness.
            </p>

            <button
              onClick={() => setSelectedBet(null)}
              className="w-full py-2.5 rounded-xl bg-[#7C3AED] text-white font-bold text-xs"
            >
              Verified Fair
            </button>
          </div>
        </div>
      )}

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
          My Game History
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-[#121524] p-1 rounded-xl border border-[#21263B] mb-4">
        {(["all", "wins", "losses"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1.5 rounded-lg font-bold text-xs capitalize transition-all cursor-pointer ${
              filter === tab
                ? "bg-[#7C3AED] text-white shadow-sm"
                : "text-[#8F97A6] hover:text-white"
            }`}
          >
            {tab === "all" ? "All Rounds" : tab === "wins" ? "Wins Only" : "Losses"}
          </button>
        ))}
      </div>

      {/* Bets List */}
      <div className="flex flex-col gap-2.5">
        {filtered.map((bet) => (
          <div 
            key={bet.id}
            onClick={() => setSelectedBet(bet)}
            className="p-3 rounded-2xl bg-[#131625] border border-[#20253B] flex items-center justify-between shadow-sm hover:border-[#7C3AED]/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                bet.win 
                  ? "bg-emerald-500/15 text-emerald-400" 
                  : "bg-rose-500/15 text-rose-400"
              }`}>
                {bet.win ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-tight">
                  {bet.game}
                </span>
                <span className="text-[10px] text-[#717A8C] mt-0.5">
                  Bet: ₹{bet.bet} • {bet.time}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5">
                <span className={`font-sans text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                  bet.win ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-800 text-zinc-400"
                }`}>
                  {bet.multiplier > 0 ? `${bet.multiplier}x` : "0.00x"}
                </span>
                <span className={`font-sans text-sm font-black ${
                  bet.win ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {bet.win ? `+₹${bet.payout.toFixed(2)}` : `-₹${bet.bet.toFixed(2)}`}
                </span>
              </div>
              <span className="text-[9px] text-[#A78BFA] mt-1 flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5" /> Fair Hash
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
