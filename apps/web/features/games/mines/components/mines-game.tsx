"use client";

import React, { useState } from "react";
import { startMinesGame, revealMinesTile, cashoutMines } from "../actions";
import { Button } from "@workspace/ui/components/button";
import { 
  Settings, Sliders, BarChart2, Maximize, ShieldCheck, ChevronDown
} from "lucide-react";

/* Stake Diamond / Gem Icon */
function StakeGemIcon({ className = "w-9 h-9 sm:w-12 sm:h-12" }: { className?: string }) {
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

/* Stake Mine / Bomb Icon */
function StakeMineIcon({ className = "w-8 h-8 sm:w-10 sm:h-10", isHit = false }: { className?: string; isHit?: boolean }) {
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
  const [betAmount, setBetAmount] = useState<number>(10);
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

  // Remaining gems count
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
          setMessage(`Won ₹${res.payout.toFixed(2)} (${res.currentMultiplier}x)!`);
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
    const available = Array.from({ length: 25 }, (_, i) => i).filter(
      (idx) => !revealed.includes(idx)
    );
    const randomIdx = available[Math.floor(Math.random() * available.length)];
    if (randomIdx !== undefined) {
      handleTileClick(randomIdx);
    }
  };

  const handleCashout = async () => {
    if (!inGame || revealed.length === 0 || loading) return;

    setLoading(true);
    try {
      const res = await cashoutMines();
      setInGame(false);
      setMines(res.mineIndices);
      setMessage(`Cashed Out ₹${res.payout.toFixed(2)} (${res.multiplier}x)!`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalProfitNum = inGame && revealed.length > 0
    ? (betAmount || 10) * (currentMultiplier - 1)
    : 0;

  return (
    <div className="w-full flex flex-col gap-3 sm:gap-4 bg-[#111420] rounded-xl p-3 sm:p-4 border border-[#1E2335] select-none">
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full">
        
        {/* Right: Mines 5x5 Board Area (On top on mobile) */}
        <div className="order-1 md:order-2 flex-1 bg-[#0B0E17] p-3 sm:p-6 rounded-lg border border-[#1E2335] flex flex-col items-center justify-center min-h-[280px] sm:min-h-[380px] relative">
          
          {message && (
            <div className={`absolute top-3 px-3 py-1 rounded-md text-xs font-bold shadow-lg text-center animate-in fade-in duration-200 z-20 ${
              message.includes('Hit') 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {message}
            </div>
          )}

          {/* 5x5 Mines Grid */}
          <div className="grid grid-cols-5 grid-rows-5 gap-1.5 sm:gap-2 max-w-[340px] sm:max-w-[400px] w-full aspect-square my-auto">
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
                      ? "bg-[#1E1118]"
                      : isRevealed
                      ? "bg-[#111624]"
                      : isMine
                      ? "bg-[#111624] opacity-40 cursor-default"
                      : inGame
                      ? "bg-[#161B2B] hover:bg-[#20273D] active:bg-[#121624] shadow-[0_3px_0_#0F131F] hover:shadow-[0_1px_0_#0F131F] hover:translate-y-[2px] cursor-pointer"
                      : "bg-[#161B2B] shadow-[0_3px_0_#0F131F] cursor-default"
                  }`}
                >
                  {isHit ? (
                    <StakeMineIcon isHit={true} className="w-8 h-8 sm:w-10 sm:h-10 animate-in zoom-in-75 duration-150" />
                  ) : isMine && !isRevealed ? (
                    <StakeMineIcon isHit={false} className="w-7 h-7 sm:w-9 sm:h-9" />
                  ) : isRevealed ? (
                    <StakeGemIcon className="w-8 h-8 sm:w-11 sm:h-11 animate-in zoom-in-75 duration-200" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Left: Controls Panel (Underneath on mobile) */}
        <div className="order-2 md:order-1 w-full md:w-72 bg-[#0B0E17] p-3.5 sm:p-4 rounded-lg border border-[#1E2335] flex flex-col justify-between gap-3">
          
          <div className="flex flex-col gap-3">
            {/* Bet Amount */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-[#8E9BAE] mb-1">
                <span>BET AMOUNT</span>
                <span>₹{(betAmount || 0).toFixed(2)}</span>
              </div>
              <div className="bg-[#111420] rounded-lg flex items-center overflow-hidden border border-[#202538] focus-within:border-[#7C3AED] transition-colors p-1">
                <input
                  type="number"
                  step="any"
                  disabled={inGame}
                  value={betAmount === 0 ? "0.00" : betAmount}
                  onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent px-2 text-sm font-bold text-white outline-none disabled:opacity-75"
                />
                <Button
                  variant="ghost"
                  size="xs"
                  disabled={inGame}
                  onClick={() => setBetAmount((b) => Math.max(1, Math.floor(b / 2)))}
                  className="text-[#8E9BAE] hover:text-white px-2 h-7 text-xs font-semibold rounded"
                >
                  ½
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  disabled={inGame}
                  onClick={() => setBetAmount((b) => Number((b === 0 ? 10 : b * 2).toFixed(2)))}
                  className="text-[#8E9BAE] hover:text-white px-2 h-7 text-xs font-semibold rounded"
                >
                  2×
                </Button>
              </div>
            </div>

            {/* Mines Selector & Gems */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-[#8E9BAE] mb-1">MINES</label>
                <div className="relative bg-[#111420] rounded-lg border border-[#202538] overflow-hidden">
                  <select
                    disabled={inGame}
                    value={minesCount}
                    onChange={(e) => setMinesCount(Number(e.target.value))}
                    className="w-full bg-transparent px-2.5 py-2 text-xs font-bold text-white outline-none cursor-pointer appearance-none disabled:opacity-60"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((n) => (
                      <option key={n} value={n} className="bg-[#111420] text-white">
                        {n}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8E9BAE] pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8E9BAE] mb-1">GEMS</label>
                <div className="bg-[#111420] rounded-lg px-2.5 py-2 text-xs font-bold text-white border border-[#202538]">
                  {remainingGems}
                </div>
              </div>
            </div>

            {/* Total Profit */}
            {inGame && (
              <div className="bg-[#111420] rounded-lg p-2.5 border border-[#202538]">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#8E9BAE]">
                  <span>PROFIT ({currentMultiplier.toFixed(2)}×)</span>
                  <span className="text-emerald-400 font-mono">₹{totalProfitNum.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Action Buttons: Bet OR Cashout */}
            <div className="pt-1 flex flex-col gap-2">
              {!inGame ? (
                <Button
                  onClick={handleStart}
                  disabled={loading}
                  className="w-full h-11 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm tracking-wider uppercase cursor-pointer"
                >
                  {loading ? "Starting..." : "Bet"}
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleCashout}
                    disabled={loading || revealed.length === 0}
                    className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wider uppercase cursor-pointer"
                  >
                    {loading ? "Processing..." : `Cashout (₹${((betAmount || 10) * currentMultiplier).toFixed(2)})`}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={handleRandomPick}
                    disabled={loading}
                    className="w-full text-xs font-semibold text-[#8E9BAE] hover:text-white"
                  >
                    Pick Random Tile
                  </Button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
