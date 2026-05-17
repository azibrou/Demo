import type { ReactNode } from 'react'

export type HomeHorizontalScrollProps = {
  children: ReactNode
  className?: string
  trackClassName?: string
  'aria-label'?: string
}

/** Horizontal carousel — 24px track padding; overflow stays inside `.home-horizontal-scroll-row`. */
export function HomeHorizontalScroll({
  children,
  className = '',
  trackClassName = '',
  'aria-label': ariaLabel,
}: HomeHorizontalScrollProps) {
  return (
    <div
      className={['home-horizontal-scroll-outer', className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
    >
      <div className="home-horizontal-scroll-row">
        <div className={['home-horizontal-scroll-track', trackClassName].filter(Boolean).join(' ')}>{children}</div>
      </div>
    </div>
  )
}
