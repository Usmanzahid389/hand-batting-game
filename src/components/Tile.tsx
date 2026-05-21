import { getTileLabel, getTileValue } from '../domain/tiles'
import type { DragonWindKind, TileInstance } from '../domain/types'
import './Tile.css'

interface TileProps {
  tile: TileInstance
  kindValues: Record<DragonWindKind, number>
  size?: 'sm' | 'md' | 'lg'
}

export function Tile({ tile, kindValues, size = 'md' }: TileProps) {
  const value = getTileValue(tile, kindValues)
  const isDynamic = tile.category !== 'number'
  const suitClass =
    tile.category === 'number' ? tile.kind.split('_')[0] : tile.category

  return (
    <div
      className={`tile tile--${size} tile--${suitClass}`}
      title={getTileLabel(tile.kind)}
    >
      <span className="tile__label">{getTileLabel(tile.kind)}</span>
      <span className={`tile__value ${isDynamic ? 'tile__value--dynamic' : ''}`}>
        {value}
      </span>
    </div>
  )
}
