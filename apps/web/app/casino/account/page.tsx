"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Bell, Settings, Copy, Check, Eye, EyeOff, RotateCw, Wallet, 
  ArrowDown, ArrowUp, Crown, History, ArrowDownLeft, ArrowUpRight, 
  Gamepad2, Gift, BarChart2, Headphones, BookOpen, Megaphone, 
  Rss, Info, FileText, HelpCircle, Globe, ChevronRight, Power, 
  Pencil, X, CheckCircle2, Star
} from "lucide-react";
import { authClient } from "@/lib/auth/client";

/* Stylized 3D Purple Wallet Illustration matching screenshot */
function WalletGraphic({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className}>
      <rect x="12" y="22" width="70" height="52" rx="14" fill="#4C1D95" opacity="0.5" />
      <rect x="16" y="26" width="70" height="52" rx="14" fill="#6D28D9" />
      <path d="M16 40C16 32.268 22.268 26 30 26H78C82.4183 26 86 29.5817 86 34V40H16Z" fill="#7C3AED" />
      <rect x="66" y="42" width="24" height="20" rx="6" fill="#8B5CF6" stroke="#C4B5FD" strokeWidth="1.5" />
      <circle cx="78" cy="52" r="3" fill="#FFFFFF" />
    </svg>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  
  // Account state
  const [balance, setBalance] = useState<number>(38.00);
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const [copiedUid, setCopiedUid] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100);
  const [upiId, setUpiId] = useState<string>("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyUid = () => {
    navigator.clipboard?.writeText("38930130");
    setCopiedUid(true);
    showToast("UID copied to clipboard!");
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleRefreshBalance = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast("Balance updated!");
    }, 600);
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/auth/sign-in");
    } catch {
      router.push("/auth/sign-in");
    }
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBalance((b) => b + depositAmount);
    showToast(`₹${depositAmount} added to balance!`);
    setActiveModal(null);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (balance < withdrawAmount) {
      showToast("Insufficient balance!");
      return;
    }
    setBalance((b) => Math.max(0, b - withdrawAmount));
    showToast(`Withdrawal of ₹${withdrawAmount} initiated via UPI!`);
    setActiveModal(null);
  };

  const username = session?.user?.name || "3R7TE";
  const userUid = session?.user?.id ? session.user.id.slice(0, 8).toUpperCase() : "38930130";

  return (
    <div className="w-full flex flex-col pt-4 pb-8 px-4 select-none text-[#8F9BAC]">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0E1422] border border-[#1C2438] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Header Icons */}
      <div className="flex items-center justify-end gap-2 mb-3">
        <button 
          onClick={() => setActiveModal("announcements")}
          className="relative w-8 h-8 rounded-full bg-gradient-to-b from-[#141826] to-[#0D101C] border border-[#1F273E] hover:border-[#354366] flex items-center justify-center text-[#8B98B2] hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center shadow-[0_0_6px_#f43f5e]">1</span>
        </button>

        <button 
          onClick={() => setActiveModal("settings")}
          className="w-8 h-8 rounded-full bg-gradient-to-b from-[#141826] to-[#0D101C] border border-[#1F273E] hover:border-[#354366] flex items-center justify-center text-[#8B98B2] hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3.5 mb-5">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] p-0.5 shadow-md">
            <div className="w-full h-full rounded-full bg-[#0A0D18] flex items-center justify-center text-xl font-bold text-white">
              {username[0]?.toUpperCase() || '3'}
            </div>
          </div>
          <button 
            onClick={() => showToast("Edit avatar coming soon")}
            className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] border-2 border-[#090B15] flex items-center justify-center text-white cursor-pointer shadow-xs active:scale-95"
            aria-label="Edit avatar"
          >
            <Pencil className="w-2.5 h-2.5" />
          </button>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-slate-100 tracking-tight">{username}</span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-b from-[#2A2315] to-[#1E190F] border border-amber-500/30 text-[10px] font-semibold text-amber-300 shadow-xs">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span>VIP 0</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#556585]">
            <span>UID</span>
            <span className="text-[#2A3445]">|</span>
            <span className="font-mono font-semibold text-[#8B98B2]">{userUid}</span>
            <button 
              onClick={handleCopyUid}
              className="p-0.5 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
              title="Copy UID"
            >
              {copiedUid ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <span className="text-[10px] text-[#3B4760] mt-0.5 font-mono">Last Login: 2026-10-12 19:31</span>
        </div>
      </div>

      {/* Balance Card */}
      <div className="rounded-2xl bg-gradient-to-b from-[#111628] to-[#0B0F1C] border border-[#1E2842] p-4.5 mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-[11px] font-medium text-[#7E8B9F]">
              <span>Total Balance</span>
              <button 
                onClick={() => setHideBalance(!hideBalance)} 
                className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-lg font-bold text-slate-100">₹</span>
              <span className="font-mono text-2xl font-bold text-slate-100 tracking-tight">
                {hideBalance ? "••••" : balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <button 
                onClick={handleRefreshBalance}
                className={`p-1 text-[#556585] hover:text-white transition-colors cursor-pointer bg-transparent border-none ${
                  refreshing ? "animate-spin" : ""
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="opacity-90 shrink-0">
            <WalletGraphic className="w-16 h-16" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#182136]">
          <Link 
            href="/casino/wallet"
            className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#181D2E] to-[#101422] border border-[#222A40] group-hover:border-[#334060] flex items-center justify-center text-[#A78BFA] shadow-xs transition-colors">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-[#8B98B2] group-hover:text-white transition-colors">Wallet</span>
          </Link>

          <Link 
            href="/casino/wallet/deposit"
            className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#181D2E] to-[#101422] border border-[#222A40] group-hover:border-[#334060] flex items-center justify-center text-amber-400 shadow-xs transition-colors">
              <ArrowDown className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-[#8B98B2] group-hover:text-white transition-colors">Deposit</span>
          </Link>

          <Link 
            href="/casino/wallet/withdraw"
            className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#181D2E] to-[#101422] border border-[#222A40] group-hover:border-[#334060] flex items-center justify-center text-sky-400 shadow-xs transition-colors">
              <ArrowUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-[#8B98B2] group-hover:text-white transition-colors">Withdraw</span>
          </Link>

          <Link 
            href="/casino/vip"
            className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#181D2E] to-[#101422] border border-[#222A40] group-hover:border-[#334060] flex items-center justify-center text-emerald-400 shadow-xs transition-colors">
              <Crown className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-[#8B98B2] group-hover:text-white transition-colors">VIP</span>
          </Link>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { href: '/casino/transactions', icon: History, label: 'Transaction', desc: 'My Transactions', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { href: '/casino/wallet', icon: ArrowDownLeft, label: 'Deposit', desc: 'My Deposits', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { href: '/casino/wallet', icon: ArrowUpRight, label: 'Withdraw', desc: 'My Withdrawals', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
          { href: '/casino/game-history', icon: Gamepad2, label: 'Game History', desc: 'My Games', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
        ].map(({ href, icon: Icon, label, desc, color, bg, border }) => (
          <Link 
            key={href + label}
            href={href}
            className="p-3 rounded-xl bg-gradient-to-b from-[#121727] to-[#0D101B] border border-[#1B2338] hover:border-[#2C3857] flex items-center justify-between transition-all cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg ${bg} border ${border} flex items-center justify-center ${color} shrink-0 shadow-xs`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-semibold text-slate-100">{label}</span>
                <span className="text-[10px] text-[#556585]">{desc}</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#42506E] shrink-0" />
          </Link>
        ))}
      </div>

      {/* Menu List */}
      <div className="flex flex-col gap-1 mb-6">
        {[
          { type: 'link', href: '/casino/wallet', icon: Wallet, label: 'Wallet', iconColor: 'text-[#8B5CF6]' },
          { type: 'link', href: '/casino/free-money', icon: Gift, label: 'Free Money & Gifts', iconColor: 'text-[#A78BFA]' },
          { type: 'link', href: '/casino/statistics', icon: BarChart2, label: 'Statistics', iconColor: 'text-[#6366F1]' },
          { type: 'link', href: '/casino/settings', icon: Settings, label: 'Settings', iconColor: 'text-[#8B5CF6]' },
          { type: 'link', href: '/casino/support', icon: Headphones, label: 'Customer Service', iconColor: 'text-[#6366F1]' },
          { type: 'button', modal: 'guide', icon: BookOpen, label: "Beginner's Guide", iconColor: 'text-[#A78BFA]' },
          { type: 'link', href: '/casino/announcements', icon: Megaphone, label: 'Announcement', iconColor: 'text-[#8B5CF6]' },
          { type: 'button', modal: 'feedback', icon: Rss, label: 'Feedback', iconColor: 'text-[#6366F1]' },
          { type: 'button', modal: 'about', icon: Info, label: 'About Us', iconColor: 'text-[#A78BFA]' },
          { type: 'button', modal: 'terms', icon: FileText, label: 'Terms & Conditions', iconColor: 'text-[#6366F1]' },
          { type: 'button', modal: 'faqs', icon: HelpCircle, label: 'FAQs', iconColor: 'text-[#8B5CF6]' },
          { type: 'button', modal: 'language', icon: Globe, label: 'Language', iconColor: 'text-[#6366F1]', extra: 'English' },
        ].map((item, i) => {
          const Icon = item.icon;
          const className = "w-full p-3.5 rounded-xl bg-gradient-to-b from-[#111524] to-[#0C0F1A] border border-[#1A2236] hover:border-[#283452] flex items-center justify-between transition-all cursor-pointer text-left shadow-xs active:scale-[0.99]";
          const content = (
            <>
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${item.iconColor} shrink-0`} />
                <span className="text-[13px] font-medium text-[#CBD5E1]">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.extra && <span className="text-[11px] text-[#556585]">{item.extra}</span>}
                <ChevronRight className="w-3.5 h-3.5 text-[#42506E]" />
              </div>
            </>
          );
          return item.type === 'link' ? (
            <Link key={i} href={item.href!} className={className}>{content}</Link>
          ) : (
            <button key={i} onClick={() => item.modal ? setActiveModal(item.modal) : showToast('Language set to English')} className={className}>{content}</button>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full py-3 rounded-xl bg-gradient-to-b from-[#1D101E] to-[#130A14] border border-rose-500/25 hover:border-rose-500/40 text-rose-300 font-semibold text-[13px] flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98] cursor-pointer mb-6"
      >
        <Power className="w-4 h-4" />
        <span>Log Out</span>
      </button>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-[360px] bg-[#0E1220] border border-[#1C253B] rounded-2xl p-5 shadow-2xl relative">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-[#556585] hover:text-white cursor-pointer border-none bg-transparent"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Deposit Modal */}
            {activeModal === "deposit" && (
              <form onSubmit={handleDepositSubmit} className="flex flex-col gap-4">
                <h3 className="text-base font-bold text-white tracking-tight">Instant UPI Deposit</h3>
                <p className="text-xs text-[#8F9BAC] leading-relaxed">Select quick amount or enter custom amount to refill your balance.</p>
                <div className="grid grid-cols-3 gap-2">
                  {[200, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
                        depositAmount === amt 
                          ? "bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] border-t border-white/20 text-white shadow-[0_2px_8px_rgba(124,58,237,0.35)]" 
                          : "bg-gradient-to-b from-[#151B2C] to-[#0E121E] border-[#1F273E] text-[#8F9BAC] hover:border-[#303E60]"
                      }`}
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
                <input 
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full bg-[#080B14] border border-[#1B2338] rounded-xl px-3 py-2.5 text-white font-bold text-sm outline-none focus:border-[#7C3AED] transition-colors"
                  placeholder="Enter amount"
                />
                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] hover:from-[#8B5CF6] hover:to-[#6D28D9] text-white font-bold text-xs rounded-xl border-t border-white/20 shadow-[0_2px_10px_rgba(124,58,237,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all cursor-pointer active:scale-95"
                >
                  Pay ₹{depositAmount} via UPI
                </button>
              </form>
            )}

            {/* Withdraw Modal */}
            {activeModal === "withdraw" && (
              <form onSubmit={handleWithdrawSubmit} className="flex flex-col gap-4">
                <h3 className="text-base font-bold text-white tracking-tight">Instant UPI Withdrawal</h3>
                <p className="text-xs text-[#8F9BAC] leading-relaxed">Withdraw earnings directly to your UPI ID (2-min payout guarantee).</p>
                <div>
                  <label className="text-[11px] font-bold text-[#8F9BAC] mb-1 block">UPI ID / VPA</label>
                  <input 
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="user@oksbi"
                    className="w-full bg-[#080B14] border border-[#1B2338] rounded-xl px-3 py-2 text-white font-semibold text-xs outline-none focus:border-[#7C3AED] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#8F9BAC] mb-1 block">Withdraw Amount (Max: ₹{balance.toFixed(2)})</label>
                  <input 
                    type="number"
                    max={balance}
                    min={50}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full bg-[#080B14] border border-[#1B2338] rounded-xl px-3 py-2 text-white font-bold text-sm outline-none focus:border-[#7C3AED] transition-colors"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-b from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#059669] text-white font-bold text-xs rounded-xl border-t border-white/20 shadow-[0_2px_10px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all cursor-pointer active:scale-95"
                >
                  Withdraw ₹{withdrawAmount}
                </button>
              </form>
            )}

            {/* Wallet Modal */}
            {activeModal === "wallet" && (
              <div className="flex flex-col gap-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#7C3AED]/25 to-[#5F27CD]/15 border border-[#7C3AED]/30 text-[#A855F7] flex items-center justify-center mx-auto shadow-inner">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">My Wallet Details</h3>
                <div className="p-3 bg-gradient-to-b from-[#131728] to-[#0D101C] rounded-xl text-left border border-[#1E2740]">
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-[#8F9BAC]">Available Balance:</span>
                    <span className="font-bold text-white font-mono">₹{balance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-[#8F9BAC]">Pending Withdrawals:</span>
                    <span className="font-bold text-white font-mono">₹0.00</span>
                  </div>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-[#8F9BAC]">VIP Rakeback Pool:</span>
                    <span className="font-bold text-emerald-400 font-mono">₹45.50</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setActiveModal("deposit")}
                    className="py-2.5 bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] hover:from-[#8B5CF6] hover:to-[#6D28D9] text-white text-xs font-bold rounded-xl border-t border-white/20 shadow-[0_2px_8px_rgba(124,58,237,0.35)] cursor-pointer active:scale-95 transition-all"
                  >
                    Deposit
                  </button>
                  <button 
                    onClick={() => setActiveModal("withdraw")}
                    className="py-2.5 bg-gradient-to-b from-[#181D2E] to-[#101422] hover:from-[#1E253A] hover:to-[#14192A] text-slate-200 text-xs font-bold rounded-xl border border-[#222A40] hover:border-[#334060] cursor-pointer active:scale-95 transition-all"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            )}

            {/* Customer Service */}
            {activeModal === "support" && (
              <div className="flex flex-col gap-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-blue-500/25 to-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">24/7 Live Support</h3>
                <p className="text-xs text-[#8F9BAC] leading-relaxed">
                  Our support team is online 24/7 to assist with UPI payments, withdrawals, and game questions.
                </p>
                <div className="p-3 rounded-xl bg-gradient-to-b from-[#131728] to-[#0D101C] border border-[#1E2740] text-xs text-left">
                  <p className="text-emerald-400 font-bold mb-1">● Average Reply Time: &lt; 2 mins</p>
                  <p className="text-[#8F9BAC]">Official Email: support@7xpasa.com</p>
                </div>
                <Link
                  href="/casino/support"
                  onClick={() => setActiveModal(null)}
                  className="w-full py-3 bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] hover:from-[#8B5CF6] hover:to-[#6D28D9] text-white text-xs font-bold rounded-xl text-center border-t border-white/20 shadow-[0_2px_10px_rgba(124,58,237,0.35)] active:scale-95 transition-all"
                >
                  Contact Live Support
                </Link>
              </div>
            )}

            {/* Generic Info Modal (FAQs, About, Terms, Guide, etc.) */}
            {!["deposit", "withdraw", "wallet", "support"].includes(activeModal) && (
              <div className="flex flex-col gap-3">
                <h3 className="text-base font-bold text-white capitalize tracking-tight">{activeModal.replace("_", " ")}</h3>
                <div className="p-3 bg-gradient-to-b from-[#131728] to-[#0D101C] rounded-xl border border-[#1E2740] text-xs text-[#8F9BAC] leading-relaxed max-h-[220px] overflow-y-auto">
                  {activeModal === "terms" && (
                    <p>7X PASA operates under strict regulatory fair-play compliance. All wagers on Originals games (Dice, Mines, Plinko, Crash) are 100% Provably Fair and auditable.</p>
                  )}
                  {activeModal === "about" && (
                    <p>7X PASA is premier next-generation gaming platform designed for speed, fairness, and instant UPI withdrawals.</p>
                  )}
                  {activeModal === "faqs" && (
                    <p>Q: How fast are withdrawals?<br />A: Typically within 2 minutes via automated UPI payout channels.<br /><br />Q: Are games fair?<br />A: Yes, each round uses client + server seeds with SHA256 cryptographic verification.</p>
                  )}
                  {activeModal === "guide" && (
                    <p>Welcome to 7X PASA! Claim your daily free ₹100 faucet in the Free Money tab, then play Mines, Dice, or Plinko to grow your balance.</p>
                  )}
                  {activeModal === "statistics" && (
                    <p>Total Wagers: ₹14,250.00<br />Total Wins: ₹16,420.00<br />Favorite Game: Mines (5x5)<br />Net Return: +₹2,170.00</p>
                  )}
                  {activeModal === "announcements" && (
                    <p>🔥 Weekend 7X Multiplier Boost is live on Wingo & Originals! Claim 10% instant rakeback every Monday.</p>
                  )}
                  {activeModal === "feedback" && (
                    <p>We value your ideas! Send suggestions directly to feedback@7xpasa.com to win VIP bonus drops.</p>
                  )}
                  {activeModal === "settings" && (
                    <p>Audio effects: ON<br />Haptic vibration: ON<br />Two-Factor Authentication: Enabled via Neon Auth.</p>
                  )}
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 bg-gradient-to-b from-[#181D2E] to-[#101422] hover:from-[#1E253A] hover:to-[#14192A] text-slate-200 text-xs font-bold rounded-xl border border-[#222A40] hover:border-[#334060] cursor-pointer active:scale-95 transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
