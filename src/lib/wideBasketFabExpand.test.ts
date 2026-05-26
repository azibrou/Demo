import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  WIDE_BASKET_FAB_EXPAND_ANCHOR,
  WIDE_BASKET_FAB_EXPAND_DATA_ATTRS,
  WIDE_BASKET_FAB_EXPAND_DIRECTION,
  wideBasketFabInTabBarAnchorCssMustInclude,
  wideBasketFabRtlForbiddenInTabBarRule,
  wideBasketFabSlotExpandCssMustInclude,
} from './wideBasketFabExpand'

const __dirname = dirname(fileURLToPath(import.meta.url))
const stylesCss = readFileSync(resolve(__dirname, '../css/styles.css'), 'utf8')

function extractRule(css: string, selectorStart: string): string {
  const start = css.indexOf(selectorStart)
  expect(start, `Missing selector: ${selectorStart}`).toBeGreaterThanOrEqual(0)
  const brace = css.indexOf('{', start)
  let depth = 0
  for (let i = brace; i < css.length; i++) {
    if (css[i] === '{') depth++
    if (css[i] === '}') {
      depth--
      if (depth === 0) return css.slice(start, i + 1)
    }
  }
  throw new Error(`Unclosed rule for ${selectorStart}`)
}

describe('WideBasketFab RTL expand contract', () => {
  it('documents RTL expand direction and right anchor', () => {
    expect(WIDE_BASKET_FAB_EXPAND_DIRECTION).toBe('rtl')
    expect(WIDE_BASKET_FAB_EXPAND_ANCHOR).toBe('right')
    expect(WIDE_BASKET_FAB_EXPAND_DATA_ATTRS.direction).toBe('data-expand-direction')
    expect(WIDE_BASKET_FAB_EXPAND_DATA_ATTRS.anchor).toBe('data-expand-anchor')
  })

  it('pins in-tab-bar FAB to inline-end and fills slot width', () => {
    const rule = extractRule(
      stylesCss,
      '.floating-tab-bar__basket-slot--wide .wide-basket-fab--in-tab-bar {',
    )
    for (const snippet of wideBasketFabInTabBarAnchorCssMustInclude) {
      if (snippet.startsWith('.')) continue
      expect(rule).toContain(snippet)
    }
    expect(rule).toContain('inset-inline-end: 0;')
    expect(rule).toContain('width: 100% !important;')
    expect(rule).toContain('transition-property: padding-inline !important;')
  })

  it('never tweens FAB width in tab bar (slot flex drives RTL expand)', () => {
    const rule = extractRule(
      stylesCss,
      '.floating-tab-bar__basket-slot--wide .wide-basket-fab--in-tab-bar {',
    )
    for (const forbidden of wideBasketFabRtlForbiddenInTabBarRule) {
      expect(rule).not.toContain(forbidden)
    }
  })

  it('expands basket slot with margin-inline-start auto on default (RTL, not LTR flex-grow)', () => {
    const slotRule = extractRule(
      stylesCss,
      '.merchant-ftb__row--basket .floating-tab-bar__basket-slot--wide {',
    )
    expect(slotRule).toContain('flex: 0 0 0px;')
    expect(stylesCss).toContain(
      ".merchant-ftb__row--basket[data-basket-phase='collapsed'] .floating-tab-bar__basket-slot--wide",
    )
    expect(stylesCss).toContain('flex: 0 0 56px;')
    for (const snippet of wideBasketFabSlotExpandCssMustInclude) {
      if (snippet.startsWith('.')) continue
      expect(stylesCss).toContain(snippet)
    }
    const defaultRule = extractRule(
      stylesCss,
      ".merchant-ftb__row--basket[data-basket-phase='default'] .floating-tab-bar__basket-slot--wide {",
    )
    expect(defaultRule).toContain('margin-inline-start: auto;')
  })

  it('locks FAB width to 100% of slot for all in-tab-bar states', () => {
    expect(stylesCss).toContain(
      ".floating-tab-bar__basket-slot--wide .wide-basket-fab--in-tab-bar[data-state='default']",
    )
    expect(stylesCss).toContain('width: 100% !important;')
  })

  it('provides standalone RTL anchor wrapper', () => {
    const rule = extractRule(stylesCss, '.wide-basket-fab-anchor .wide-basket-fab {')
    expect(rule).toContain('position: absolute;')
    expect(rule).toContain('inset-inline-end: 0;')
  })
})
