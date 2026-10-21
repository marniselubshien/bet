"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Crown, Sparkles, ShieldCheck, CheckCircle2, 
  ArrowRight, Flame, Trophy, Coins, Zap
} from "lucide-react";

interface VipTier {
  id: string;
  name: string;
  color: string;
  bgGradient: string;
  reqWager: string;
  perks: string[];
  isCurrent?: boolean;
}

const VIP_TIERS: VipTier[] = [
  {
    id: "bronze",
    name: "Bronze",
    color: "#CD7F32",
    bgGradient: "from-[#3b2314]/30 to-[#141624]",
    reqWager: "₹10,000 Wagered",
    perks: ["5% Daily Rakeback", "Level-Up Cash Bonus", "Community Chat Badge"],
  },
  {
    id: "silver",
    name: "Silver",
    color: "#C0C0C0",
    bgGradient: "from-[#303440]/30 to-[#141624]",
    reqWager: "₹50,000 Wagered",
    perks: ["7.5% Daily Rakeback", "Weekly Boost Reload", "Priority Support 24/7"],
  },
  {
    id: "gold",
    name: "Gold",
    color: "#FFD700",
    bgGradient: "from-[#45380d]/40 to-[#141624]",
    reqWager: "₹2,50,000 Wagered",
    perks: ["10% Daily Rakeback", "Monthly Bonus Drops", "Zero UPI Withdrawal Fees"],
    isCurrent: true,
  },
  {
    id: "platinum",
    name: "Platinum",
    color: "#00E5FF",
    bgGradient: "from-[#083344]/40 to-[#141624]",
    reqWager: "₹10,00,000 Wagered",
    perks: ["12.5% Daily Rakeback", "Dedicated VIP Host", "Bespoke Cash Reloads"],
  },
  {
    id: "diamond",
    name: "Diamond",
    color: "#A855F7",
    bgGradient: "from-[#3b1261]/40 to-[#141624]",
    reqWager: "₹50,00,000 Wagered",
    perks: ["15% Maximum Rakeback", "Custom Limits & Luxury Gifts", "Real-World VIP Trips"],
  },
];

export default function VipPage() {
  const [rakebackClaimed, setRakebackClaimed] = useState(false);
  const [rakebackAmount, setRakebackAmount] = useState(342.50);

  const handleClaimRakeback = () => {
    setRakebackClaimed(true);
    setRakebackAmount(0);
  };

  return (
    <div className="w-full flex flex-col pt-2 pb-6 px-3.5 select-none text-[#8F97A6]">
      
      {/* VIP Club Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#7C3AED]/30 via-[#191C2C] to-[#121422] border border-[#7C3AED]/40 p-4 mb-4 shadow-xl">
        <div className="flex items-center gap-1.5 mb-1 text-[#FFD700]">
          <Crown className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-wider">7X PASA VIP Club</span>
        </div>
        <h1 className="text-base font-black text-white leading-tight">
          Elite VIP Rewards & Rakeback
        </h1>
        <p className="text-xs text-[#8F97A6] mt-1 max-w-[280px]">
          Wager on any game to rank up and unlock permanent bonuses.
        </p>
      </div>

      {/* Current VIP Status & Progress */}
      <div className="rounded-2xl bg-[#141624] border border-[#23273A] p-4 mb-4 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/15 text-[#FFD700] flex items-center justify-center font-black text-sm">
              👑
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">Gold Tier 1</h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#FFD700]/20 text-[#FFD700]">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-[#8F97A6]">Next: Platinum Tier</p>
            </div>
          </div>
          <span className="text-xs font-sans font-bold text-[#A78BFA]">72%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#1C1F2E] overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#6D28D9] to-[#A855F7] rounded-full transition-all duration-500"
            style={{ width: "72%" }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[#6B7280]">
          <span>₹1,80,000 Wagered</span>
          <span>₹2,50,000 Target</span>
        </div>
      </div>

      {/* Rakeback Claim Box */}
      <div className="rounded-2xl bg-[#141624] border border-[#23273A] p-4 mb-4 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#00E701]" />
            <span className="text-xs font-bold text-white">Instant Rakeback Balance</span>
          </div>
          <span className="text-[10px] text-[#8F97A6]">10% of Casino House Edge</span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-[#A855F7]">₹</span>
          <span className="font-sans text-2xl font-black text-white">
            {rakebackAmount.toFixed(2)}
          </span>
        </div>

        {rakebackClaimed ? (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>₹342.50 Added to Playable Balance!</span>
          </div>
        ) : (
          <button
            onClick={handleClaimRakeback}
            className="w-full py-2.5 bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] hover:from-[#7C3AED] hover:to-[#9333EA] text-white text-xs font-bold rounded-xl shadow-md shadow-purple-900/30 cursor-pointer border-none transition-all active:scale-95"
          >
            Claim ₹342.50 Rakeback
          </button>
        )}
      </div>

      {/* VIP Tiers Progression Cards */}
      <h2 className="text-xs font-black uppercase tracking-wider text-white mb-2 px-1">
        VIP Progression Tiers
      </h2>
      <div className="flex flex-col gap-2.5">
        {VIP_TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`rounded-xl p-3.5 border bg-gradient-to-r ${tier.bgGradient} transition-all ${
              tier.isCurrent 
                ? "border-[#FFD700]/60 shadow-lg shadow-yellow-500/5" 
                : "border-[#232738]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                <span className="text-xs font-black text-white">{tier.name}</span>
                {tier.isCurrent && (
                  <span className="text-[9px] font-black bg-[#FFD700] text-black px-1.5 py-0.2 rounded font-sans">
                    YOUR TIER
                  </span>
                )}
              </div>
              <span className="text-[10px] font-sans text-[#8F97A6]">{tier.reqWager}</span>
            </div>

            <div className="grid grid-cols-1 gap-1 pt-1 border-t border-white/5">
              {tier.perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
                  <CheckCircle2 className="w-3 h-3 text-[#A855F7] shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
