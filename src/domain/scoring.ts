import type { BetDirection, BetOutcome } from './types'

export function resolveBetOutcome(
  totalA: number,
  totalB: number,
  bet: BetDirection,
): BetOutcome {
  if (totalB === totalA) return 'push'
  if (bet === 'higher') return totalB > totalA ? 'win' : 'loss'
  return totalB < totalA ? 'win' : 'loss'
}

export function scoreForOutcome(outcome: BetOutcome, totalB: number): number {
  return outcome === 'win' ? totalB : 0
}
