"use client";

import { useState } from "react";
import { placeCoinflipBet } from "../actions";
import { Coins } from "lucide-react";

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
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Side</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => setChoice('heads')}
              className={`py-3 rounded-lg font-bold text-sm transition-all ${
                choice === 'heads'
                  ? 'bg-primary text-white border-2 border-blue-400 shadow-md'
                  : 'bg-[#1A2C38] text-slate-300 border border-[#2F4553] hover:bg-[#253947]'
              }`}
            >
              Heads
            </button>
            <button
              onClick={() => setChoice('tails')}
              className={`py-3 rounded-lg font-bold text-sm transition-all ${
                choice === 'tails'
                  ? 'bg-primary text-white border-2 border-blue-400 shadow-md'
                  : 'bg-[#1A2C38] text-slate-300 border border-[#2F4553] hover:bg-[#253947]'
              }`}
            >
              Tails
            </button>
          </div>
        </div>

        <div className="bg-[#1A2C38] p-3 rounded-lg border border-[#2F4553] text-center">
          <span className="text-xs text-slate-400 font-bold">Multiplier: </span>
          <span className="text-sm font-black text-green-400">1.98x</span>
        </div>

        <button 
          onClick={handleBet} 
          disabled={loading}
          className="mt-auto w-full rounded-md bg-[#1475E1] hover:bg-[#0f64c4] py-4 text-base font-bold text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 tracking-wide uppercase"
        >
          {loading ? "Flipping..." : "Flip Coin"}
        </button>
      </div>

      {/* Game Visuals */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0F212E] rounded-xl border border-[#2F4553] p-8 relative min-h-[360px]">
        <div className={`w-36 h-36 rounded-full flex items-center justify-center border-4 shadow-2xl transition-all duration-300 ${
          flipping 
            ? 'animate-spin border-yellow-400 bg-yellow-500/20' 
            : result?.isWin 
            ? 'border-green-400 bg-green-500/20 shadow-[0_0_30px_rgba(74,222,128,0.3)]' 
            : result 
            ? 'border-red-500 bg-red-500/20' 
            : 'border-yellow-500 bg-yellow-500/10'
        }`}>
          <div className="text-center">
            <Coins className={`w-16 h-16 mx-auto ${result?.isWin ? 'text-green-400' : 'text-yellow-400'}`} />
            <div className="text-xs font-black uppercase tracking-wider mt-1 text-white">
              {flipping ? "Flipping" : result ? result.outcome : choice}
            </div>
          </div>
        </div>

        {result && !flipping && (
          <div className="mt-6 text-center animate-in zoom-in duration-200">
            <div className={`text-2xl font-black ${result.isWin ? 'text-[#00E701]' : 'text-red-500'}`}>
              {result.isWin ? `Won $${result.payout.toFixed(2)}!` : `It landed on ${result.outcome}. You lost.`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
