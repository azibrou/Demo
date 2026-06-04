import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { WideBasketFabState } from '../components/WideBasketFab'
import { WIDE_BASKET_FAB_LOADING_MS } from '../components/WideBasketFab'
import { triggerHaptic } from '../lib/haptic'

const SEARCH_BASKET_FAB_SLIDE_MS = 150

/**
 * Search overlay wide basket FAB — slide up from bottom, loading (1500ms) → default.
 */
export function useHomeSearchWideBasketFab(basketUnitTotal: number) {
  const hadItemsOnMount = useRef(basketUnitTotal > 0)
  const prevTotalRef = useRef(basketUnitTotal)
  const mountedRef = useRef(true)
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [visible, setVisible] = useState(basketUnitTotal > 0)
  const [slideIn, setSlideIn] = useState(false)
  const [ready, setReady] = useState(hadItemsOnMount.current)
  const [popIn, setPopIn] = useState(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [])

  useLayoutEffect(() => {
    if (!hadItemsOnMount.current) return
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        if (!mountedRef.current) return
        setSlideIn(true)
      })
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [])

  useEffect(() => {
    const prev = prevTotalRef.current
    prevTotalRef.current = basketUnitTotal

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }

    if (basketUnitTotal <= 0) {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current)
        loadingTimerRef.current = null
      }
      setSlideIn(false)
      setPopIn(false)
      hideTimerRef.current = window.setTimeout(() => {
        hideTimerRef.current = null
        if (!mountedRef.current) return
        setVisible(false)
        setReady(false)
      }, SEARCH_BASKET_FAB_SLIDE_MS)
      return
    }

    setVisible(true)

    if (prev === 0) {
      setReady(false)
      setSlideIn(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!mountedRef.current) return
          setSlideIn(true)
        })
      })

      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current)
      loadingTimerRef.current = window.setTimeout(() => {
        loadingTimerRef.current = null
        if (!mountedRef.current) return
        triggerHaptic('success')
        setReady(true)
      }, WIDE_BASKET_FAB_LOADING_MS)
      return
    }

    setSlideIn(true)
    setReady(true)
  }, [basketUnitTotal])

  useLayoutEffect(() => {
    if (!visible || !slideIn) return
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        if (!mountedRef.current) return
        setPopIn(true)
      })
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [visible, slideIn])

  const state: WideBasketFabState = ready ? 'default' : 'loading'

  return { visible, slideIn, state, popIn }
}
