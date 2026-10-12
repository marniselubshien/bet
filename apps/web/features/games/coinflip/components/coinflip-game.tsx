"use client";

import { useState } from "react";
import { placeCoinflipBet } from "../actions";
import { Button } from "@workspace/ui/components/button";

export function CoinflipGame({ gameId }: { gameId: string }) {
  const [betAmount, setBetAmount] = useState(10);
  const [choice, setChoice] = useState<'heads' | 'tails'>('heads');
  const [loading, setLoading] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<{ isWin: boolean; outcome: 'heads' | 'tails'; payout: number } | null>(null);

  const handleBet = async () => {
    setLoading(true);
    setFlipping(true);
    setResult(null);

    try {
      const res = await placeCoinflipBet({ betAmount, choice });
      setTimeout(() => {
        setFlipping(false);
        setResult(res);
        setLoading(false);
      }, 800);
    } catch (err: any) {
      setFlipping(false);
      setLoading(false);
      alert(err.message);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-3 sm:gap-4 bg-[#111420] rounded-xl p-3 sm:p-4 border border-[#1E2335] select-none">
      {/* Game Visuals (On top on mobile) */}
      <div className="order-1 md:order-2 flex-1 flex flex-col items-center justify-center bg-[#0B0E17] rounded-lg border border-[#1E2335] p-5 sm:p-6 relative min-h-[180px] sm:min-h-[240px]">
        <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-300 ${
          flipping 
            ? 'animate-spin border-amber-400 bg-amber-500/10' 
            : result?.isWin 
            ? 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_25px_rgba(52,211,153,0.25)]' 
            : result 
            ? 'border-rose-500 bg-rose-500/15' 
            : 'border-[#202538] bg-[#111420]'
        }`}>
          <span className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase">
            {flipping ? '?' : result ? result.outcome : choice}
          </span>
        </div>

        {result && (
          <div className="mt-4 text-center animate-in zoom-in duration-200">
            <span className={`text-sm sm:text-base font-extrabold ${result.isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
              {result.isWin ? `+ ₹${result.payout.toFixed(2)} Win!` : 'You Lost'}
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
          <label className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-wider">Select Side</label>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => setChoice('heads')}
              className={`h-10 text-xs font-bold transition-all border ${
                choice === 'heads'
                  ? 'bg-[#1E2335] text-white border-[#7C3AED] shadow-xs'
                  : 'bg-[#111420] text-[#8E9BAE] border-[#202538] hover:text-white hover:bg-[#161A28]'
              }`}
            >
              Heads
            </Button>
            <Button
              variant="outline"
              onClick={() => setChoice('tails')}
              className={`h-10 text-xs font-bold transition-all border ${
                choice === 'tails'
                  ? 'bg-[#1E2335] text-white border-[#7C3AED] shadow-xs'
                  : 'bg-[#111420] text-[#8E9BAE] border-[#202538] hover:text-white hover:bg-[#161A28]'
              }`}
            >
              Tails
            </Button>
          </div>
        </div>

        <div className="bg-[#111420] p-2.5 rounded-lg border border-[#202538] flex items-center justify-between text-xs">
          <span className="text-[#8E9BAE] font-semibold">Multiplier:</span>
          <span className="font-mono font-bold text-emerald-400">1.98×</span>
        </div>

        <Button 
          onClick={handleBet} 
          disabled={loading}
          className="mt-2 w-full h-11 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 tracking-wider uppercase cursor-pointer"
        >
          {loading ? "Flipping..." : "Flip Coin"}
        </Button>
      </div>
    </div>
  );
}
