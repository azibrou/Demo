import { useEffect, useState, type ReactNode } from 'react'

/** Slide-down / slide-up duration for bottom-chrome handoff (ms). Keep in sync with CSS. */
export const BOTTOM_CHROME_SLIDE_MS = 300

type SlidePhase = 'enter' | 'exit'

export type BottomChromeSlideProps = {
  children: ReactNode
  /** Extra classes for the sliding wrapper (e.g. `pointer-events-auto`). */
  className?: string
  /** When true, the chrome slides down out of view (paired with the iOS stack slide-out). */
  exiting?: boolean
}

/**
 * Slides bottom chrome (tab bars / action rows) up on mount and down when `exiting`,
 * so navigation between screens with different tab bars hands off vertically:
 * the current bar slides down, then the destination bar slides up.
 *
 * Uses CSS keyframe animations (not transitions) so the slide-up reliably plays
 * on mount — a mount-time transition is often skipped while the iOS stack panel
 * is animating, which made the entering bar pop in instantly.
 */
export function BottomChromeSlide({ children, className = '', exiting = false }: BottomChromeSlideProps) {
  const [phase, setPhase] = useState<SlidePhase>(exiting ? 'exit' : 'enter')

  useEffect(() => {
    setPhase(exiting ? 'exit' : 'enter')
  }, [exiting])

  return (
    <div className={className ? `bottom-chrome-slide ${className}` : 'bottom-chrome-slide'} data-slide={phase}>
      {children}
    </div>
  )
}
