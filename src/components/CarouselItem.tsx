import { useId, type ReactNode } from 'react'
import { CarouselGridItem } from './CarouselGridItem'
import { HomeScaledCarousel } from './HomeScaledCarousel'
import { design } from '../lib/figmaDesignAssets'

const a = design.carousel

const tiles = [
  { id: '1', variant: 'default' as const },
  { id: '2', variant: 'discount' as const },
  { id: '3', variant: 'default' as const },
  { id: '4', variant: 'discount' as const },
  { id: '5', variant: 'default' as const },
]

export type CarouselItemProps = {
  title: string
  /** When set with `topSlot`, labels the section for assistive tech (title row is in `topSlot`). */
  titleId?: string
  /** Provider header + custom product track (retail snippet). */
  topSlot?: ReactNode
  children?: ReactNode
  /** Product track uses `--shortcut-scale` gutters (retail snippet). */
  scaledTrack?: boolean
}

/** Node 70394:111156 — ItemCarousel; header node 70394:111157 */
export function CarouselItem({ title, titleId, topSlot, children, scaledTrack }: CarouselItemProps) {
  const headingId = titleId ?? useId()

  if (topSlot != null && children != null) {
    return (
      <section
        className="bolt-font-base my-0 flex w-full flex-col items-start gap-3 py-4 text-[var(--color-content-primary)]"
        aria-label={title}
      >
        {topSlot}
        {scaledTrack ? (
          <HomeScaledCarousel variant="product-scroll" aria-label={title}>
            {children}
          </HomeScaledCarousel>
        ) : (
          <div className="carousel-grid-scrollport w-full min-w-0 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="home-horizontal-scroll-track gap-3">{children}</div>
          </div>
        )}
      </section>
    )
  }

  return (
    <section
      className="bolt-font-base flex w-full flex-col items-start gap-4 py-3 text-[var(--color-content-primary)]"
      aria-labelledby={headingId}
    >
      <div className="flex w-full shrink-0 items-center px-6">
        <div className="flex min-w-0 flex-[1_0_0] flex-col items-start justify-center">
          <div className="flex w-full shrink-0 items-center gap-3">
            <div className="flex min-w-0 flex-[1_0_0] items-center gap-1">
              <h2
                id={headingId}
                className="bolt-font-heading-xs-accent min-w-0 shrink-0 truncate whitespace-nowrap text-[var(--color-content-primary)]"
              >
                {title}
              </h2>
            </div>
            <div className="flex h-[25px] w-10 shrink-0 flex-col items-start pt-[5px]">
              <button
                type="button"
                className="flex w-full shrink-0 cursor-pointer items-center justify-end gap-1 rounded text-[var(--color-content-primary)]"
              >
                <span className="bolt-font-body-s-accent shrink-0 whitespace-nowrap">All</span>
                <span className="relative size-[18px] shrink-0" aria-hidden>
                  <img
                    alt=""
                    src={a.allChevron}
                    className="pointer-events-none absolute inset-0 block size-full max-w-none"
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="carousel-grid-scrollport w-full min-w-0 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="home-horizontal-scroll-track gap-3">
          {tiles.map((tile) => (
            <CarouselGridItem key={`${headingId}-${tile.id}`} variant={tile.variant} />
          ))}
        </div>
      </div>
    </section>
  )
}
