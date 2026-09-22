"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, BookmarkCheck, Heart, PlaySquare, Sparkles, Receipt,
  Flame, ShoppingBag, Disc, Rocket, TrendingUp,
  Target, Gift, Spade, User, Search, Bell, PanelRight, ChevronDown,
  ChevronRight, Trophy, Newspaper, Handshake, ShieldCheck, Headphones, Globe
} from "lucide-react";
import { ClientLogoutButton } from "./client-logout-button";

interface CasinoShellProps {
  session: any;
  profile: any;
  children: React.ReactNode;
}

/* Official Stake Cursive Logo Vector matching Stake.com */
function StakeLogo({ className = "h-6 md:h-7 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 447 222" fill="currentColor" className={className}>
      <g transform="matrix(1.1284878,0,0,1.1216599,0.000565,0.000629)">
        <path d="M 25.68,56.89 C 25.58,30.42 42.52,15.74 73.62,15.63 96,15.55 100,30.19 100,35.51 c 0,10.19 -14.42,21 -14.42,21 0,0 0.8,6.35 13.18,6.3 12.38,-0.05 24.44,-8.22 24.37,-28.67 C 123.07,10.65 98.46,-0.09 74.13,0 53.78,0.07 -0.19,2.93 0,56.51 c 0.18,47.59 90,51.79 90.07,82.26 0.12,33.09 -37,42 -49.56,42 -12.56,0 -17.67,-8.89 -17.69,-13.77 -0.09,-26.8 26.58,-34.26 26.58,-34.26 0,-2 -1.56,-10.91 -11.89,-10.87 -26.61,0.05 -37.21,22.93 -37.13,45.27 0.07,19 13.5,30.86 33.78,30.78 38.78,-0.14 82.51,-19.06 82.35,-61.08 C 116.37,97.54 25.79,87.28 25.68,56.89 Z" />
        <path d="m 395.37,162.18 c -0.31,-0.75 -1.18,-0.57 -2.33,0.38 -4.4,3.63 -14.46,13.91 -38,14 -42.92,0.16 -50.37,-70.58 -50.37,-70.58 0,0 32.71,-24.42 37.82,-34.27 5.11,-9.85 -11.15,-12 -11.15,-12 0,0 -22.88,27.84 -39.1,36 C 294,83.6 306,56 306.69,40.13 c 0.69,-15.87 -19.11,-12 -22.27,-10.48 0,6.93 -17.49,69.84 -23.86,104.42 -3.75,6 -9.11,12.86 -13.91,12.87 -2.78,0 -3.8,-5.15 -3.83,-12.53 0,-10.24 5.64,-26.65 5.6,-36.62 0,-6.9 -3.17,-7.31 -5.9,-7.3 -0.59,0 -3.87,0.09 -4.47,0.09 -7,0 -4.7,-6 -11,-5.94 -19.28,0.07 -43.84,21.12 -44.91,52.89 -6.51,4.31 -15.62,9.74 -20.27,9.76 -4.88,0 -6.09,-4.51 -6.1,-8.41 0,-6.85 11.08,-47.55 11.08,-47.55 0,0 14.11,-3.62 20.27,-4.81 4.66,-0.91 6,-1.25 7.81,-3.5 1.81,-2.25 5.35,-6.9 8.21,-11.08 2.86,-4.18 0.05,-7.41 -5.24,-7.39 -6.94,0 -25.51,4.4 -25.51,4.4 0,0 8.92,-38.46 8.91,-39.24 -0.01,-0.78 -1,-1.19 -2.51,-1.18 -3.38,0 -9.41,1.82 -13.27,3.2 -5.91,2.11 -10.72,9.35 -11.69,12.72 -0.97,3.37 -7.65,29.76 -7.65,29.76 0,0 -35.77,12.35 -40.66,14.2 a 0.74,0.74 0 0 0 -0.5,0.7 c 0,0.32 4.09,16 12.48,15.94 6,0 23.63,-7.22 23.63,-7.22 0,0 -9.06,36 -9,48 0,7.7 3.63,16.72 18.67,16.67 14,0 26.25,-7.23 33.11,-12.26 3.75,9.49 12.61,12.09 18.66,12.07 13.56,0 24,-10.82 25.34,-12.27 1.76,4.16 5.91,12.15 15.39,12.12 5.36,0 10.91,-6 15,-11.82 a 23.38,23.38 0 0 0 0.05,3.63 c 1.64,14.92 23.79,6.15 25,4.07 0.75,-10.79 0.28,-32.85 4.59,-46.47 5.72,46.46 27.42,77.71 66.43,77.57 21.81,-0.08 33,-6.35 37.63,-11.52 a 15.9,15.9 0 0 0 3.37,-15.44 z M 208.2,146.86 c -18.73,0.07 5.73,-48.48 21.71,-48.54 0.02,6.26 -0.33,48.47 -21.71,48.54 z" />
        <path d="m 360.26,161.74 c 16.91,-0.06 30,-11.19 32.4,-14.81 3.1,-4.71 -3.6,-11.82 -5.73,-11.7 -5.34,5.11 -10.92,11.29 -23.45,11.33 -14.75,0.06 -11.41,-16.17 -11.41,-16.17 0,0 28.39,3.67 39.8,-16.74 3.65,-6.53 3.8,-15.56 2.33,-19.45 -1.47,-3.89 -9.73,-11.09 -22.87,-10 -16.14,1.36 -36.48,18.19 -40.95,38.4 -3.59,16.26 3.2,39.24 29.88,39.14 z m 18,-68.1 c 2.66,-0.09 2.42,4.29 1.71,8.87 -1,6.21 -9.53,22 -25.81,21.38 1.13,-9.19 13.24,-29.89 24.13,-30.25 z" />
      </g>
    </svg>
  );
}

