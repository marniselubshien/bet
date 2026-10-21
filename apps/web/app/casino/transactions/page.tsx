"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, ArrowDownLeft, ArrowUpRight, Gift, 
  CheckCircle2, Clock, XCircle, Copy, Check, Filter
} from "lucide-react";

type TxType = "all" | "deposit" | "withdraw" | "bonus";

interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "bonus";
  title: string;
  method: string;
  amount: number;
  date: string;
  status: "completed" | "processing" | "failed";
  refId: string;
}

export default function TransactionsPage() {
  const [filter, setFilter] = useState<TxType>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const TRANSACTIONS: Transaction[] = [
    {
      id: "tx-1",
      type: "deposit",
      title: "UPI Deposit",
      method: "Google Pay UPI",
      amount: 500,
      date: "Today, 14:32",
      status: "completed",
      refId: "UPI7394829104",
    },
    {
      id: "tx-2",
      type: "bonus",
      title: "Daily Faucet Bonus",
      method: "Streak Day 1",
      amount: 10,
      date: "Today, 11:20",
      status: "completed",
      refId: "BON8821039471",
    },
    {
      id: "tx-3",
      type: "withdraw",
      title: "UPI Withdrawal",
      method: "Paytm Payments Bank",
      amount: 1200,
      date: "Yesterday, 19:45",
      status: "completed",
      refId: "WTH9948201932",
    },
    {
      id: "tx-4",
      type: "deposit",
      title: "Instant UPI Deposit",
      method: "PhonePe UPI",
      amount: 1000,
      date: "10 Oct, 16:15",
      status: "completed",
      refId: "UPI4492019384",
    },
    {
      id: "tx-5",
      type: "bonus",
      title: "Referral Commission",
      method: "Player @rohan_pro",
      amount: 250,
      date: "09 Oct, 13:00",
      status: "completed",
      refId: "REF3391029481",
    },
    {
      id: "tx-6",
      type: "withdraw",
      title: "Bank Wire Payout",
      method: "HDFC Bank IMPS",
      amount: 3500,
      date: "08 Oct, 21:10",
      status: "completed",
      refId: "WTH5582910394",
    },
    {
      id: "tx-7",
      type: "deposit",
      title: "USDT Crypto Deposit",
      method: "USDT TRC20",
      amount: 2000,
      date: "07 Oct, 10:25",
      status: "completed",
      refId: "CRY1102938491",
    },
  ];

  const filtered = TRANSACTIONS.filter((tx) => {
    if (filter === "all") return true;
    return tx.type === filter;
  });

  const handleCopy = (refId: string) => {
    navigator.clipboard?.writeText(refId);
    setCopiedId(refId);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
          Transactions
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-[#121524] p-1 rounded-xl border border-[#21263B] mb-4">
        {(["all", "deposit", "withdraw", "bonus"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1.5 rounded-lg font-bold text-xs capitalize transition-all cursor-pointer ${
              filter === tab
                ? "bg-[#7C3AED] text-white shadow-sm"
                : "text-[#8F97A6] hover:text-white"
            }`}
          >
            {tab === "all" ? "All" : tab === "deposit" ? "Deposits" : tab === "withdraw" ? "Withdraws" : "Bonuses"}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#717A8C]">
            No transactions found for this filter.
          </div>
        ) : (
          filtered.map((tx) => {
            const isCredit = tx.type === "deposit" || tx.type === "bonus";

            return (
              <div 
                key={tx.id}
                className="p-3 rounded-2xl bg-[#131625] border border-[#20253B] flex items-center justify-between shadow-sm"
              >
                {/* Left icon & text */}
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === "deposit" 
                      ? "bg-emerald-500/15 text-emerald-400" 
                      : tx.type === "withdraw" 
                      ? "bg-rose-500/15 text-rose-400" 
                      : "bg-[#7C3AED]/20 text-[#A78BFA]"
                  }`}>
                    {tx.type === "deposit" && <ArrowDownLeft className="w-4 h-4" />}
                    {tx.type === "withdraw" && <ArrowUpRight className="w-4 h-4" />}
                    {tx.type === "bonus" && <Gift className="w-4 h-4" />}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-tight">
                      {tx.title}
                    </span>
                    <span className="text-[10px] text-[#717A8C] mt-0.5">
                      {tx.method} • {tx.date}
                    </span>
                    <div 
                      onClick={() => handleCopy(tx.refId)}
                      className="flex items-center gap-1 text-[9px] text-[#A78BFA] hover:text-white cursor-pointer mt-1 font-sans"
                    >
                      <span>ID: {tx.refId}</span>
                      {copiedId === tx.refId ? (
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-2.5 h-2.5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Amount & Status */}
                <div className="flex flex-col items-end">
                  <span className={`font-sans text-sm font-bold ${
                    isCredit ? "text-emerald-400" : "text-white"
                  }`}>
                    {isCredit ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
