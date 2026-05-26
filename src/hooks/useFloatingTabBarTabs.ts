import { useCallback, useMemo, useState, type KeyboardEvent } from 'react'
import type { FloatingTabBarItem } from '../components/FloatingTabBar'

type UseFloatingTabBarTabsArgs = {
  items: readonly FloatingTabBarItem[]
  activeId?: string
  defaultActiveId?: string
  onTabChange?: (id: string) => void
}

export function useFloatingTabBarTabs({
  items,
  activeId: activeIdProp,
  defaultActiveId,
  onTabChange,
}: UseFloatingTabBarTabsArgs) {
  const n = items.length

  const [uncontrolledActiveId, setUncontrolledActiveId] = useState(() => {
    if (defaultActiveId && items.some((it) => it.id === defaultActiveId)) return defaultActiveId
    return items[0]?.id ?? ''
  })

  const isControlled = activeIdProp !== undefined
  const activeId =
    isControlled && activeIdProp && items.some((it) => it.id === activeIdProp)
      ? activeIdProp
      : isControlled
        ? items[0]?.id ?? ''
        : uncontrolledActiveId

  const selectTab = useCallback(
    (id: string) => {
      onTabChange?.(id)
      if (!isControlled) setUncontrolledActiveId(id)
    },
    [isControlled, onTabChange],
  )

  const activeIndex = useMemo(() => {
    if (n === 0) return 0
    const i = items.findIndex((it) => it.id === activeId)
    return i < 0 ? 0 : i
  }, [activeId, items, n])

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      const from = activeIndex
      const next =
        e.key === 'ArrowLeft' ? (from + items.length - 1) % items.length : (from + 1) % items.length
      selectTab(items[next]!.id)
    },
    [activeIndex, items, selectTab],
  )

  return { activeId, activeIndex, selectTab, onKeyDown, n }
}
