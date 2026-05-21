import type { DragonWindKind, HandSnapshot } from '../domain/types'
import { Tile } from './Tile'
import './HistoryList.css'

interface HistoryListProps {
  history: HandSnapshot[]
  kindValues: Record<DragonWindKind, number>
}

export function HistoryList({ history, kindValues }: HistoryListProps) {
  if (history.length === 0) {
    return <p className="history-list__empty">No rounds yet — place your first bet.</p>
  }

  return (
    <div className="history-list">
      {history.map((entry, index) => (
        <article
          key={`${entry.totalB}-${index}`}
          className={`history-list__item history-list__item--${entry.outcome}`}
          style={{ animationDelay: `${index * 40}ms` }}
        >
          <header className="history-list__header">
            <span className="history-list__bet">
              Bet {entry.bet === 'higher' ? 'Higher' : 'Lower'}
            </span>
            <span className={`history-list__outcome history-list__outcome--${entry.outcome}`}>
              {entry.outcome}
            </span>
          </header>
          <div className="history-list__row">
            <div className="history-list__hand-group">
              <span className="history-list__hand-label">A ({entry.totalA})</span>
              <div className="history-list__tiles">
                {entry.handA.map((tile) => (
                  <Tile key={tile.instanceId} tile={tile} kindValues={kindValues} size="sm" />
                ))}
              </div>
            </div>
            <div className="history-list__hand-group">
              <span className="history-list__hand-label">B ({entry.totalB})</span>
              <div className="history-list__tiles">
                {entry.handB.map((tile) => (
                  <Tile key={tile.instanceId} tile={tile} kindValues={kindValues} size="sm" />
                ))}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
