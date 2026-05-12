import type { ReactNode } from 'react'

const scrollRowClass =
  'shortcuts-carousel-scale-row overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

/**
 * Shared horizontal strip: same DOM/classes as {@link ShortcutsCarousel} (viewport `dvw` scale + track padding).
 * Use for shortcuts row and any full-bleed home carousel that should match it (e.g. Order again).
 */
export function HomeCarouselRow({ children }: { children: ReactNode }) {
  return (
    <div className="home-viewport-scale shortcuts-carousel-outer">
      <div className="shortcuts-carousel-cq max-w-full">
        <div className={scrollRowClass}>
          <div className="shortcuts-carousel-track">{children}</div>
        </div>
      </div>
    </div>
  )
}
