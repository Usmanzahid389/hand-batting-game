import { describe, expect, it } from 'vitest'
import { resolveBetOutcome, scoreForOutcome } from './scoring'

describe('scoring', () => {
  it('resolves higher bets', () => {
    expect(resolveBetOutcome(10, 15, 'higher')).toBe('win')
    expect(resolveBetOutcome(10, 8, 'higher')).toBe('loss')
    expect(resolveBetOutcome(10, 10, 'higher')).toBe('push')
  })

  it('resolves lower bets', () => {
    expect(resolveBetOutcome(10, 8, 'lower')).toBe('win')
    expect(resolveBetOutcome(10, 15, 'lower')).toBe('loss')
  })

  it('adds totalB only on win', () => {
    expect(scoreForOutcome('win', 22)).toBe(22)
    expect(scoreForOutcome('loss', 22)).toBe(0)
    expect(scoreForOutcome('push', 22)).toBe(0)
  })
})
