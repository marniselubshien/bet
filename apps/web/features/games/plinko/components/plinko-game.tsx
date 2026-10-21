"use client"
import { useCallback, useRef, useState } from "react"
import { History, Info, SlidersHorizontal } from "lucide-react"
import { useBetRequest } from "@/features/games/use-bet-request"
import { type PlinkoRows } from "@workspace/casino/catalog"
import { dropPlinkoBall } from "../actions"
import { PlinkoBoard } from "./plinko-board"
import styles from "./plinko.module.css"
type Outcome = Awaited<ReturnType<typeof dropPlinkoBall>>
export function PlinkoGame({ gameId }: { gameId: string }) {
  const betRequest = useBetRequest()
  const [betAmount, setBetAmount] = useState(10)
  const [rows, setRows] = useState<PlinkoRows>(16)
  const [loading, setLoading] = useState(false)
  const [drop, setDrop] = useState<{ id: string; path: number[] } | null>(null)
  const [activeBucket, setActiveBucket] = useState<number | null>(null)
  const [result, setResult] = useState<Outcome | null>(null)
  const [error, setError] = useState("")
  const [history, setHistory] = useState<{ id: string; multiplier: number }[]>(
    []
  )
  const pending = useRef<Outcome | null>(null)
  const submitting = useRef(false)
  const onLand = useCallback(() => {
    const outcome = pending.current
    if (!outcome) return
    pending.current = null
    setActiveBucket(outcome.bucketIndex)
    setResult(outcome)
    setHistory((items) =>
      [
        { id: crypto.randomUUID(), multiplier: outcome.multiplier },
        ...items,
      ].slice(0, 5)
    )
    submitting.current = false
    setLoading(false)
  }, [])
  const handleDrop = async () => {
    if (submitting.current) return
    if (!Number.isFinite(betAmount) || betAmount < 1) {
      setError("Enter a bet of at least ₹1.")
      return
    }
    submitting.current = true
    setLoading(true)
    setError("")
    setActiveBucket(null)
    setResult(null)
    setDrop(null)
    try {
      const outcome = await dropPlinkoBall({
        betAmount,
        rows,
        requestId: betRequest.requestId({ betAmount, rows }),
      })
      betRequest.complete()
      pending.current = outcome
      setDrop({ id: crypto.randomUUID(), path: outcome.path })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to drop the ball. Please try again."
      )
      submitting.current = false
      setLoading(false)
    }
  }
  return (
    <section className={styles.game} aria-label={`${gameId} game`}>
      <div className={styles.visual}>
        <div className={styles.history} aria-label="Recent results">
          {history.map((item) => (
            <span key={item.id}>{item.multiplier}×</span>
          ))}
          <History size={15} />
        </div>
        <PlinkoBoard
          rows={rows}
          drop={drop}
          activeBucket={activeBucket}
          onLand={onLand}
        />
        <p role="status" className={styles.status}>
          {result
            ? `${result.multiplier}× · ₹${result.payout.toFixed(2)} paid out`
            : loading
              ? drop
                ? "Ball in play…"
                : "Starting drop…"
              : "Choose your bet and drop a ball"}
        </p>
      </div>
      <div className={styles.controls}>
        <button
          className={styles.bet}
          type="button"
          onClick={handleDrop}
          disabled={loading}
        >
          {loading ? "Dropping…" : "Bet"}
        </button>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <label htmlFor="plinko-bet">
          Bet Amount <span>INR</span>
        </label>
        <div className={styles.amount}>
          <span>₹</span>
          <input
            id="plinko-bet"
            type="number"
            inputMode="decimal"
            min="1"
            step="0.01"
            disabled={loading}
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.valueAsNumber || 0)}
          />
          <button
            type="button"
            aria-label="Halve bet"
            disabled={loading}
            onClick={() =>
              setBetAmount((b) => Math.max(1, Math.round(b * 50) / 100))
            }
          >
            ½
          </button>
          <button
            type="button"
            aria-label="Double bet"
            disabled={loading}
            onClick={() => setBetAmount((b) => Math.round(b * 200) / 100)}
          >
            2×
          </button>
        </div>
        <label htmlFor="plinko-risk">Difficulty</label>
        <select id="plinko-risk" disabled value="medium">
          <option value="medium">Medium</option>
        </select>
        <label htmlFor="plinko-rows">Rows</label>
        <select
          id="plinko-rows"
          disabled={loading}
          value={rows}
          onChange={(e) => {
            setRows(Number(e.target.value) as PlinkoRows)
            setDrop(null)
            setActiveBucket(null)
            setResult(null)
          }}
        >
          <option value={10}>10</option>
          <option value={16}>16</option>
        </select>
        <div className={styles.mode}>
          <SlidersHorizontal size={14} />
          Manual betting<span>Medium risk</span>
        </div>
      </div>
      <details className={styles.help}>
        <summary>
          <Info size={15} />
          How to play
        </summary>
        <p>
          Each peg sends the ball left or right. The bucket it lands in
          determines your payout. Choose 10 or 16 rows to change the board and
          multipliers. The server determines the path and settles the payout
          before the animation plays.
        </p>
      </details>
    </section>
  )
}
