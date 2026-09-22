"use client";

import { useState } from "react";
import { placeLimboBet } from "../actions";
import { Rocket } from "lucide-react";

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
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Multiplier</label>
          <div className="mt-2 bg-[#1A2C38] rounded-md p-2 border border-[#2F4553] flex items-center">
            <input 
              type="number" 
              step="0.05"
              min="1.01"
              max="1000000"
              value={targetMultiplier} 
              onChange={(e) => setTargetMultiplier(Math.max(1.01, Number(e.target.value)))}
              className="w-full bg-transparent px-2 text-sm font-bold text-white outline-none"
            />
            <span className="text-xs font-bold text-slate-400 mr-2">X</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Win Chance</label>
          <div className="mt-2 bg-[#1A2C38] rounded-md p-2 border border-[#2F4553] flex items-center">
            <input 
              type="text" 
              readOnly
              value={`${winChance}%`}
              className="w-full bg-transparent px-2 text-sm font-bold text-slate-400 outline-none cursor-default"
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
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0F212E] rounded-xl border border-[#2F4553] p-8 relative min-h-[360px]">
        {result ? (
          <div className="text-center animate-in zoom-in duration-300">
            <div className={`text-7xl font-black mb-3 tracking-tighter ${result.isWin ? 'text-[#00E701]' : 'text-red-500'}`}>
              {result.roll.toFixed(2)}x
            </div>
            <div className={`text-xl font-bold ${result.isWin ? 'text-green-400' : 'text-slate-500'}`}>
              {result.isWin ? `+ $${result.payout.toFixed(2)} (${targetMultiplier}x)` : 'You Busted'}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Rocket className="w-16 h-16 text-slate-600 mx-auto mb-4 animate-bounce" />
            <div className="text-6xl font-black text-slate-500 mb-2">1.00x</div>
            <p className="text-sm font-bold text-slate-400">Aim above {targetMultiplier}x to win!</p>
          </div>
        )}
      </div>
    </div>
  );
}
