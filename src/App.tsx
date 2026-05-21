import { GameOverPage } from './features/gameOver/GameOverPage'
import { GamePage } from './features/game/GamePage'
import { LandingPage } from './features/landing/LandingPage'
import { useGameStore } from './store/gameStore'
import './styles/global.css'

function App() {
  const view = useGameStore((s) => s.view)

  return (
    <div className="app">
      {view === 'landing' && <LandingPage />}
      {view === 'game' && <GamePage />}
      {view === 'gameOver' && <GameOverPage />}
    </div>
  )
}

export default App
 