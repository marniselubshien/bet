"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  X, Send, CheckCircle2, ChevronRight, User, Wallet, LogOut, AlertTriangle,
  Gift, BarChart2, FileText, BookmarkCheck, Settings, Megaphone, Headphones, Bell
} from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { ClientLogoutButton } from "./client-logout-button";

interface CasinoShellProps {
  session: any;
  profile: any;
  children: React.ReactNode;
}

/* 7X PASA Brand Logo */
function PasaLogo() {
  return (
    <Link href="/casino" className="flex items-center gap-1 group select-none">
      <div className="flex items-center">
        {/* 7X Stylized italic gradient mark */}
        <div className="flex items-center justify-center font-black italic tracking-tighter text-xl text-[#A855F7] group-hover:text-[#C084FC] transition-colors leading-none pr-0.5">
          7X
        </div>
        {/* PASA typography & subtag */}
        <div className="flex flex-col ml-0.5 justify-center">
          <span className="text-[17px] font-black tracking-wide text-white leading-none">
            PASA
          </span>
          <span className="text-[6.5px] font-extrabold tracking-widest text-[#8F97A6] leading-none uppercase mt-0.5">
            PLAY 7X WIN 7X
          </span>
        </div>
      </div>
    </Link>
  );
}

/* BNB Solid Filled SVG Icons matching mobile reference */
function HomeFilledIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.1 2.2 10.15a1 1 0 0 0-.2.62v9.73c0 .83.67 1.5 1.5 1.5h5.5c.55 0 1-.45 1-1v-4.5c0-.55.45-1 1-1h2c.55 0 1 .45 1 1V21c0 .55.45 1 1 1h5.5c.83 0 1.5-.67 1.5-1.5V10.77a1 1 0 0 0-.2-.62L12 2.1Z" />
    </svg>
  );
}

function FreeMoneyFilledIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2a4 4 0 0 0-3.8 2.76 3.5 3.5 0 0 0-3.7 3.74H4a2 2 0 0 0-2 2v2a2 2 0 0 0 1 1.73V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6.27A2 2 0 0 0 22 12V10a2 2 0 0 0-2-2h-.5a3.5 3.5 0 0 0-3.7-3.74A4 4 0 0 0 12 2Zm-1 8.5V8.5h2v2h-2Zm-7 2h7v7.5H5a.5.5 0 0 1-.5-.5v-7Zm9 0h7V19.5a.5.5 0 0 1-.5.5H13v-7.5Z" />
    </svg>
  );
}

function AccountFilledIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 12.5c-4.42 0-8 2.24-8 5v1a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5v-1c0-2.76-3.58-5-8-5Z" />
    </svg>
  );
}

function SupportFilledIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2a9 9 0 0 0-9 9v3.5A3.5 3.5 0 0 0 6.5 18H7a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5.07A7.002 7.002 0 0 1 12 4a7.002 7.002 0 0 1 6.93 7H17a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h.5a3.5 3.5 0 0 0 3.5-3.5V11a9 9 0 0 0-9-9ZM5 13h1v3H5a1.5 1.5 0 0 1-1.5-1.5V14A1 1 0 0 1 5 13Zm14 3h-1v-3h1a1 1 0 0 1 1 1v.5a1.5 1.5 0 0 1-1.5 1.5Z" />
    </svg>
  );
}

function ChatFilledIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20 2H4a2 2 0 0 0-2 2v13.5A1.5 1.5 0 0 0 3.5 19H6v3.29a1 1 0 0 0 1.62.78L12.5 19H20a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm-12 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
    </svg>
  );
}

