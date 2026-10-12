"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, ArrowUpRight, ShieldCheck, 
  HelpCircle, Clock, AlertCircle, CheckCircle2,
  FileText, CreditCard, Building
} from "lucide-react";

export default function WithdrawPage() {
  const [balance, setBalance] = useState<number>(38.00);
  const [withdrawMethod, setWithdrawMethod] = useState<"upi" | "bank">("upi");
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>("100");
  const [upiId, setUpiId] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [ifscCode, setIfscCode] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const QUICK_WITHDRAW_AMOUNTS = [100, 200, 500, 1000, 2500];

  const handleSelectAmount = (val: number) => {
    setAmount(val);
    setCustomAmount(val.toString());
  };

  const handleSelectMax = () => {
    const val = Math.floor(balance);
    setAmount(val);
    setCustomAmount(val.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setAmount(num);
    }
  };

  const handleSubmitWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 100) {
      setStatusMessage({ type: "error", text: "Minimum withdrawal amount is ₹100." });
      return;
    }
    if (amount > balance) {
      setStatusMessage({ type: "error", text: "Insufficient available balance. You currently have ₹" + balance.toFixed(2) });
      return;
    }

    if (withdrawMethod === "upi" && (!upiId.trim() || !upiId.includes("@"))) {
      setStatusMessage({ type: "error", text: "Please provide a valid UPI ID (e.g. yourname@okhdfcbank)." });
      return;
    }

    if (withdrawMethod === "bank" && (!accountNumber.trim() || !ifscCode.trim() || !accountName.trim())) {
      setStatusMessage({ type: "error", text: "Please fill in all bank account details." });
      return;
    }

    setProcessing(true);
    setStatusMessage(null);

    setTimeout(() => {
      setProcessing(false);
      setBalance((b) => Math.max(0, b - amount));
      setStatusMessage({ 
        type: "success", 
        text: `Withdrawal request of ₹${amount.toLocaleString("en-IN")} submitted! Payout will reflect in your account within 3–15 minutes.` 
      });
      setCustomAmount("100");
      setAmount(100);
    }, 1200);
  };

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
          Withdraw Funds
        </h1>

        <Link 
          href="/casino/wallet/withdrawal-history" 
          className="w-9 h-9 rounded-xl bg-[#141624] border border-[#23273A] hover:border-[#353B55] flex items-center justify-center text-[#8F97A6] hover:text-white transition-all shadow-sm active:scale-95"
          title="Withdrawal History"
        >
          <FileText className="w-4 h-4 text-[#38BDF8]" />
        </Link>
      </div>

      {/* Balance Summary Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#11172A] to-[#0E1322] border border-[#1E2845] p-3.5 mb-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10.5px] font-medium text-[#8F9BAC] block">Withdrawable Balance</span>
            <span className="text-base font-extrabold text-white font-mono">
              ₹ {balance.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9.5px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            0% Payout Fee
          </span>
          <span className="text-[9px] text-[#556585] mt-0.5">Min: ₹100</span>
        </div>
      </div>

      {/* Withdrawal Method Tabs */}
      <div className="mb-4">
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 block">
          Payout Method
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setWithdrawMethod("upi")}
            className={`p-3 rounded-2xl flex items-center gap-2.5 transition-all cursor-pointer border ${
              withdrawMethod === "upi"
                ? "bg-gradient-to-b from-[#132238] to-[#0C1524] border-sky-500/60 shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                : "bg-[#111422] border-[#1C2337] hover:border-[#2C3755]"
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white">UPI Instant</span>
              <span className="text-[9.5px] text-sky-400 font-semibold">PhonePe, GPay, Paytm</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setWithdrawMethod("bank")}
            className={`p-3 rounded-2xl flex items-center gap-2.5 transition-all cursor-pointer border ${
              withdrawMethod === "bank"
                ? "bg-gradient-to-b from-[#132238] to-[#0C1524] border-sky-500/60 shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                : "bg-[#111422] border-[#1C2337] hover:border-[#2C3755]"
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400">
              <Building className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white">Bank IMPS</span>
              <span className="text-[9.5px] text-sky-400 font-semibold">Direct NEFT / IMPS</span>
            </div>
          </button>
        </div>
      </div>

      {/* Amount Selector */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            Withdrawal Amount
          </span>
          <button
            type="button"
            onClick={handleSelectMax}
            className="text-[10.5px] font-bold text-sky-400 hover:text-sky-300 transition-colors bg-transparent border-none cursor-pointer"
          >
            Withdraw All (₹{balance.toFixed(2)})
          </button>
        </div>

        {/* Quick Amount Pills */}
        <div className="grid grid-cols-3 gap-2 mb-2.5">
          {QUICK_WITHDRAW_AMOUNTS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleSelectAmount(val)}
              className={`py-2 px-3 rounded-xl font-bold text-xs font-mono transition-all cursor-pointer border ${
                amount === val
                  ? "bg-gradient-to-b from-[#38BDF8] via-[#0EA5E9] to-[#0284C7] text-white border-t border-white/20 shadow-[0_2px_8px_rgba(56,189,248,0.35)]"
                  : "bg-[#121524] border-[#1E253B] text-[#8F9BAC] hover:text-white"
              }`}
            >
              ₹{val.toLocaleString("en-IN")}
            </button>
          ))}
          <button
            type="button"
            onClick={handleSelectMax}
            className="py-2 px-3 rounded-xl font-bold text-xs font-mono transition-all cursor-pointer border bg-[#121524] border-[#1E253B] text-sky-400 hover:border-sky-500/40"
          >
            MAX
          </button>
        </div>

        {/* Custom Amount Input */}
        <div className="flex items-center bg-[#0C0F1A] border border-[#1E253B] rounded-2xl px-3 py-2.5 shadow-inner focus-within:border-sky-500/70 transition-colors">
          <span className="text-sm font-bold text-sky-400 font-mono mr-2">₹</span>
          <input
            type="text"
            value={customAmount}
            onChange={handleCustomAmountChange}
            placeholder="Enter withdrawal amount"
            className="flex-1 bg-transparent text-sm font-bold text-white outline-none font-mono"
          />
          <span className="text-[11px] text-[#556585] font-semibold">INR</span>
        </div>
      </div>

      {/* Account Details Form */}
      <form onSubmit={handleSubmitWithdraw} className="flex flex-col gap-3">
        {withdrawMethod === "upi" ? (
          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Your UPI ID (VPA)
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. mobile@paytm or name@okhdfcbank"
              className="w-full bg-[#0C0F1A] border border-[#1E253B] focus:border-sky-500 rounded-2xl px-3.5 py-3 text-xs font-medium text-white outline-none placeholder:text-[#556585] shadow-inner"
            />
            <span className="text-[10px] text-[#556585] mt-1 block pl-1">
              Verify your UPI VPA handle carefully before requesting.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Full name as per bank records"
                className="w-full bg-[#0C0F1A] border border-[#1E253B] focus:border-sky-500 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-white outline-none placeholder:text-[#556585]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Bank Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. 5010029482019"
                className="w-full bg-[#0C0F1A] border border-[#1E253B] focus:border-sky-500 rounded-2xl px-3.5 py-2.5 text-xs font-mono text-white outline-none placeholder:text-[#556585]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Bank IFSC Code
              </label>
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                placeholder="e.g. HDFC0001234"
                className="w-full bg-[#0C0F1A] border border-[#1E253B] focus:border-sky-500 rounded-2xl px-3.5 py-2.5 text-xs font-mono text-white outline-none placeholder:text-[#556585]"
              />
            </div>
          </div>
        )}

        {/* Speed / Policy Notice */}
        <div className="rounded-2xl bg-[#0B0F1C] border border-[#182136] p-3 text-[11px] flex items-center justify-between text-[#8F9BAC]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Avg. Payout Settlement: <strong className="text-white">3 – 15 Minutes</strong></span>
          </div>
          <span className="text-[9.5px] font-bold text-emerald-400">Automated</span>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
            statusMessage.type === "success" 
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
          }`}>
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={processing}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-b from-[#38BDF8] via-[#0EA5E9] to-[#0284C7] hover:from-[#7DD3FC] hover:to-[#0369A1] text-white font-bold text-sm tracking-wide shadow-[0_4px_16px_rgba(56,189,248,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] border-t border-white/20 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Routing Payout Gateway...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Request Withdrawal of ₹{amount.toLocaleString("en-IN")}</span>
            </>
          )}
        </button>
      </form>

      {/* Support Helper Footer */}
      <div className="mt-4 text-center">
        <Link 
          href="/casino/support" 
          className="inline-flex items-center gap-1.5 text-xs text-[#8F9BAC] hover:text-white transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
          <span>Have questions about withdrawals? Contact Live Support</span>
        </Link>
      </div>
    </div>
  );
}
