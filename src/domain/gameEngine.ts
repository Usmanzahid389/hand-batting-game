import { createDeck, drawTiles, shuffle } from './deck'
import { HAND_SIZE } from './gameConfig'
import { checkGameOver, markGameOver } from './gameOver'
import { resolveBetOutcome, scoreForOutcome } from './scoring'
import { createDefaultKindValues, handTotal } from './tiles'
import type { BetDirection, DragonWindKind, GameState, TileInstance } from './types'

function adjustKindValuesForHand(
  hand: TileInstance[],
  kindValues: Record<DragonWindKind, number>,
  delta: number,
): Record<DragonWindKind, number> {
  const next = { ...kindValues }
  const adjusted = new Set<DragonWindKind>()

  for (const tile of hand) {
    if (tile.category === 'number') continue
    const kind = tile.kind as DragonWindKind
    if (adjusted.has(kind)) continue
    adjusted.add(kind)
    next[kind] += delta
  }

  return next
}

function reshuffleDrawPile(
  discardPile: TileInstance[],
): { drawPile: TileInstance[]; discardPile: TileInstance[] } {
  const merged = shuffle([...createDeck(), ...discardPile])
  return { drawPile: merged, discardPile: [] }
}

export function handleDrawEmpty(state: GameState): GameState {
  const nextExhaustion = state.drawExhaustionCount + 1

  if (nextExhaustion >= 3) {
    return markGameOver(
      { ...state, drawExhaustionCount: nextExhaustion },
      'Draw pile exhausted for the 3rd time',
    )
  }

  const { drawPile, discardPile } = reshuffleDrawPile(state.discardPile)
  return {
    ...state,
    drawExhaustionCount: nextExhaustion,
    drawPile,
    discardPile,
  }
}

export function drawHandFromState(
  state: GameState,
  count: number,
): { state: GameState; hand: TileInstance[] } | { state: GameState; gameOver: true } {
  let current = state
  const hand: TileInstance[] = []

  while (hand.length < count) {
    if (current.drawPile.length === 0) {
      current = handleDrawEmpty(current)
      if (current.phase === 'gameOver') {
        return { state: current, gameOver: true }
      }
    }

    const needed = count - hand.length
    const { drawPile, drawn } = drawTiles(current.drawPile, needed)
    hand.push(...drawn)
    current = { ...current, drawPile }
  }

  return { state: current, hand }
}

export function createInitialGame(): GameState {
  const shuffled = shuffle(createDeck())
  const currentHand = shuffled.slice(0, HAND_SIZE)
  const drawPile = shuffled.slice(HAND_SIZE)

  return {
    phase: 'playing',
    score: 0,
    drawPile,
    discardPile: [],
    currentHand,
    kindValues: createDefaultKindValues(),
    history: [],
    drawExhaustionCount: 0,
  }
}

export function placeBet(
  state: GameState,
  bet: BetDirection,
): GameState {
  if (state.phase !== 'playing') return state

  const handA = state.currentHand
  const totalA = handTotal(handA, state.kindValues)

  let working: GameState = {
    ...state,
    discardPile: [...state.discardPile, ...handA],
  }

  const drawResult = drawHandFromState(working, HAND_SIZE)
  if ('gameOver' in drawResult) {
    return drawResult.state
  }

  working = drawResult.state
  const handB = drawResult.hand
  const totalB = handTotal(handB, working.kindValues)

  const outcome = resolveBetOutcome(totalA, totalB, bet)
  let kindValues = working.kindValues
  let score = working.score

  if (outcome === 'win') {
    score += scoreForOutcome(outcome, totalB)
    kindValues = adjustKindValuesForHand(handB, kindValues, 1)
  } else if (outcome === 'loss') {
    kindValues = adjustKindValuesForHand(handB, kindValues, -1)
  }

  const snapshot = {
    handA,
    totalA,
    handB,
    totalB,
    bet,
    outcome,
  }

  const next: GameState = {
    ...working,
    score,
    kindValues,
    currentHand: handB,
    history: [...working.history, snapshot],
  }

  const over = checkGameOver(next)
  return over ?? next
}
