"use client"
import { useEffect, useState } from "react"
import styles from "./limbo.module.css"
export type LimboResult = {
  id: string
  roll: number
  isWin: boolean
  payout: number
}
export function LimboDisplay({
  result,
  busy,
  onFinish,
}: {
  result: LimboResult | null
  busy: boolean
  onFinish: () => void
}) {
  const [value, setValue] = useState(1)
  useEffect(() => {
    let frame: number
    const start = performance.now()
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const duration = reduced ? 0 : 750
    const tick = (now: number) => {
      const t = result
        ? duration
          ? Math.min(1, (now - start) / duration)
          : 1
        : 1
      setValue(result ? 1 + (result.roll - 1) * (1 - Math.pow(1 - t, 3)) : 1)
      if (t < 1) frame = requestAnimationFrame(tick)
      else if (result) onFinish()
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [result, onFinish])
  return (
    <div
      className={styles.display}
      data-state={
        busy ? "rolling" : result ? (result.isWin ? "win" : "loss") : "idle"
      }
    >
      <strong>
        <span>{value.toFixed(2)}</span>
        <small>×</small>
      </strong>
      <span className={styles.status} role="status">
        {busy
          ? result
            ? "Revealing multiplier…"
            : "Starting round…"
          : result
            ? result.isWin
              ? `You won · ₹${result.payout.toFixed(2)} paid out`
              : "Below target · No payout"
            : "Set your target multiplier"}
      </span>
    </div>
  )
}
