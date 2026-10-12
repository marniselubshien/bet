"use client";

import { useState, useEffect, useRef } from "react";
import { placeCrashBet, resolveCrashGame } from "../actions";
import { Rocket } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export function CrashGame({ gameId }: { gameId: string }) {
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashout, setAutoCashout] = useState(2.00);
  const [gameState, setGameState] = useState<'idle' | 'running' | 'crashed' | 'cashed_out'>('idle');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [crashPoint, setCrashPoint] = useState(0);
  const [cashedOutAt, setCashedOutAt] = useState<number | null>(null);
  const [payout, setPayout] = useState(0);
  const [loading, setLoading] = useState(false);

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const handleStart = async () => {
    setLoading(true);
    setCashedOutAt(null);
    setPayout(0);
    setCurrentMultiplier(1.00);

    try {
      const res = await placeCrashBet({ betAmount, autoCashout });
      setCrashPoint(res.crashPoint);
      setGameState('running');
      startTimeRef.current = performance.now();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCashout = async () => {
    if (gameState !== 'running') return;
    const finalMult = Number(currentMultiplier.toFixed(2));
    setGameState('cashed_out');
    setCashedOutAt(finalMult);
    const winPayout = Number((betAmount * finalMult).toFixed(2));
    setPayout(winPayout);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    try {
      await resolveCrashGame({
        betAmount,
        cashoutMultiplier: finalMult,
        crashPoint,
        isWin: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (gameState !== 'running') return;

    const tick = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      const mult = 1.0 + Math.pow(elapsed * 0.55, 1.8);

      if (mult >= crashPoint) {
        setCurrentMultiplier(crashPoint);
        setGameState('crashed');
        resolveCrashGame({
          betAmount,
          cashoutMultiplier: 0,
          crashPoint,
          isWin: false,
        });
        return;
      }

      if (autoCashout > 1 && mult >= autoCashout) {
        setCurrentMultiplier(autoCashout);
        setGameState('cashed_out');
        setCashedOutAt(autoCashout);
        const winPayout = Number((betAmount * autoCashout).toFixed(2));
        setPayout(winPayout);
        resolveCrashGame({
          betAmount,
          cashoutMultiplier: autoCashout,
          crashPoint,
          isWin: true,
        });
        return;
      }

      setCurrentMultiplier(mult);
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, crashPoint, autoCashout, betAmount]);

  const currentProfit = Number(((betAmount * currentMultiplier) - betAmount).toFixed(2));

  return (
    <div className="w-full flex flex-col md:flex-row gap-3 sm:gap-4 bg-[#111420] rounded-xl p-3 sm:p-4 border border-[#1E2335] select-none">
      {/* Game Visuals (On top on mobile) */}
      <div className="order-1 md:order-2 flex-1 flex flex-col items-center justify-center bg-[#0B0E17] rounded-lg border border-[#1E2335] p-5 sm:p-6 relative min-h-[200px] sm:min-h-[260px] overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Central Display */}
        <div className="z-10 text-center">
          <div className={`text-6xl sm:text-7xl font-black mb-2 tracking-tight font-mono transition-colors ${
            gameState === 'crashed'
              ? 'text-rose-500'
              : gameState === 'cashed_out'
              ? 'text-emerald-400'
              : 'text-white'
          }`}>
            {currentMultiplier.toFixed(2)}x
          </div>

          {gameState === 'crashed' && (
            <div className="text-sm font-bold text-rose-500 tracking-wider uppercase animate-bounce">
              CRASHED
            </div>
          )}

          {gameState === 'cashed_out' && (
            <div className="text-sm font-bold text-emerald-400 tracking-wider">
              CASHED OUT ₹{payout.toFixed(2)} ({cashedOutAt}x)
            </div>
          )}

          {gameState === 'running' && (
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-400">
              <Rocket className="w-4 h-4 animate-pulse" />
              <span>FLYING...</span>
            </div>
          )}

          {gameState === 'idle' && (
            <p className="text-xs text-[#64748B]">Set your bet and cashout before the crash</p>
          )}
        </div>
      </div>

      {/* Controls Sidebar (Underneath visuals on mobile) */}
      <div className="order-2 md:order-1 w-full md:w-72 flex flex-col gap-3.5 bg-[#0B0E17] p-3.5 sm:p-4 rounded-lg border border-[#1E2335]">
        <div>
          <label className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-wider">Bet Amount</label>
          <div className="mt-1.5 flex bg-[#111420] rounded-lg p-1 border border-[#202538] focus-within:border-[#7C3AED] transition-colors">
            <input 
              type="number" 
              disabled={gameState === 'running'}
              value={betAmount} 
              onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
              className="w-full bg-transparent px-2 text-sm font-bold text-white outline-none disabled:opacity-50"
            />
            <div className="flex items-center gap-0.5">
              <Button 
                variant="ghost" 
                size="xs" 
                disabled={gameState === 'running'}
                onClick={() => setBetAmount(b => Math.max(1, Math.floor(b / 2)))} 
                className="text-[#8E9BAE] hover:text-white px-2 h-7 text-xs font-semibold rounded disabled:opacity-50"
              >
                ½
              </Button>
              <Button 
                variant="ghost" 
                size="xs" 
                disabled={gameState === 'running'}
                onClick={() => setBetAmount(b => b * 2)} 
                className="text-[#8E9BAE] hover:text-white px-2 h-7 text-xs font-semibold rounded disabled:opacity-50"
              >
                2×
              </Button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-wider">Auto Cashout</label>
          <div className="mt-1.5 bg-[#111420] rounded-lg p-1.5 border border-[#202538] flex items-center focus-within:border-[#7C3AED] transition-colors">
            <input 
              type="number" 
              step="0.1"
              min="1.01"
              disabled={gameState === 'running'}
              value={autoCashout} 
              onChange={(e) => setAutoCashout(Math.max(1.01, Number(e.target.value)))}
              className="w-full bg-transparent px-2 text-sm font-bold text-white outline-none disabled:opacity-50"
            />
            <span className="text-xs font-bold text-[#64748B] mr-2">X</span>
          </div>
        </div>

        {gameState === 'running' ? (
          <Button 
            onClick={handleCashout} 
            className="mt-2 w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98] tracking-wider uppercase cursor-pointer"
          >
            Cashout ₹{(betAmount + currentProfit).toFixed(2)} ({currentMultiplier.toFixed(2)}x)
          </Button>
        ) : (
          <Button 
            onClick={handleStart} 
            disabled={loading}
            className="mt-2 w-full h-11 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 tracking-wider uppercase cursor-pointer"
          >
            {loading ? "Starting..." : "Bet"}
          </Button>
        )}
      </div>
    </div>
  );
}
