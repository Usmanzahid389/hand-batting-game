import { handTotal } from '../domain/tiles'
import type { DragonWindKind, TileInstance } from '../domain/types'
import { Tile } from './Tile'
import './HandDisplay.css'

interface HandDisplayProps {
  hand: TileInstance[]
  kindValues: Record<DragonWindKind, number>
  animating?: boolean
}

export function HandDisplay({ hand, kindValues, animating }: HandDisplayProps) {
  const total = handTotal(hand, kindValues)

  return (
    <div className={`hand-display ${animating ? 'hand-display--animating' : ''}`}>
      <div className="hand-display__tiles">
        {hand.map((tile) => (
          <Tile key={tile.instanceId} tile={tile} kindValues={kindValues} size="lg" />
        ))}
      </div>
      <div className="hand-display__total">
        <span className="hand-display__total-label">Hand total</span>
        <span className="hand-display__total-value">{total}</span>
      </div>
    </div>
  )
}
