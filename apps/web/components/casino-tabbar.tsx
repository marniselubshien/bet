"use client";

import React, { useState } from "react";

/* 1. Playing cards with heart icon matching Stake Casino Home */
export function CasinoHomeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      {/* Back card corner peeking out on top-left */}
      <path d="M4.5 3C3.67 3 3 3.67 3 4.5v10c0 .41.34.75.75.75s.75-.34.75-.75V5c0-.55.45-1 1-1h7c.41 0 .75-.34.75-.75S12.91 3 12.5 3H4.5z" />
      {/* Front card with cutout heart */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 5C5.67 5 5 5.67 5 6.5v12C5 19.33 5.67 20 6.5 20h11c.83 0 1.5-.67 1.5-1.5v-12C19 5.67 18.33 5 17.5 5h-11zm5.5 4.5c-.35-.45-.88-.75-1.5-.75-1.1 0-2 .9-2 2 0 1.5 1.5 2.8 3.5 4.4 2-1.6 3.5-2.9 3.5-4.4 0-1.1-.9-2-2-2-.62 0-1.15.3-1.5.75z"
      />
    </svg>
  );
}

/* 2. Solid User Silhouette Icon for My Casino */
export function MyCasinoIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="7" r="4" />
      <path d="M4 20c0-4.42 3.58-8 8-8s8 3.58 8 8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

/* 3. Stake Monogram 'S' Emblem Icon for Only on Stake */
export function OnlyOnStakeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#213743" />
      <g transform="translate(4.5, 3.5) scale(0.12, 0.1)">
        <path
          fill="white"
          d="M 25.68,56.89 C 25.58,30.42 42.52,15.74 73.62,15.63 96,15.55 100,30.19 100,35.51 c 0,10.19 -14.42,21 -14.42,21 0,0 0.8,6.35 13.18,6.3 12.38,-0.05 24.44,-8.22 24.37,-28.67 C 123.07,10.65 98.46,-0.09 74.13,0 53.78,0.07 -0.19,2.93 0,56.51 c 0.18,47.59 90,51.79 90.07,82.26 0.12,33.09 -37,42 -49.56,42 -12.56,0 -17.67,-8.89 -17.69,-13.77 -0.09,-26.8 26.58,-34.26 26.58,-34.26 0,-2 -1.56,-10.91 -11.89,-10.87 -26.61,0.05 -37.21,22.93 -37.13,45.27 0.07,19 13.5,30.86 33.78,30.78 38.78,-0.14 82.51,-19.06 82.35,-61.08 C 116.37,97.54 25.79,87.28 25.68,56.89 Z"
        />
      </g>
    </svg>
  );
}

/* 4. 4-pointed Star Sparkles Icon for New Releases */
export function NewReleasesIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      {/* Primary 4-pointed star */}
      <path d="M12 2c0 4.2-2 6.5-6.5 7.2 4.5.7 6.5 3 6.5 7.2 0-4.2 2-6.5 6.5-7.2-4.5-.7-6.5-3-6.5-7.2z" />
      {/* Secondary 4-pointed star top right */}
      <path d="M19.5 2c0 2-1 3-3 3.4 2 .4 3 1.4 3 3.4 0-2 1-3 3-3.4-2-.4-3-1.4-3-3.4z" />
    </svg>
  );
}

/* 5. Solid White Flame Icon for Stake Originals */
export function StakeOriginalsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2c-.4 0-.8.3-.9.7-.8 2.6-1.5 4.3-3 5.8-1.3 1.4-2.8 3.2-2.8 5.8 0 4.2 3.2 7.7 7 7.7s7-3.5 7-7.7c0-3-1.5-5.4-3.6-7.5-.8-.9-1.4-1.8-1.9-2.8-.2-.5-.8-.5-1 0-.4 1-.9 1.9-1.5 2.7-.3.3-.6.1-.8-.3-.5-1.5-.7-3-1.1-4.2 0 0 0-.2-.4-.2z" />
    </svg>
  );
}

