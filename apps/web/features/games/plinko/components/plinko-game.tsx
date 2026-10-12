"use client";

import { useState } from "react";
import { dropPlinkoBall } from "../actions";
import { Button } from "@workspace/ui/components/button";

const MULTIPLIERS = [16, 9, 2, 1.4, 0.4, 0.2, 0.4, 1.4, 2, 9, 16];

export function PlinkoGame({ gameId }: { gameId: string }) {
  const [betAmount, setBetAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [activeBucket, setActiveBucket] = useState<number | null>(null);
  const [result, setResult] = useState<{ isWin: boolean; multiplier: number; payout: number } | null>(null);

  const handleDrop = async () => {
    setLoading(true);
    setActiveBucket(null);
    setResult(null);

    try {
      const res = await dropPlinkoBall({ betAmount });
      setTimeout(() => {
        setActiveBucket(res.bucketIndex);
        setResult(res);
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      alert(err.message);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-3 sm:gap-4 bg-[#111420] rounded-xl p-3 sm:p-4 border border-[#1E2335] select-none">
      {/* Game Visuals (On top on mobile) */}
      <div className="order-1 md:order-2 flex-1 flex flex-col items-center justify-center bg-[#0B0E17] rounded-lg border border-[#1E2335] p-4 sm:p-6 relative min-h-[260px] sm:min-h-[340px]">
        {/* Animated ball dropping indicator */}
        {loading && (
          <div className="absolute top-4 sm:top-6 w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_12px_#facc15] animate-bounce" />
        )}

        {/* Pin Pyramid */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 my-auto pt-4">
          {Array.from({ length: 8 }, (_, row) => (
            <div key={row} className="flex justify-center gap-3 sm:gap-4">
              {Array.from({ length: row + 3 }, (_, col) => (
                <div key={col} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/70 shadow-xs" />
              ))}
            </div>
          ))}
        </div>

        {/* Multiplier Buckets */}
        <div className="grid grid-cols-11 gap-0.5 sm:gap-1.5 w-full max-w-[420px] mt-4 sm:mt-6">
          {MULTIPLIERS.map((mult, i) => {
            const isHit = activeBucket === i;
            let color = "bg-amber-600/20 text-amber-400 border-amber-600/30";
            if (mult >= 9) color = "bg-rose-600/20 text-rose-400 border-rose-500/30";
            else if (mult >= 2) color = "bg-orange-500/20 text-orange-300 border-orange-500/30";
            else if (mult < 1) color = "bg-indigo-600/20 text-indigo-300 border-indigo-500/30";

            return (
              <div 
                key={i} 
                className={`py-1 sm:py-1.5 px-0.5 rounded text-center border text-[9px] sm:text-[11px] font-black transition-all ${color} ${
                  isHit ? "scale-110 ring-2 ring-white shadow-lg -translate-y-1 bg-white text-black font-black" : ""
                }`}
              >
                {mult}x
              </div>
            );
          })}
        </div>

        {result && (
          <div className="mt-3 text-center animate-in zoom-in duration-200">
            <span className={`text-xs sm:text-sm font-extrabold ${result.isWin ? 'text-emerald-400' : 'text-[#64748B]'}`}>
              {result.isWin ? `Won ₹${result.payout.toFixed(2)} (${result.multiplier}x)` : `${result.multiplier}x multiplier`}
            </span>
          </div>
        )}
      </div>

      {/* Controls Sidebar (Underneath visuals on mobile) */}
      <div className="order-2 md:order-1 w-full md:w-72 flex flex-col gap-3.5 bg-[#0B0E17] p-3.5 sm:p-4 rounded-lg border border-[#1E2335]">
        <div>
          <label className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-wider">Bet Amount</label>
          <div className="mt-1.5 flex bg-[#111420] rounded-lg p-1 border border-[#202538] focus-within:border-[#7C3AED] transition-colors">
            <input 
              type="number" 
              value={betAmount} 
              onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
              className="w-full bg-transparent px-2 text-sm font-bold text-white outline-none"
            />
            <div className="flex items-center gap-0.5">
              <Button 
                variant="ghost" 
                size="xs" 
                onClick={() => setBetAmount(b => Math.max(1, Math.floor(b / 2)))} 
                className="text-[#8E9BAE] hover:text-white px-2 h-7 text-xs font-semibold rounded"
              >
                ½
              </Button>
              <Button 
                variant="ghost" 
                size="xs" 
                onClick={() => setBetAmount(b => b * 2)} 
                className="text-[#8E9BAE] hover:text-white px-2 h-7 text-xs font-semibold rounded"
              >
                2×
              </Button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-wider">Risk Level</label>
          <div className="mt-1.5 bg-[#111420] rounded-lg p-2.5 border border-[#202538] text-xs font-bold text-white">
            Medium (10 Rows)
          </div>
        </div>

        <Button 
          onClick={handleDrop} 
          disabled={loading}
          className="mt-2 w-full h-11 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 tracking-wider uppercase cursor-pointer"
        >
          {loading ? "Dropping..." : "Drop Ball"}
        </Button>
      </div>
    </div>
  );
}
