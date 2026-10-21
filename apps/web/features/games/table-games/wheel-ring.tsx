"use client"
import { useState } from "react"
import { WHEEL_TABLES, type WheelSegments } from "@workspace/casino/catalog"
import styles from "./wheel-ring.module.css"
const colors: Record<number, string> = {
  0: "#425468",
  0.6: "#8b783f",
  1.2: "#cfab67",
  1.5: "#f4c64c",
  1.7: "#dce7f3",
  2: "#ffb064",
  3: "#bb96ed",
  4: "#ff813c",
}
export function WheelRing({
  segments,
  rotation,
  result,
  busy,
  betAmount,
}: {
  segments: WheelSegments
  rotation: number
  result: { multiplier: number; payout: number } | null
  busy: boolean
  betAmount: number
}) {
  const [hover, setHover] = useState<number | null>(null)
  const table = WHEEL_TABLES[segments]
  const legend = [...new Set(table)].sort((a, b) => a - b)
  const point = (radius: number, angle: number) =>
    `${(180 + radius * Math.cos(angle)).toFixed(4)} ${(180 + radius * Math.sin(angle)).toFixed(4)}`
  return (
    <div className={styles.visual}>
      <div className={styles.recent} aria-label="Last multiplier">
        {result && !busy
          ? `${result.multiplier.toFixed(2)}×`
          : busy
            ? "Spinning…"
            : "—"}
      </div>
      <div className={styles.frame}>
        <svg
          viewBox="0 0 360 360"
          className={styles.ring}
          style={{ transform: `rotate(${rotation}deg)` }}
          role="img"
          aria-label={`${segments}-segment payout ring`}
        >
          <circle
            cx="180"
            cy="180"
            r="160"
            fill="none"
            stroke="#283445"
            strokeWidth="26"
          />
          {table.map((mult, i) => {
            const a = (((i * 360) / segments - 90) * Math.PI) / 180
            const b = ((((i + 1) * 360) / segments - 90) * Math.PI) / 180
            return (
              <path
                key={i}
                d={`M ${point(158, a)} A 158 158 0 0 1 ${point(158, b)}`}
                fill="none"
                stroke={colors[mult] ?? "#f4c64c"}
                strokeWidth="13"
              />
            )
          })}
        </svg>
        <svg className={styles.pointer} viewBox="0 0 20 42" aria-hidden="true">
          <path
            d="M 3 11 A 7 7 0 1 1 17 11 L 10 40 Z"
            fill="#f06c7d"
            stroke="#ff9bab"
            strokeWidth="2"
          />
        </svg>
        <div className={styles.center}>
          {hover !== null ? (
            <>
              <small>Payout</small>
              <strong>₹{(betAmount * hover).toFixed(2)}</strong>
              <small>
                {table.filter((v) => v === hover).length} / {segments} segments
              </small>
            </>
          ) : result && !busy ? (
            <>
              <strong data-win={result.multiplier > 0}>
                {result.multiplier.toFixed(2)}×
              </strong>
              <small>₹{result.payout.toFixed(2)} paid out</small>
            </>
          ) : (
            <span className={styles.hub} />
          )}
        </div>
      </div>
      <div className={styles.legend} aria-label="Wheel payouts">
        {legend.map((mult) => (
          <button
            key={mult}
            type="button"
            style={{ "--segment-color": colors[mult] } as React.CSSProperties}
            data-active={result && !busy && result.multiplier === mult}
            onMouseEnter={() => setHover(mult)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(mult)}
            onBlur={() => setHover(null)}
            aria-label={`${mult.toFixed(2)} times payout, ${table.filter((v) => v === mult).length} of ${segments} segments`}
          >
            {mult.toFixed(2)}×
          </button>
        ))}
      </div>
    </div>
  )
}
