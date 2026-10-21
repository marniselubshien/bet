"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Gift, Sparkles, CheckCircle2, Copy, Check, ArrowRight,
  Flame, Trophy, Zap, ShieldAlert
} from "lucide-react";

export default function PromotionsPage() {
  const [claimedDaily, setClaimedDaily] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelPrize, setWheelPrize] = useState<string | null>(null);

  const handleClaim = () => {
    setClaimedDaily(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText("PASA7X");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSpinWheel = () => {
    if (wheelSpinning || wheelPrize) return;
    setWheelSpinning(true);
    setTimeout(() => {
      setWheelSpinning(false);
      setWheelPrize("₹250 Bonus Added!");
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col pt-2 pb-6 px-3.5 select-none text-[#8F97A6]">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#7C3AED]/30 via-[#1B1E30] to-[#121422] border border-[#7C3AED]/40 p-4 mb-4 shadow-xl">
        <div className="flex items-center gap-1.5 mb-1 text-[#EAB308]">
          <Gift className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-wider">Free Rewards Hub</span>
        </div>
        <h1 className="text-lg font-black text-white leading-tight">
          Claim Free Bonuses & Cash Drops
        </h1>
        <p className="text-xs text-[#8F97A6] mt-1 max-w-[280px]">
          Reload your balance every single day without spending a rupee.
        </p>
      </div>

      {/* Promo 1: Daily Free Money Faucet */}
      <div className="rounded-2xl bg-[#141624] border border-[#23273A] p-4 mb-3.5 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EAB308]/15 text-[#EAB308] flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Daily ₹100 Faucet</h3>
              <p className="text-[11px] text-[#8F97A6]">Free instant balance reload</p>
            </div>
          </div>
          <span className="text-xs font-sans font-black text-[#00E701] bg-[#1C1F2E] px-2 py-1 rounded-md">
            +₹100.00
          </span>
        </div>

        {claimedDaily ? (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Claimed! Returns in 23h 59m</span>
          </div>
        ) : (
          <button
            onClick={handleClaim}
            className="w-full py-2.5 bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] hover:from-[#7C3AED] hover:to-[#9333EA] text-white text-xs font-bold rounded-xl shadow-md shadow-purple-900/30 cursor-pointer border-none transition-all active:scale-95"
          >
            Claim Free ₹100 Now
          </button>
        )}
      </div>

      {/* Promo 2: Lucky Spin Wheel Mini-Game */}
      <div className="rounded-2xl bg-[#141624] border border-[#23273A] p-4 mb-3.5 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Lucky Wheel Spin</h3>
              <p className="text-[11px] text-[#8F97A6]">Win up to ₹5,000 every week</p>
            </div>
          </div>
        </div>

        {wheelPrize ? (
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FFC700]" />
            <span>🎉 {wheelPrize}</span>
          </div>
        ) : (
          <button
            onClick={handleSpinWheel}
            disabled={wheelSpinning}
            className={`w-full py-2.5 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer border-none ${
              wheelSpinning 
                ? "bg-zinc-700 animate-pulse" 
                : "bg-[#1E2132] hover:bg-[#282D42] border border-[#2B3045] active:scale-95"
            }`}
          >
            {wheelSpinning ? "Spinning Wheel..." : "Spin Lucky Wheel (1 Free)"}
          </button>
        )}
      </div>

      {/* Promo 3: 200% Welcome Bonus */}
      <div className="rounded-2xl bg-[#141624] border border-[#23273A] p-4 mb-3.5 shadow-md flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FFC700]" />
            <h3 className="text-xs font-bold text-white">200% First Deposit Match</h3>
          </div>
          <span className="text-[10px] font-bold text-[#A78BFA] bg-[#6D28D9]/20 px-2 py-0.5 rounded">
            VIP 1
          </span>
        </div>
        <p className="text-[11px] text-[#8F97A6] leading-relaxed">
          Deposit ₹500 or more to receive up to ₹50,000 bonus cash match with instant activation.
        </p>
        <Link 
          href="/casino/account"
          className="w-full py-2 bg-[#1B1E2E] hover:bg-[#24283D] border border-[#2B3045] text-white text-xs font-semibold rounded-lg text-center transition-colors"
        >
          View Deposit Options
        </Link>
      </div>

      {/* Promo 4: Referral Bonus */}
      <div className="rounded-2xl bg-[#141624] border border-[#23273A] p-4 shadow-md flex flex-col gap-2.5">
        <h3 className="text-xs font-bold text-white">Refer & Earn ₹500 per Friend</h3>
        <p className="text-[11px] text-[#8F97A6] leading-relaxed">
          Share your exclusive referral code with your friends and receive ₹500 when they play!
        </p>
        <div className="flex items-center gap-2 bg-[#1B1E2E] border border-[#2B3045] rounded-xl p-2">
          <span className="font-sans text-xs font-bold text-white px-2">PASA7X</span>
          <button
            onClick={handleCopyCode}
            className="ml-auto px-3 py-1.5 rounded-lg bg-[#6D28D9] hover:bg-[#7C3AED] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer border-none transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
