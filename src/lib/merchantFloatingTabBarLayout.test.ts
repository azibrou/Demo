import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  MERCHANT_TAB_BAR_ROW_HEIGHT_PX,
  merchantBasketSlotDefaultCssMustInclude,
  merchantBasketFabLoadingCssMustInclude,
  merchantBasketSlotLoadingCssMustInclude,
  merchantTabBarHeightCssMustInclude,
  wideBasketFabInTabBarCssMustNotInclude,
} from './merchantFloatingTabBarLayout'

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

describe('merchant floating tab bar CSS contract', () => {
  it('keeps row height at 56px', () => {
    expect(MERCHANT_TAB_BAR_ROW_HEIGHT_PX).toBe(56)
    for (const snippet of merchantTabBarHeightCssMustInclude) {
      expect(stylesCss).toContain(snippet)
    }
  })

  it('uses wide basket slot at 56px during merchant loading phase', () => {
    for (const snippet of merchantBasketSlotLoadingCssMustInclude) {
      expect(stylesCss).toContain(snippet)
    }
  })

  it('uses in-tab-bar WideBasketFab spinner during merchant loading', () => {
    for (const snippet of merchantBasketFabLoadingCssMustInclude) {
      expect(stylesCss).toContain(snippet)
    }
  })

  it('expands basket slot on default phase via flex-grow', () => {
    for (const snippet of merchantBasketSlotDefaultCssMustInclude) {
      expect(stylesCss).toContain(snippet)
    }
  })

  it('anchors in-tab-bar WideBasketFab to inline-end for RTL expand', () => {
    const rule = extractRule(
      stylesCss,
      '.floating-tab-bar__basket-slot--wide .wide-basket-fab--in-tab-bar {',
    )
    expect(rule).toContain('position: absolute !important;')
    expect(rule).toContain('inset-inline-end: 0;')
    expect(rule).toContain('width: 100% !important;')
    expect(rule).toContain('transition-property: padding-inline !important;')
    expect(rule).not.toContain('margin-inline-start: auto')
    for (const forbidden of wideBasketFabInTabBarCssMustNotInclude) {
      expect(rule).not.toContain(forbidden)
    }
  })

})
