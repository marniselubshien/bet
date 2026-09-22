"use client";

import React, { useState } from "react";
import { startMinesGame, revealMinesTile, cashoutMines } from "../actions";
import { 
  Settings, Sliders, BarChart2, Maximize, ShieldCheck, ChevronDown
} from "lucide-react";

/* Stake Diamond / Gem Icon using https://stake.ac/_app/immutable/assets/gem-none.Bcv6X_BH.svg */
function StakeGemIcon({ className = "w-14 h-14 md:w-16 md:h-16" }: { className?: string }) {
  return (
    <img 
      src="https://stake.ac/_app/immutable/assets/gem-none.Bcv6X_BH.svg"
      alt="Diamond"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/games/gem.svg";
      }}
      className={`${className} object-contain`}
    />
  );
}

/* Stake Mine / Bomb Icon using https://stake.ac/_app/immutable/assets/mine.BrdEJX0T.svg */
function StakeMineIcon({ className = "w-10 h-10 md:w-12 md:h-12", isHit = false }: { className?: string; isHit?: boolean }) {
  return (
    <img 
      src="https://stake.ac/_app/immutable/assets/mine.BrdEJX0T.svg"
      alt="Mine Bomb"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = isHit ? "/games/mine-hit.svg" : "/games/mine.svg";
      }}
      className={`${className} object-contain ${
        isHit ? "scale-105" : ""
      }`}
    />
  );
}

