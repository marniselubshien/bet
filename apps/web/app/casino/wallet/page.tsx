"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { authClient } from "@/lib/auth/client";

export default function WalletPage() {
  const { data: session } = authClient.useSession();
  const [balance] = useState<number>(38.00);

  return (
    <div className="w-full flex flex-col pt-3 pb-8 px-4 select-none text-[#8F97A6]">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <Link 
          href="/casino" 
          className="w-9 h-9 rounded-xl bg-[#141624] border border-[#23273A] hover:border-[#353B55] flex items-center justify-center text-white transition-all shadow-sm active:scale-95"
          title="Back to Casino"
        >
          <ArrowLeft className="w-4 h-4 text-slate-200" />
        </Link>
        
        <h1 className="text-base font-bold text-white tracking-wide">
          Wallet
        </h1>

        <Link 
          href="/casino/wallet/deposit-history" 
          className="w-9 h-9 rounded-xl bg-[#141624] border border-[#23273A] hover:border-[#353B55] flex items-center justify-center text-[#8F97A6] hover:text-white transition-all shadow-sm active:scale-95"
          title="Transaction History"
        >
          <ClipboardList className="w-4 h-4 text-[#A78BFA]" />
        </Link>
      </div>

      {/* Card 1: Total Balance Card */}
      <div className="rounded-3xl bg-[#121422] border border-[#1E2235] p-6 mb-3 flex flex-col items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Purple Wallet 3D-style Illustration */}
        <div className="mb-3 relative">
          <svg width="68" height="58" viewBox="0 0 68 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="walletGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="60%" stopColor="#6D28D9" />
                <stop offset="100%" stopColor="#4C1D95" />
              </linearGradient>
              <linearGradient id="walletGradFlap" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
              <linearGradient id="walletGradClasp" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DDD6FE" />
                <stop offset="100%" stopColor="#C4B5FD" />
              </linearGradient>
              <filter id="walletGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#7C3AED" floodOpacity="0.35" />
              </filter>
            </defs>
            {/* Top Back Lip */}
            <rect x="12" y="4" width="44" height="18" rx="7" fill="#5B21B6" />
            <rect x="15" y="8" width="38" height="8" rx="4" fill="#7C3AED" opacity="0.6" />
            {/* Main Wallet Body */}
            <rect x="6" y="12" width="56" height="42" rx="14" fill="url(#walletGradMain)" filter="url(#walletGlow)" />
            {/* Soft Inner Highlight */}
            <rect x="8" y="14" width="52" height="12" rx="8" fill="white" opacity="0.12" />
            {/* Front Pocket Flap */}
            <path d="M6 26C6 20 10 16 16 16H52C58 16 62 20 62 26V32C62 32 50 38 34 38C18 38 6 32 6 32V26Z" fill="url(#walletGradFlap)" opacity="0.5" />
            {/* Side Clasp / Latch */}
            <rect x="42" y="25" width="22" height="15" rx="7.5" fill="url(#walletGradClasp)" />
            <circle cx="56" cy="32.5" r="3.5" fill="#5B21B6" />
          </svg>
        </div>

        {/* Total Balance Label */}
        <span className="text-xs font-medium text-[#8F97A6] tracking-tight">
          Total Balance
        </span>

        {/* Large Currency Amount */}
        <div className="flex items-center gap-1.5 mt-1 mb-3">
          <span className="text-3xl font-extrabold text-white font-sans tracking-tight">
            ₹ {balance.toFixed(2)}
          </span>
        </div>

        {/* Available Balance Pill Badge */}
        <div className="px-4 py-1 rounded-full bg-[#1A1D2E] border border-white/5 shadow-inner">
          <span className="text-[11.5px] font-medium text-[#8F97A6]">
            Available Balance
          </span>
        </div>
      </div>

      {/* Card 2: Wallets Breakdown & Actions Card */}
      <div className="rounded-3xl bg-[#121422] border border-[#1E2235] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col">
        {/* Top Gauges Section */}
        <div className="grid grid-cols-2 relative pb-5 border-b border-[#1E2235]">
          {/* Vertical Divider */}
          <div className="absolute left-1/2 top-2 bottom-6 w-[1px] bg-[#1E2235] -translate-x-1/2" />

          {/* Left Gauge: Main Wallet */}
          <div className="flex flex-col items-center justify-center pr-2">
            {/* Donut Ring */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-[#1B1F33]"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Gauge Stroke (0.00%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-[#7C3AED]"
                  strokeWidth="8"
                  strokeDasharray="238.76"
                  strokeDashoffset="238.76"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white tracking-tight">
                  0.00%
                </span>
              </div>
            </div>

            <span className="text-sm font-bold text-white font-sans tracking-tight">
              ₹ 0.00
            </span>
            <span className="text-[11.5px] font-semibold text-[#8B5CF6] mt-0.5">
              Main wallet
            </span>
          </div>

          {/* Right Gauge: 3rd Party Wallet */}
          <div className="flex flex-col items-center justify-center pl-2">
            {/* Donut Ring */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-[#1B1F33]"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Gauge Stroke (0.00%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-[#38BDF8]"
                  strokeWidth="8"
                  strokeDasharray="238.76"
                  strokeDashoffset="238.76"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white tracking-tight">
                  0.00%
                </span>
              </div>
            </div>

            <span className="text-sm font-bold text-white font-sans tracking-tight">
              ₹ 0.00
            </span>
            <span className="text-[11.5px] font-semibold text-[#38BDF8] mt-0.5">
              3rd party wallet
            </span>
          </div>
        </div>

        {/* Bottom Section: 4 Rounded Squircle Action Buttons */}
        <div className="grid grid-cols-4 gap-2 pt-4">
          {/* Button 1: Deposit */}
          <Link
            href="/casino/wallet/deposit"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-[58px] h-[58px] rounded-2xl bg-gradient-to-b from-[#FCD34D] via-[#F59E0B] to-[#D97706] p-0.5 shadow-[0_4px_16px_rgba(245,158,11,0.3)] flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform">
              <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-inner">
                {/* Deposit Pouch Icon */}
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 11V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V11" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M3 11C3 9.89543 3.89543 9 5 9H19C20.1046 9 21 9.89543 21 11V11C21 12.1046 20.1046 13 19 13H5C3.89543 13 3 12.1046 3 11V11Z" fill="#FDE68A" fillOpacity="0.4" stroke="#FEF3C7" strokeWidth="2"/>
                  <path d="M12 4V15M12 15L9 12M12 15L15 12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-200 mt-2 text-center group-hover:text-white transition-colors">
              Deposit
            </span>
          </Link>

          {/* Button 2: Withdraw */}
          <Link
            href="/casino/wallet/withdraw"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-[58px] h-[58px] rounded-2xl bg-gradient-to-b from-[#7DD3FC] via-[#38BDF8] to-[#0284C7] p-0.5 shadow-[0_4px_16px_rgba(56,189,248,0.3)] flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform">
              <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-[#38BDF8] to-[#0284C7] flex items-center justify-center shadow-inner">
                {/* Credit Card / Payout Icon */}
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="6" width="18" height="12" rx="3" stroke="#E0F2FE" strokeWidth="2" fill="#BAE6FD" fillOpacity="0.3"/>
                  <path d="M3 10H21" stroke="#E0F2FE" strokeWidth="2"/>
                  <rect x="6" y="13" width="4" height="2.5" rx="0.5" fill="#FFFFFF"/>
                </svg>
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-200 mt-2 text-center group-hover:text-white transition-colors">
              Withdraw
            </span>
          </Link>

          {/* Button 3: Deposit history */}
          <Link
            href="/casino/wallet/deposit-history"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-[58px] h-[58px] rounded-2xl bg-gradient-to-b from-[#FDA4AF] via-[#FB7185] to-[#E11D48] p-0.5 shadow-[0_4px_16px_rgba(244,63,94,0.3)] flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform">
              <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-[#FB7185] to-[#E11D48] flex items-center justify-center shadow-inner">
                {/* Deposit History Document Icon */}
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 4C6 2.89543 6.89543 2 8 2H16C17.1046 2 18 2.89543 18 4V20C18 21.1046 17.1046 22 16 22H8C6.89543 22 6 21.1046 6 20V4Z" stroke="#FFE4E6" strokeWidth="2" fill="#FECDD3" fillOpacity="0.3"/>
                  <path d="M10 6H14M10 10H14M10 14H13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M13 2V6L15 4.5L17 6V2" fill="#FFFFFF"/>
                </svg>
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-200 mt-2 text-center leading-tight group-hover:text-white transition-colors">
              Deposit history
            </span>
          </Link>

          {/* Button 4: Withdrawal history */}
          <Link
            href="/casino/wallet/withdrawal-history"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-[58px] h-[58px] rounded-2xl bg-gradient-to-b from-[#6EE7B7] via-[#34D399] to-[#059669] p-0.5 shadow-[0_4px_16px_rgba(16,185,129,0.3)] flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform">
              <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-[#34D399] to-[#059669] flex items-center justify-center shadow-inner">
                {/* Withdrawal Wallet with Checkmark Icon */}
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="6" width="18" height="13" rx="3" stroke="#D1FAE5" strokeWidth="2" fill="#A7F3D0" fillOpacity="0.3"/>
                  <circle cx="15" cy="12.5" r="3.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5"/>
                  <path d="M13.5 12.5L14.5 13.5L16.5 11.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-200 mt-2 text-center leading-tight group-hover:text-white transition-colors">
              Withdrawal history
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
