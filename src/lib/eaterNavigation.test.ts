import { describe, expect, it } from 'vitest'
import {
  isEaterHomeTabPath,
  isEaterHubPath,
  isEaterInnerPath,
  shouldResetBasketOnNavigation,
  shouldResetBasketWhenLeavingPath,
} from './eaterNavigation'

describe('eaterNavigation basket reset policy', () => {
  it('classifies inner paths including category routes', () => {
    expect(isEaterInnerPath('/category/dairy-and-eggs')).toBe(true)
    expect(isEaterInnerPath('/checkout')).toBe(true)
    expect(isEaterInnerPath('/stores')).toBe(false)
  })

  it('classifies hub paths', () => {
    expect(isEaterHubPath('/')).toBe(true)
    expect(isEaterHubPath('/stores')).toBe(true)
    expect(isEaterHubPath('/dineout')).toBe(true)
    expect(isEaterHubPath('/restaurant')).toBe(false)
  })

  it('classifies home tab', () => {
    expect(isEaterHomeTabPath('/')).toBe(true)
    expect(isEaterHomeTabPath('/stores')).toBe(false)
  })

  it('does not reset on hub tab switches', () => {
    expect(shouldResetBasketOnNavigation('/', '/stores')).toBe(false)
    expect(shouldResetBasketOnNavigation('/stores', '/dineout')).toBe(false)
    expect(shouldResetBasketOnNavigation('/dineout', '/')).toBe(false)
  })

  it('does not reset when entering a venue from Stores or DineOut', () => {
    expect(shouldResetBasketOnNavigation('/stores', '/store-merchant')).toBe(false)
    expect(shouldResetBasketOnNavigation('/dineout', '/restaurant')).toBe(false)
  })

  it('resets when opening a venue from Home', () => {
    expect(shouldResetBasketOnNavigation('/', '/restaurant')).toBe(true)
    expect(shouldResetBasketOnNavigation('/', '/store-merchant')).toBe(true)
  })

  it('does not reset when opening shopping list from Home', () => {
    expect(shouldResetBasketOnNavigation('/', '/shopping-list')).toBe(false)
  })

  it('does not reset when opening checkout from Home', () => {
    expect(shouldResetBasketOnNavigation('/', '/checkout')).toBe(false)
  })

  it('resets when returning to the hub from inner routes', () => {
    expect(shouldResetBasketOnNavigation('/restaurant', '/')).toBe(true)
    expect(shouldResetBasketOnNavigation('/store-merchant', '/stores')).toBe(true)
    expect(shouldResetBasketOnNavigation('/shopping-list', '/')).toBe(true)
    expect(shouldResetBasketOnNavigation('/checkout', '/')).toBe(true)
  })

  it('resets on back from non-hub screens', () => {
    expect(shouldResetBasketWhenLeavingPath('/restaurant')).toBe(true)
    expect(shouldResetBasketWhenLeavingPath('/shopping-list')).toBe(true)
    expect(shouldResetBasketWhenLeavingPath('/checkout')).toBe(true)
    expect(shouldResetBasketWhenLeavingPath('/')).toBe(false)
    expect(shouldResetBasketWhenLeavingPath('/stores')).toBe(false)
  })
})