export function MinesGame({ gameId }: { gameId: string }) {
  const [betTab, setBetTab] = useState<"manual" | "auto">("manual");
  const [betAmount, setBetAmount] = useState<number>(0.00000000);
  const [minesCount, setMinesCount] = useState<number>(3);
  const [inGame, setInGame] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Game state
  const [revealed, setRevealed] = useState<number[]>([]);
  const [mines, setMines] = useState<number[]>([]);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1);
  const [nextMultiplier, setNextMultiplier] = useState<number>(1.12);
  const [hitMine, setHitMine] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Remaining gems count: 25 total tiles - mines count - currently revealed safe gems
  const remainingGems = Math.max(0, 25 - minesCount - revealed.length);

  const handleStart = async () => {
    setLoading(true);
    setMessage(null);
    setHitMine(null);
    setMines([]);
    setRevealed([]);

    try {
      const res = await startMinesGame({ betAmount: betAmount || 10, minesCount });
      setInGame(true);
      setCurrentMultiplier(res.currentMultiplier);
      setNextMultiplier(res.nextMultiplier);
    } catch (err: any) {
      alert(err.message || "Failed to start game");
    } finally {
      setLoading(false);
    }
  };

  const handleTileClick = async (index: number) => {
    if (!inGame || revealed.includes(index) || loading) return;

    setLoading(true);
    try {
      const res = await revealMinesTile(index);
      if (res.isMine) {
        setInGame(false);
        setHitMine(index);
        setMines(res.mineIndices || []);
        setMessage(`Hit a mine!`);
      } else {
        setRevealed(res.revealedIndices ? [...res.revealedIndices] : []);
        setCurrentMultiplier(res.currentMultiplier ?? 1);
        setNextMultiplier(res.nextMultiplier ?? 1);

        if (res.gameOver && res.isCashout) {
          setInGame(false);
          setMines(res.allMines || []);
          setMessage(`Won $${res.payout.toFixed(2)} (${res.currentMultiplier}x)!`);
        }
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomPick = () => {
    if (!inGame || loading) return;
    const unrevealedIndices = Array.from({ length: 25 }, (_, i) => i).filter(
      (idx) => !revealed.includes(idx)
    );
    if (unrevealedIndices.length === 0) return;
    const randomIdx = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
    if (typeof randomIdx === "number") {
      handleTileClick(randomIdx);
    }
  };

  const handleCashout = async () => {
    if (!inGame || loading || revealed.length === 0) return;

    setLoading(true);
    try {
      const res = await cashoutMines();
      setInGame(false);
      setMines(res.mineIndices);
      setMessage(`Cashed Out $${res.payout.toFixed(2)} (${res.multiplier}x)!`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Profit calculation
  const totalProfitNum = inGame && revealed.length > 0
    ? (betAmount || 10) * (currentMultiplier - 1)
    : 0;

  return (
    <div className="w-full max-w-[1180px] mx-auto select-none">
      {/* Main Game Card: Unified 2-column frame */}
      <div className="flex flex-col md:flex-row bg-[#213743] rounded-lg overflow-hidden shadow-2xl border-none">
        
        {/* Left: Controls Panel */}
        <div className="w-full md:w-[320px] bg-[#213743] p-4 flex flex-col justify-between gap-4 border-r border-[#1A2C38]/40">
          
          <div className="flex flex-col gap-3.5">
            {/* Manual / Auto Pill Switch */}
            <div className="bg-[#0F212E] p-1 rounded-full flex w-full">
              <button
                type="button"
                onClick={() => setBetTab("manual")}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-colors text-center cursor-pointer border-none ${
                  betTab === "manual"
                    ? "bg-[#2F4553] text-white shadow-sm"
                    : "text-[#8596A5] hover:text-white"
                }`}
              >
                Manual
              </button>
              <button
                type="button"
                onClick={() => setBetTab("auto")}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-colors text-center cursor-pointer border-none ${
                  betTab === "auto"
                    ? "bg-[#2F4553] text-white shadow-sm"
                    : "text-[#8596A5] hover:text-white"
                }`}
              >
                Auto
              </button>
            </div>

            {/* Bet Amount Section */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[#8596A5] mb-1.5">
                <span>Bet Amount</span>
                <span>${(betAmount || 0).toFixed(2)}</span>
              </div>
              <div className="bg-[#0F212E] rounded-md flex items-center overflow-hidden border border-[#2F4553]/40 focus-within:border-[#1475E1] transition-colors">
                <input
                  type="number"
                  step="any"
                  disabled={inGame}
                  value={betAmount === 0 ? "0.00000000" : betAmount}
                  onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent px-3 py-2 text-sm font-bold text-white font-mono outline-none disabled:opacity-75"
                />
                <div className="w-4 h-4 rounded-full bg-[#26A17B] text-white flex items-center justify-center text-[10px] font-black mr-2 flex-shrink-0">
                  ₮
                </div>
                <button
                  type="button"
                  disabled={inGame}
                  onClick={() => setBetAmount((b) => Math.max(0, Number((b / 2).toFixed(8))))}
                  className="px-2.5 py-2 text-xs font-bold text-[#8596A5] hover:text-white hover:bg-[#213743] border-l border-[#213743] transition-colors cursor-pointer border-none disabled:opacity-50"
                >
                  ½
                </button>
                <button
                  type="button"
                  disabled={inGame}
                  onClick={() => setBetAmount((b) => Number((b === 0 ? 10 : b * 2).toFixed(8)))}
                  className="px-2.5 py-2 text-xs font-bold text-[#8596A5] hover:text-white hover:bg-[#213743] border-l border-[#213743] transition-colors cursor-pointer border-none disabled:opacity-50"
                >
                  2×
                </button>
              </div>
            </div>

            {/* Mines Selector */}
            <div>
              <label className="block text-xs font-bold text-[#8596A5] mb-1.5">Mines</label>
              <div className="relative bg-[#0F212E] rounded-md border border-[#2F4553]/40 overflow-hidden">
                <select
                  disabled={inGame}
                  value={minesCount}
                  onChange={(e) => setMinesCount(Number(e.target.value))}
                  className="w-full bg-transparent px-3 py-2.5 text-sm font-bold text-white outline-none cursor-pointer appearance-none disabled:opacity-60"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((n) => (
                    <option key={n} value={n} className="bg-[#0F212E] text-white font-bold">
                      {n}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8596A5] pointer-events-none" />
              </div>
            </div>

            {/* Gems Display */}
            <div>
              <label className="block text-xs font-bold text-[#8596A5] mb-1.5">Gems</label>
              <div className="bg-[#0F212E] rounded-md px-3 py-2.5 text-sm font-bold text-white border border-[#2F4553]/40">
                {remainingGems}
              </div>
            </div>

            {/* Action Buttons: Bet OR Cashout + Random Pick */}
            <div className="pt-1 flex flex-col gap-2">
              {!inGame ? (
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={loading}
                  className="w-full py-3.5 rounded-md bg-[#1475E1] hover:bg-[#0f64c4] text-white font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer border-none"
                >
                  {loading ? "Starting..." : "Bet"}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCashout}
                    disabled={loading || revealed.length === 0}
                    className="w-full py-3 rounded-md bg-[#1475E1] hover:bg-[#0f64c4] text-white font-bold text-sm transition-all shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer border-none"
                  >
                    {loading ? "Processing..." : "Cashout"}
                  </button>

                  <button
                    type="button"
                    onClick={handleRandomPick}
                    disabled={loading}
                    className="w-full py-2.5 rounded-md bg-[#2F4553] hover:bg-[#385364] text-white font-bold text-xs transition-colors cursor-pointer border-none"
                  >
                    Random Pick
                  </button>
                </>
              )}
            </div>

            {/* Total Profit Section */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[#8596A5] mb-1.5">
                <span>Total Profit ({currentMultiplier.toFixed(2)}×)</span>
                <span>${totalProfitNum.toFixed(2)}</span>
              </div>
              <div className="bg-[#0F212E] rounded-md px-3 py-2 flex items-center justify-between border border-[#2F4553]/40">
                <span className="text-white font-mono text-sm font-bold">
                  {totalProfitNum.toFixed(8)}
                </span>
                <div className="w-4 h-4 rounded-full bg-[#26A17B] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">
                  ₮
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right: Mines 5x5 Board Area */}
        <div className="flex-1 bg-[#0F212E] p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center min-h-[580px] md:min-h-[640px] relative">
          
          {/* Optional win/lose notification message toast */}
          {message && (
            <div className={`absolute top-4 px-4 py-1.5 rounded-md text-xs font-bold shadow-lg text-center animate-in fade-in duration-200 z-20 ${
              message.includes('Hit') 
                ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                : 'bg-[#1475E1]/20 text-[#2f8af5] border border-[#1475E1]/40'
            }`}>
              {message}
            </div>
          )}

          {/* 5x5 Mines Grid */}
          <div className="grid grid-cols-5 grid-rows-5 gap-2.5 sm:gap-3 max-w-[530px] w-full aspect-square">
            {Array.from({ length: 25 }, (_, i) => {
              const isRevealed = revealed.includes(i);
              const isMine = mines.includes(i);
              const isHit = hitMine === i;

              return (
                <button
                  key={i}
                  disabled={!inGame || isRevealed || loading}
                  onClick={() => handleTileClick(i)}
                  className={`w-full h-full rounded-lg flex items-center justify-center transition-all duration-150 border-none ${
                    isHit
                      ? "bg-[#071824]"
                      : isRevealed
                      ? "bg-[#071824]"
                      : isMine
                      ? "bg-[#071824] opacity-40 cursor-default"
                      : inGame
                      ? "bg-[#2F4553] hover:bg-[#385364] active:bg-[#253945] shadow-[0_4px_0_#213743] hover:shadow-[0_2px_0_#213743] hover:translate-y-[2px] cursor-pointer"
                      : "bg-[#2F4553] shadow-[0_4px_0_#213743] cursor-default"
                  }`}
                >
                  {isHit ? (
                    <StakeMineIcon isHit={true} className="w-12 h-12 md:w-14 md:h-14 animate-in zoom-in-75 duration-150" />
                  ) : isMine && !isRevealed ? (
                    <StakeMineIcon isHit={false} className="w-10 h-10 md:w-12 md:h-12" />
                  ) : isRevealed ? (
                    <StakeGemIcon className="w-14 h-14 md:w-16 md:h-16 animate-in zoom-in-75 duration-200" />
                  ) : null}
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* Bottom Bar: Controls, Stake Cursive, Fairness Button */}
      <div className="h-12 bg-[#213743] rounded-b-lg border-t border-[#1A2C38]/40 px-4 flex items-center justify-between mt-0.5">
        
        {/* Left: 4 Utility Icons */}
        <div className="flex items-center gap-2">
          <button 
            aria-label="Game settings" 
            className="p-1.5 text-[#8596A5] hover:text-white hover:bg-[#2F4553] rounded transition-colors cursor-pointer border-none"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button 
            aria-label="Theater mode" 
            className="p-1.5 text-[#8596A5] hover:text-white hover:bg-[#2F4553] rounded transition-colors cursor-pointer border-none"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button 
            aria-label="Game statistics" 
            className="p-1.5 text-[#8596A5] hover:text-white hover:bg-[#2F4553] rounded transition-colors cursor-pointer border-none"
          >
            <BarChart2 className="w-4 h-4" />
          </button>
          <button 
            aria-label="Fullscreen" 
            className="p-1.5 text-[#8596A5] hover:text-white hover:bg-[#2F4553] rounded transition-colors cursor-pointer border-none"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Signature Stake Cursive Logo */}
        <div className="flex items-center justify-center select-none">
          <span className="text-xl font-black italic font-serif text-white tracking-tighter drop-shadow">
            Stake
          </span>
        </div>

        {/* Right: Provably Fair Button */}
        <button 
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#2F4553] hover:bg-[#385364] text-[#B1BAD3] hover:text-white text-xs font-bold transition-colors cursor-pointer border-none shadow-sm"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Fairness</span>
        </button>

      </div>

    </div>
  );
}
