import {
  MAX_DRAGON_WIND_VALUE,
  MAX_DRAW_EXHAUSTIONS,
  MIN_DRAGON_WIND_VALUE,
} from './gameConfig'
import { DRAGON_KINDS, WIND_KINDS } from './tiles'
import type { DragonWindKind, GameState } from './types'

export function getKindValueViolation(
  kindValues: Record<DragonWindKind, number>,
): DragonWindKind | null {
  for (const kind of [...DRAGON_KINDS, ...WIND_KINDS]) {
    const value = kindValues[kind]
    if (value <= MIN_DRAGON_WIND_VALUE || value >= MAX_DRAGON_WIND_VALUE) {
      return kind
    }
  }
  return null
}

export function checkGameOver(state: GameState): GameState | null {
  const violatedKind = getKindValueViolation(state.kindValues)
  if (violatedKind) {
    const value = state.kindValues[violatedKind]
    return {
      ...state,
      phase: 'gameOver', 
      gameOverReason: `Tile value reached ${value} (${violatedKind.replace(/_/g, ' ')})`,
    }
  }

  if (state.drawExhaustionCount >= MAX_DRAW_EXHAUSTIONS) {
    return {
      ...state,
      phase: 'gameOver',
      gameOverReason: 'Draw pile exhausted for the 3rd time',
    }
  }

  return null
}

export function markGameOver(state: GameState, reason: string): GameState {
  return {
    ...state,
    phase: 'gameOver',
    gameOverReason: reason,
  }
}
