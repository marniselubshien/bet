import { randomInt } from "node:crypto"
import { finite } from "../game-utils"
export type JourneyState = { traps: number[]; choices: number[] }
export const journeyMultiplier = (step: number) =>
  step === 0 ? 1 : Math.floor((0.99 / Math.pow(0.75, step)) * 1000000) / 1000000
export const newJourney = (): JourneyState => ({
  traps: Array.from({ length: 8 }, () => randomInt(4)),
  choices: [],
})
export function journeyView(state: JourneyState) {
  const step = state.choices.length
  return {
    step,
    choices: state.choices,
    currentMultiplier: journeyMultiplier(step),
    nextMultiplier:
      step < 8 ? journeyMultiplier(step + 1) : journeyMultiplier(8),
  }
}
export function advanceJourney(state: JourneyState, tile: unknown) {
  finite(tile, 0, 31, "tile")
  if (!Number.isInteger(tile)) throw new Error("Invalid tile")
  const index = Number(tile)
  const step = state.choices.length
  if (Math.floor(index / 4) < step)
    return { state, replayed: true, lost: false }
  if (Math.floor(index / 4) !== step || step >= 8)
    throw new Error("Choose a tile on the next level")
  const choice = index % 4
  const lost = choice === state.traps[step]
  return {
    state: { ...state, choices: [...state.choices, choice] },
    replayed: false,
    lost,
  }
}
