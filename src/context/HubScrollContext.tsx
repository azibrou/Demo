import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'

const SCROLL_ELEVATED_THRESHOLD_PX = 8
const MOUNT_BOUNCE_SESSION_KEY = 'demo-account-button-bounce'

type HubScrollContextValue = {
  elevated: boolean
  consumeMountBounce: () => boolean
}

const HubScrollContext = createContext<HubScrollContextValue>({
  elevated: false,
  consumeMountBounce: () => false,
})

export const HubScrollRefContext = createContext<RefObject<HTMLDivElement | null> | null>(null)

export function useHubScrollElevated(): boolean {
  return useContext(HubScrollContext).elevated
}

/** True once per browser session — Figma home first load bounce. */
export function useAccountButtonMountBounce(): boolean {
  const { consumeMountBounce } = useContext(HubScrollContext)
  return useMemo(() => consumeMountBounce(), [consumeMountBounce])
}

export function HubScrollProvider({
  scrollRef,
  children,
}: {
  scrollRef: RefObject<HTMLDivElement | null>
  children: ReactNode
}) {
  const [elevated, setElevated] = useState(false)
  const mountBouncePendingRef = useRef(
    typeof sessionStorage !== 'undefined' && !sessionStorage.getItem(MOUNT_BOUNCE_SESSION_KEY),
  )

  const consumeMountBounce = useCallback(() => {
    if (!mountBouncePendingRef.current) return false
    mountBouncePendingRef.current = false
    try {
      sessionStorage.setItem(MOUNT_BOUNCE_SESSION_KEY, '1')
    } catch {
      /* private mode */
    }
    return true
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onScroll = () => {
      setElevated(el.scrollTop > SCROLL_ELEVATED_THRESHOLD_PX)
    }

    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [scrollRef])

  const value = useMemo(
    () => ({ elevated, consumeMountBounce }),
    [elevated, consumeMountBounce],
  )

  return (
    <HubScrollRefContext.Provider value={scrollRef}>
      <HubScrollContext.Provider value={value}>{children}</HubScrollContext.Provider>
    </HubScrollRefContext.Provider>
  )
}
