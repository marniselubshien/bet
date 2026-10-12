"use client";

import { useState } from "react";
import { placeLimboBet } from "../actions";
import { Rocket } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export function LimboGame({ gameId }: { gameId: string }) {
  const [betAmount, setBetAmount] = useState(10);
  const [targetMultiplier, setTargetMultiplier] = useState(2.00);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ isWin: boolean; roll: number; payout: number; profit: number } | null>(null);

  const winChance = (99 / targetMultiplier).toFixed(2);

  const handleBet = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await placeLimboBet({ betAmount, targetMultiplier });
      setResult(res);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-3 sm:gap-4 bg-[#111420] rounded-xl p-3 sm:p-4 border border-[#1E2335] select-none">
      {/* Game Visuals (On top on mobile) */}
      <div className="order-1 md:order-2 flex-1 flex flex-col items-center justify-center bg-[#0B0E17] rounded-lg border border-[#1E2335] p-5 sm:p-6 relative min-h-[180px] sm:min-h-[240px]">
        {result ? (
          <div className="text-center animate-in zoom-in duration-300">
            <div className={`text-6xl sm:text-7xl font-black mb-2 tracking-tighter ${result.isWin ? 'text-emerald-400' : 'text-rose-500'}`}>
              {result.roll.toFixed(2)}x
            </div>
            <div className={`text-sm sm:text-base font-bold ${result.isWin ? 'text-emerald-400' : 'text-[#64748B]'}`}>
              {result.isWin ? `+ ₹${result.payout.toFixed(2)} (${targetMultiplier}x)` : 'Busted'}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Rocket className="w-12 h-12 text-[#64748B] mx-auto mb-3 animate-bounce" />
            <div className="text-5xl sm:text-6xl font-black text-white/80 mb-1">1.00x</div>
            <p className="text-xs text-[#64748B]">Target: {targetMultiplier.toFixed(2)}x</p>
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
          <label className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-wider">Target Multiplier</label>
          <div className="mt-1.5 bg-[#111420] rounded-lg p-1.5 border border-[#202538] flex items-center focus-within:border-[#7C3AED] transition-colors">
            <input 
              type="number" 
              step="0.05"
              min="1.01"
              max="1000000"
              value={targetMultiplier} 
              onChange={(e) => setTargetMultiplier(Math.max(1.01, Number(e.target.value)))}
              className="w-full bg-transparent px-2 text-sm font-bold text-white outline-none"
            />
            <span className="text-xs font-bold text-[#64748B] mr-2">X</span>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-wider">Win Chance</label>
          <div className="mt-1.5 bg-[#111420] rounded-lg p-2 border border-[#202538]">
            <span className="text-xs font-bold text-[#8E9BAE]">{winChance}%</span>
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
