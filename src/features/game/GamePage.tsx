import { HandDisplay } from '../../components/HandDisplay'
import { HistoryList } from '../../components/HistoryList'
import { PileBadge } from '../../components/PileBadge'
import { useGameStore } from '../../store/gameStore'
import './GamePage.css'

export function GamePage() {
  const game = useGameStore((s) => s.game)
  const isResolving = useGameStore((s) => s.isResolving)
  const placeBet = useGameStore((s) => s.placeBet)
  const exitToLanding = useGameStore((s) => s.exitToLanding)

  if (!game) return null

  const handleExit = () => {
    if (game.history.length > 0) {
      const ok = window.confirm('Leave this game? Progress will not be saved to the leaderboard.')
      if (!ok) return
    }
    exitToLanding()
  }

  return (
    <div className="game-page">
      <header className="game-page__header"> 
        <button type="button" className="btn btn-secondary" onClick={handleExit}>
          Exit
        </button>
        <div className="game-page__score">
          Score: <strong>{game.score}</strong>
        </div>
      </header>

      <section className="game-page__piles panel">
        <PileBadge label="Draw pile" count={game.drawPile.length} />
        <PileBadge label="Discard pile" count={game.discardPile.length} />
        <div className="game-page__exhaustion">
          Draw exhaustions: {game.drawExhaustionCount} / 3
        </div>
      </section>

      <section className="game-page__hand panel">
        <h2 className="game-page__section-title">Current hand</h2>
        <HandDisplay
          hand={game.currentHand}
          kindValues={game.kindValues}
          animating={isResolving}
        />
        <div className="game-page__bet-actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled={isResolving}
            onClick={() => placeBet('higher')}
          >
            Bet Higher
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={isResolving}
            onClick={() => placeBet('lower')}
          >
            Bet Lower
          </button>
        </div>
      </section>

      <section className="game-page__history panel">
        <h2 className="game-page__section-title">History</h2>
        <HistoryList history={game.history} kindValues={game.kindValues} />
      </section>
    </div>
  )
}
