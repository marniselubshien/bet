"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, ArrowUpRight, CheckCircle2, Clock, XCircle, 
  Copy, Check, Filter, HelpCircle, CreditCard
} from "lucide-react";

interface WithdrawalRecord {
  id: string;
  method: string;
  destination: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  refId: string;
}

const WITHDRAWAL_HISTORY: WithdrawalRecord[] = [
  {
    id: "wth-1",
    method: "UPI Payout",
    destination: "vikram***@okhdfcbank",
    amount: 1200,
    date: "Yesterday, 19:45",
    status: "completed",
    refId: "WTH9948201932",
  },
  {
    id: "wth-2",
    method: "Bank Wire IMPS",
    destination: "HDFC Bank (A/C **4921)",
    amount: 3500,
    date: "08 Oct, 21:10",
    status: "completed",
    refId: "WTH5582910394",
  },
  {
    id: "wth-3",
    method: "Instant Paytm UPI",
    destination: "987654***@paytm",
    amount: 800,
    date: "05 Oct, 13:25",
    status: "completed",
    refId: "WTH2291048201",
  },
];

export default function WithdrawalHistoryPage() {
  const [filter, setFilter] = useState<"all" | "completed" | "pending" | "failed">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyRef = (refId: string) => {
    navigator.clipboard.writeText(refId);
    setCopiedId(refId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredWithdrawals = WITHDRAWAL_HISTORY.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const totalWithdrawn = WITHDRAWAL_HISTORY.reduce((acc, curr) => acc + curr.amount, 0);

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
          Withdrawal History
        </h1>

        <Link 
          href="/casino/wallet/withdraw" 
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-[#38BDF8] via-[#0EA5E9] to-[#0284C7] text-white text-[11px] font-bold shadow-[0_2px_8px_rgba(56,189,248,0.35)] active:scale-95 transition-all"
          title="New Withdrawal"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Withdraw</span>
        </Link>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#111422] border border-[#1C2337] mb-3.5 shadow-sm">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#556585] font-semibold">Total Withdrawn</span>
          <span className="text-xs font-bold text-sky-400 font-mono mt-0.5">
            ₹{totalWithdrawn.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex flex-col text-center border-x border-[#1A2033]">
          <span className="text-[10px] text-[#556585] font-semibold">Successful Payouts</span>
          <span className="text-xs font-bold text-white font-mono mt-0.5">
            {WITHDRAWAL_HISTORY.length}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-[#556585] font-semibold">Avg. Payout Time</span>
          <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
            ~5 mins
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-[#0C101C] p-1 rounded-2xl border border-[#182136] mb-3.5 shadow-inner">
        {(["all", "completed", "pending", "failed"] as const).map((tab) => (
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
        {filteredWithdrawals.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#131628] border border-[#1E243D] flex items-center justify-center text-[#556585] mb-2">
              <Filter className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-white">No withdrawals found</p>
            <p className="text-[11px] text-[#556585] mt-0.5">No records match the selected filter.</p>
          </div>
        ) : (
          filteredWithdrawals.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-[#111422] border border-[#1C2337] hover:border-[#2C3858] transition-all shadow-xs flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-tight">{item.method}</h3>
                    <span className="text-[10px] text-[#606E8C] font-mono">{item.destination}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs font-extrabold text-white font-mono">
                    -₹{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {item.status === "completed" && (
                      <span className="text-[9.5px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    )}
                    {item.status === "pending" && (
                      <span className="text-[9.5px] font-bold text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" />
                        <span>Pending</span>
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

              {/* Reference ID footer */}
              <div className="pt-2 border-t border-[#181E31] flex items-center justify-between text-[10.5px]">
                <div className="flex items-center gap-1 font-mono text-[#667699]">
                  <span className="text-[10px] text-[#556585]">{item.date} · Ref:</span>
                  <span className="text-slate-300 font-bold">{item.refId}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyRef(item.refId)}
                  className="flex items-center gap-1 text-[10px] font-semibold text-[#8F9BAC] hover:text-white bg-transparent border-none cursor-pointer"
                >
                  {copiedId === item.refId ? (
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
          <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
          <span>Inquiry on a payout? Track with 24/7 Live Support</span>
        </Link>
      </div>
    </div>
  );
}
