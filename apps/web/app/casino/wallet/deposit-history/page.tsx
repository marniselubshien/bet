"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Plus, CheckCircle2, Clock, XCircle, 
  Copy, Check, ArrowDownLeft, Filter, HelpCircle
} from "lucide-react";

interface DepositRecord {
  id: string;
  method: string;
  amount: number;
  date: string;
  status: "completed" | "processing" | "failed";
  utr: string;
}

const DEPOSIT_HISTORY: DepositRecord[] = [
  {
    id: "dep-1",
    method: "Google Pay UPI",
    amount: 500,
    date: "Today, 14:32",
    status: "completed",
    utr: "428910482910",
  },
  {
    id: "dep-2",
    method: "PhonePe UPI",
    amount: 1000,
    date: "Yesterday, 19:15",
    status: "completed",
    utr: "428849201948",
  },
  {
    id: "dep-3",
    method: "Paytm Instant QR",
    amount: 200,
    date: "10 Oct, 11:45",
    status: "completed",
    utr: "428710394821",
  },
  {
    id: "dep-4",
    method: "BHIM UPI",
    amount: 500,
    date: "09 Oct, 16:20",
    status: "completed",
    utr: "428691029384",
  },
  {
    id: "dep-5",
    method: "USDT TRC20",
    amount: 1500,
    date: "07 Oct, 09:10",
    status: "completed",
    utr: "0x8f92b49201a8",
  },
];

export default function DepositHistoryPage() {
  const [filter, setFilter] = useState<"all" | "completed" | "processing" | "failed">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUTR = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedId(utr);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDeposits = DEPOSIT_HISTORY.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const totalDeposited = DEPOSIT_HISTORY.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="w-full flex flex-col pt-3 pb-8 px-4 select-none text-[#8F97A6]">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <Link 
          href="/casino/wallet" 
          className="w-9 h-9 rounded-xl bg-[#141624] border border-[#23273A] hover:border-[#353B55] flex items-center justify-center text-white transition-all shadow-sm active:scale-95"
          title="Back to Wallet"
        >
          <ArrowLeft className="w-4 h-4 text-slate-200" />
        </Link>
        
        <h1 className="text-base font-bold text-white tracking-wide">
          Deposit History
        </h1>

        <Link 
          href="/casino/wallet/deposit" 
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-[#F59E0B] to-[#D97706] text-white text-[11px] font-bold shadow-[0_2px_8px_rgba(245,158,11,0.35)] active:scale-95 transition-all"
          title="New Deposit"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Deposit</span>
        </Link>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#111422] border border-[#1C2337] mb-3.5 shadow-sm">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#556585] font-semibold">Total Deposited</span>
          <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
            ₹{totalDeposited.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex flex-col text-center border-x border-[#1A2033]">
          <span className="text-[10px] text-[#556585] font-semibold">Transactions</span>
          <span className="text-xs font-bold text-white font-mono mt-0.5">
            {DEPOSIT_HISTORY.length}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-[#556585] font-semibold">Avg. Credit Time</span>
          <span className="text-xs font-bold text-amber-400 font-mono mt-0.5">
            &lt; 2 mins
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-[#0C101C] p-1 rounded-2xl border border-[#182136] mb-3.5 shadow-inner">
        {(["all", "completed", "processing", "failed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1.5 rounded-xl font-bold text-[11px] capitalize transition-all cursor-pointer ${
              filter === tab
                ? "bg-gradient-to-b from-[#1C243B] to-[#121626] text-white border border-[#2B3758] shadow-sm"
                : "text-[#62708E] hover:text-[#8F9BAC]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* History Records List */}
      <div className="flex flex-col gap-2.5">
        {filteredDeposits.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#131628] border border-[#1E243D] flex items-center justify-center text-[#556585] mb-2">
              <Filter className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-white">No deposits found</p>
            <p className="text-[11px] text-[#556585] mt-0.5">No records match the selected filter.</p>
          </div>
        ) : (
          filteredDeposits.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-[#111422] border border-[#1C2337] hover:border-[#2C3858] transition-all shadow-xs flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ArrowDownLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-tight">{item.method}</h3>
                    <span className="text-[10px] text-[#556585]">{item.date}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs font-extrabold text-emerald-400 font-mono">
                    +₹{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {item.status === "completed" && (
                      <span className="text-[9.5px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    )}
                    {item.status === "processing" && (
                      <span className="text-[9.5px] font-bold text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" />
                        <span>Processing</span>
                      </span>
                    )}
                    {item.status === "failed" && (
                      <span className="text-[9.5px] font-bold text-rose-400 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        <span>Failed</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* UTR / Reference ID footer */}
              <div className="pt-2 border-t border-[#181E31] flex items-center justify-between text-[10.5px]">
                <div className="flex items-center gap-1 font-mono text-[#667699]">
                  <span>UTR:</span>
                  <span className="text-slate-300 font-bold">{item.utr}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyUTR(item.utr)}
                  className="flex items-center gap-1 text-[10px] font-semibold text-[#8F9BAC] hover:text-white bg-transparent border-none cursor-pointer"
                >
                  {copiedId === item.utr ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Support Helper */}
      <div className="mt-6 text-center">
        <Link 
          href="/casino/support" 
          className="inline-flex items-center gap-1.5 text-xs text-[#8F9BAC] hover:text-white transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Missing a deposit? Report your UTR to Live Support</span>
        </Link>
      </div>
    </div>
  );
}
