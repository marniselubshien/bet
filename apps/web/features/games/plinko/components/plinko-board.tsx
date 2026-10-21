"use client"
import { useEffect, useRef } from "react"
import { PLINKO_TABLES, type PlinkoRows } from "@workspace/casino/catalog"
import styles from "./plinko.module.css"
export function PlinkoBoard({
  rows,
  drop,
  activeBucket,
  onLand,
}: {
  rows: PlinkoRows
  drop: { id: string; path: number[] } | null
  activeBucket: number | null
  onLand: () => void
}) {
  const ball = useRef<SVGCircleElement>(null)
  const step = 340 / (rows + 2)
  useEffect(() => {
    if (!drop || !ball.current) return
    const frames: Keyframe[] = [
      { transform: "translate(200px, 8px)", offset: 0 },
    ]
    let x = 200
    drop.path.forEach((direction, i) => {
      const y = 24 + (i * 260) / (rows - 1)
      frames.push({
        transform: `translate(${x}px, ${y - 5}px)`,
        offset: (i + 0.55) / (rows + 1),
      })
      x += ((direction ? 1 : -1) * step) / 2
      frames.push({
        transform: `translate(${x}px, ${y + 3}px)`,
        offset: (i + 1) / (rows + 1),
        easing: "ease-in",
      })
    })
    frames.push({ transform: `translate(${x}px, 299px)`, offset: 1 })
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const animation = ball.current.animate(frames, {
      duration: reduced ? 100 : rows * 155,
      fill: "forwards",
      easing: "linear",
    })
    animation.onfinish = onLand
    return () => {
      animation.onfinish = null
      animation.cancel()
    }
  }, [drop, rows, step, onLand])
  return (
    <svg
      className={styles.board}
      viewBox="0 0 400 342"
      role="img"
      aria-label={`Plinko board with ${rows} rows${activeBucket !== null ? `, landed in bucket ${activeBucket + 1}` : ""}`}
    >
      <defs>
        <radialGradient id="plinko-ball">
          <stop offset="0%" stopColor="#fff2c1" />
          <stop offset="100%" stopColor="#ff9b47" />
        </radialGradient>
      </defs>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: r + 3 }, (_, c) => (
          <circle
            key={`${r}-${c}`}
            cx={200 + (c - (r + 2) / 2) * step}
            cy={24 + (r * 260) / (rows - 1)}
            r={rows === 16 ? 1.9 : 2.5}
            fill="#e3ebf7"
          />
        ))
      )}
      {PLINKO_TABLES[rows].map((mult, i) => (
        <g
          key={i}
          className={activeBucket === i ? styles.hit : undefined}
          style={{ transformOrigin: `${200 + (i - rows / 2) * step}px 317px` }}
        >
          <rect
            x={200 + (i - rows / 2) * step - step * 0.44}
            y="307"
            width={step * 0.88}
            height="20"
            rx="2"
            fill={
              mult >= 10
                ? "#ff854b"
                : mult >= 2
                  ? "#ffb064"
                  : mult >= 1
                    ? "#f4c64c"
                    : "#8b783f"
            }
          />
          <text
            x={200 + (i - rows / 2) * step}
            y="320"
            textAnchor="middle"
            fill="#251c15"
            fontSize={rows === 16 ? 7 : 9}
            fontWeight="850"
          >
            {mult}
          </text>
        </g>
      ))}
      {drop && (
        <circle
          ref={ball}
          cx="0"
          cy="0"
          r="4"
          fill="url(#plinko-ball)"
          className={styles.ball}
          style={{ transform: "translate(200px, 8px)" }}
        />
      )}
    </svg>
  )
}
