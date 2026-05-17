import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useShortcutScale } from '../hooks/useShortcutScale'

export type HomeScaledCarouselProps = {
  children: ReactNode
  className?: string
  /** Fit this many 86px tiles across the column (shortcuts = 5, order again = 4). */
  tileCount?: number
  /** Product strip: scroll wide tiles; only gutters scale with column width. */
  variant?: 'tile-fit' | 'product-scroll'
  'aria-label'?: string
  'data-name'?: string
  'data-node-id'?: string
}

/**
 * Figma 76281:68503 — scaled shortcut / XS thumb row.
 * `tile-fit`: measures width and sets `--shortcut-scale` (375px baseline).
 */
export function HomeScaledCarousel({
  children,
  className = '',
  tileCount = 5,
  variant = 'tile-fit',
  'aria-label': ariaLabel,
  'data-name': dataName,
  'data-node-id': dataNodeId,
}: HomeScaledCarouselProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const scale = useShortcutScale(shellRef, {
    mode: variant === 'tile-fit' ? 'tile-fit' : 'viewport',
    tileCount,
  })

  const shellClass = variant === 'product-scroll' ? 'home-product-carousel' : 'home-scaled-carousel'

  const style = { '--shortcut-scale': String(scale) } as CSSProperties

  return (
    <div
      ref={shellRef}
      className={[shellClass, 'min-w-0 max-w-full', className].filter(Boolean).join(' ')}
      style={style}
      data-tile-count={variant === 'tile-fit' ? tileCount : undefined}
      data-name={dataName}
      data-node-id={dataNodeId}
      aria-label={ariaLabel}
    >
      <div className="shortcuts-carousel-cq min-w-0 max-w-full">
        <div className="shortcuts-carousel-scale-row">
          <div className="shortcuts-carousel-track">{children}</div>
        </div>
      </div>
    </div>
  )
}