export function CasinoShell({ session, profile, children }: CasinoShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoggedIn = !!session?.user;

  // Drawers & Modals state
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [freeMoneyOpen, setFreeMoneyOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err) {
        setAuthError(err);
      }
    }
  }, []);
  
  // Free Money Claimed status
  const [claimedBonus, setClaimedBonus] = useState(false);
  const [balance, setBalance] = useState<number>(() => {
    return profile?.balance ? parseFloat(profile.balance) : 38.00;
  });

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    try {
      await authClient.signOut();
      router.push("/auth/sign-in");
    } catch {
      router.push("/auth/sign-in");
    }
  };

  // Simulated live chat messages
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Karan_99", text: "Big hit on Wingo!! 🚀 450x multiplier!!", time: "12:18", badge: "VIP 3" },
    { id: 2, user: "Rohan_Pro", text: "Trx Wingo is printing right now", time: "12:19", badge: "VIP 5" },
    { id: 3, user: "Alex_Stake", text: "Who is on Aviator? Cashout at 15x", time: "12:20", badge: "VIP 2" },
    { id: 4, user: "Priya777", text: "Claimed the daily ₹100 bonus, thanks Pasa!", time: "12:20", badge: "VIP 1" },
  ]);
  const [newChatText, setNewChatText] = useState("");

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;
    const msg = {
      id: Date.now(),
      user: session?.user?.name || "Player",
      text: newChatText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: "Player"
    };
    setChatMessages((prev) => [...prev, msg]);
    setNewChatText("");
  };

  const handleClaimFreeMoney = () => {
    if (!claimedBonus) {
      setBalance((b) => b + 100);
      setClaimedBonus(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#060810] font-sans antialiased">
      {/* Mobile Shell */}
      <div className="w-full max-w-[430px] min-h-screen bg-[#090B15] flex flex-col relative shadow-2xl border-x border-[#14192B]/70 pb-20">
        
        {/* Sticky Header — refined, clean */}
        <header className="sticky top-0 z-40 bg-[#090B15]/95 backdrop-blur-xl px-4 py-2.5 flex items-center justify-between border-b border-[#141A2D]">
          {/* Brand Logo */}
          <PasaLogo />

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Balance Capsule */}
            <div className="flex items-center bg-gradient-to-b from-[#131726] to-[#0A0D18] border border-[#1E263D] rounded-full pl-3 pr-1 py-1 gap-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
              <span className="font-mono text-[12.5px] font-bold text-slate-100 tabular-nums tracking-tight">
                ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <Link 
                href="/casino/wallet"
                className="w-6.5 h-6.5 rounded-full bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] hover:from-[#8B5CF6] hover:to-[#6D28D9] flex items-center justify-center text-white transition-all cursor-pointer shadow-[0_2px_6px_rgba(109,40,217,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] border-t border-white/20 active:scale-95"
                title="Wallet"
              >
                <Wallet className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Profile Button */}
            <button 
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 ${
                profileMenuOpen 
                  ? "bg-[#1E2540] border-[#7C3AED] text-white" 
                  : "bg-gradient-to-b from-[#141826] to-[#0D101C] border-[#1F273E] hover:border-[#354366] text-[#94A3B8] hover:text-white"
              }`}
              aria-label="Profile menu"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Bell */}
            <Link
              href="/casino/announcements"
              className="w-8 h-8 rounded-full bg-gradient-to-b from-[#141826] to-[#0D101C] border border-[#1F273E] hover:border-[#354366] flex items-center justify-center transition-all relative cursor-pointer text-[#94A3B8] hover:text-white shadow-sm active:scale-95"
              title="Announcements"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
            </Link>
          </div>
        </header>

        {/* Profile Menu Dropdown */}
        {profileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setProfileMenuOpen(false)} 
            />
            
            {/* Dropdown Card — dark themed, matches the app */}
            <div className="absolute top-[52px] right-3.5 z-50 w-[220px] bg-[#0E1220] rounded-2xl border border-[#1C253B] shadow-[0_16px_40px_rgba(0,0,0,0.7)] py-1.5 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
              {/* Caret */}
              <div className="absolute -top-[7px] right-[22px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[7px] border-b-[#1C253B]" />
              <div className="absolute -top-[6px] right-[22px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[7px] border-b-[#0E1220]" />

              <div className="flex flex-col px-1">
                {[
                  { href: '/casino/wallet', icon: Wallet, label: 'Wallet' },
                  { href: '/casino/free-money', icon: Gift, label: 'Free Money' },
                  { href: '/casino/statistics', icon: BarChart2, label: 'Statistics' },
                  { href: '/casino/transactions', icon: FileText, label: 'Transactions' },
                  { href: '/casino/game-history', icon: BookmarkCheck, label: 'Game History' },
                  { href: '/casino/settings', icon: Settings, label: 'Settings' },
                  { href: '/casino/announcements', icon: Megaphone, label: 'Announcements' },
                  { href: '/casino/support', icon: Headphones, label: 'Live Support' },
                ].map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#151B2C] transition-colors text-[13px] font-medium text-[#CBD5E1] hover:text-white"
                  >
                    <Icon className="w-4 h-4 text-[#718096] shrink-0" />
                    <span>{label}</span>
                  </Link>
                ))}

                <div className="my-1 border-t border-[#1C253B]" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-rose-500/10 transition-colors text-[13px] font-medium text-rose-400 hover:text-rose-300 text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>

        {/* Bottom Navigation Bar (BNB) */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#0A0D18]/94 backdrop-blur-xl border-t border-[#161E33] px-2 pb-3.5 flex items-center justify-around shadow-[0_-10px_35px_rgba(0,0,0,0.6)]">
          {[  
            { href: '/casino', icon: HomeFilledIcon, label: 'Home' },
            { href: '/casino/promotions', icon: FreeMoneyFilledIcon, label: 'Bonuses' },
            { href: '/casino/account', icon: AccountFilledIcon, label: 'Account' },
            { href: '/casino/support', icon: SupportFilledIcon, label: 'Support' },
          ].map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/casino' && (pathname.startsWith(href) || (href === '/casino/support' && pathname.startsWith('/casino/chat'))));
            return (
              <Link
                key={href}
                href={href}
                className="relative flex-1 flex flex-col items-center pt-2.5 pb-1 gap-1.5 select-none group transition-transform active:scale-95"
              >
                {/* Top indicator bar for active tab */}
                {active && (
                  <>
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2.5px] rounded-b-full bg-gradient-to-r from-[#7C3AED] via-[#C4B5FD] to-[#7C3AED] shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-gradient-to-b from-[#7C3AED]/20 to-transparent pointer-events-none rounded-b-full blur-xs" />
                  </>
                )}

                {/* Plain icon without card container */}
                <Icon className={`w-5 h-5 transition-colors duration-200 ${
                  active 
                    ? 'text-[#C4B5FD] drop-shadow-[0_0_6px_rgba(167,139,250,0.45)]' 
                    : 'text-[#505D78] group-hover:text-[#94A3B8]'
                }`} />

                {/* Label */}
                <span className={`text-[10px] font-semibold tracking-tight transition-colors duration-200 ${
                  active ? 'text-white font-bold' : 'text-[#505D78] group-hover:text-[#94A3B8]'
                }`}>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Live Support Drawer */}
        {chatOpen && (
          <div className="fixed inset-0 z-50 flex justify-center bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-[430px] h-full bg-[#0E1018] flex flex-col shadow-2xl relative border-x border-[#1F2233]">
              
              {/* Support Header */}
              <div className="p-3.5 border-b border-[#1A1C29] flex items-center justify-between bg-[#11131E]">
                <div className="flex items-center gap-2">
                  <SupportFilledIcon className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="text-sm font-bold text-white">Live Support</span>
                  <span className="w-2 h-2 rounded-full bg-[#00E701]" />
                </div>
                <button 
                  onClick={() => setChatOpen(false)}
                  className="p-1 rounded-md text-[#8F97A6] hover:text-white hover:bg-white/5 cursor-pointer border-none bg-transparent"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages List */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="bg-[#151724] border border-[#212435] rounded-xl p-2.5 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-[11px]">{msg.user}</span>
                        <span className="text-[8px] font-extrabold bg-[#7C3AED]/20 text-[#A78BFA] px-1.5 py-0.5 rounded">
                          {msg.badge}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#6B7280]">{msg.time}</span>
                    </div>
                    <p className="text-[#D1D5DB] text-xs leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="p-3 border-t border-[#1A1C29] bg-[#11131E] flex items-center gap-2">
                <input 
                  type="text" 
                  value={newChatText}
                  onChange={(e) => setNewChatText(e.target.value)}
                  placeholder="Send a message..."
                  className="flex-1 bg-[#1A1C29] border border-[#292D40] rounded-lg px-3 py-2 text-xs text-white placeholder-[#6B7280] outline-none focus:border-[#7C3AED]"
                />
                <button 
                  type="submit"
                  className="p-2 bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] hover:from-[#8B5CF6] hover:to-[#6D28D9] rounded-lg text-white cursor-pointer border-none shadow-[0_2px_8px_rgba(124,58,237,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>
        )}

        {/* Free Money Modal */}
        {freeMoneyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs px-4">
            <div className="w-full max-w-[360px] bg-[#0E1220] border border-[#1C253B] rounded-2xl p-5 shadow-2xl relative text-center">
              <button 
                onClick={() => setFreeMoneyOpen(false)}
                className="absolute top-3.5 right-3.5 p-1 rounded-md text-[#8F97A6] hover:text-white cursor-pointer border-none bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <FreeMoneyFilledIcon className="w-8 h-8" />
              </div>

              <h3 className="text-base font-bold text-white tracking-tight">Daily Bonus Faucet</h3>
              <p className="text-xs text-[#8F97A6] mt-1.5 max-w-[280px] mx-auto leading-relaxed">
                Claim your daily free ₹100.00 refill to play Originals and Slots!
              </p>

              <div className="my-5 p-3 rounded-xl bg-gradient-to-b from-[#131828] to-[#0D101C] border border-[#1E2740] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8F97A6]">Reward Amount:</span>
                <span className="text-base font-black text-emerald-400 font-mono">₹100.00 FREE</span>
              </div>

              {claimedBonus ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Claimed for Today! Refills in 23h 59m</span>
                </div>
              ) : (
                <button 
                  onClick={handleClaimFreeMoney}
                  className="w-full py-3 bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] hover:from-[#8B5CF6] hover:to-[#6D28D9] text-white text-xs font-bold rounded-xl shadow-[0_2px_10px_rgba(124,58,237,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] border-t border-white/20 cursor-pointer transition-all active:scale-95"
                >
                  CLAIM ₹100 NOW
                </button>
              )}
            </div>
          </div>
        )}

        {/* Account Drawer */}
        {accountOpen && (
          <div className="fixed inset-0 z-50 flex justify-center bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-[430px] h-full bg-[#0A0D18] flex flex-col shadow-2xl relative border-x border-[#182136]">
              
              {/* Drawer Header */}
              <div className="p-3.5 border-b border-[#161F33] flex items-center justify-between bg-[#0E1322]">
                <div className="flex items-center gap-2">
                  <AccountFilledIcon className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="text-sm font-bold text-white tracking-tight">Account Details</span>
                </div>
                <button 
                  onClick={() => setAccountOpen(false)}
                  className="p-1 rounded-md text-[#8F97A6] hover:text-white hover:bg-white/5 cursor-pointer border-none bg-transparent"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto">
                {isLoggedIn ? (
                  <>
                    {/* User Card */}
                    <div className="p-4 rounded-xl bg-gradient-to-b from-[#131828] to-[#0D101C] border border-[#1E2740] flex items-center gap-3 shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] flex items-center justify-center text-white text-base font-black shadow-md border-t border-white/20">
                        {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{session?.user?.name || "Player"}</span>
                        <span className="text-xs text-[#8F97A6]">{session?.user?.email}</span>
                        <span className="text-[10px] font-extrabold text-[#A78BFA] mt-0.5">VIP Level: Gold 1</span>
                      </div>
                    </div>

                    {/* Balance & Wallet */}
                    <div className="p-4 rounded-xl bg-gradient-to-b from-[#131828] to-[#0D101C] border border-[#1E2740] flex flex-col gap-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#8F97A6]">Total Balance</span>
                        <span className="text-base font-mono font-black text-white">
                          ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button 
                          onClick={() => setBalance(b => b + 500)}
                          className="py-2.5 px-3 rounded-xl bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] hover:from-[#8B5CF6] hover:to-[#6D28D9] text-white text-xs font-bold cursor-pointer border-t border-white/20 shadow-[0_2px_8px_rgba(124,58,237,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-95 transition-all"
                        >
                          + Deposit ₹500
                        </button>
                        <button 
                          onClick={() => alert("Withdrawal processing via UPI")}
                          className="py-2.5 px-3 rounded-xl bg-gradient-to-b from-[#181D2E] to-[#101422] hover:from-[#1E253A] hover:to-[#14192A] text-slate-200 border border-[#222A40] hover:border-[#334060] text-xs font-bold cursor-pointer shadow-sm active:scale-95 transition-all"
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>

                    {/* Sign out */}
                    <div className="mt-auto pt-4">
                      <ClientLogoutButton />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AccountFilledIcon className="w-12 h-12 text-[#8B5CF6] mb-3" />
                    <h4 className="text-base font-bold text-white tracking-tight">Join 7X PASA</h4>
                    <p className="text-xs text-[#8F97A6] mt-1 max-w-[240px] leading-relaxed">
                      Sign in or create an account to play with real balances, climb VIP ranks, and claim bonuses!
                    </p>
                    <div className="flex flex-col gap-2.5 w-full mt-6">
                      <Link 
                        href="/auth/sign-in" 
                        onClick={() => setAccountOpen(false)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] hover:from-[#8B5CF6] hover:to-[#6D28D9] text-white text-xs font-bold text-center border-t border-white/20 shadow-[0_2px_8px_rgba(124,58,237,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-95 transition-all"
                      >
                        Sign In
                      </Link>
                      <Link 
                        href="/auth/sign-up" 
                        onClick={() => setAccountOpen(false)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-b from-[#181D2E] to-[#101422] hover:from-[#1E253A] hover:to-[#14192A] border border-[#222A40] hover:border-[#334060] text-slate-200 text-xs font-bold text-center shadow-sm active:scale-95 transition-all"
                      >
                        Create New Account
                      </Link>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}


        {/* Auth Error Notification Modal */}
        {authError === "account_not_linked" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-[380px] bg-[#0F1221] border border-amber-500/40 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_40px_rgba(234,179,8,0.2)] flex flex-col text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-3.5">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>

              <h3 className="text-base font-black text-white tracking-tight">
                Account Already Exists
              </h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                An account with this email was registered using an <span className="text-white font-semibold">Email & Password</span>.
              </p>
              <p className="text-[11px] text-[#CBD5E1]/80 mt-1 leading-relaxed">
                For security, please sign in using your password.
              </p>

              <div className="flex flex-col gap-2 mt-5">
                <Link
                  href="/auth/sign-in?error=account_not_linked"
                  onClick={() => setAuthError(null)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] hover:from-[#8B5CF6] hover:to-[#6D28D9] text-white text-xs font-bold border-t border-white/20 shadow-[0_2px_10px_rgba(124,58,237,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all text-center flex items-center justify-center active:scale-95"
                >
                  Sign In with Password
                </Link>
                <button
                  onClick={() => setAuthError(null)}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-[#8F97A6] hover:text-white bg-transparent border-none cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
