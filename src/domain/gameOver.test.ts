import { describe, expect, it } from 'vitest'
import { getKindValueViolation } from './gameOver'
import { createDefaultKindValues } from './tiles'

describe('gameOver', () => {
  it('detects kind value at 0', () => {
    const kindValues = createDefaultKindValues()
    kindValues.dragon_red = 0
    expect(getKindValueViolation(kindValues)).toBe('dragon_red')
  })

  it('detects kind value at 10', () => {
    const kindValues = createDefaultKindValues()
    kindValues.wind_north = 10
    expect(getKindValueViolation(kindValues)).toBe('wind_north')
  })

  it('returns null when all values are in range', () => {
    expect(getKindValueViolation(createDefaultKindValues())).toBeNull()
  })
})
