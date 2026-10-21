"use client"
import { useEffect, useRef, useState } from "react"
import { Info, SlidersHorizontal } from "lucide-react"
import { type WheelSegments, kenoPayouts } from "@workspace/casino/catalog"
import { useBetRequest } from "@/features/games/use-bet-request"
import { playWheel, playKeno } from "./actions"
import common from "../dice/components/dice.module.css"
import mines from "../mines/components/mines.module.css"
import styles from "./table-games.module.css"
import ringStyles from "./wheel-ring.module.css"
import { WheelRing } from "./wheel-ring"
type Result = {
  multiplier: number
  payout: number
  isWin: boolean
  drawn?: number[]
  matches?: number[]
}
function TableGame({ kind }: { kind: "wheel" | "keno" }) {
  const betRequest = useBetRequest()
  const [betAmount, setBetAmount] = useState(10)
  const [selected, setSelected] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [visible, setVisible] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [segments, setSegments] = useState<WheelSegments>(30)
  const [error, setError] = useState("")
  const submitting = useRef(false)
  useEffect(() => {
    if (!result || !loading) return
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    let count = 0
    const timer = setInterval(
      () => {
        count++
        setVisible(kind === "wheel" ? 1 : count)
        if (kind === "wheel" || count >= 10) {
          clearInterval(timer)
          setLoading(false)
          submitting.current = false
        }
      },
      reduced ? 10 : kind === "wheel" ? 3300 : 110
    )
    return () => clearInterval(timer)
  }, [result, loading, kind])
  const bet = async () => {
    if (submitting.current) return
    if (!Number.isFinite(betAmount) || betAmount < 1) {
      setError("Enter a bet amount of at least ₹1.")
      return
    }
    if (kind === "keno" && !selected.length) {
      setError("Choose 1 to 10 numbers.")
      return
    }
    submitting.current = true
    setLoading(true)
    setError("")
    setResult(null)
    setVisible(0)
    try {
      if (kind === "wheel") {
        const outcome = await playWheel({
          betAmount,
          segments,
          requestId: betRequest.requestId({ betAmount, segments }),
        })
        betRequest.complete()
        setRotation((previous) => {
          const target =
            (360 - (outcome.segmentIndex + 0.5) * (360 / segments)) % 360
          return previous + 1440 + ((target - (previous % 360) + 360) % 360)
        })
        setResult(outcome)
      } else {
        const numbers = [...selected].sort((a, b) => a - b)
        const outcome = await playKeno({
          betAmount,
          numbers,
          requestId: betRequest.requestId({ betAmount, numbers }),
        })
        betRequest.complete()
        setResult(outcome)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to place bet.")
      setLoading(false)
      submitting.current = false
    }
  }
  const revealed = result?.drawn?.slice(0, visible) ?? []
  const payouts = selected.length ? kenoPayouts(selected.length) : []
  return (
    <section className={common.game} aria-label={`${kind} game`}>
      <div className={styles.board}>
        {kind === "wheel" && (
          <h1>
            {kind === "wheel" ? "Wheel" : "Keno"}
            <span>7X PASA ORIGINALS</span>
          </h1>
        )}
        {kind === "wheel" ? (
          <WheelRing
            key={segments}
            segments={segments}
            rotation={rotation}
            result={result}
            busy={loading}
            betAmount={betAmount}
          />
        ) : (
          <>
            <div className={styles.kenoGrid}>
              {Array.from({ length: 40 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={mines.tile}
                  type="button"
                  disabled={
                    loading || (!selected.includes(n) && selected.length >= 10)
                  }
                  aria-pressed={selected.includes(n)}
                  data-selected={selected.includes(n)}
                  data-drawn={revealed.includes(n)}
                  onClick={() => {
                    setSelected((items) =>
                      items.includes(n)
                        ? items.filter((x) => x !== n)
                        : [...items, n]
                    )
                    setResult(null)
                    setVisible(0)
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className={styles.selection} role="status">
              {selected.length
                ? `${selected.length} / 10 numbers selected`
                : "Select 1-10 numbers to play"}
            </div>
            {payouts.length > 0 && (
              <div className={styles.payouts} aria-label="Keno payout table">
                {payouts.map((mult, hits) => (
                  <span
                    key={hits}
                    data-active={!loading && result?.matches?.length === hits}
                  >
                    <small>{hits} hits</small>
                    <strong>{mult}×</strong>
                  </span>
                ))}
              </div>
            )}
          </>
        )}
        {(kind === "wheel" || loading || result) && (
          <p
            role="status"
            className={styles.result}
            data-win={!loading && result?.isWin}
          >
            {loading
              ? kind === "wheel"
                ? "Spinning…"
                : `Drawing ${visible}/10…`
              : result
                ? `${kind === "keno" ? `${result.matches?.length} hits · ` : ""}${result.multiplier}× · ₹${result.payout.toFixed(2)} paid out`
                : kind === "wheel"
                  ? "Spin the wheel to reveal your multiplier"
                  : "Choose 1 to 10 numbers from the board"}
          </p>
        )}
      </div>
      <div className={common.controls}>
        <button
          type="button"
          className={common.betButton}
          disabled={loading || (kind === "keno" && !selected.length)}
          onClick={bet}
        >
          {loading ? (kind === "wheel" ? "Spinning…" : "Drawing…") : "Bet"}
        </button>
        {error && (
          <p role="alert" className={common.error}>
            {error}
          </p>
        )}
        <label htmlFor={`${kind}-bet`}>
          Bet Amount <span>INR</span>
        </label>
        <div className={common.amount}>
          <span>₹</span>
          <input
            id={`${kind}-bet`}
            type="number"
            inputMode="decimal"
            min="1"
            step="0.01"
            value={betAmount}
            disabled={loading}
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
        {kind === "keno" && (
          <div className={styles.kenoActions}>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                const pool = Array.from({ length: 40 }, (_, i) => i + 1)
                for (let i = pool.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1))
                  ;[pool[i], pool[j]] = [pool[j]!, pool[i]!]
                }
                setSelected(pool.slice(0, 10).sort((a, b) => a - b))
                setResult(null)
                setVisible(0)
                setError("")
              }}
            >
              Random Pick
            </button>
            <button
              type="button"
              disabled={loading || !selected.length}
              onClick={() => {
                setSelected([])
                setResult(null)
                setVisible(0)
                setError("")
              }}
            >
              Clear Table
            </button>
            <label htmlFor="keno-difficulty">Difficulty</label>
            <select id="keno-difficulty" disabled value="medium">
              <option value="medium">Medium</option>
            </select>
          </div>
        )}
        {kind === "wheel" && (
          <div className={ringStyles.fields}>
            <label htmlFor="wheel-difficulty">Difficulty</label>
            <select id="wheel-difficulty" value="medium" disabled>
              <option value="medium">Medium</option>
            </select>
            <label htmlFor="wheel-segments">Segments</label>
            <select
              id="wheel-segments"
              value={segments}
              disabled={loading}
              onChange={(e) => {
                setSegments(Number(e.target.value) as WheelSegments)
                setResult(null)
                setRotation(0)
              }}
            >
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>
        )}
        <div className={common.mode}>
          <SlidersHorizontal size={14} />
          Manual betting
          <small>
            {kind === "wheel" ? `${segments} segments` : "10-number draw"}
          </small>
        </div>
      </div>
      <details className={common.help}>
        <summary>
          <Info size={15} />
          Rules and payouts
        </summary>
        <p>
          {kind === "wheel"
            ? "Each configured wheel segment is equally likely. Your payout is your bet multiplied by the landed segment. A 0× result pays nothing. The configured average return is 99% before cent rounding."
            : "Choose up to 10 numbers from 1–40. Ten unique numbers are drawn. Your matching numbers determine the payout shown in the table. These payouts are normalized to at most 99% average return before cent rounding."}{" "}
          Outcomes and payouts are determined by the server.
        </p>
      </details>
    </section>
  )
}
export function WheelGame() {
  return <TableGame kind="wheel" />
}
export function KenoGame() {
  return <TableGame kind="keno" />
}
