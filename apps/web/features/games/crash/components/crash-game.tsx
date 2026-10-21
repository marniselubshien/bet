"use client"

import { useEffect, useRef, useState } from "react"
import {
  Activity,
  ArrowUpRight,
  Check,
  ChevronRight,
  History,
} from "lucide-react"
import { useBetRequest } from "@/features/games/use-bet-request"
import { placeCrashBet, resolveCrashGame, resumeCrashGame } from "../actions"
import styles from "./crash.module.css"
import { CrashChart } from "./crash-chart"

type GameState = "idle" | "running" | "crashed" | "cashed_out"
type Result = Awaited<ReturnType<typeof resolveCrashGame>>

export function CrashGame({ gameId }: { gameId: string }) {
  const betRequest = useBetRequest()
  const [betAmount, setBetAmount] = useState(10)
  const [autoCashout, setAutoCashout] = useState(2)
  const [gameState, setGameState] = useState<GameState>("idle")
  const [currentMultiplier, setCurrentMultiplier] = useState(1)
  const [roundId, setRoundId] = useState("")
  const [payout, setPayout] = useState(0)
  const [loading, setLoading] = useState(false)
  const [recovering, setRecovering] = useState(true)
  const [error, setError] = useState("")
  const [connection, setConnection] = useState(true)
  const [history, setHistory] = useState<
    { id: string; multiplier: number; win: boolean }[]
  >([])
  const settled = useRef(new Set<string>())
  const submitting = useRef(false)

  const applyResult = (res: Result, id: string) => {
    if (settled.current.has(id)) return
    setCurrentMultiplier(res.currentMultiplier ?? 1)
    setConnection(true)
    if (res.gameOver) {
      settled.current.add(id)
      setGameState(res.isWin ? "cashed_out" : "crashed")
      setPayout(res.payout)
      setHistory((items) =>
        [
          { id, multiplier: res.currentMultiplier ?? 1, win: !!res.isWin },
          ...items,
        ].slice(0, 8)
      )
    }
  }

  useEffect(() => {
    let cancelled = false
    resumeCrashGame()
      .then((res) => {
        if (cancelled || !res) return
        setRoundId(res.roundId)
        setBetAmount(res.betAmount)
        setAutoCashout(res.autoCashout)
        setCurrentMultiplier(res.currentMultiplier ?? 1)
        setGameState("running")
      })
      .catch(() => {
        // Signed-out visitors can view the game; placing a bet checks authentication.
      })
      .finally(() => {
        if (!cancelled) setRecovering(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleStart = async () => {
    if (submitting.current || recovering || gameState === "running") return
    if (
      !Number.isFinite(betAmount) ||
      betAmount < 1 ||
      !Number.isFinite(autoCashout) ||
      autoCashout < 1.01
    ) {
      setError(
        "Enter a bet of at least ₹1 and a cashout target of at least 1.01×."
      )
      return
    }
    submitting.current = true
    setLoading(true)
    setError("")
    try {
      const res = await placeCrashBet({
        betAmount,
        autoCashout,
        requestId: betRequest.requestId({ betAmount, autoCashout }),
      })
      betRequest.complete()
      setRoundId(res.roundId)
      setPayout(0)
      setCurrentMultiplier(1)
      setConnection(true)
      setGameState("running")
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start. Please try again."
      )
    } finally {
      submitting.current = false
      setLoading(false)
    }
  }

  const handleCashout = async () => {
    if (submitting.current || gameState !== "running") return
    submitting.current = true
    setLoading(true)
    setError("")
    try {
      applyResult(await resolveCrashGame(roundId, "cashout"), roundId)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to cash out. Please try again."
      )
    } finally {
      submitting.current = false
      setLoading(false)
    }
  }

  useEffect(() => {
    if (gameState !== "running") return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    const poll = async () => {
      try {
        const res = await resolveCrashGame(roundId)
        if (!cancelled) applyResult(res, roundId)
        if (res.gameOver) return
      } catch {
        if (!cancelled) setConnection(false)
      }
      if (!cancelled) timer = setTimeout(poll, 500)
    }
    void poll()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [gameState, roundId])

  const running = gameState === "running"
  const locked = running || loading || recovering
  const profit = Number.isFinite(betAmount * autoCashout)
    ? betAmount * (autoCashout - 1)
    : 0

  return (
    <section className={styles.game} aria-label={`${gameId} game`}>
      <div className={styles.history} aria-label="Your recent rounds">
        <History size={14} />
        {history.length ? (
          history.map((item) => (
            <span
              key={item.id}
              className={item.win ? styles.winChip : styles.lossChip}
            >
              {item.multiplier.toFixed(2)}×
            </span>
          ))
        ) : (
          <span className={styles.emptyHistory}>
            Your round results will appear here
          </span>
        )}
      </div>
      <CrashChart
        multiplier={currentMultiplier}
        state={gameState}
        payout={payout}
      />
      <footer className={styles.footer}>
        <span className={connection ? styles.connected : styles.reconnecting}>
          <Activity size={13} />{" "}
          {connection ? "Network Status" : "Reconnecting…"}
        </span>
        <span>
          <Check size={13} /> Server-settled rounds
        </span>
      </footer>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.betButton}
          data-running={running}
          disabled={loading || recovering}
          onClick={running ? handleCashout : handleStart}
        >
          {recovering ? (
            "Checking active round…"
          ) : loading ? (
            running ? (
              "Cashing out…"
            ) : (
              "Starting round…"
            )
          ) : running ? (
            <>
              <span>Cash Out</span>
              <strong>
                ₹{(betAmount * currentMultiplier).toFixed(2)}{" "}
                <ArrowUpRight size={18} />
              </strong>
            </>
          ) : (
            <>
              <span>{gameState === "idle" ? "Bet" : "Bet Next Round"}</span>
              <ChevronRight size={19} />
            </>
          )}
        </button>
        <label htmlFor="crash-bet">
          Bet Amount <span>INR</span>
        </label>
        <div className={styles.inputGroup}>
          <span className={styles.currency}>₹</span>
          <input
            id="crash-bet"
            type="number"
            inputMode="decimal"
            min="1"
            step="0.01"
            value={betAmount}
            disabled={locked}
            onChange={(e) => setBetAmount(e.target.valueAsNumber || 0)}
          />
          <button
            type="button"
            aria-label="Halve bet"
            disabled={locked}
            onClick={() =>
              setBetAmount((b) => Math.max(1, Math.round(b * 50) / 100))
            }
          >
            ½
          </button>
          <button
            type="button"
            aria-label="Double bet"
            disabled={locked}
            onClick={() => setBetAmount((b) => Math.round(b * 200) / 100)}
          >
            2×
          </button>
        </div>
        <label htmlFor="crash-target">
          Cashout At <span>Multiplier</span>
        </label>
        <div className={styles.inputGroup}>
          <input
            id="crash-target"
            type="number"
            inputMode="decimal"
            min="1.01"
            max="1000000"
            step="0.01"
            value={autoCashout}
            disabled={locked}
            onChange={(e) => setAutoCashout(e.target.valueAsNumber || 0)}
          />
          <span className={styles.unit}>×</span>
          <button
            type="button"
            aria-label="Decrease cashout target"
            disabled={locked}
            onClick={() =>
              setAutoCashout((v) =>
                Math.max(1.01, Math.round((v - 0.1) * 100) / 100)
              )
            }
          >
            ⌄
          </button>
          <button
            type="button"
            aria-label="Increase cashout target"
            disabled={locked}
            onClick={() =>
              setAutoCashout((v) =>
                Math.min(1000000, Math.round((v + 0.1) * 100) / 100)
              )
            }
          >
            ⌃
          </button>
        </div>
        <div className={styles.profit}>
          <span>
            Profit on win <small>at {autoCashout.toFixed(2)}×</small>
          </span>
          <strong>₹{profit.toFixed(2)}</strong>
        </div>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <p className={styles.hint}>
          Auto cashout settles at your target. You can cash out earlier.
        </p>
      </div>
    </section>
  )
}
