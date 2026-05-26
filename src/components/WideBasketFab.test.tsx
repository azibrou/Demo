import { createElement } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import {
  WIDE_BASKET_FAB_EXPAND_ANCHOR,
  WIDE_BASKET_FAB_EXPAND_DATA_ATTRS,
  WIDE_BASKET_FAB_EXPAND_DIRECTION,
  WIDE_BASKET_FAB_IN_TAB_BAR_CLASS,
} from '../lib/wideBasketFabExpand'
import { WideBasketFab } from './WideBasketFab'

afterEach(() => cleanup())

function renderFab(state: 'loading' | 'default' | 'collapsed', count = 1) {
  return render(
    createElement(
      MemoryRouter,
      null,
      createElement(WideBasketFab, {
        state,
        count,
        revealed: true,
        className: WIDE_BASKET_FAB_IN_TAB_BAR_CLASS,
      }),
    ),
  )
}

describe('WideBasketFab', () => {
  it('declares RTL expand data attributes', () => {
    renderFab('default', 2)
    const btn = screen.getByRole('button', { name: 'Basket, 2 items' })
    expect(btn.getAttribute(WIDE_BASKET_FAB_EXPAND_DATA_ATTRS.direction)).toBe(WIDE_BASKET_FAB_EXPAND_DIRECTION)
    expect(btn.getAttribute(WIDE_BASKET_FAB_EXPAND_DATA_ATTRS.anchor)).toBe(WIDE_BASKET_FAB_EXPAND_ANCHOR)
  })

  it('loading state renders spinner markup', () => {
    const { container } = renderFab('loading')
    expect(container.querySelector('.wide-basket-fab__loader')).toBeTruthy()
    expect(container.querySelector('.wide-basket-fab__loader-img')).toBeTruthy()
    expect(container.querySelector('.wide-basket-fab__icon')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Loading basket' })).toHaveAttribute('data-state', 'loading')
  })

  it('exposes default state for expanded basket', () => {
    renderFab('default', 2)
    expect(screen.getByRole('button', { name: 'Basket, 2 items' })).toHaveAttribute('data-state', 'default')
  })
})
