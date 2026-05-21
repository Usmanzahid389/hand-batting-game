import { describe, expect, it } from 'vitest'
import { createDeck } from './deck'
import {
  createInitialGame,
  drawHandFromState,
  handleDrawEmpty,
  placeBet,
} from './gameEngine'
import { HAND_SIZE } from './gameConfig'
import {
  createDefaultKindValues,
  createTileInstance,
  handTotal,
  resetInstanceCounter,
} from './tiles'
import type { GameState, TileInstance } from './types'

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    phase: 'playing',
    score: 0,
    drawPile: [],
    discardPile: [],
    currentHand: [],
    kindValues: createDefaultKindValues(),
    history: [],
    drawExhaustionCount: 0,
    ...overrides,
  }
}

function numberHand(ranks: number[]): TileInstance[] {
  resetInstanceCounter()
  return ranks.map((rank) => createTileInstance(`characters_${rank}` as TileInstance['kind']))
}

describe('handleDrawEmpty', () => {
  it('reshuffles on first and second exhaustion', () => {
    const discard = createDeck().slice(0, 10)
    let state = makeState({ discardPile: discard, drawExhaustionCount: 0 })

    state = handleDrawEmpty(state)
    expect(state.drawExhaustionCount).toBe(1)
    expect(state.phase).toBe('playing')
    expect(state.drawPile.length).toBeGreaterThan(0)
    expect(state.discardPile).toHaveLength(0)

    state = { ...state, drawPile: [], discardPile: discard }
    state = handleDrawEmpty(state)
    expect(state.drawExhaustionCount).toBe(2)
    expect(state.phase).toBe('playing')
  })

  it('ends game on third draw exhaustion', () => {
    const state = makeState({ drawExhaustionCount: 2 })
    const result = handleDrawEmpty(state)
    expect(result.phase).toBe('gameOver')
    expect(result.drawExhaustionCount).toBe(3)
  })
})

describe('placeBet', () => {
  it('awards score and increases dragon value on win', () => {
    resetInstanceCounter()
    const handA = numberHand([1, 1, 1, 1, 1])
    const handB = [
      ...numberHand([9, 9, 9]),
      createTileInstance('dragon_red'),
      createTileInstance('dragon_red'),
    ]

    const state = makeState({
      currentHand: handA,
      drawPile: handB,
    })

    const totalBBefore = handTotal(handB, state.kindValues)
    const next = placeBet(state, 'higher')
    expect(next.history).toHaveLength(1)
    expect(next.history[0].outcome).toBe('win')
    expect(next.score).toBe(totalBBefore)
    expect(next.kindValues.dragon_red).toBe(6)
    expect(next.currentHand).toHaveLength(HAND_SIZE)
    expect(handTotal(next.currentHand, next.kindValues)).toBe(
      handTotal(handB, next.kindValues),
    )
    expect(next.discardPile).toHaveLength(handA.length)
  })

  it('decreases dragon value on loss without score change', () => {
    resetInstanceCounter()
    const handA = numberHand([9, 9, 9, 9, 9])
    const handB = [
      ...numberHand([1, 1, 1]),
      createTileInstance('dragon_green'),
      createTileInstance('dragon_green'),
    ]

    const state = makeState({
      currentHand: handA,
      drawPile: handB,
      score: 10,
    })

    const next = placeBet(state, 'higher')
    expect(next.history[0].outcome).toBe('loss')
    expect(next.score).toBe(10)
    expect(next.kindValues.dragon_green).toBe(4)
  })

  it('push does not change score or kind values', () => {
    resetInstanceCounter()
    const handA = numberHand([5, 5, 5, 5, 5])
    const handB = numberHand([5, 5, 5, 5, 5])

    const state = makeState({
      currentHand: handA,
      drawPile: handB,
      kindValues: { ...createDefaultKindValues(), dragon_red: 6 },
    })

    const next = placeBet(state, 'higher')
    expect(next.history[0].outcome).toBe('push')
    expect(next.score).toBe(0)
    expect(next.kindValues.dragon_red).toBe(6)
  })

  it('ends game when kind value hits 10', () => {
    resetInstanceCounter()
    const handA = numberHand([1, 1, 1, 1, 1])
    const handB = [createTileInstance('wind_east')]

    const kindValues = createDefaultKindValues()
    kindValues.wind_east = 9

    const state = makeState({
      currentHand: handA,
      drawPile: [...handB, ...numberHand([9, 9, 9, 9])],
      kindValues,
    })

    const next = placeBet(state, 'higher')
    expect(next.phase).toBe('gameOver')
    expect(next.kindValues.wind_east).toBe(10)
  })
})

describe('drawHandFromState', () => {
  it('triggers reshuffle when draw pile is empty', () => {
    const discard = createDeck().slice(0, 20)
    const state = makeState({ drawPile: [], discardPile: discard })

    const result = drawHandFromState(state, HAND_SIZE)
    expect('hand' in result).toBe(true)
    if ('hand' in result) {
      expect(result.hand).toHaveLength(HAND_SIZE)
      expect(result.state.drawExhaustionCount).toBe(1)
    }
  })
})

describe('createInitialGame', () => {
  it('starts in playing phase with default kind values', () => {
    const game = createInitialGame()
    expect(game.phase).toBe('playing')
    expect(game.kindValues.dragon_red).toBe(5)
    expect(game.score).toBe(0)
  })
})
