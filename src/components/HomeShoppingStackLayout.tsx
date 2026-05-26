import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { Outlet, useLocation, useNavigate, useOutlet, type NavigateFunction } from 'react-router-dom'
import { resolveFloatingTabBarModel } from '../config/floatingTabBarConfig'
import { BasketFabProvider } from '../context/BasketFabContext'
import { HomeShoppingStackContext } from '../context/HomeShoppingStackContext'
import { design } from '../lib/figmaDesignAssets'
import { DineOutScreen } from '../screens/DineOutScreen'
import { HomeScreen } from '../screens/HomeScreen'
import { HOME_FLOATING_TAB_BAR_ITEMS } from '../screens/homeFloatingTabBarItems'
import { StoresScreen } from '../screens/StoresScreen'
import { CrossFadeStack } from './CrossFadeStack'
import { FloatingTabBar } from './FloatingTabBar'
import { TabAction } from './TabAction'

/** iOS UINavigationController default interactive transition duration. */
const STACK_DURATION_MS = 350
const STACK_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)'
const MOBILE_STACK_MQ = '(max-width: 640px)'

const INNER_PATH_SEGMENTS = new Set(['shopping-list', 'store-merchant', 'restaurant'])

const HUB_TAB_PATHS: Record<string, string | undefined> = {
  home: '/',
  store: '/stores',
  dineout: '/dineout',
}

function isHubPath(pathname: string): boolean {
  const last = pathname.split('/').filter(Boolean).pop()
  return last === undefined || last === 'stores' || last === 'dineout'
}

function isInnerPath(pathname: string): boolean {
  const last = pathname.split('/').filter(Boolean).pop()
  return last != null && INNER_PATH_SEGMENTS.has(last)
}

function hubTabIdFromPathname(pathname: string): string {
  const last = pathname.split('/').filter(Boolean).pop()
  if (last === 'stores') return 'store'
  if (last === 'dineout') return 'dineout'
  return 'home'
}

const HubScrollRefContext = createContext<RefObject<HTMLDivElement | null> | null>(null)

/**
 * Cross-fades eater hub tabs on switch (300ms ease-out). Other routes render without fade.
 */
function EaterHubFadeOutlet() {
  const hubScrollRef = useContext(HubScrollRefContext)
  const location = useLocation()
  const outlet = useOutlet()

  const onHubSwitch = useCallback(() => {
    hubScrollRef?.current?.scrollTo(0, 0)
  }, [hubScrollRef])

  if (!isHubPath(location.pathname)) {
    return <>{outlet}</>
  }

  return (
    <CrossFadeStack activeKey={location.pathname} onSwitch={onHubSwitch}>
      {outlet}
    </CrossFadeStack>
  )
}

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

/** Frozen hub screen shown under the pushed inner route during iOS stack transitions. */
function HubStackUnderlay({ pathname }: { pathname: string }) {
  const tabId = hubTabIdFromPathname(pathname)
  if (tabId === 'store') return <StoresScreen />
  if (tabId === 'dineout') return <DineOutScreen />
  return <HomeScreen />
}

/** Persists home tab bar across hub routes so enter animation runs only on layout mount. */
const hubSearchTabAction = <TabAction iconSrc={design.tabAction.search} ariaLabel="Search" />

function HubLayoutShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const resolved = useMemo(() => resolveFloatingTabBarModel(HOME_FLOATING_TAB_BAR_ITEMS), [])
  const showTabBar = isHubPath(location.pathname)
  const tabId = hubTabIdFromPathname(location.pathname)
  const ariaLabel = tabId === 'store' ? 'Stores' : tabId === 'dineout' ? 'DineOut' : 'Home'

  const onHubTabChange = useCallback(
    (id: string) => {
      const path = HUB_TAB_PATHS[id]
      if (path != null) navigate(path)
    },
    [navigate],
  )

  useEffect(() => {
    document.documentElement.classList.add('eater-hub-active')
    return () => document.documentElement.classList.remove('eater-hub-active')
  }, [])

  useLayoutEffect(() => {
    if (!isHubPath(location.pathname)) return
    scrollRef.current?.scrollTo(0, 0)
  }, [location.pathname, location.key])

  return (
    <BasketFabProvider>
      <HomeShoppingStackContext.Provider value={null}>
        <HubScrollRefContext.Provider value={scrollRef}>
          <div className="eater-hub-shell">
            <div ref={scrollRef} className="eater-hub-scroll">
              {children}
            </div>
            {showTabBar && resolved.barItems.length > 0 ? (
              <div className="eater-hub-shell__tabbar fixed inset-x-0 bottom-0 z-40 w-full max-w-full overflow-visible">
                <FloatingTabBar
                  items={resolved.barItems}
                  activeId={tabId}
                  onTabChange={onHubTabChange}
                  ariaLabel={ariaLabel}
                  tabActions={hubSearchTabAction}
                />
              </div>
            ) : null}
          </div>
        </HubScrollRefContext.Provider>
      </HomeShoppingStackContext.Provider>
    </BasketFabProvider>
  )
}

