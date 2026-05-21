import { INITIAL_DRAGON_WIND_VALUE } from './gameConfig'
import type {
  DragonWindKind,
  Suit,
  TileCategory,
  TileInstance,
  TileKind,
} from './types'

export const DRAGON_KINDS = [
  'dragon_red',
  'dragon_green',
  'dragon_white',
] as const

export const WIND_KINDS = [
  'wind_east',
  'wind_south',
  'wind_west',
  'wind_north',
] as const

export const SUITS: Suit[] = ['characters', 'bamboo', 'dots']

export function createDefaultKindValues(): Record<DragonWindKind, number> {
  const values = {} as Record<DragonWindKind, number>
  for (const kind of [...DRAGON_KINDS, ...WIND_KINDS]) {
    values[kind] = INITIAL_DRAGON_WIND_VALUE
  }
  return values
}

export function getTileCategory(kind: TileKind): TileCategory {
  if (kind.startsWith('dragon_')) return 'dragon'
  if (kind.startsWith('wind_')) return 'wind'
  return 'number'
}

export function getTileRank(kind: TileKind): number | undefined {
  const category = getTileCategory(kind)
  if (category !== 'number') return undefined
  const rank = Number(kind.split('_')[1])
  return rank
}

let instanceCounter = 0

export function resetInstanceCounter(): void {
  instanceCounter = 0
}

export function createTileInstance(kind: TileKind): TileInstance {
  instanceCounter += 1
  const category = getTileCategory(kind)
  return {
    instanceId: `${kind}-${instanceCounter}`,
    kind,
    category,
    rank: category === 'number' ? getTileRank(kind) : undefined,
  }
}

export function getTileValue(
  tile: TileInstance,
  kindValues: Record<DragonWindKind, number>,
): number {
  if (tile.category === 'number') {
    return tile.rank ?? 0
  }
  return kindValues[tile.kind as DragonWindKind]
}

export function handTotal(
  hand: TileInstance[],
  kindValues: Record<DragonWindKind, number>,
): number {
  return hand.reduce((sum, tile) => sum + getTileValue(tile, kindValues), 0)
}

export function getTileLabel(kind: TileKind): string {
  if (kind.startsWith('dragon_')) {
    const color = kind.replace('dragon_', '')
    return `${color.charAt(0).toUpperCase()}${color.slice(1)} Dragon`
  }
  if (kind.startsWith('wind_')) {
    const dir = kind.replace('wind_', '')
    return `${dir.charAt(0).toUpperCase()}${dir.slice(1)} Wind`
  }
  const [suit, rank] = kind.split('_')
  const suitLabel =
    suit === 'characters' ? 'Characters' : suit === 'bamboo' ? 'Bamboo' : 'Dots'
  return `${rank} ${suitLabel}`
}
