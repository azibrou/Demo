import { describe, expect, it } from 'vitest'
import {
  merchantScrollCompactToFabPhase,
  merchantScrollCompactToTabSolo,
  resolveMerchantScrollCompact,
} from './merchantBasketScrollChrome'

describe('resolveMerchantScrollCompact', () => {
  it('stays compact when scrolling up or down', () => {
    expect(resolveMerchantScrollCompact(100, 200, true)).toBe(true)
    expect(resolveMerchantScrollCompact(0, 100, true)).toBe(true)
  })

  it('compacts on first scroll movement while expanded', () => {
    expect(resolveMerchantScrollCompact(8, 0, false)).toBe(true)
    expect(resolveMerchantScrollCompact(0, 8, false)).toBe(true)
  })

  it('ignores sub-pixel jitter while expanded', () => {
    expect(resolveMerchantScrollCompact(0, 0, false)).toBe(false)
    expect(resolveMerchantScrollCompact(0.5, 0, false)).toBe(false)
  })
})

describe('merchant scroll chrome mappers', () => {
  it('maps expanded vs compact to tab solo and FAB phase', () => {
    expect(merchantScrollCompactToTabSolo(false)).toBe(false)
    expect(merchantScrollCompactToTabSolo(true)).toBe(true)
    expect(merchantScrollCompactToFabPhase(false)).toBe('collapsed')
    expect(merchantScrollCompactToFabPhase(true)).toBe('default')
  })
})
