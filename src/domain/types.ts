export type Suit = 'characters' | 'bamboo' | 'dots'

export type DragonKind = 'dragon_red' | 'dragon_green' | 'dragon_white'
export type WindKind = 'wind_east' | 'wind_south' | 'wind_west' | 'wind_north'
export type DragonWindKind = DragonKind | WindKind

export type NumberKind = `${Suit}_${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
export type TileKind = NumberKind | DragonKind | WindKind

export type TileCategory = 'number' | 'dragon' | 'wind'

export interface TileInstance {
  instanceId: string
  kind: TileKind
  category: TileCategory
  rank?: number
}

export type BetDirection = 'higher' | 'lower'
export type BetOutcome = 'win' | 'loss' | 'push'

export interface HandSnapshot {
  handA: TileInstance[]
  totalA: number
  handB: TileInstance[]
  totalB: number
  bet: BetDirection
  outcome: BetOutcome
}

export type GamePhase = 'playing' | 'gameOver'

export interface GameState {
  phase: GamePhase
  score: number
  drawPile: TileInstance[]
  discardPile: TileInstance[]
  currentHand: TileInstance[]
  kindValues: Record<DragonWindKind, number>
  history: HandSnapshot[]
  drawExhaustionCount: number
  gameOverReason?: string
}

export type AppView = 'landing' | 'game' | 'gameOver'
