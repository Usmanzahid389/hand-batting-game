import { getLeaderboard } from '../../lib/leaderboard'
import { useGameStore } from '../../store/gameStore'
import './LandingPage.css'

export function LandingPage() {
  const startNewGame = useGameStore((s) => s.startNewGame)
  const leaderboard = getLeaderboard()

  return (
    <div className="landing">
      <header className="landing__header">
        <h1 className="title">Hand Betting Game</h1>
        <p className="subtitle">
          Mahjong hi-lo betting — predict whether the next hand beats the current total.
        </p>
      </header>

      <div className="landing__actions panel">
        <button type="button" className="btn btn-primary landing__new-game" onClick={startNewGame}>
          New Game
        </button>
      </div>

      <section className="landing__leaderboard panel">
        <h2 className="landing__section-title">Leaderboard</h2>
        {leaderboard.length === 0 ? (
          <p className="landing__empty">No scores yet. Finish a game to claim the top spot.</p>
        ) : (
          <ol className="landing__list">
            {leaderboard.map((entry, index) => (
              <li key={`${entry.initials}-${entry.date}`} className="landing__entry">
                <span className="landing__rank">{index + 1}</span>
                <span className="landing__initials">{entry.initials}</span>
                <span className="landing__score">{entry.score}</span>
                <span className="landing__date">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
