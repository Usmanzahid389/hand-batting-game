import { LEADERBOARD_SIZE } from '../domain/gameConfig'

export interface LeaderboardEntry {
  initials: string
  score: number
  date: string
}

const STORAGE_KEY = 'hand-betting-leaderboard'

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as LeaderboardEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function addLeaderboardEntry(
  initials: string,
  score: number,
): LeaderboardEntry[] {
  const entry: LeaderboardEntry = {
    initials: initials.trim().slice(0, 3).toUpperCase() || 'ANO',
    score,
    date: new Date().toISOString(),
  }

  const next = [...getLeaderboard(), entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, LEADERBOARD_SIZE)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function qualifiesForLeaderboard(score: number): boolean {
  const board = getLeaderboard()
  if (board.length < LEADERBOARD_SIZE) return true
  return score > board[board.length - 1].score
}
