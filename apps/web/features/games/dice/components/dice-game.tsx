"use client";

import { useState } from "react";
import { placeDiceBet } from "../actions";
import { Button } from "@workspace/ui/components/button";

export function DiceGame({ gameId }: { gameId: string }) {
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(2);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ isWin: boolean; roll: number; payout: number } | null>(null);

  const handleBet = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await placeDiceBet({ betAmount, targetMultiplier: multiplier });
      setResult({
        isWin: res.isWin,
        roll: res.roll,
        payout: res.payout
      });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const winChance = (99 / multiplier).toFixed(2);

  return (
    <div className="w-full flex flex-col md:flex-row gap-3 sm:gap-4 bg-[#111420] rounded-xl p-3 sm:p-4 border border-[#1E2335] select-none">
      {/* Game Visuals (On top on mobile, on right on desktop) */}
      <div className="order-1 md:order-2 flex-1 flex flex-col items-center justify-center bg-[#0B0E17] rounded-lg border border-[#1E2335] p-5 sm:p-6 relative min-h-[200px] sm:min-h-[260px]">
        {result ? (
          <div className="text-center animate-in zoom-in duration-300">
            <div className={`text-5xl sm:text-6xl font-black mb-2 ${result.isWin ? 'text-emerald-400' : 'text-red-500'}`}>
              {result.roll.toFixed(2)}
            </div>
            <div className={`text-sm sm:text-base font-bold ${result.isWin ? 'text-emerald-400' : 'text-[#64748B]'}`}>
              {result.isWin ? `+ ₹${result.payout.toFixed(2)}` : 'You Lose'}
            </div>
          </div>
        ) : (
          <div className="text-center text-[#64748B]">
            <div className="text-5xl sm:text-6xl font-black mb-2 text-white/80">50.00</div>
            <p className="text-xs font-medium">Roll under {winChance} to win</p>
          </div>
        )}

        <div className="w-full max-w-sm mt-6 sm:mt-8 px-2">
          <div className="h-3 rounded-full bg-[#161A28] w-full overflow-hidden relative border border-[#202538]">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-emerald-500 transition-all duration-200"
              style={{ width: `${winChance}%` }}
            />
            <div 
              className="absolute right-0 top-0 bottom-0 bg-rose-500 transition-all duration-200"
              style={{ width: `${100 - Number(winChance)}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] font-bold text-[#64748B]">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Controls Sidebar (Underneath visuals on mobile, on left on desktop) */}
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
          <label className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-wider">Multiplier</label>
          <div className="mt-1.5 bg-[#111420] rounded-lg p-1.5 border border-[#202538] focus-within:border-[#7C3AED] transition-colors">
            <input 
              type="number" 
              step="0.01"
              value={multiplier} 
              onChange={(e) => setMultiplier(Math.max(1.01, Number(e.target.value)))}
              className="w-full bg-transparent px-2 text-sm font-bold text-white outline-none"
            />
          </div>
        </div>

        <Button 
          onClick={handleBet} 
          disabled={loading}
          className="mt-2 w-full h-11 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 tracking-wider uppercase cursor-pointer"
        >
          {loading ? "Rolling..." : "Bet"}
        </Button>
      </div>
    </div>
  );
}
