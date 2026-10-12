"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Gift, Sparkles, CheckCircle2, Copy, Check, 
  Flame, Zap, Users, Share2, Award, ChevronRight
} from "lucide-react";

export default function FreeMoneyPage() {
  const [claimedDay, setClaimedDay] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelPrize, setWheelPrize] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoClaimed, setPromoClaimed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const STREAK_DAYS = [
    { day: 1, amount: 10, bonus: "+₹10" },
    { day: 2, amount: 25, bonus: "+₹25" },
    { day: 3, amount: 50, bonus: "+₹50" },
    { day: 4, amount: 75, bonus: "+₹75" },
    { day: 5, amount: 100, bonus: "+₹100" },
    { day: 6, amount: 150, bonus: "+₹150" },
    { day: 7, amount: 300, bonus: "+₹300 🎁" },
  ];

  const handleClaimDay = (day: number, amount: number) => {
    if (claimedDay !== null) {
      showToast("Already claimed today's bonus! Come back tomorrow.");
      return;
    }
    setClaimedDay(day);
    showToast(`Claimed ₹${amount} Daily Bonus to your wallet!`);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText("PASA7X");
    setCopiedCode(true);
    showToast("Referral code PASA7X copied!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSpinWheel = () => {
    if (wheelSpinning || wheelPrize) return;
    setWheelSpinning(true);
    setTimeout(() => {
      setWheelSpinning(false);
      setWheelPrize("₹250 Cash Added!");
      showToast("Won ₹250 Cash Bonus!");
    }, 2000);
  };

  const handleClaimPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    if (promoCode.trim().toUpperCase() === "PASA7X" || promoCode.trim().toUpperCase() === "BONUS100") {
      setPromoClaimed(true);
      showToast("Promo Code applied! ₹100 added to balance.");
    } else {
      showToast("Invalid or expired promo code.");
    }
  };

  return (
    <div className="w-full flex flex-col pt-2 pb-10 px-3.5 select-none text-[#8F97A6]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#161A28] border border-[#EAB308] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-2">
          {toastMessage}
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
        <span className="text-xs font-black uppercase tracking-wider text-[#EAB308]">
          Free Money Hub
        </span>
      </div>

      {/* Golden Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#7C3AED]/30 via-[#1B1E30] to-[#121422] border border-[#7C3AED]/40 p-4 mb-4 shadow-xl">
        <div className="flex items-center gap-1.5 mb-1 text-[#EAB308]">
          <Gift className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-wider">Free Cash Faucets</span>
        </div>
        <h1 className="text-lg font-black text-white leading-tight">
          Claim Daily Cash Drops & Bonuses
        </h1>
        <p className="text-xs text-[#8F97A6] mt-1 max-w-[280px]">
          Free rewards available every day. Play games with real money bonuses at zero cost.
        </p>
      </div>

      {/* 1. 7-Day Login Streak */}
      <div className="rounded-2xl bg-[#141624] border border-[#23273A] p-4 mb-4 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              7-Day Check-in Streak
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400">
            {claimedDay !== null ? "Claimed Today" : "Available Now"}
          </span>
        </div>

        {/* 7 Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {STREAK_DAYS.map((item) => {
            const isClaimed = claimedDay !== null && claimedDay >= item.day;
            const isToday = item.day === 1;

            return (
              <div 
                key={item.day}
                onClick={() => isToday && handleClaimDay(item.day, item.amount)}
                className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isClaimed
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                    : isToday
                    ? "bg-[#7C3AED]/20 border-[#7C3AED] text-white hover:scale-105"
                    : "bg-[#0E101B] border-[#1C2030] text-[#697285]"
                }`}
              >
                <span className="text-[9px] font-bold">D{item.day}</span>
                <span className="text-[10px] font-black font-mono mt-0.5">
                  ₹{item.amount}
                </span>
                {isClaimed ? (
                  <Check className="w-3 h-3 text-emerald-400 mt-1" />
                ) : (
                  <Gift className="w-3 h-3 text-[#A78BFA] mt-1" />
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => handleClaimDay(1, 10)}
          disabled={claimedDay !== null}
          className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer mt-1 ${
            claimedDay !== null
              ? "bg-[#1C2030] text-[#5D6577] cursor-not-allowed"
              : "bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-md"
          }`}
        >
          {claimedDay !== null ? "Come Back Tomorrow" : "Claim Today's Bonus (₹10)"}
        </button>
      </div>

      {/* 2. Lucky Spin Faucet */}
      <div className="rounded-2xl bg-[#141624] border border-[#23273A] p-4 mb-4 shadow-md flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
            <Zap className="w-4 h-4" />
            <span>Lucky Spin Wheel</span>
          </div>
          <span className="text-[11px] text-[#8F97A6]">
            {wheelPrize ? wheelPrize : "Win up to ₹500 instant bonus"}
          </span>
        </div>

        <button
          onClick={handleSpinWheel}
          disabled={wheelSpinning || !!wheelPrize}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            wheelPrize
              ? "bg-emerald-600 text-white"
              : wheelSpinning
              ? "bg-amber-600 text-white animate-pulse"
              : "bg-[#EAB308] hover:bg-[#CA8A04] text-black"
          }`}
        >
          {wheelSpinning ? "Spinning..." : wheelPrize ? "Claimed!" : "Spin Free"}
        </button>
      </div>

      {/* 3. Invite Friends & Earn */}
      <div className="rounded-2xl bg-[#141624] border border-[#23273A] p-4 mb-4 shadow-md flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Refer & Earn ₹250 Per Friend
          </span>
        </div>
        <p className="text-[11px] text-[#8F97A6]">
          Share your referral code with friends. Earn ₹250 instant cash plus 20% lifetime bet commission on every wager!
        </p>

        <div className="flex items-center gap-2 bg-[#0E101B] border border-[#1E2335] rounded-xl px-3 py-2">
          <span className="text-xs font-mono font-bold text-white tracking-widest flex-1">
            PASA7X
          </span>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 text-xs font-bold text-[#A78BFA] hover:text-white cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* 4. Redeem Promo Code */}
      <div className="rounded-2xl bg-[#141624] border border-[#23273A] p-4 shadow-md flex flex-col gap-3">
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          Redeem Promo Voucher
        </span>
        <form onSubmit={handleClaimPromo} className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            disabled={promoClaimed}
            placeholder="Enter promo code (e.g. PASA7X)"
            className="flex-1 bg-[#0E101B] border border-[#1E2335] rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-[#7C3AED]"
          />
          <button
            type="submit"
            disabled={promoClaimed}
            className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs cursor-pointer disabled:opacity-50"
          >
            {promoClaimed ? "Redeemed" : "Apply"}
          </button>
        </form>
      </div>
    </div>
  );
}
