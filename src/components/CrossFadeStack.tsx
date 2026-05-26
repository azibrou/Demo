import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type TransitionEvent,
} from 'react'

/** Matches eater hub tab cross-fade (`--eater-hub-fade-duration`). */
export const CROSS_FADE_MS = 300

type FadeLayer = {
  key: string
  node: ReactNode
  state: 'entering' | 'visible' | 'leaving'
}

function useCrossFadeLeavingCleanup(layers: FadeLayer[], removeLeaving: (key: string) => void) {
  useEffect(() => {
    const leaving = layers.filter((l) => l.state === 'leaving')
    if (leaving.length === 0) return
    const timeout = window.setTimeout(() => {
      for (const layer of leaving) removeLeaving(layer.key)
    }, CROSS_FADE_MS + 50)
    return () => clearTimeout(timeout)
  }, [layers, removeLeaving])
}

type CrossFadeStackProps = {
  activeKey: string
  children: ReactNode
  className?: string
  /** Called when a cross-fade begins (e.g. scroll reset). */
  onSwitch?: () => void
}

/**
 * Cross-fades between keyed children (300ms ease-out). Reuses `.eater-hub-fade` styles from home hub tabs.
 */
export function CrossFadeStack({ activeKey, children, className = '', onSwitch }: CrossFadeStackProps) {
  const prevKeyRef = useRef(activeKey)
  const prevChildrenRef = useRef(children)

  const [layers, setLayers] = useState<FadeLayer[]>([
    { key: activeKey, node: children, state: 'visible' },
  ])

  const removeLeaving = useCallback((key: string) => {
    setLayers((prev) => {
      const next = prev.filter((l) => l.key !== key)
      return next.length > 0 ? next : prev
    })
  }, [])

  useCrossFadeLeavingCleanup(layers, removeLeaving)

  useLayoutEffect(() => {
    const prevKey = prevKeyRef.current
    const prevChildren = prevChildrenRef.current
    const nextKey = activeKey
    const nextChildren = children

    if (prevKey !== nextKey) {
      onSwitch?.()
      setLayers([
        { key: prevKey, node: prevChildren, state: 'leaving' },
        { key: nextKey, node: nextChildren, state: 'entering' },
      ])
      let inner = 0
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => {
          setLayers([
            { key: prevKey, node: prevChildren, state: 'leaving' },
            { key: nextKey, node: nextChildren, state: 'visible' },
          ])
        })
      })
      prevKeyRef.current = nextKey
      prevChildrenRef.current = nextChildren
      return () => {
        cancelAnimationFrame(outer)
        cancelAnimationFrame(inner)
      }
    }

    setLayers([{ key: nextKey, node: nextChildren, state: 'visible' }])
    prevKeyRef.current = nextKey
    prevChildrenRef.current = nextChildren
  }, [activeKey, children, onSwitch])

  const isCrossfading = layers.length > 1

  return (
    <div
      className={['eater-hub-fade', isCrossfading ? 'eater-hub-fade--active' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {layers.map((layer) => (
        <div
          key={layer.key}
          className="eater-hub-fade__layer motion-reduce:transition-none"
          data-state={layer.state}
          onTransitionEnd={(e: TransitionEvent<HTMLDivElement>) => {
            if (e.propertyName !== 'opacity') return
            if (e.target !== e.currentTarget) return
            if (layer.state !== 'leaving') return
            removeLeaving(layer.key)
          }}
        >
          {layer.node}
        </div>
      ))}
    </div>
  )
}
