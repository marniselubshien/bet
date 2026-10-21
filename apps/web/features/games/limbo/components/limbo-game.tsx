"use client"
import { useCallback, useRef, useState } from "react"
import { History, Info, SlidersHorizontal } from "lucide-react"
import { useBetRequest } from "@/features/games/use-bet-request"
import { placeLimboBet } from "../actions"
import { LimboDisplay, type LimboResult } from "./limbo-display"
import shared from "../../dice/components/dice.module.css"
import styles from "./limbo.module.css"
export function LimboGame({ gameId }: { gameId: string }) {
  const betRequest = useBetRequest()
  const [betAmount, setBetAmount] = useState(10)
  const [targetText, setTargetText] = useState("2.00")
  const [chanceText, setChanceText] = useState("49.50000000")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<LimboResult | null>(null)
  const [history, setHistory] = useState<LimboResult[]>([])
  const [error, setError] = useState("")
  const submitting = useRef(false)
  const pending = useRef<LimboResult | null>(null)
  const targetMultiplier = Number(targetText)
  const profit = Number.isFinite(betAmount * (targetMultiplier - 1))
    ? Math.max(0, betAmount * (targetMultiplier - 1))
    : 0
  const finish = useCallback(() => {
    const outcome = pending.current
    if (!outcome) return
    pending.current = null
    setHistory((items) => [outcome, ...items].slice(0, 6))
    submitting.current = false
    setLoading(false)
  }, [])
  const handleBet = async () => {
    if (submitting.current) return
    if (!Number.isFinite(betAmount) || betAmount < 1) {
      setError("Enter a bet amount of at least ₹1.")
      return
    }
    if (
      !Number.isFinite(targetMultiplier) ||
      targetMultiplier < 1.01 ||
      targetMultiplier > 1000000 ||
      !Number.isFinite(Number(chanceText)) ||
      Number(chanceText) <= 0
    ) {
      setError(
        "Enter a target from 1.01× to 1,000,000× and a valid win chance."
      )
      return
    }
    submitting.current = true
    setLoading(true)
    setResult(null)
    setError("")
    try {
      const res = await placeLimboBet({
        betAmount,
        targetMultiplier,
        requestId: betRequest.requestId({ betAmount, targetMultiplier }),
      })
      betRequest.complete()
      const outcome = {
        id: crypto.randomUUID(),
        roll: res.roll,
        isWin: res.isWin,
        payout: res.payout,
      }
      pending.current = outcome
      setResult(outcome)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to place bet. Please try again."
      )
      submitting.current = false
      setLoading(false)
    }
  }
  return (
    <section className={shared.game} aria-label={`${gameId} game`}>
      <div className={styles.board}>
        <div className={shared.history} aria-label="Recent multipliers">
          {history.map((item) => (
            <span
              key={item.id}
              className={item.isWin ? shared.winChip : shared.lossChip}
            >
              {item.roll.toFixed(2)}×
            </span>
          ))}
          {!history.length && (
            <span className={shared.empty}>Your results appear here</span>
          )}
          <History size={15} />
        </div>
        <LimboDisplay result={result} busy={loading} onFinish={finish} />
        <div className={styles.settings}>
          <div>
            <label htmlFor="limbo-target">Target Multiplier</label>
            <div className={shared.settingInput}>
              <input
                id="limbo-target"
                type="number"
                inputMode="decimal"
                min="1.01"
                max="1000000"
                step="0.01"
                value={targetText}
                disabled={loading}
                onChange={(e) => {
                  setTargetText(e.target.value)
                  const v = e.target.valueAsNumber
                  if (Number.isFinite(v) && v > 0)
                    setChanceText((99 / v).toFixed(8))
                }}
              />
              <span>×</span>
            </div>
          </div>
          <div>
            <label htmlFor="limbo-chance">Win Chance</label>
            <div className={shared.settingInput}>
              <input
                id="limbo-chance"
                type="number"
                inputMode="decimal"
                min="0.000099"
                max={99 / 1.01}
                step="0.01"
                value={chanceText}
                disabled={loading}
                onChange={(e) => {
                  setChanceText(e.target.value)
                  const v = e.target.valueAsNumber
                  if (Number.isFinite(v) && v > 0)
                    setTargetText(String(Number((99 / v).toPrecision(12))))
                }}
              />
              <span>%</span>
            </div>
          </div>
        </div>
      </div>
      <div className={shared.controls}>
        <button
          type="button"
          className={shared.betButton}
          onClick={handleBet}
          disabled={loading}
        >
          {loading ? "Revealing…" : "Bet"}
        </button>
        {error && (
          <p role="alert" className={shared.error}>
            {error}
          </p>
        )}
        <label htmlFor="limbo-bet">
          Bet Amount <span>INR</span>
        </label>
        <div className={shared.amount}>
          <span>₹</span>
          <input
            id="limbo-bet"
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
        <label htmlFor="limbo-profit">
          Profit on Win <span>INR</span>
        </label>
        <div className={shared.amount}>
          <span>₹</span>
          <output id="limbo-profit">{profit.toFixed(2)}</output>
        </div>
        <div className={shared.mode}>
          <SlidersHorizontal size={14} />
          Manual betting
          <small>
            Target{" "}
            {Number.isFinite(targetMultiplier)
              ? targetMultiplier.toFixed(2)
              : "—"}
            ×
          </small>
        </div>
      </div>
      <details className={shared.help}>
        <summary>
          <Info size={15} />
          How to play
        </summary>
        <p>
          Set a target multiplier and place your bet. If the revealed multiplier
          reaches your target, your payout is your bet multiplied by the target.
          Higher targets have a lower win chance. Each result and payout comes
          from the server.
        </p>
      </details>
    </section>
  )
}
