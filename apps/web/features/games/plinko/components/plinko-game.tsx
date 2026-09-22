"use client";

import { useState } from "react";
import { dropPlinkoBall } from "../actions";

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
    <div className="flex flex-col md:flex-row gap-6 bg-[#1A2C38] rounded-2xl p-6 border border-[#2F4553] shadow-2xl">
      {/* Controls Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-6 bg-[#0F212E] p-6 rounded-xl border border-[#2F4553]">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bet Amount</label>
          <div className="mt-2 flex bg-[#1A2C38] rounded-md p-1 border border-[#2F4553]">
            <input 
              type="number" 
              value={betAmount} 
              onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
              className="w-full bg-transparent px-3 text-sm font-bold text-white outline-none"
            />
            <div className="flex gap-1">
              <button onClick={() => setBetAmount(b => Math.max(1, Math.floor(b / 2)))} className="bg-[#2F4553] px-3 py-1 text-xs font-bold rounded text-white hover:bg-[#3d5a6c]">1/2</button>
              <button onClick={() => setBetAmount(b => b * 2)} className="bg-[#2F4553] px-3 py-1 text-xs font-bold rounded text-white hover:bg-[#3d5a6c]">2x</button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Risk Level</label>
          <div className="mt-2 bg-[#1A2C38] rounded-md p-2 border border-[#2F4553] text-sm font-bold text-white">
            Medium (10 Rows)
          </div>
        </div>

        <button 
          onClick={handleDrop} 
          disabled={loading}
          className="mt-auto w-full rounded-md bg-[#1475E1] hover:bg-[#0f64c4] py-4 text-base font-bold text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 tracking-wide uppercase"
        >
          {loading ? "Dropping Ball..." : "Bet"}
        </button>
      </div>

      {/* Game Visuals (Plinko Pyramid & Buckets) */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0F212E] rounded-xl border border-[#2F4553] p-8 relative min-h-[420px]">
        {/* Animated ball dropping indicator */}
        {loading && (
          <div className="absolute top-8 w-4 h-4 rounded-full bg-yellow-400 shadow-[0_0_12px_#facc15] animate-bounce" />
        )}

        {/* Pin Pyramid */}
        <div className="flex flex-col items-center gap-3 my-auto">
          {Array.from({ length: 9 }, (_, row) => (
            <div key={row} className="flex justify-center gap-4">
              {Array.from({ length: row + 3 }, (_, col) => (
                <div key={col} className="w-2 h-2 rounded-full bg-white/70 shadow-sm" />
              ))}
            </div>
          ))}
        </div>

        {/* Multiplier Buckets */}
        <div className="grid grid-cols-11 gap-1.5 w-full max-w-[500px] mt-6">
          {MULTIPLIERS.map((mult, i) => {
            const isHit = activeBucket === i;
            let color = "bg-yellow-600/30 text-yellow-400 border-yellow-600/50";
            if (mult >= 9) color = "bg-red-600/40 text-red-400 border-red-500/60";
            else if (mult >= 2) color = "bg-orange-500/40 text-orange-300 border-orange-500/60";
            else if (mult < 1) color = "bg-blue-600/30 text-blue-300 border-blue-500/40";

            return (
              <div 
                key={i} 
                className={`py-2 px-1 rounded text-center border text-[10px] sm:text-xs font-black transition-all ${color} ${
                  isHit ? "scale-110 ring-2 ring-white shadow-xl -translate-y-1 bg-white text-black font-black" : ""
                }`}
              >
                {mult}x
              </div>
            );
          })}
        </div>

        {result && (
          <div className="mt-4 text-center animate-in zoom-in duration-200">
            <span className={`text-lg font-black ${result.isWin ? "text-[#00E701]" : "text-slate-400"}`}>
              {result.multiplier}x Multiplier! Payout: ${result.payout.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