/* Custom SVG Icons tailored to Stake's exact visual style */
function CasinoCardIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      {/* Back card corner peeking out on top-left */}
      <path
        d="M4.5 3C3.67 3 3 3.67 3 4.5v10c0 .41.34.75.75.75s.75-.34.75-.75V5c0-.55.45-1 1-1h7c.41 0 .75-.34.75-.75S12.91 3 12.5 3H4.5z"
      />
      <circle cx="5.2" cy="6.2" r="0.8" />
      {/* Front card with cutout heart */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 5C5.67 5 5 5.67 5 6.5v12C5 19.33 5.67 20 6.5 20h11c.83 0 1.5-.67 1.5-1.5v-12C19 5.67 18.33 5 17.5 5h-11zm5.5 4.5c-.35-.45-.88-.75-1.5-.75-1.1 0-2 .9-2 2 0 1.5 1.5 2.8 3.5 4.4 2-1.6 3.5-2.9 3.5-4.4 0-1.1-.9-2-2-2-.62 0-1.15.3-1.5.75z"
      />
    </svg>
  );
}

function SportsBallIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 2.5a13 13 0 0 1 0 19" />
      <path d="M2.5 12h19" />
      <path d="M5.5 5.5a13 13 0 0 1 13 13" />
    </svg>
  );
}

function VipMountainIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      {/* Flag at summit */}
      <path d="M11 2v4.5l3.5-2L11 2.5z" />
      {/* Mountain peak */}
      <path d="M10 6.5 2.5 19.5h19L15 9l-2.5 3.5-2.5-6z" />
      <path d="M10 6.5 12.5 12.5 15 9l-1-1.8z" opacity="0.35" />
    </svg>
  );
}

function AffiliateIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="6" cy="12" r="3.5" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M8.5 10.8l6.5-3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M8.5 13.2l6.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function ForumIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <circle cx="8.5" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CasinoShell({ session, profile, children }: CasinoShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Responsive default: close on small screens initially, open on desktop if desired
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const navItemsTop = [
    { label: "Saved Games", href: "/casino/saved", icon: BookmarkCheck },
    { label: "Following", href: "/casino/following", icon: Heart },
    { label: "Continue Playing", href: "/casino/recent", icon: PlaySquare },
    { label: "Games For You", href: "/casino/for-you", icon: Sparkles },
    { label: "My Bets", href: "/casino/bets", icon: Receipt },
  ];

  const navItemsGames = [
    { label: "Only on Stake", href: "/casino/exclusive", isStakeBadge: true },
    { label: "New Releases", href: "/casino/new", icon: Sparkles },
    { label: "Slots", href: "/casino/slots", isSlotsBadge: true },
    { label: "Stake Originals", href: "/casino", icon: Flame },
    { label: "Live Casino", href: "/casino/live", icon: ShoppingBag },
    { label: "Game Shows", href: "/casino/shows", icon: Disc },
    { label: "Burst Games", href: "/casino/burst", icon: Rocket },
    { label: "Enhanced RTP", href: "/casino/rtp", icon: TrendingUp },
    { label: "Stake Poker", href: "/casino/poker", icon: Target },
    { label: "Bonus Buy", href: "/casino/bonus-buy", icon: Gift },
    { label: "Blackjack", href: "/casino/blackjack", icon: Spade },
  ];

  const navItemsSecondary = [
    { label: "Promotions", href: "/promotions", icon: Gift, hasChevron: true },
    { label: "VIP Club", href: "/vip", icon: VipMountainIcon },
    { label: "Affiliate", href: "/affiliate", icon: AffiliateIcon },
    { label: "Challenges", href: "/challenges", icon: Trophy },
    { label: "Blog", href: "/blog", icon: Newspaper },
    { label: "Forum", href: "/forum", icon: ForumIcon },
  ];

  const navItemsUtility = [
    { label: "Sponsorships", href: "/sponsorships", icon: Handshake, hasChevron: true },
    { label: "Provably Fair", href: "/provably-fair", icon: ShieldCheck },
    { label: "Live Support", href: "/support", icon: Headphones },
    { label: "English", href: "#", icon: Globe, hasChevron: true },
  ];

  /* 12 Collapsed Rail Items matching exact user screenshot */
  const collapsedRailTopItems = [
    {
      id: "casino",
      label: "Casino",
      href: "/casino",
      icon: CasinoCardIcon,
      isActive: pathname === "/casino" || pathname.startsWith("/casino"),
    },
    {
      id: "sports",
      label: "Sports",
      href: "/sports",
      icon: SportsBallIcon,
      isActive: pathname.startsWith("/sports"),
    },
    {
      id: "promotions",
      label: "Promotions",
      href: "/promotions",
      icon: Gift,
      hasChevron: true,
    },
    {
      id: "vip",
      label: "VIP Club",
      href: "/vip",
      icon: VipMountainIcon,
    },
    {
      id: "affiliate",
      label: "Affiliate",
      href: "/affiliate",
      icon: AffiliateIcon,
    },
    {
      id: "challenges",
      label: "Challenges",
      href: "/challenges",
      icon: Trophy,
    },
    {
      id: "blog",
      label: "Blog",
      href: "/blog",
      icon: Newspaper,
    },
    {
      id: "forum",
      label: "Forum",
      href: "/forum",
      icon: ForumIcon,
    },
  ];

  const collapsedRailBottomItems = [
    {
      id: "sponsorships",
      label: "Sponsorships",
      href: "/sponsorships",
      icon: Handshake,
      hasChevron: true,
    },
    {
      id: "fairness",
      label: "Provably Fair",
      href: "/provably-fair",
      icon: ShieldCheck,
    },
    {
      id: "support",
      label: "Live Support",
      href: "/support",
      icon: Headphones,
    },
    {
      id: "language",
      label: "Language",
      href: "#language",
      icon: Globe,
      hasChevron: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A2C38] text-white font-sans selection:bg-[#1475E1] selection:text-white">
      
      {/* Topbar: Seamless Stake layout, bottom elevation shadow, centered balance & wallet */}
      <header className="fixed top-0 inset-x-0 h-16 bg-[#1A2C38] z-50 flex items-center select-none shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-none">
        
        {/* Left: Hamburger Column & Stake Logo */}
        <div className="flex items-center h-full">
          {/* Hamburger Column matching sidebar width */}
          <div className={`h-full flex items-center bg-[#0F212E] transition-all duration-300 flex-shrink-0 ${
            sidebarOpen ? "w-60 px-4 justify-start" : "w-[60px] justify-center"
          }`}>
            <button 
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="p-2 rounded-lg text-[#B1BAD3] hover:text-white hover:bg-[#213743] transition-colors cursor-pointer border-none flex items-center justify-center"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Official Stake Logo */}
          <Link href="/casino" className="flex items-center group ml-4 md:ml-6 text-white hover:opacity-95 transition-opacity">
            <StakeLogo className="h-6 md:h-7 w-auto text-white" />
          </Link>
        </div>

        {/* Center: Compound Balance + Wallet Pill (Horizontally centered across the viewport) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <div className="flex items-center bg-[#0F212E] rounded-md overflow-hidden shadow-sm border-none">
            <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 cursor-pointer hover:bg-[#152533] transition-colors">
              <span className="text-white font-mono text-xs md:text-sm font-bold">
                {Number(profile?.balance ?? 1000).toFixed(8)}
              </span>
              <div className="w-4 h-4 rounded-full bg-[#26A17B] text-white flex items-center justify-center text-[10px] font-black leading-none flex-shrink-0">
                ₮
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#B1BAD3] flex-shrink-0" />
            </div>

            <button className="bg-[#1475E1] hover:bg-[#0f64c4] text-white font-bold text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 transition-colors border-none cursor-pointer">
              Wallet
            </button>
          </div>
        </div>

        {/* Right: 4 Action Icons */}
        <div className="flex items-center gap-1 md:gap-2 px-4 md:px-6 ml-auto">
          <button 
            aria-label="Search"
            className="p-2 text-[#B1BAD3] hover:text-white hover:bg-[#213743] rounded-lg transition-colors cursor-pointer border-none"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* User Profile / Menu */}
          <div className="relative group">
            <button 
              aria-label="User Profile"
              className="p-2 text-[#B1BAD3] hover:text-white hover:bg-[#213743] rounded-lg transition-colors cursor-pointer border-none"
            >
              <User className="w-5 h-5" />
            </button>

            <div className="absolute right-0 top-full mt-1 w-44 bg-[#0F212E] rounded-lg shadow-xl py-1 hidden group-hover:block z-50 border-none">
              {session ? (
                <>
                  <div className="px-3 py-1.5 text-xs text-[#8596A5] font-bold border-b border-[#213743] truncate">
                    {session.user?.email || "Signed In"}
                  </div>
                  <div className="p-1">
                    <ClientLogoutButton />
                  </div>
                </>
              ) : (
                <div className="p-2 flex flex-col gap-1">
                  <Link 
                    href="/auth/sign-in" 
                    className="bg-[#2F4553] hover:bg-[#385364] text-white text-xs font-bold px-3 py-1.5 rounded text-center transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/sign-up" 
                    className="bg-[#1475E1] hover:bg-[#0f64c4] text-white text-xs font-bold px-3 py-1.5 rounded text-center transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          <button 
            aria-label="Notifications"
            className="p-2 text-[#B1BAD3] hover:text-white hover:bg-[#213743] rounded-lg transition-colors cursor-pointer border-none"
          >
            <Bell className="w-5 h-5" />
          </button>

          <button 
            aria-label="Chat and side panel"
            className="p-2 text-[#B1BAD3] hover:text-white hover:bg-[#213743] rounded-lg transition-colors cursor-pointer border-none"
          >
            <PanelRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Backdrop for Sidebar Drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar: Smooth toggleable width between full (w-60) and collapsed rail (w-[60px] on desktop) */}
      <aside 
        className={`fixed inset-y-0 left-0 top-16 z-40 bg-[#0F212E] transition-all duration-300 ease-in-out select-none border-r border-[#213743]/40 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden ${
          sidebarOpen 
            ? "w-60 translate-x-0 opacity-100" 
            : "max-md:-translate-x-full max-md:w-0 max-md:opacity-0 md:w-[60px] md:translate-x-0 md:opacity-100"
        }`}
      >
        {sidebarOpen ? (
          /* Expanded Sidebar View */
          <div className="p-2.5 w-60">
            <div className="bg-[#1A2C38] rounded-xl overflow-hidden py-1 shadow-sm">
              
              {/* Top Actions */}
              {navItemsTop.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3.5 px-4 py-2.5 text-sm font-bold transition-colors ${
                      isActive 
                        ? "bg-[#2F4553] text-white" 
                        : "text-white hover:bg-[#213743]"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#B1BAD3]"}`} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}

              {/* Subtle Divider between sections */}
              <div className="border-t border-[#213743] my-1.5 mx-3" />

              {/* Games Category Header */}
              <div className="px-4 pt-1.5 pb-1 text-sm font-bold text-[#8596A5]">
                Games
              </div>

              {/* Games List */}
              {navItemsGames.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === "/casino" && pathname === "/casino";
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3.5 px-4 py-2.5 text-sm font-bold transition-colors ${
                      isActive 
                        ? "bg-[#2F4553] text-white" 
                        : "text-white hover:bg-[#213743]"
                    }`}
                  >
                    {item.isStakeBadge ? (
                      <div className="flex h-4 w-4 items-center justify-center font-serif italic text-xs font-black text-[#B1BAD3]">
                        S
                      </div>
                    ) : item.isSlotsBadge ? (
                      <div className="flex h-4 w-4 items-center justify-center text-[10px] font-black tracking-tighter text-[#B1BAD3] leading-none">
                        777
                      </div>
                    ) : Icon ? (
                      <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#B1BAD3]"}`} />
                    ) : null}
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}

              {/* Subtle Divider */}
              <div className="border-t border-[#213743] my-1.5 mx-3" />

              {/* Secondary Links */}
              {navItemsSecondary.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm font-bold transition-colors ${
                      isActive 
                        ? "bg-[#2F4553] text-white" 
                        : "text-white hover:bg-[#213743]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#B1BAD3]"}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.hasChevron && (
                      <ChevronRight className="w-3.5 h-3.5 text-[#8596A5]" />
                    )}
                  </Link>
                );
              })}

              {/* Subtle Divider */}
              <div className="border-t border-[#213743] my-1.5 mx-3" />

              {/* Utility Links */}
              {navItemsUtility.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between px-4 py-2.5 text-sm font-bold text-white hover:bg-[#213743] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon className="h-4 w-4 text-[#B1BAD3]" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.hasChevron && (
                      <ChevronRight className="w-3.5 h-3.5 text-[#8596A5]" />
                    )}
                  </Link>
                );
              })}

            </div>
          </div>
        ) : (
          /* Collapsed Mini Rail: Exact match to user screenshot */
          <div className="w-[60px] py-2.5 flex flex-col items-center gap-1.5">
            {/* Top Navigation Items */}
            {collapsedRailTopItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="relative group/rail flex items-center justify-center">
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      item.isActive 
                        ? "bg-[#213743] text-white shadow-sm" 
                        : "text-[#B1BAD3] hover:text-white hover:bg-[#213743]"
                    }`}
                  >
                    {item.hasChevron ? (
                      <div className="flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                        <ChevronRight className="w-2.5 h-2.5 text-[#8596A5] -mr-1 stroke-[2.5]" />
                      </div>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </Link>

                  {/* Tooltip on hover */}
                  <div className="pointer-events-none absolute left-full ml-2.5 px-2.5 py-1 bg-[#1A2C38] text-white text-xs font-semibold rounded shadow-2xl border border-[#2F4553] opacity-0 group-hover/rail:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                </div>
              );
            })}

            {/* Subtle Divider between groups */}
            <div className="w-7 h-[1px] bg-[#213743] my-1" />

            {/* Bottom Utility Items */}
            {collapsedRailBottomItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="relative group/rail flex items-center justify-center">
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-[#B1BAD3] hover:text-white hover:bg-[#213743] transition-colors cursor-pointer"
                  >
                    {item.hasChevron ? (
                      <div className="flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                        <ChevronRight className="w-2.5 h-2.5 text-[#8596A5] -mr-1 stroke-[2.5]" />
                      </div>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </Link>

                  {/* Tooltip on hover */}
                  <div className="pointer-events-none absolute left-full ml-2.5 px-2.5 py-1 bg-[#1A2C38] text-white text-xs font-semibold rounded shadow-2xl border border-[#2F4553] opacity-0 group-hover/rail:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </aside>

      {/* Main Content Area: Smooth responsive left padding when sidebar toggles */}
      <main 
        className={`pt-16 min-h-screen bg-[#1A2C38] transition-all duration-300 ease-in-out ${
          sidebarOpen ? "md:pl-60" : "md:pl-[60px] pl-0"
        }`}
      >
        <div className="w-full">
          {children}
        </div>
      </main>

    </div>
  );
}
