import { DECK_SIZE } from './gameConfig'
import {
  createTileInstance,
  DRAGON_KINDS,
  resetInstanceCounter,
  SUITS,
  WIND_KINDS,
} from './tiles'
import type { TileInstance, TileKind } from './types'

export function createDeck(): TileInstance[] {
  resetInstanceCounter()
  const tiles: TileInstance[] = []

  for (const suit of SUITS) {
    for (let rank = 1; rank <= 9; rank += 1) {
      const kind = `${suit}_${rank}` as TileKind
      for (let copy = 0; copy < 4; copy += 1) {
        tiles.push(createTileInstance(kind))
      }
    }
  }

  for (const kind of DRAGON_KINDS) {
    for (let copy = 0; copy < 4; copy += 1) {
      tiles.push(createTileInstance(kind))
    }
  }

  for (const kind of WIND_KINDS) {
    for (let copy = 0; copy < 4; copy += 1) {
      tiles.push(createTileInstance(kind))
    }
  }

  if (tiles.length !== DECK_SIZE) {
    throw new Error(`Expected ${DECK_SIZE} tiles, got ${tiles.length}`)
  }

  return tiles
}

export function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function drawTiles(
  drawPile: TileInstance[],
  count: number,
): { drawPile: TileInstance[]; drawn: TileInstance[] } {
  const pile = [...drawPile]
  const drawn: TileInstance[] = []
  while (drawn.length < count && pile.length > 0) {
    drawn.push(pile.pop()!)
  }
  return { drawPile: pile, drawn }
}
