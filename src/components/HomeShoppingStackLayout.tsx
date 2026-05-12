import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type TransitionEvent,
} from 'react'
import { Outlet, useLocation, useNavigate, type NavigateFunction } from 'react-router-dom'
import { BasketFabProvider, useBasketFab } from '../context/BasketFabContext'
import { FloatingTabBar } from './FloatingTabBar'
import { StoresScreen } from '../screens/StoresScreen'
import { HomeShoppingStackContext } from '../context/HomeShoppingStackContext'
import {
  getFloatingTabBarDisplayActiveId,
  resolveFloatingTabBarModel,
} from '../config/floatingTabBarConfig'
import { HOME_SHOPPING_STACK_FLOATING_TAB_BAR_ITEMS } from '../screens/homeShoppingStackFloatingTabBarItems'

const DURATION_MS = 150
const EASE = 'ease-out'
const MOBILE_STACK_MQ = '(max-width: 640px)'

const TAB_BAR_PAD = 'pb-[calc(110px+env(safe-area-inset-bottom,0px))]'

function useMobileStackEnabled() {
  const get = useCallback(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(MOBILE_STACK_MQ).matches
  }, [])
  const [narrow, setNarrow] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_STACK_MQ)
    const on = () => setNarrow(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return narrow
}

function isShoppingListPath(pathname: string) {
  const last = pathname.split('/').filter(Boolean).pop()
  return last === 'shopping-list'
}

function stackTabFromLocation(pathname: string, hash: string): string {
  if (isShoppingListPath(pathname)) return 'list'
  const last = pathname.split('/').filter(Boolean).pop()
  if (last === 'stores') return 'store'
  if (last === 'dineout') return 'dineout'
  if (hash === '#search') return 'search'
  return 'home'
}

type SlidePhase = 'entering' | 'open' | 'exiting'

/**
 * Slide-in (from right) / slide-out (to right) for shopping list on narrow viewports.
 * Remounted via `key` from parent so enter animation state always starts at `entering`.
 */
function ShoppingListSlideSurface({ children, navigate }: { children: ReactNode; navigate: NavigateFunction }) {
  const [slide, setSlide] = useState<SlidePhase>('entering')
  const slideRef = useRef(slide)

  useEffect(() => {
    slideRef.current = slide
  }, [slide])

  useLayoutEffect(() => {
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setSlide('open'))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [])

  const requestSlideOutClose = useCallback(() => {
    if (slideRef.current === 'open') {
      setSlide('exiting')
      return
    }
    navigate(-1)
  }, [navigate])

  const ctxValue = useMemo(() => ({ requestSlideOutClose }), [requestSlideOutClose])

  const onPanelTransitionEnd = useCallback(
    (e: TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== 'transform') return
      if (e.target !== e.currentTarget) return
      if (slideRef.current !== 'exiting') return
      navigate(-1)
    },
    [navigate],
  )

  const panelTransform = slide === 'open' ? 'translateX(0)' : 'translateX(100%)'

  return (
    <HomeShoppingStackContext.Provider value={ctxValue}>
      <div
        className={`relative z-10 min-h-svh w-full max-w-full bg-white will-change-transform ${TAB_BAR_PAD}`}
        style={{
          transform: panelTransform,
          transition: `transform ${DURATION_MS}ms ${EASE}`,
        }}
        onTransitionEnd={onPanelTransitionEnd}
      >
        {children}
      </div>
    </HomeShoppingStackContext.Provider>
  )
}

function HomeShoppingStackTabBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    basketDisplayCount,
    compactTabs,
    fabReserveWidthPx,
    fabReveal,
    showBasketBadge,
    basketFabExiting,
    badgePopNonce,
  } = useBasketFab()

  const resolved = useMemo(
    () => resolveFloatingTabBarModel([...HOME_SHOPPING_STACK_FLOATING_TAB_BAR_ITEMS]),
    [],
  )

  const logicalActiveId = useMemo(
    () => stackTabFromLocation(location.pathname, location.hash),
    [location.pathname, location.hash],
  )

  const barActiveId = useMemo(
    () => getFloatingTabBarDisplayActiveId(logicalActiveId, resolved),
    [logicalActiveId, resolved],
  )

  const onTabChange = useCallback(
    (id: string) => {
      if (id === 'home') {
        navigate({ pathname: '/', hash: undefined })
        return
      }
      if (id === 'store') {
        navigate('/stores')
        return
      }
      if (id === 'dineout') {
        navigate('/dineout')
        return
      }
      if (id === 'search') {
        navigate({ pathname: '/', hash: 'search' })
        requestAnimationFrame(() => {
          document.getElementById('eater-home-search')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
        return
      }
      if (id === 'list') {
        navigate('/shopping-list')
      }
    },
    [navigate],
  )

  if (resolved.barItems.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 w-full max-w-full box-border">
      <div className="pointer-events-auto w-full min-w-0 max-w-full box-border">
        <FloatingTabBar
          items={resolved.barItems}
          activeId={barActiveId}
          onActiveChange={onTabChange}
          compact={compactTabs}
          basketFab={{
            count: basketDisplayCount,
            fabReveal,
            showBadge: showBasketBadge,
            exiting: basketFabExiting,
            badgePopNonce,
            reserveWidthPx: fabReserveWidthPx,
          }}
        />
      </div>
    </div>
  )
}

export function HomeShoppingStackLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const narrow = useMobileStackEnabled()
  const isList = isShoppingListPath(location.pathname)

  useEffect(() => {
    if (location.hash !== '#search') return
    const t = window.setTimeout(() => {
      document.getElementById('eater-home-search')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => window.clearTimeout(t)
  }, [location.pathname, location.hash])

  return (
    <BasketFabProvider>
      <HomeShoppingStackContext.Provider value={null}>
        {!narrow || !isList ? (
          <>
            <div className={`min-h-svh w-full ${TAB_BAR_PAD}`}>
              <Outlet />
            </div>
            <HomeShoppingStackTabBar />
          </>
        ) : (
          <>
            <div className="relative min-h-svh w-full overflow-x-hidden bg-white">
              <div
                className="pointer-events-none absolute inset-0 z-0 min-h-svh select-none overflow-hidden bg-white"
                aria-hidden
              >
                <StoresScreen />
              </div>
              <ShoppingListSlideSurface key={location.key} navigate={navigate}>
                <Outlet />
              </ShoppingListSlideSurface>
            </div>
            <HomeShoppingStackTabBar />
          </>
        )}
      </HomeShoppingStackContext.Provider>
    </BasketFabProvider>
  )
}
