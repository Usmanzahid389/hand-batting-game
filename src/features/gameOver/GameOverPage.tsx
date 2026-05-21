import { useState } from 'react'
import {
  addLeaderboardEntry,
  qualifiesForLeaderboard,
} from '../../lib/leaderboard'
import { useGameStore } from '../../store/gameStore'
import './GameOverPage.css'

export function GameOverPage() {
  const game = useGameStore((s) => s.game)
  const goToLanding = useGameStore((s) => s.goToLanding)
  const [initials, setInitials] = useState('')
  const [saved, setSaved] = useState(false)

  if (!game) return null

  const canSave = qualifiesForLeaderboard(game.score) && !saved

  const handleSave = () => {
    addLeaderboardEntry(initials, game.score)
    setSaved(true)
  }

  return (
    <div className="game-over panel">
      <h1 className="title">Game Over</h1>
      <p className="game-over__reason">{game.gameOverReason}</p>
      <p className="game-over__score">
        Final score: <strong>{game.score}</strong>
      </p>

      {canSave && (
        <div className="game-over__leaderboard-form">
          <label htmlFor="initials">Enter initials for the leaderboard (3 chars)</label>
          <input
            id="initials"
            type="text"
            maxLength={3}
            value={initials}
            onChange={(e) => setInitials(e.target.value)}
            placeholder="ABC"
          />
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save score
          </button>
        </div>
      )}

      {saved && <p className="game-over__saved">Score saved to leaderboard.</p>}

      {!canSave && !saved && game.score > 0 && (
        <p className="game-over__hint">Score did not make the top 5.</p>
      )}

      <button type="button" className="btn btn-secondary game-over__again" onClick={goToLanding}>
        Play Again
      </button>
    </div>
  )
}
