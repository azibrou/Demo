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
import { BasketFabProvider } from '../context/BasketFabContext'
import { HomeShoppingStackContext } from '../context/HomeShoppingStackContext'
import { StoresScreen } from '../screens/StoresScreen'

const DURATION_MS = 150
const EASE = 'ease-out'
const MOBILE_STACK_MQ = '(max-width: 640px)'

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
        className="relative z-10 min-h-svh w-full max-w-full bg-white will-change-transform"
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

export function HomeShoppingStackLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const narrow = useMobileStackEnabled()
  const isList = isShoppingListPath(location.pathname)

  if (!narrow) {
    return (
      <BasketFabProvider>
        <HomeShoppingStackContext.Provider value={null}>
          <Outlet />
        </HomeShoppingStackContext.Provider>
      </BasketFabProvider>
    )
  }

  if (!isList) {
    return (
      <BasketFabProvider>
        <HomeShoppingStackContext.Provider value={null}>
          <Outlet />
        </HomeShoppingStackContext.Provider>
      </BasketFabProvider>
    )
  }

  return (
    <BasketFabProvider>
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
    </BasketFabProvider>
  )
}