/* 6. Slot Machine 777 with top hood and lever handle for Slots */
export function SlotsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      {/* Top slot reel housing / hood */}
      <rect x="2" y="3" width="16" height="2.5" rx="1.2" />
      {/* Slot machine handle lever on right */}
      <path d="M18.5 4.2h1.8a.7.7 0 0 1 .7.7v4a1.8 1.8 0 1 1-1.4 0V5.7h-1.1v-1.5z" />
      <circle cx="21" cy="11.2" r="1.3" />
      {/* Three slanted 7s */}
      <g>
        {/* 7 #1 */}
        <path d="M3.2 7.5h3.6c.4 0 .7.3.6.7l-1.8 7.5c-.1.5-.5.8-1 .8h-.4c-.4 0-.7-.3-.6-.7l1.5-6.1H3.6c-.4 0-.7-.3-.7-.7v-.8c0-.4.3-.7.7-.7z" />
        {/* 7 #2 */}
        <path d="M7.8 7.5h3.6c.4 0 .7.3.6.7l-1.8 7.5c-.1.5-.5.8-1 .8h-.4c-.4 0-.7-.3-.6-.7l1.5-6.1H8.2c-.4 0-.7-.3-.7-.7v-.8c0-.4.3-.7.7-.7z" />
        {/* 7 #3 */}
        <path d="M12.4 7.5h3.6c.4 0 .7.3.6.7l-1.8 7.5c-.1.5-.5.8-1 .8h-.4c-.4 0-.7-.3-.6-.7l1.5-6.1h-2.1c-.4 0-.7-.3-.7-.7v-.8c0-.4.3-.7.7-.7z" />
      </g>
    </svg>
  );
}

/* 7. Dealer Tuxedo & Bowtie Icon for Live Casino */
export function LiveCasinoIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      {/* Bowtie */}
      <path d="M9.5 5.5l2.2 1.3V4.2L9.5 5.5zM14.5 5.5l-2.2 1.3V4.2l2.2 1.3z" />
      <circle cx="12" cy="5.5" r="0.9" />
      {/* Tuxedo lapels & vest/jacket */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.5 3.5A1.5 1.5 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a1.5 1.5 0 0 0-1.5-1.5h-2.5a1 1 0 0 0-.85.47L12 9.5 8.85 3.97a1 1 0 0 0-.85-.47H5.5zm4.7 10a1.3 1.3 0 1 1 2.6 0 1.3 1.3 0 0 1-2.6 0zm0 3a1.3 1.3 0 1 1 2.6 0 1.3 1.3 0 0 1-2.6 0z"
      />
    </svg>
  );
}

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabItem[] = [
  { id: "casino-home", label: "Casino Home", icon: CasinoHomeIcon },
  { id: "my-casino", label: "My Casino", icon: MyCasinoIcon },
  { id: "only-on-stake", label: "Only on Stake", icon: OnlyOnStakeIcon },
  { id: "new-releases", label: "New Releases", icon: NewReleasesIcon },
  { id: "stake-originals", label: "Stake Originals", icon: StakeOriginalsIcon },
  { id: "slots", label: "Slots", icon: SlotsIcon },
  { id: "live-casino", label: "Live Casino", icon: LiveCasinoIcon },
];

interface CasinoTabBarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export function CasinoTabBar({
  activeTab: controlledActiveTab,
  onTabChange,
  className = "",
}: CasinoTabBarProps) {
  const [internalActiveTab, setInternalActiveTab] = useState("casino-home");
  const currentTab = controlledActiveTab ?? internalActiveTab;

  const handleSelect = (tabId: string) => {
    setInternalActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className={`w-full overflow-x-auto scrollbar-none pb-1 mb-6 select-none ${className}`}>
      {/* Dark Capsule Pill Container */}
      <div className="inline-flex items-center bg-[#0F212E] rounded-full p-1 gap-1 shadow-sm">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`flex items-center gap-2 rounded-full font-bold text-xs md:text-sm whitespace-nowrap transition-all duration-150 border-none cursor-pointer ${
                isActive
                  ? "bg-[#2F4553] text-white px-4 py-2 shadow-sm"
                  : "text-white hover:bg-[#213743]/60 px-3.5 py-2"
              }`}
            >
              <Icon className="w-4 h-4 text-white flex-shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
