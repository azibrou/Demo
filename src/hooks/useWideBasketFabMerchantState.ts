import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { WideBasketFabState } from '../components/WideBasketFab'
import { WIDE_BASKET_FAB_LOADING_MS } from '../components/WideBasketFab'

const SCROLL_TOP_EXPAND_PX = 8
const SCROLL_DELTA_PX = 1

function getMerchantScrollEl(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  if (document.documentElement.classList.contains('merchant-immersive-active')) {
    return document.querySelector('.merchant-screen') ?? document.querySelector('.eater-hub-scroll')
  }
  return document.querySelector('.eater-hub-scroll')
}

/**
 * Merchant wide basket FAB: hidden until first quick-add (basket &gt; 0),
 * loading (1500ms) → expanded default immediately; scroll down → collapsed; scroll up → default.
 */
export function useWideBasketFabMerchantState(basketUnitTotal: number) {
  const [ready, setReady] = useState(false)
  const [scrollCollapsed, setScrollCollapsed] = useState(false)
  const [popIn, setPopIn] = useState(false)
  const [visible, setVisible] = useState(false)
  const prevTotalRef = useRef(0)
  const lastScrollTopRef = useRef(0)
  const readyRef = useRef(false)
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  readyRef.current = ready

  useEffect(() => {
    const prev = prevTotalRef.current
    prevTotalRef.current = basketUnitTotal

    if (basketUnitTotal <= 0) {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current)
        loadingTimerRef.current = null
      }
      setVisible(false)
      setReady(false)
      setPopIn(false)
      setScrollCollapsed(false)
      return
    }

    if (prev === 0) {
      setVisible(true)
      setReady(false)
      setScrollCollapsed(false)
      setPopIn(false)

      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current)
      loadingTimerRef.current = window.setTimeout(() => {
        loadingTimerRef.current = null
        setReady(true)
      }, WIDE_BASKET_FAB_LOADING_MS)
    } else {
      setVisible(true)
    }
  }, [basketUnitTotal])

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current)
        loadingTimerRef.current = null
      }
    }
  }, [])

  /** After loading: always expand first, regardless of current scroll offset. */
  useLayoutEffect(() => {
    if (!visible || !ready) return
    setScrollCollapsed(false)
    const el = getMerchantScrollEl()
    if (el) lastScrollTopRef.current = el.scrollTop
  }, [visible, ready])

  useLayoutEffect(() => {
    if (!visible) return

    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPopIn(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [visible])

  useEffect(() => {
    if (!visible) return

    const el = getMerchantScrollEl()
    if (!el) return

    lastScrollTopRef.current = el.scrollTop

    const onScroll = () => {
      const top = el.scrollTop
      const prevTop = lastScrollTopRef.current
      lastScrollTopRef.current = top

      if (!readyRef.current) return

      if (top <= SCROLL_TOP_EXPAND_PX) {
        setScrollCollapsed(false)
        return
      }

      const delta = top - prevTop
      if (delta > SCROLL_DELTA_PX) setScrollCollapsed(true)
      else if (delta < -SCROLL_DELTA_PX) setScrollCollapsed(false)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [visible])

  const state: WideBasketFabState = !ready
    ? 'loading'
    : scrollCollapsed
      ? 'collapsed'
      : 'default'

  return { state, popIn, visible }
}
