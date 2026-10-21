"use client"

import { useRef, useState } from "react"
import { ArrowLeftRight, History, Info, SlidersHorizontal } from "lucide-react"
import { useBetRequest } from "@/features/games/use-bet-request"
import { placeDiceBet } from "../actions"
import styles from "./dice.module.css"

type Roll = { id: string; roll: number; isWin: boolean; payout: number }
const clampChance = (value: number) => Math.max(0.01, Math.min(98, value))

export function DiceGame({ gameId }: { gameId: string }) {
  const betRequest = useBetRequest()
  const [betAmount, setBetAmount] = useState(10)
  const [chance, setChance] = useState(49.5)
  const [over, setOver] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Roll | null>(null)
  const [history, setHistory] = useState<Roll[]>([])
  const [error, setError] = useState("")
  const submitting = useRef(false)
  const multiplier = 99 / chance
  const target = over ? 100 - chance : chance
  const profit = Number.isFinite(betAmount) ? betAmount * (multiplier - 1) : 0

  const handleBet = async () => {
    if (submitting.current) return
    if (!Number.isFinite(betAmount) || betAmount < 1) {
      setError("Enter a bet amount of at least ₹1.")
      return
    }
    submitting.current = true
    setLoading(true)
    setError("")
    try {
      const res = await placeDiceBet({
        requestId: betRequest.requestId({
          betAmount,
          targetMultiplier: multiplier,
        }),
        betAmount,
        targetMultiplier: multiplier,
      })
      betRequest.complete()
      // The server settles roll-under. Mirroring the roll provides the equivalent
      // roll-over presentation without changing the odds or settlement result.
      const outcome = {
        id: crypto.randomUUID(),
        roll: over ? 100 - res.roll : res.roll,
        isWin: res.isWin,
        payout: res.payout,
      }
      setResult(outcome)
      setHistory((items) => [outcome, ...items].slice(0, 8))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to roll. Please try again."
      )
    } finally {
      submitting.current = false
      setLoading(false)
    }
  }

  const changeChance = (value: number) => {
    if (Number.isFinite(value)) {
      setChance(clampChance(value))
      setResult(null)
    }
  }

  return (
    <section className={styles.game} aria-label={`${gameId} game`}>
      <div className={styles.board}>
        <div className={styles.history} aria-label="Your recent rolls">
          {history.length ? (
            history.map((roll) => (
              <span
                key={roll.id}
                className={roll.isWin ? styles.winChip : styles.lossChip}
              >
                {roll.roll.toFixed(2)}
              </span>
            ))
          ) : (
            <span className={styles.empty}>Your rolls appear here</span>
          )}
          <History size={16} aria-hidden="true" />
        </div>
        <div className={styles.scale}>
          <div className={styles.ticks} aria-hidden="true">
            {[0, 25, 50, 75, 100].map((tick) => (
              <span key={tick}>
                {tick}
                <i />
              </span>
            ))}
          </div>
          <div
            className={styles.rail}
            data-over={over}
            style={{ "--target": `${target}%` } as React.CSSProperties}
          >
            <div className={styles.track} />
            <input
              aria-label={over ? "Roll over target" : "Roll under target"}
              type="range"
              min={over ? 2 : 0.01}
              max={over ? 99.99 : 98}
              step="0.01"
              value={target}
              disabled={loading}
              onChange={(e) =>
                changeChance(
                  over ? 100 - Number(e.target.value) : Number(e.target.value)
                )
              }
            />
            {result && (
              <div
                key={result.id}
                className={styles.rollMarker}
                data-win={result.isWin}
                style={{ left: `${Math.max(3, Math.min(97, result.roll))}%` }}
              >
                {result.roll.toFixed(2)}
                <i />
              </div>
            )}
          </div>
          <p className={styles.result} role="status" data-win={result?.isWin}>
            {loading
              ? "Rolling…"
              : result
                ? result.isWin
                  ? `You won · ₹${result.payout.toFixed(2)} paid out`
                  : "No win this roll"
                : `Roll ${over ? "over" : "under"} ${target.toFixed(2)} to win`}
          </p>
        </div>
        <div className={styles.settings}>
          <div>
            <label htmlFor="dice-multiplier">Multiplier</label>
            <div className={styles.settingInput}>
              <input
                id="dice-multiplier"
                type="number"
                inputMode="decimal"
                min="1.01020409"
                max="9900"
                step="0.01"
                disabled={loading}
                value={Number(multiplier.toFixed(4))}
                onChange={(e) => {
                  const value = e.target.valueAsNumber
                  if (value > 0) changeChance(99 / value)
                }}
              />
              <span>×</span>
            </div>
          </div>
          <div>
            <label htmlFor="dice-target">Roll {over ? "Over" : "Under"}</label>
            <div className={styles.settingInput}>
              <input
                id="dice-target"
                type="number"
                inputMode="decimal"
                step="0.01"
                min={over ? 2 : 0.01}
                max={over ? 99.99 : 98}
                value={Number(target.toFixed(2))}
                disabled={loading}
                onChange={(e) => {
                  const v = e.target.valueAsNumber
                  if (Number.isFinite(v)) changeChance(over ? 100 - v : v)
                }}
              />
              <button
                type="button"
                disabled={loading}
                aria-label={`Switch to roll ${over ? "under" : "over"}`}
                onClick={() => {
                  setOver((v) => !v)
                  setResult(null)
                }}
              >
                <ArrowLeftRight size={16} />
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="dice-chance">Win Chance</label>
            <div className={styles.settingInput}>
              <input
                id="dice-chance"
                type="number"
                inputMode="decimal"
                min="0.01"
                max="98"
                step="0.01"
                disabled={loading}
                value={Number(chance.toFixed(4))}
                onChange={(e) => changeChance(e.target.valueAsNumber)}
              />
              <span>%</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.betButton}
          onClick={handleBet}
          disabled={loading}
        >
          {loading ? "Rolling…" : "Bet"}
        </button>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        <label htmlFor="dice-bet">
          Bet Amount <span>INR</span>
        </label>
        <div className={styles.amount}>
          <span>₹</span>
          <input
            id="dice-bet"
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
        <label htmlFor="dice-profit">
          Profit on Win <span>INR</span>
        </label>
        <div className={styles.amount}>
          <span>₹</span>
          <output id="dice-profit">{profit.toFixed(2)}</output>
        </div>
        <div className={styles.mode}>
          <SlidersHorizontal size={14} />
          <span>Manual betting</span>
          <small>{chance.toFixed(2)}% win chance</small>
        </div>
      </div>
      <details className={styles.help}>
        <summary>
          <Info size={15} />
          How to play
        </summary>
        <p>
          Choose your multiplier, target, or win chance, then place a bet. Drag
          the slider to adjust your target. Switch between rolling over and
          under with the arrows. Each roll is independent; payouts are settled
          by the server.
        </p>
      </details>
    </section>
  )
}
