import { useRef, type CSSProperties, type ReactNode } from 'react'
import { SHORTCUTS_DESIGN } from '../lib/shortcutScale'
import { useShortcutScale } from '../hooks/useShortcutScale'

export type HomeScaledRowProps = {
  children: ReactNode
  ariaLabel: string
  className?: string
  trackClassName?: string
  'data-name'?: string
  'data-node-id'?: string
}

/**
 * Full-width horizontal row — 375px baseline scale, 24px scroll gutters (Figma home rows).
 */
export function HomeScaledRow({
  children,
  ariaLabel,
  className = '',
  trackClassName = '',
  'data-name': dataName,
  'data-node-id': dataNodeId,
}: HomeScaledRowProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const scale = useShortcutScale(rootRef)

  const style = {
    '--shortcut-scale': String(scale),
    '--shortcuts-gutter': `${SHORTCUTS_DESIGN.gutter}px`,
  } as CSSProperties

  return (
    <div
      ref={rootRef}
      className={['home-scaled-row', className].filter(Boolean).join(' ')}
      style={style}
      data-name={dataName}
      data-node-id={dataNodeId}
    >
      <div className="home-scaled-row__scroll" aria-label={ariaLabel}>
        <div className={['home-scaled-row__track', trackClassName].filter(Boolean).join(' ')}>{children}</div>
      </div>
    </div>
  )
}
