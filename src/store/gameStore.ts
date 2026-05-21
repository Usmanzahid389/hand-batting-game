import { create } from 'zustand'
import { createInitialGame, placeBet } from '../domain/gameEngine'
import type { AppView, BetDirection, GameState } from '../domain/types'

interface GameStore {
  view: AppView
  game: GameState | null
  isResolving: boolean
  startNewGame: () => void
  placeBet: (bet: BetDirection) => void
  exitToLanding: () => void
  goToLanding: () => void
  setView: (view: AppView) => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  view: 'landing',
  game: null,
  isResolving: false,

  startNewGame: () => {
    set({ game: createInitialGame(), view: 'game', isResolving: false })
  },

  placeBet: (bet) => {
    const { game, isResolving } = get()
    if (!game || game.phase !== 'playing' || isResolving) return

    set({ isResolving: true })
    window.setTimeout(() => {
      const next = placeBet(game, bet)
      set({
        game: next,
        isResolving: false,
        view: next.phase === 'gameOver' ? 'gameOver' : 'game',
      })
    }, 320)
  },

  exitToLanding: () => {
    set({ view: 'landing', game: null, isResolving: false })
  },

  goToLanding: () => {
    set({ view: 'landing', game: null, isResolving: false })
  },

  setView: (view) => set({ view }),
}))
