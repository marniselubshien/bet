export * from "./game-utils"
export * from "./catalog"
export * from "./games/mines"
import { dice } from "./games/dice"
import { limbo } from "./games/limbo"
import { coinflip } from "./games/coinflip"
import { plinko } from "./games/plinko"
import { wheel } from "./games/wheel"
import { keno } from "./games/keno"
import { slides, darts } from "./games/arcade"
const instantEngines = {
  slides,
  darts,
  dice,
  limbo,
  coinflip,
  plinko,
  wheel,
  keno,
}
export function instantOutcome(game: string, input: Record<string, unknown>) {
  if (!Object.hasOwn(instantEngines, game))
    throw new Error("Unsupported instant game")
  return instantEngines[game as keyof typeof instantEngines](input)
}
