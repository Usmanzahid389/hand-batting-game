import { describe, expect, it } from 'vitest'
import { createDeck, shuffle } from './deck'
import { DECK_SIZE, HAND_SIZE } from './gameConfig'
import { createInitialGame } from './gameEngine'

describe('deck', () => {
  it('creates 136 tiles', () => {
    expect(createDeck()).toHaveLength(DECK_SIZE)
  })

  it('shuffle preserves all tiles', () => {
    const deck = createDeck()
    const shuffled = shuffle(deck)
    expect(shuffled).toHaveLength(DECK_SIZE)
    const ids = new Set(shuffled.map((t) => t.instanceId))
    expect(ids.size).toBe(DECK_SIZE)
  })

  it('initial game deals correct pile sizes', () => {
    const game = createInitialGame()
    expect(game.currentHand).toHaveLength(HAND_SIZE)
    expect(game.drawPile).toHaveLength(DECK_SIZE - HAND_SIZE)
    expect(game.discardPile).toHaveLength(0)
    expect(game.drawExhaustionCount).toBe(0)
  }) 
})
