"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Copy, Check, QrCode, ShieldCheck, 
  HelpCircle, Clock, Sparkles, AlertCircle, CheckCircle2,
  Receipt, ArrowDownLeft
} from "lucide-react";

export default function DepositPage() {
  const [balance, setBalance] = useState<number>(38.00);
  const [selectedMethod, setSelectedMethod] = useState<"upi" | "bank" | "crypto">("upi");
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>("500");
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const UPI_ID = "7xpasa.pay@icici";
  const QUICK_AMOUNTS = [200, 500, 1000, 2500, 5000, 10000];

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSelectAmount = (val: number) => {
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

  const handleSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 100) {
      setStatusMessage({ type: "error", text: "Minimum deposit is ₹100." });
      return;
    }
    if (utrNumber.trim().length < 10) {
      setStatusMessage({ type: "error", text: "Please enter a valid 12-digit UPI UTR / Reference number." });
      return;
    }

    setProcessing(true);
    setStatusMessage(null);

    setTimeout(() => {
      setProcessing(false);
      setBalance((b) => b + amount);
      setStatusMessage({ 
        type: "success", 
        text: `Deposit of ₹${amount.toLocaleString("en-IN")} verified! Funds credited to your wallet.` 
      });
      setUtrNumber("");
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
          Deposit Funds
        </h1>

        <Link 
          href="/casino/wallet/deposit-history" 
          className="w-9 h-9 rounded-xl bg-[#141624] border border-[#23273A] hover:border-[#353B55] flex items-center justify-center text-[#8F97A6] hover:text-white transition-all shadow-sm active:scale-95"
          title="Deposit History"
        >
          <Receipt className="w-4 h-4 text-[#F59E0B]" />
        </Link>
      </div>

      {/* Balance Pill Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#171A2B] to-[#111422] border border-[#20263D] p-3.5 mb-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10.5px] font-medium text-[#8F9BAC] block">Current Available Balance</span>
            <span className="text-base font-extrabold text-white font-mono">
              ₹ {balance.toFixed(2)}
            </span>
          </div>
        </div>
        <span className="text-[9.5px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          Instant 0% Fee
        </span>
      </div>

      {/* Bonus Callout Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#F59E0B]/20 via-[#D97706]/15 to-[#121422] border border-[#F59E0B]/30 p-3 mb-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-[11px] font-medium text-amber-200 leading-tight">
            <strong>+10% Extra Bonus</strong> applied automatically to all UPI deposits!
          </p>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="mb-4">
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 block">
          Select Payment Method
        </span>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "upi", label: "UPI Instant", badge: "Fastest", icon: "⚡" },
            { id: "bank", label: "Bank IMPS", badge: "Direct", icon: "🏦" },
            { id: "crypto", label: "USDT Crypto", badge: "TRC20", icon: "🪙" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMethod(m.id as any)}
              className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                selectedMethod === m.id
                  ? "bg-gradient-to-b from-[#1E2540] to-[#121728] border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                  : "bg-[#111422] border-[#1C2337] hover:border-[#2C3755]"
              }`}
            >
              <span className="text-base">{m.icon}</span>
              <span className="text-xs font-bold text-white">{m.label}</span>
              <span className="text-[9px] font-semibold text-amber-400/90">{m.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Amount Selector */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            Deposit Amount
          </span>
          <span className="text-[10px] text-[#8F9BAC]">Min: ₹100 · Max: ₹1,00,000</span>
        </div>
        
        {/* Quick Amount Pills */}
        <div className="grid grid-cols-3 gap-2 mb-2.5">
          {QUICK_AMOUNTS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleSelectAmount(val)}
              className={`py-2 px-3 rounded-xl font-bold text-xs font-mono transition-all cursor-pointer border ${
                amount === val
                  ? "bg-gradient-to-b from-[#F59E0B] to-[#D97706] text-white border-t border-white/20 shadow-[0_2px_8px_rgba(245,158,11,0.35)]"
                  : "bg-[#121524] border-[#1E253B] text-[#8F9BAC] hover:text-white"
              }`}
            >
              ₹{val.toLocaleString("en-IN")}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="flex items-center bg-[#0C0F1A] border border-[#1E253B] rounded-2xl px-3 py-2.5 shadow-inner focus-within:border-amber-500/70 transition-colors">
          <span className="text-sm font-bold text-amber-400 font-mono mr-2">₹</span>
          <input
            type="text"
            value={customAmount}
            onChange={handleCustomAmountChange}
            placeholder="Enter custom amount"
            className="flex-1 bg-transparent text-sm font-bold text-white outline-none font-mono"
          />
          <span className="text-[11px] text-[#556585] font-semibold">INR</span>
        </div>
      </div>

      {/* UPI Details & QR Section */}
      <div className="rounded-3xl bg-[#111422] border border-[#1C2337] p-4 mb-4 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-[#182033]">
          <div>
            <span className="text-[11px] font-bold text-white block">Official UPI Payment Address</span>
            <span className="text-[10px] text-[#8F9BAC]">Pay using PhonePe, Google Pay, Paytm, or BHIM</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Copy UPI Address Card */}
        <div className="flex items-center justify-between bg-[#0C0F1B] border border-[#1F2740] rounded-2xl p-2.5 my-3">
          <div className="flex flex-col pl-1">
            <span className="text-[9px] text-[#606E8C] font-semibold uppercase">UPI ID / VPA</span>
            <span className="text-xs font-bold text-white font-mono">{UPI_ID}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyUPI}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#1C2338] to-[#121626] border border-[#2B3552] text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            {copiedUpi ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Instruction Steps */}
        <div className="flex flex-col gap-1.5 text-[11px] text-[#8F9BAC] bg-[#0A0D18] p-3 rounded-2xl border border-white/5">
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">1</span>
            <span>Copy the UPI ID above or scan in your UPI App (PhonePe, GPay, Paytm).</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">2</span>
            <span>Complete the transfer of <strong className="text-white">₹{amount.toLocaleString("en-IN")}</strong>.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">3</span>
            <span>Copy the 12-digit UTR / Reference ID from the transaction receipt & paste below.</span>
          </div>
        </div>
      </div>

      {/* UTR Input & Submit Form */}
      <form onSubmit={handleSubmitDeposit} className="flex flex-col gap-3">
        <div>
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
            12-Digit UPI UTR / Reference Number
          </label>
          <input
            type="text"
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9]/g, "").slice(0, 12))}
            placeholder="e.g. 428910482910"
            className="w-full bg-[#0C0F1A] border border-[#1E253B] focus:border-amber-500 rounded-2xl px-3.5 py-3 text-xs font-mono font-bold text-white outline-none placeholder:text-[#556585] shadow-inner"
          />
        </div>

        {/* Status Message */}
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

        {/* Submit Deposit Button */}
        <button
          type="submit"
          disabled={processing}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-b from-[#F59E0B] via-[#EAB308] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] text-white font-bold text-sm tracking-wide shadow-[0_4px_16px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] border-t border-white/20 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying Banking Node...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm & Credit ₹{amount.toLocaleString("en-IN")}</span>
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
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Need help with a deposit? Contact 24/7 Support</span>
        </Link>
      </div>
    </div>
  );
}
