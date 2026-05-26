import type { CSSProperties } from 'react'
import { TAB_BAR_LAYOUT_EASE, TAB_BAR_LAYOUT_MS, TAB_COMPACT_MS } from '../context/BasketFabContext'

/** Shared motion + row layout CSS vars for home and merchant floating tab bars. */
export function floatingTabBarMotionVars(trailingChromePx = 0): CSSProperties {
  return {
    '--ftb-compact-ms': `${TAB_COMPACT_MS}ms`,
    '--ftb-layout-ms': `${TAB_BAR_LAYOUT_MS}ms`,
    '--ftb-layout-ease': TAB_BAR_LAYOUT_EASE,
    '--ftb-trailing-chrome': `${trailingChromePx}px`,
  } as CSSProperties
}

export function floatingTabBarPillGridStyle(tabCount: number, activeIndex: number): CSSProperties {
  return {
    gridTemplateColumns: `repeat(${tabCount}, minmax(0, 1fr))`,
    '--ftb-tab-count': String(tabCount),
    '--ftb-active-index': String(activeIndex),
  } as CSSProperties
}

/** Merchant solo pill — single visible tab column. */
export function floatingTabBarSoloPillGridStyle(): CSSProperties {
  return {
    gridTemplateColumns: 'minmax(0, 1fr)',
    '--ftb-tab-count': '1',
    '--ftb-active-index': '0',
  } as CSSProperties
}
