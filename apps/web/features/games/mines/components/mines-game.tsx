"use client"
import { useEffect, useRef, useState } from "react"
import { Bomb, Shuffle, LoaderCircle, Trophy, RotateCcw, ArrowRightToLine, TriangleAlert, X } from "lucide-react"
import { useBetRequest } from "@/features/games/use-bet-request"
import {
  startMinesGame,
  revealMinesTile,
  cashoutMines,
  resumeMinesGame,
} from "../actions"
import styles from "./mines.module.css"

type Phase = "idle" | "playing" | "won" | "lost" | "refunded"
export function MinesGame({ gameId }: { gameId: string }) {
  const request = useBetRequest()
  const lock = useRef(false)
  const [phase, setPhase] = useState<Phase>("idle")
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [pending, setPending] = useState<number | null>(null)
  const [amount, setAmount] = useState("10")
  const [roundStake, setRoundStake] = useState(0)
  const [roundCount, setRoundCount] = useState(3)
  const [count, setCount] = useState(3)
  const [round, setRound] = useState("")
  const [revealed, setRevealed] = useState<number[]>([])
  const [mines, setMines] = useState<number[]>([])
  const [hit, setHit] = useState<number | null>(null)
  const [mult, setMult] = useState(1)
  const [next, setNext] = useState(1)
  const [payout, setPayout] = useState(0)
  const [error, setError] = useState("")
  const active = phase === "playing"
  const ended = ["won", "lost", "refunded"].includes(phase)
  const stake = Number(amount)
  const cash = Math.floor(roundStake * mult * 100 + 1e-7) / 100
  const gemsLeft = Math.max(0, 25 - (active || ended ? roundCount : count) - revealed.length)
  const chance = active ? gemsLeft / (25 - revealed.length) * 100 : 0
  const nextProfit = active && next > 0 ? Math.floor(roundStake * next * 100 + 1e-7) / 100 - roundStake : 0
  useEffect(() => {
    let cancelled = false
    resumeMinesGame()
      .then((res) => {
        if (!res || cancelled) return
        setRound(res.roundId)
        setAmount(String(res.betAmount))
        setCount(res.minesCount)
        setRoundCount(res.minesCount)
        setRoundStake(res.betAmount)
        setRevealed(res.revealedIndices)
        setMult(res.currentMultiplier)
        setNext(res.nextMultiplier)
        setPhase("playing")
      })
      .catch(() => {
        /* Signing in is required when a player starts a round. */
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])
  async function run(action: "start" | "reveal" | "cashout", tile?: number) {
    if (lock.current || !ready) return
    const startsRound = action === "start" || (action === "reveal" && phase === "idle")
    if (
      startsRound &&
      (!Number.isFinite(stake) ||
        stake <= 0 ||
        Math.abs(stake * 100 - Math.round(stake * 100)) > 1e-7)
    ) {
      setError("Enter a positive bet with at most two decimal places.")
      return
    }
    if (!startsRound && !active) return
    lock.current = true
    setBusy(true)
    setError("")
    setPending(tile ?? null)
    try {
      let currentRound = round
      if (startsRound) {
        const options = { betAmount: stake, minesCount: count }
        const res = await startMinesGame({
          ...options,
          requestId: request.requestId(options),
        })
        request.complete()
        setRoundStake(stake)
        setRoundCount(count)
        currentRound = res.roundId
        setRound(res.roundId)
        setRevealed([])
        setMines([])
        setHit(null)
        setPayout(0)
        setMult(res.currentMultiplier)
        setNext(res.nextMultiplier)
        setPhase("playing")
      }
      if (action !== "start") {
        const res =
          action === "cashout"
            ? await cashoutMines(currentRound)
            : await revealMinesTile(currentRound, tile!)
        if (res.revealedIndices) setRevealed(res.revealedIndices)
        setMult(res.currentMultiplier ?? res.multiplier ?? 0)
        setNext(res.nextMultiplier ?? 0)
        if (res.gameOver) {
          setMines(res.mineIndices ?? res.allMines ?? [])
          setPayout(res.payout)
          setHit(res.isMine ? (tile ?? null) : null)
          setPhase(
            res.refunded
              ? "refunded"
              : res.isMine || res.payout === 0
                ? "lost"
                : "won"
          )
        }
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Connection interrupted. Retry the same action safely."
      )
    } finally {
      lock.current = false
      setBusy(false)
      setPending(null)
    }
  }
  function resetGame() {
    if (lock.current) return
    request.complete()
    setRound("")
    setRevealed([])
    setMines([])
    setHit(null)
    setPayout(0)
    setRoundStake(0)
    setMult(1)
    setNext(1)
    setPending(null)
    setError("")
    setPhase("idle")
  }
  function randomTile() {
    const options = Array.from({ length: 25 }, (_, i) => i).filter(
      (i) => !revealed.includes(i)
    )
    const tile = options[Math.floor(Math.random() * options.length)]
    if (tile !== undefined) void run("reveal", tile)
  }
  return (
    <section className={styles.game} aria-label={`${gameId} game`}>
      {error && <div className={styles.errorToast} role="alert" aria-live="assertive">
        <span className={styles.toastIcon}><TriangleAlert size={20}/></span>
        <div><strong>Error</strong><p>{/insufficient|enough balance/i.test(error) ? "You do not have enough balance to do that." : error}</p></div>
        <button type="button" aria-label="Dismiss error" onClick={()=>setError("")}><X size={18}/></button>
      </div>}
      <div className={styles.boardPanel}>
        <div className={styles.boardStage}>
        <div
          className={`${styles.board} ${phase === "lost" ? styles.shake : ""}`}
          aria-label="Mines board"
        >
          {Array.from({ length: 25 }, (_, i) => {
            const selected = revealed.includes(i),
              mine = mines.includes(i),
              show = selected || ended
            return (
              <button
                key={`${round}-${i}`}
                type="button"
                aria-label={`Tile ${i + 1}${show ? (mine ? ": mine" : ": gem") : ": hidden"}`}
                disabled={!ready || busy || ended || (active && selected)}
                onClick={() => void run("reveal", i)}
                className={`${styles.tile} ${show ? styles.open : ""} ${selected ? styles.selected : ""} ${hit === i ? styles.hit : ""} ${ended && !selected && hit !== i ? styles.dim : ""}`}
              >
                {pending === i ? (
                  <LoaderCircle className={styles.spinner} />
                ) : show ? (
                  <img
                    className={styles.symbol}
                    src={
                      mine
                        ? hit === i
                          ? "/games/mine-hit.svg"
                          : "/games/mine.svg"
                        : "/games/gem.svg"
                    }
                    alt=""
                    draggable={false}
                  />
                ) : (
                  null
                )}
              </button>
            )
          })}
        </div>
        {ended && <div className={styles.resultLayer} role="status" aria-live="polite">
          <div className={`${styles.resultCard} ${phase === "lost" ? styles.resultLoss : phase === "refunded" ? styles.resultRefund : ""}`}>
            <span className={styles.resultLabel}>{phase === "won" ? "Cashed out" : phase === "lost" ? "Mine hit" : "Refunded"}</span>
            <strong>{phase === "refunded" ? "1.00" : mult.toFixed(2)}×</strong>
            <span className={styles.resultDivider}/>
            <span className={styles.resultPayout}>₹{payout.toLocaleString("en-IN", {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
          </div>
        </div>}
        </div>
        <div className={styles.roundBar}>
          <button type="button" disabled={!ended || busy || !ready} onClick={()=>void run("start")} title="Start another round with the selected bet and mine count"><RotateCcw size={12}/> Repeat</button>
          <div className={styles.multiplierHover} tabIndex={0} aria-label={`Current multiplier ${mult.toFixed(2)} times`} aria-describedby="mines-next-pick">
            <span className={styles.multiplierPill}><ArrowRightToLine size={17}/>{mult.toFixed(2)}×</span>
            <div id="mines-next-pick" role="tooltip" className={styles.pickTooltip}>
              <span className={styles.tooltipHeading}>{active ? "Next gem" : "No active round"}</span>
              <div className={styles.tooltipGrid}>
                <div><span>Profit on win</span><strong>{active && next > 0 ? `₹${nextProfit.toFixed(2)}` : "—"}</strong></div>
                <div><span>Gem chance</span><strong>{active ? `${chance.toFixed(6)}%` : "—"}</strong></div>
                <div className={styles.tooltipWide}><span>Gems left</span><strong>{active ? gemsLeft : "—"}</strong></div>
              </div>
            </div>
          </div>
          <button type="button" disabled={!ended || busy || !ready} onClick={resetGame}>Clear <RotateCcw size={12}/></button>
        </div>
        {ended && <div className={`${styles.status} ${phase === "lost" ? styles.loss : ""}`} role="status" aria-live="polite">
          {phase === "won" ? `Cashed out ₹${payout.toFixed(2)}` : phase === "refunded" ? `Round refunded · ₹${payout.toFixed(2)}` : `Mine hit · Lost ₹${roundStake.toFixed(2)}`}
        </div>}
      </div>
      <div className={styles.controls}>
        <div className={styles.title}>
          <span>MINES</span>
          <span className={styles.manual}>Manual play</span>
        </div>
        <label htmlFor="mines-stake">
          Bet amount <span>INR</span>
        </label>
        <div className={styles.inputGroup}>
          <input
            id="mines-stake"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            value={amount}
            disabled={active || busy || !ready}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            disabled={active || busy || !ready}
            onClick={() =>
              setAmount(String(Math.max(0.01, Math.floor(stake * 50) / 100)))
            }
          >
            ½
          </button>
          <button
            disabled={active || busy || !ready}
            onClick={() => setAmount(String(Math.round(stake * 200) / 100))}
          >
            2×
          </button>
        </div>
        <div className={styles.mineSliderGroup}>
          <label htmlFor="mines-count"><span>Mines</span><span>Gems</span></label>
          <div className={styles.mineSliderRow}>
            <output htmlFor="mines-count">{count}</output>
            <input id="mines-count" type="range" min={1} max={24} step={1} value={count} disabled={active || busy || !ready} aria-label="Number of mines" aria-valuetext={`${count} mines, ${25-count} gems`} onChange={e=>setCount(Number(e.target.value))}/>
            <output htmlFor="mines-count">{25-count}</output>
          </div>
        </div>
        <div className={styles.presets}>
          {[1, 3, 5, 10, 24].map((n) => (
            <button
              key={n}
              aria-pressed={count === n}
              disabled={active || busy || !ready}
              onClick={() => setCount(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <div className={styles.summary}>
          <div>
            <span>Current multiplier</span>
            <strong>{active || ended ? mult.toFixed(2) : "1.00"}×</strong>
          </div>
          <div>
            <span>{ended ? "Net result" : "Potential profit"}</span>
            <strong
              className={phase === "lost" ? styles.negative : styles.positive}
            >
              ₹
              {(ended
                ? payout - roundStake
                : active && revealed.length
                  ? cash - roundStake
                  : 0
              ).toFixed(2)}
            </strong>
          </div>
          {active && next > 0 && (
            <div>
              <span>Next gem</span>
              <strong>{next.toFixed(2)}×</strong>
            </div>
          )}
        </div>
        <button
          className={styles.primary}
          disabled={!ready || busy || (active && revealed.length === 0)}
          onClick={() => ended ? resetGame() : void run(active ? "cashout" : "start")}
        >
          {busy ? (
            <>
              <LoaderCircle className={styles.spinner} /> Processing…
            </>
          ) : active ? (
            `Cash out ₹${cash.toFixed(2)}`
          ) : ended ? (
            "Play again"
          ) : (
            "Start game"
          )}
        </button>
        {active && (
          <button
            className={styles.random}
            disabled={busy}
            onClick={randomTile}
          >
            <Shuffle size={16} /> Pick a random tile
          </button>
        )}
        <p className={styles.help}>
          Reveal gems to increase your multiplier. A mine ends the round. Cash
          out after any gem to collect your payout.
        </p>
      </div>
    </section>
  )
}
