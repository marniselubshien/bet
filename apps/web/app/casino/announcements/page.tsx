"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Megaphone, Sparkles, Flame, Bell, 
  Calendar, ChevronRight, Gift, ShieldAlert
} from "lucide-react";

interface Announcement {
  id: string;
  category: "updates" | "bonuses" | "tournaments";
  tag: string;
  tagColor: string;
  title: string;
  date: string;
  summary: string;
  content: string;
}

export default function AnnouncementsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>("ann-1");

  const ANNOUNCEMENTS: Announcement[] = [
    {
      id: "ann-1",
      category: "bonuses",
      tag: "HOT EVENT",
      tagColor: "bg-red-500/20 text-red-400 border-red-500/40",
      title: "Mega IPL & Diwali Cash Festival: ₹10,00,000 Prize Pool!",
      date: "12 Oct 2026",
      summary: "Double your first deposit up to ₹10,000 + 50 Free Aviator Spins all week.",
      content: "Celebrate this festive season with 7X PASA! From today until Sunday midnight, all deposits receive an automatic 100% matched bonus with 1x playthrough requirement. Plus, climb the daily leaderboard for instant cash airdrops.",
    },
    {
      id: "ann-2",
      category: "updates",
      tag: "SPEED UPGRADE",
      tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      title: "Sub-3-Minute Instant UPI Withdrawals Are Now Live!",
      date: "11 Oct 2026",
      summary: "Our banking rails now process payouts instantly 24/7 across PhonePe, Google Pay, and Paytm.",
      content: "We have upgraded our payment gateway nodes across India. All verified accounts can now enjoy instant automated withdrawals processed within 180 seconds directly to any valid VPA.",
    },
    {
      id: "ann-3",
      category: "updates",
      tag: "NEW GAMES",
      tagColor: "bg-[#7C3AED]/20 text-[#A78BFA] border-[#7C3AED]/40",
      title: "4 New Originals Released: Wingo 30s, Limbo 900x & More",
      date: "09 Oct 2026",
      summary: "Experience ultra high-frequency rounds with 99% RTP and provably fair cryptographic verification.",
      content: "Head over to the Lobby to test out our brand new high-speed games. Wingo 30s features lightning-fast rounds every 30 seconds, and Limbo lets you target multipliers up to 900x your wager.",
    },
    {
      id: "ann-4",
      category: "tournaments",
      tag: "WEEKLY CONTEST",
      tagColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      title: "Weekly Aviator Multiplier Hunt — ₹2,50,000 Reward",
      date: "07 Oct 2026",
      summary: "Cash out at the highest multiplier on Aviator to win your share of the weekly jackpot.",
      content: "Every round above 50x automatically enters you into the Multiplier Hall of Fame. First place walks away with ₹75,000 cash credited on Monday at 00:00 UTC.",
    },
  ];

  const filtered = ANNOUNCEMENTS.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

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
          Platform Announcements
        </span>
      </div>

      {/* Categories */}
      <div className="flex bg-[#121524] p-1 rounded-xl border border-[#21263B] mb-4">
        {[
          { id: "all", label: "All" },
          { id: "bonuses", label: "Bonuses" },
          { id: "updates", label: "Updates" },
          { id: "tournaments", label: "Tournaments" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeCategory === cat.id
                ? "bg-[#7C3AED] text-white shadow-sm"
                : "text-[#8F97A6] hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="flex flex-col gap-3">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
              className="p-4 rounded-2xl bg-[#131625] border border-[#20253B] hover:border-[#7C3AED]/40 transition-colors shadow-sm cursor-pointer flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${item.tagColor}`}>
                  {item.tag}
                </span>
                <span className="text-[10px] text-[#717A8C] font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </span>
              </div>

              <h3 className="text-xs font-black text-white leading-snug">
                {item.title}
              </h3>

              <p className="text-[11px] text-[#8F97A6] leading-relaxed">
                {item.summary}
              </p>

              {isExpanded && (
                <div className="mt-2 pt-2 border-t border-[#1F2438] text-[11px] text-[#A6B0C3] leading-relaxed animate-in fade-in duration-150">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