type SlidePhase = 'entering' | 'open' | 'exiting'

type StackSlideSurfaceProps = {
  children: ReactNode
  navigate: NavigateFunction
  slidePhase: SlidePhase
  onSlidePhaseChange: (phase: SlidePhase) => void
}

/**
 * Slide-in (from right) / slide-out (to right) for inner routes on narrow viewports.
 * Remounted via `key` from parent so enter animation always starts at `entering`.
 */
function StackSlideSurface({ children, navigate, slidePhase, onSlidePhaseChange }: StackSlideSurfaceProps) {
  const slideRef = useRef(slidePhase)

  useEffect(() => {
    slideRef.current = slidePhase
  }, [slidePhase])

  useLayoutEffect(() => {
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => onSlidePhaseChange('open'))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [onSlidePhaseChange])

  const requestSlideOutClose = useCallback(() => {
    if (slideRef.current === 'open') {
      onSlidePhaseChange('exiting')
      return
    }
    navigate(-1)
  }, [navigate, onSlidePhaseChange])

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

  const panelTransform = slidePhase === 'open' ? 'translateX(0)' : 'translateX(100%)'

  return (
    <HomeShoppingStackContext.Provider value={ctxValue}>
      <div
        className="eater-ios-stack__panel motion-reduce:transition-none"
        style={{
          transform: panelTransform,
          transition: `transform ${STACK_DURATION_MS}ms ${STACK_EASE}`,
        }}
        onTransitionEnd={onPanelTransitionEnd}
      >
        {children}
      </div>
    </HomeShoppingStackContext.Provider>
  )
}

type EaterIosStackProps = {
  underlayPath: string
  navigate: NavigateFunction
  children: ReactNode
}

function EaterIosStack({ underlayPath, navigate, children }: EaterIosStackProps) {
  const [slidePhase, setSlidePhase] = useState<SlidePhase>('entering')

  return (
    <div className="eater-ios-stack" data-slide={slidePhase}>
      <div className="eater-ios-stack__underlay motion-reduce:transition-none" aria-hidden>
        <HubStackUnderlay pathname={underlayPath} />
      </div>
      <StackSlideSurface navigate={navigate} slidePhase={slidePhase} onSlidePhaseChange={setSlidePhase}>
        {children}
      </StackSlideSurface>
    </div>
  )
}

export function HomeShoppingStackLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const narrow = useMobileStackEnabled()
  const inner = isInnerPath(location.pathname)

  const lastHubPathRef = useRef(location.pathname)
  const [stackUnderlayPath, setStackUnderlayPath] = useState(() =>
    isHubPath(location.pathname) ? location.pathname : '/',
  )

  useLayoutEffect(() => {
    if (isHubPath(location.pathname)) {
      lastHubPathRef.current = location.pathname
      return
    }
    if (isInnerPath(location.pathname)) {
      setStackUnderlayPath(lastHubPathRef.current)
    }
  }, [location.pathname])

  if (!narrow || !inner) {
    return (
      <HubLayoutShell>
        <EaterHubFadeOutlet />
      </HubLayoutShell>
    )
  }

  return (
    <HubLayoutShell>
      <EaterIosStack key={location.key} underlayPath={stackUnderlayPath} navigate={navigate}>
        <Outlet />
      </EaterIosStack>
    </HubLayoutShell>
  )
}
