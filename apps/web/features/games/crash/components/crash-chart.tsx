"use client"

import { useEffect, useId, useRef, useState } from "react"
import styles from "./crash.module.css"

export type CrashState = "idle" | "running" | "crashed" | "cashed_out"

export function CrashChart({
  multiplier,
  state,
  payout,
}: {
  multiplier: number
  state: CrashState
  payout: number
}) {
  const gradient = useId().replace(/:/g, "")
  const [display, setDisplay] = useState(1)
  const rendered = useRef(1)

  useEffect(() => {
    // Interpolate only towards confirmed server values; never predict a payout.
    const from = Math.min(rendered.current, multiplier)
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const duration = state === "running" && !reduced ? 450 : 0
    const start = performance.now()
    let frame: number
    const tick = (now: number) => {
      const progress = duration ? Math.min(1, (now - start) / duration) : 1
      rendered.current = from + (multiplier - from) * progress
      setDisplay(rendered.current)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [multiplier, state])

  const value = state === "running" ? display : multiplier
  const progress =
    state === "idle"
      ? 0
      : Math.min(0.96, Math.log(Math.max(1, value)) / 2.5 + 0.025)
  const x = 28 + 344 * progress
  const y = 254 - 235 * Math.pow(progress, 1.8)
  const points = Array.from({ length: 61 }, (_, i) => {
    const p = (progress * i) / 60
    return `${28 + 344 * p},${254 - 235 * Math.pow(p, 1.8)}`
  })

  return (
    <div className={styles.chart} data-state={state}>
      <svg
        className={styles.graph}
        viewBox="0 0 400 290"
        role="img"
        aria-label={`Crash chart: ${value.toFixed(2)} times, ${state.replace("_", " ")}`}
      >
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.26" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.015" />
          </linearGradient>
        </defs>
        <path
          d={`M ${points.join(" L ")} L ${x} 254 L 28 254 Z`}
          fill={`url(#${gradient})`}
        />
        <polyline className={styles.curve} points={points.join(" ")} />
        <g
          key={state === "crashed" ? "impact" : "flight"}
          transform={`translate(${x} ${y})`}
        >
          {state === "crashed" ? (
            <g className={styles.impact}>
              <circle className={styles.shockwave} r="8" />
              {Array.from({ length: 8 }, (_, i) => (
                <g key={i} transform={`rotate(${i * 45})`}>
                  <line
                    className={styles.fragment}
                    x1="7"
                    y1="0"
                    x2="15"
                    y2="0"
                  />
                </g>
              ))}
              <circle className={styles.impactCore} r="5" />
            </g>
          ) : (
            <g
              className={
                state === "running" ? styles.flyingMarker : styles.waitingMarker
              }
            >
              <circle className={styles.tipHalo} r="13" />
              <path
                d="M -8 5 Q -13 10 -18 8 M -8 0 Q -16 4 -21 1"
                className={styles.exhaust}
              />
              <path d="M -8 4 Q -5 -8 7 -8 Q 11 2 1 7 Z" fill="#fff" />
              <circle cx="2" cy="-2" r="2" fill="#ffad62" />
            </g>
          )}
        </g>
      </svg>
      <div
        key={state === "crashed" ? "crashed" : "readout"}
        className={styles.readout}
      >
        <strong>
          {value.toFixed(2)}
          <span>×</span>
        </strong>
        <span className={styles.roundStatus} role="status">
          {state === "crashed"
            ? "Crashed"
            : state === "cashed_out"
              ? `Cashed out · ₹${payout.toFixed(2)}`
              : state === "running"
                ? "Climbing…"
                : "Ready to fly"}
        </span>
      </div>
    </div>
  )
}
