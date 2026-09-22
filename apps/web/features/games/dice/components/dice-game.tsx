"use client";

import { useState } from "react";
import { placeDiceBet } from "../actions";

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
    <div className="flex flex-col md:flex-row gap-6 bg-zinc-900 rounded-2xl p-6 ring-1 ring-white/10">
      {/* Controls Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-6 bg-zinc-950/50 p-6 rounded-xl border border-white/5">
        
        <div>
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Bet Amount</label>
          <div className="mt-2 flex bg-zinc-900 rounded-md p-1 ring-1 ring-white/10">
            <input 
              type="number" 
              value={betAmount} 
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="w-full bg-transparent px-3 text-sm font-bold text-white outline-none"
            />
            <div className="flex gap-1">
              <button onClick={() => setBetAmount(b => b / 2)} className="bg-zinc-800 px-3 py-1 text-xs font-bold rounded hover:bg-zinc-700">1/2</button>
              <button onClick={() => setBetAmount(b => b * 2)} className="bg-zinc-800 px-3 py-1 text-xs font-bold rounded hover:bg-zinc-700">2x</button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Multiplier</label>
          <div className="mt-2 bg-zinc-900 rounded-md p-1 ring-1 ring-white/10">
            <input 
              type="number" 
              step="0.01"
              value={multiplier} 
              onChange={(e) => setMultiplier(Number(e.target.value))}
              className="w-full bg-transparent px-3 py-2 text-sm font-bold text-white outline-none"
            />
          </div>
        </div>

        <button 
          onClick={handleBet} 
          disabled={loading}
          className="mt-auto w-full rounded-md bg-[#1475E1] hover:bg-[#0f64c4] py-4 text-base font-bold text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 tracking-wide uppercase"
        >
          {loading ? "Rolling..." : "Bet"}
        </button>
      </div>

      {/* Game Visuals */}
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 rounded-xl border border-white/5 p-8 relative min-h-[300px]">
        {result ? (
          <div className="text-center animate-in zoom-in duration-300">
            <div className={`text-6xl font-black mb-4 ${result.isWin ? 'text-green-500' : 'text-red-500'}`}>
              {result.roll.toFixed(2)}
            </div>
            <div className={`text-xl font-bold ${result.isWin ? 'text-green-400' : 'text-zinc-500'}`}>
              {result.isWin ? `+ $${result.payout.toFixed(2)}` : 'You Lose'}
            </div>
          </div>
        ) : (
          <div className="text-center text-zinc-600">
            <div className="text-6xl font-black mb-4">50.00</div>
            <p>Roll under {winChance} to win</p>
          </div>
        )}

        <div className="absolute bottom-6 inset-x-12">
          <div className="h-4 rounded-full bg-zinc-800 w-full overflow-hidden relative">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-green-500"
              style={{ width: `${winChance}%` }}
            />
            <div 
              className="absolute right-0 top-0 bottom-0 bg-red-500"
              style={{ width: `${100 - Number(winChance)}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs font-bold text-zinc-500">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
