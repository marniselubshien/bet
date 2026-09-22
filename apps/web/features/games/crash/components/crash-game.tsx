"use client";

import { useState, useEffect, useRef } from "react";
import { placeCrashBet, resolveCrashGame } from "../actions";
import { Rocket } from "lucide-react";

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

  // Run the tick loop when state is 'running'
  useEffect(() => {
    if (gameState !== 'running') return;

    const tick = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      // Exponential curve: 1 * e^(0.06 * elapsed^1.4)
      const mult = 1.0 + Math.pow(elapsed * 0.55, 1.8);

      if (mult >= crashPoint) {
        // Crashed
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

      // Check auto cashout
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

  const currentProfit = Number((betAmount * currentMultiplier).toFixed(2));

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-[#1A2C38] rounded-2xl p-6 border border-[#2F4553] shadow-2xl">
      {/* Controls Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-5 bg-[#0F212E] p-6 rounded-xl border border-[#2F4553]">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bet Amount</label>
          <div className="mt-2 flex bg-[#1A2C38] rounded-md p-1 border border-[#2F4553]">
            <input 
              type="number" 
              disabled={gameState === 'running'}
              value={betAmount} 
              onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
              className="w-full bg-transparent px-3 text-sm font-bold text-white outline-none disabled:opacity-50"
            />
            <div className="flex gap-1">
              <button 
                disabled={gameState === 'running'}
                onClick={() => setBetAmount(b => Math.max(1, Math.floor(b / 2)))} 
                className="bg-[#2F4553] px-3 py-1 text-xs font-bold rounded text-white hover:bg-[#3d5a6c] disabled:opacity-50"
              >
                1/2
              </button>
              <button 
                disabled={gameState === 'running'}
                onClick={() => setBetAmount(b => b * 2)} 
                className="bg-[#2F4553] px-3 py-1 text-xs font-bold rounded text-white hover:bg-[#3d5a6c] disabled:opacity-50"
              >
                2x
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Auto Cashout (Optional)</label>
          <div className="mt-2 bg-[#1A2C38] rounded-md p-2 border border-[#2F4553] flex items-center">
            <input 
              type="number" 
              step="0.1"
              min="1.01"
              disabled={gameState === 'running'}
              value={autoCashout} 
              onChange={(e) => setAutoCashout(Math.max(1.01, Number(e.target.value)))}
              className="w-full bg-transparent px-2 text-sm font-bold text-white outline-none disabled:opacity-50"
            />
            <span className="text-xs font-bold text-slate-400 mr-2">X</span>
          </div>
        </div>

        {gameState === 'running' ? (
          <button 
            onClick={handleCashout} 
            className="mt-auto w-full rounded-md bg-[#1475E1] hover:bg-[#0f64c4] py-4 text-base font-bold text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-95 tracking-wide uppercase"
          >
            Cashout ${currentProfit} ({currentMultiplier.toFixed(2)}x)
          </button>
        ) : (
          <button 
            onClick={handleStart} 
            disabled={loading}
            className="mt-auto w-full rounded-md bg-[#1475E1] hover:bg-[#0f64c4] py-4 text-base font-bold text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 tracking-wide uppercase"
          >
            {loading ? "Starting..." : "Bet"}
          </button>
        )}
      </div>

      {/* Game Visuals (Rocket Arena) */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0F212E] rounded-xl border border-[#2F4553] p-8 relative min-h-[380px] overflow-hidden">
        {/* Background Grid & Particles */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Central Display */}
        <div className="z-10 text-center">
          <div className={`text-7xl font-black mb-3 tracking-tight font-mono transition-colors ${
            gameState === 'crashed'
              ? 'text-red-500 animate-pulse'
              : gameState === 'cashed_out'
              ? 'text-[#00E701]'
              : gameState === 'running'
              ? 'text-white'
              : 'text-slate-500'
          }`}>
            {currentMultiplier.toFixed(2)}x
          </div>

          {gameState === 'crashed' && (
            <div className="text-lg font-black text-red-400 animate-in zoom-in duration-200">
              CRASHED @ {crashPoint.toFixed(2)}x
            </div>
          )}

          {gameState === 'cashed_out' && (
            <div className="text-lg font-black text-[#00E701] animate-in zoom-in duration-200">
              Cashed Out @ {cashedOutAt}x! Won ${payout.toFixed(2)}
            </div>
          )}

          {gameState === 'running' && (
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400">
              <Rocket className="w-5 h-5 text-red-500 animate-bounce" />
              Flying higher...
            </div>
          )}

          {gameState === 'idle' && (
            <p className="text-sm font-bold text-slate-400">Place bet to launch rocket</p>
          )}
        </div>
      </div>
    </div>
  );
}
