"use client";
import { useBetRequest } from "@/features/games/use-bet-request";

import { useState } from "react";
import { placeCoinflipBet } from "../actions";
import { Button } from "@workspace/ui/components/button";

export function CoinflipGame({ gameId }: { gameId: string }) {
  const betRequest = useBetRequest();
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
      const res = await placeCoinflipBet({ requestId: betRequest.requestId({ betAmount, choice }), betAmount, choice });
      betRequest.complete();
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
    <div className="w-full flex flex-col  gap-3  bg-[#242b38] rounded-xl p-3  border border-[#343d4e] select-none">
      {/* Game Visuals (On top on mobile) */}
      <div className="order-1  flex-1 flex flex-col items-center justify-center bg-[#191f2a] rounded-lg border border-[#343d4e] p-5  relative min-h-[180px] ">
        <div className={`w-28 h-28   rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-300 ${
          flipping 
            ? 'animate-spin border-amber-400 bg-amber-500/10' 
            : result?.isWin 
            ? 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_25px_rgba(52,211,153,0.25)]' 
            : result 
            ? 'border-rose-500 bg-rose-500/15' 
            : 'border-[#3a4456] bg-[#202632]'
        }`}>
          <span className="text-xl  font-black text-white tracking-wider uppercase">
            {flipping ? '?' : result ? result.outcome : choice}
          </span>
        </div>

        {result && (
          <div className="mt-4 text-center animate-in zoom-in duration-200">
            <span className={`text-sm  font-extrabold ${result.isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
              {result.isWin ? `+ ₹${result.payout.toFixed(2)} Win!` : 'You Lost'}
            </span>
          </div>
        )}
      </div>

      {/* Controls Sidebar (Underneath visuals on mobile) */}
      <div className="order-2  w-full  flex flex-col gap-3.5 bg-[#191f2a] p-3.5  rounded-lg border border-[#343d4e]">
        <div>
          <label className="text-[11px] font-bold text-[#a9b7cb] uppercase tracking-wider">Bet Amount</label>
          <div className="mt-1.5 flex bg-[#202632] rounded-lg p-1 border border-[#3a4456] focus-within:border-[#7C3AED] transition-colors">
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
                className="text-[#a9b7cb] hover:text-white px-2 h-7 text-xs font-semibold rounded"
              >
                ½
              </Button>
              <Button 
                variant="ghost" 
                size="xs" 
                onClick={() => setBetAmount(b => b * 2)} 
                className="text-[#a9b7cb] hover:text-white px-2 h-7 text-xs font-semibold rounded"
              >
                2×
              </Button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-[#a9b7cb] uppercase tracking-wider">Select Side</label>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => setChoice('heads')}
              className={`h-10 text-xs font-bold transition-all border ${
                choice === 'heads'
                  ? 'bg-[#343d4e] text-white border-[#7C3AED] shadow-xs'
                  : 'bg-[#202632] text-[#a9b7cb] border-[#3a4456] hover:text-white hover:bg-[#161A28]'
              }`}
            >
              Heads
            </Button>
            <Button
              variant="outline"
              onClick={() => setChoice('tails')}
              className={`h-10 text-xs font-bold transition-all border ${
                choice === 'tails'
                  ? 'bg-[#343d4e] text-white border-[#7C3AED] shadow-xs'
                  : 'bg-[#202632] text-[#a9b7cb] border-[#3a4456] hover:text-white hover:bg-[#161A28]'
              }`}
            >
              Tails
            </Button>
          </div>
        </div>

        <div className="bg-[#202632] p-2.5 rounded-lg border border-[#3a4456] flex items-center justify-between text-xs">
          <span className="text-[#a9b7cb] font-semibold">Multiplier:</span>
          <span className="font-sans font-bold text-emerald-400">1.98×</span>
        </div>

        <Button 
          onClick={handleBet} 
          disabled={loading}
          className="mt-2 w-full h-11 rounded-lg bg-[#147be4] hover:bg-[#258af1] text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 tracking-wider uppercase cursor-pointer"
        >
          {loading ? "Flipping..." : "Flip Coin"}
        </Button>
      </div>
    </div>
  );
}
