"use client"
import { useEffect, useRef, useState } from "react"
import {
  Bird,
  Flame,
  Shield,
  Target,
  Wind,
  ArrowRight,
  Check,
  Info,
} from "lucide-react"
import {
  ARCADE_GAMES,
  SLIDE_PAYOUTS,
  DART_PAYOUTS,
  isJourneyGame,
} from "@workspace/casino/catalog"
import { useBetRequest } from "../use-bet-request"
import { startArcade, resumeArcade, advanceArcade } from "./actions"
import common from "../dice/components/dice.module.css"
import mines from "../mines/components/mines.module.css"
import styles from "./arcade.module.css"
type View = Awaited<ReturnType<typeof startArcade>>
const icons = {
  chicken: Bird,
  pump: Wind,
  slides: ArrowRight,
  darts: Target,
  "dragon-tower": Shield,
}
export function ArcadeGame({
  slug,
}: {
  slug: (typeof ARCADE_GAMES)[number]["slug"]
}) {
  const definition = ARCADE_GAMES.find((game) => game.slug === slug)!
  const Icon = icons[slug]
  const journey = isJourneyGame(slug)
  const request = useBetRequest()
  const [amount, setAmount] = useState(10)
  const [view, setView] = useState<View | null>(null)
  const [busy, setBusy] = useState(false)
  const [recovering, setRecovering] = useState(journey)
  const [error, setError] = useState("")
  const [animate, setAnimate] = useState(false)
  const [slidePosition, setSlidePosition] = useState(60)
  const lock = useRef(false)
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const running = !!view?.roundId && !view.gameOver && journey
  const step = view?.step ?? 0
  useEffect(() => {
    let cancelled = false
    resumeArcade(slug)
      .then((res) => {
        if (!cancelled && res) {
          setView(res)
          setAmount(res.betAmount)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setRecovering(false)
      })
    return () => {
      cancelled = true
      if (animationTimer.current) clearTimeout(animationTimer.current)
    }
  }, [slug])
  const run = async (action: "start" | "reveal" | "cashout", choice = 0) => {
    if (lock.current || recovering) return
    if (action === "start" && (!Number.isFinite(amount) || amount < 1)) {
      setError("Enter a bet amount of at least ₹1.")
      return
    }
    lock.current = true
    setBusy(true)
    setError("")
    try {
      const result =
        action === "start"
          ? await startArcade(slug, {
              betAmount: amount,
              requestId: request.requestId({ slug, betAmount: amount }),
            })
          : await advanceArcade(slug, view!.roundId!, action, step * 4 + choice)
      if (action === "start") request.complete()
      if (!journey) {
        setAnimate(true)
        if (slug === "slides")
          setSlidePosition(
            (previous) =>
              previous + 40 + ((result.index - (previous % 20) + 20) % 20)
          )
        animationTimer.current = setTimeout(
          () => {
            setView({ ...result, gameOver: true })
            setAnimate(false)
            setBusy(false)
            lock.current = false
          },
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? 10
            : 1600
        )
      } else {
        setView(result)
        setBusy(false)
        lock.current = false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete action")
      setBusy(false)
      lock.current = false
    }
  }
  const failed = view?.gameOver && !view.isWin
  return (
    <section className={common.game} aria-label={`${definition.name} game`}>
      <div className={styles.board} data-failed={failed}>
        <header>
          <span>
            <Icon size={18} />
            {definition.name}
          </span>
          <small>7X PASA ORIGINALS</small>
        </header>
        {slug === "chicken" && (
          <div className={styles.road}>
            <div className={styles.lanes}>
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} data-cleared={i < step}>
                  <span>{i + 1}</span>
                  {i < step ? <Check size={18} /> : <Flame size={17} />}
                </div>
              ))}
            </div>
            <Bird
              className={styles.chicken}
              size={34}
              style={{ left: `${(Math.min(step, 7) / 8) * 90 + 3}%` }}
            />
          </div>
        )}
        {slug === "pump" && (
          <div className={styles.pumpStage}>
            {failed ? (
              <div className={styles.burst}>
                <Flame size={74} />
                <span>Popped!</span>
              </div>
            ) : (
              <div
                className={styles.balloon}
                style={{ transform: `scale(${0.6 + step * 0.07})` }}
              >
                <span>{step}/8</span>
              </div>
            )}
          </div>
        )}
        {slug === "dragon-tower" && (
          <div className={styles.tower}>
            {Array.from({ length: 8 }, (_, r) => 7 - r).map((level) => (
              <div key={level} className={styles.floor}>
                <small>{level + 1}</small>
                {Array.from({ length: 4 }, (_, tile) => (
                  <button
                    key={tile}
                    type="button"
                    className={mines.tile}
                    disabled={!running || busy || step !== level}
                    data-picked={view?.choices[level] === tile}
                    data-failed={
                      failed &&
                      view?.failedStep === level &&
                      view?.choices[level] === tile
                    }
                    aria-label={`Level ${level + 1}, tile ${tile + 1}`}
                    onClick={() => run("reveal", tile)}
                  >
                    {view?.choices[level] === tile ? (
                      failed && view?.failedStep === level ? (
                        <Flame size={20} />
                      ) : (
                        <Shield size={20} />
                      )
                    ) : (
                      <span>◆</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
        {slug === "slides" && (
          <div className={styles.slideStage}>
            <span className={styles.slidePointer} />
            <div
              aria-hidden="true"
              className={styles.strip}
              style={{
                transform: `translateX(-${slidePosition * 64 + 32}px)`,
              }}
            >
              {Array.from(
                { length: Math.max(200, slidePosition + 60) },
                (_, i) => (
                  <div key={i} data-pay={SLIDE_PAYOUTS[i % 20]! > 0}>
                    {SLIDE_PAYOUTS[i % 20]}×
                  </div>
                )
              )}
            </div>
          </div>
        )}
        {slug === "darts" && (
          <div className={styles.dartStage}>
            <svg viewBox="0 0 300 300" aria-label="Darts target">
              {DART_PAYOUTS.map((mult, i) => (
                <g key={i}>
                  <circle
                    cx="150"
                    cy="150"
                    r={140 - i * 17}
                    fill={i % 2 ? "#f4c64c" : "#34445b"}
                    stroke="#141922"
                    strokeWidth="2"
                  />
                  <text
                    x="150"
                    y={18 + i * 17}
                    textAnchor="middle"
                    fontSize="9"
                    fill={i % 2 ? "#252015" : "#d8e1ef"}
                  >
                    {mult}×
                  </text>
                </g>
              ))}
            </svg>
            {view && !animate && (
              <Target
                className={styles.dart}
                size={23}
                style={{
                  left: `${50 + (((7 - view.index) * 17 + 8) / 3) * Math.cos((view.angle * Math.PI) / 180)}%`,
                  top: `${50 + (((7 - view.index) * 17 + 8) / 3) * Math.sin((view.angle * Math.PI) / 180)}%`,
                }}
              />
            )}
            {animate && <div className={styles.throwing}>Throwing…</div>}
          </div>
        )}
        <div className={styles.readout} role="status">
          <strong>
            {journey
              ? failed
                ? "Round over"
                : `${(view?.currentMultiplier ?? 1).toFixed(2)}×`
              : busy
                ? "Revealing…"
                : view
                  ? `${view.currentMultiplier.toFixed(2)}×`
                  : "Ready to play"}
          </strong>
          <span>
            {view?.gameOver
              ? `${view.refunded ? "Stake refunded" : view.isWin ? "Paid out" : "No payout"} · ₹${view.payout.toFixed(2)}`
              : running
                ? `Step ${step}/8 · Next ${(view?.nextMultiplier ?? 1).toFixed(2)}×`
                : definition.description}
          </span>
        </div>
      </div>
      <div className={common.controls}>
        {error && (
          <p className={common.error} role="alert">
            {error}
          </p>
        )}
        {running ? (
          <>
            <button
              className={common.betButton}
              disabled={busy || slug === "dragon-tower"}
              onClick={() => run("reveal")}
            >
              {busy
                ? "Playing…"
                : slug === "chicken"
                  ? "Cross next lane"
                  : slug === "pump"
                    ? "Pump balloon"
                    : "Choose a tile above"}
            </button>
            <button
              className={styles.cashout}
              disabled={busy || step < 1}
              onClick={() => run("cashout")}
            >
              Cash Out · ₹{(amount * (view?.currentMultiplier ?? 1)).toFixed(2)}
            </button>
          </>
        ) : (
          <button
            className={common.betButton}
            disabled={busy || recovering}
            onClick={() => run("start")}
          >
            {recovering ? "Checking active round…" : busy ? "Playing…" : "Bet"}
          </button>
        )}
        <label htmlFor={`${slug}-bet`}>
          Bet Amount <span>INR</span>
        </label>
        <div className={common.amount}>
          <span>₹</span>
          <input
            id={`${slug}-bet`}
            type="number"
            inputMode="decimal"
            min="1"
            step="0.01"
            value={amount}
            disabled={running || busy || recovering}
            onChange={(e) => setAmount(e.target.valueAsNumber || 0)}
          />
          <button
            type="button"
            aria-label="Halve bet"
            disabled={running || busy || recovering}
            onClick={() =>
              setAmount((a) => Math.max(1, Math.round(a * 50) / 100))
            }
          >
            ½
          </button>
          <button
            type="button"
            aria-label="Double bet"
            disabled={running || busy || recovering}
            onClick={() => setAmount((a) => Math.round(a * 200) / 100)}
          >
            2×
          </button>
        </div>
      </div>
      <details className={common.help}>
        <summary>
          <Info size={15} />
          Rules and payouts
        </summary>
        <p>
          {journey
            ? "Eight steps. Each step has a 75% success chance. One trap is generated for each step before play. Complete a step to unlock cashout, or finish all eight for an automatic payout. Multipliers include a 1% house edge and are rounded down. A failed step loses the stake."
            : slug === "slides"
              ? "Twenty equally likely positions with the displayed multipliers. The configured average return is 99% before cent rounding."
              : "Eight payout rings: 0× (30%), 0.5× (20%), 1× (20%), 1.5× (15%), 2.25× (10%), 3× (3%), 5× (1%), and 10× (1%). Average return is 99% before cent rounding."}{" "}
          Results and payouts are settled by the server.
        </p>
      </details>
    </section>
  )
}
