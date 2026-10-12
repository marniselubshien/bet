"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, User, Shield, Key, Bell, Volume2, 
  Smartphone, CheckCircle2, ChevronRight, Lock, Eye, EyeOff
} from "lucide-react";
import { authClient } from "@/lib/auth/client";

export default function SettingsPage() {
  const { data: session } = authClient.useSession();
  
  const [nickname, setNickname] = useState(session?.user?.name || "Player3R7TE");
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Profile nickname updated successfully!");
  };

  return (
    <div className="w-full flex flex-col pt-2 pb-10 px-3.5 select-none text-[#8F97A6]">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#161A28] border border-[#7C3AED] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-2">
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
        <span className="text-xs font-black uppercase tracking-wider text-white">
          Account Settings
        </span>
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl bg-[#131625] border border-[#20253B] p-4 mb-4 shadow-md flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#A78BFA]" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Profile Information
          </span>
        </div>

        <div className="flex items-center gap-3 py-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6D28D9] to-[#8B5CF6] border-2 border-white/20 flex items-center justify-center text-white text-base font-extrabold shadow-md">
            {nickname[0]?.toUpperCase() || "P"}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">{nickname}</span>
            <span className="text-[10px] text-[#717A8C]">
              UID: 38930130 • Verified VIP 3
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="flex flex-col gap-2.5 mt-1">
          <div>
            <label className="text-[11px] font-semibold text-[#8F97A6] mb-1 block">
              Player Nickname
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-[#0E101B] border border-[#1E2335] rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs cursor-pointer transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Security Section */}
      <div className="rounded-2xl bg-[#131625] border border-[#20253B] p-4 mb-4 shadow-md flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Security & Login
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-[#0E101B] border border-[#1E2335]">
          <div className="flex items-center gap-2.5">
            <Key className="w-4 h-4 text-[#A78BFA]" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Two-Factor Authentication</span>
              <span className="text-[10px] text-[#717A8C]">Google Authenticator / SMS code</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setTwoFactor(!twoFactor);
              showToast(twoFactor ? "2FA disabled" : "2FA enabled successfully");
            }}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              twoFactor ? "bg-[#7C3AED]" : "bg-[#252A3D]"
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
              twoFactor ? "right-1" : "left-1"
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-[#0E101B] border border-[#1E2335]">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#A78BFA]" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Password & PIN</span>
              <span className="text-[10px] text-[#717A8C]">Updated 12 days ago</span>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => showToast("Password reset link sent to registered email")}
            className="text-[11px] font-bold text-[#A78BFA] hover:text-white"
          >
            Change
          </button>
        </div>
      </div>

      {/* Audio & Game Preferences */}
      <div className="rounded-2xl bg-[#131625] border border-[#20253B] p-4 shadow-md flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Game Sound & FX
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-[#0E101B] border border-[#1E2335]">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">Sound Effects</span>
            <span className="text-[10px] text-[#717A8C]">Win chimes, multiplier alerts</span>
          </div>
          <button
            type="button"
            onClick={() => setSfxEnabled(!sfxEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              sfxEnabled ? "bg-[#7C3AED]" : "bg-[#252A3D]"
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
              sfxEnabled ? "right-1" : "left-1"
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-[#0E101B] border border-[#1E2335]">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">Background Music</span>
            <span className="text-[10px] text-[#717A8C]">Casino lobby ambient audio</span>
          </div>
          <button
            type="button"
            onClick={() => setMusicEnabled(!musicEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              musicEnabled ? "bg-[#7C3AED]" : "bg-[#252A3D]"
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
              musicEnabled ? "right-1" : "left-1"
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}
