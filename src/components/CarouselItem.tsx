import type { ReactNode } from 'react'
import { useId } from 'react'
import { CarouselGridItem } from './CarouselGridItem'
import { HomeCarouselRow } from './HomeCarouselRow'
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
  /**
   * Replaces the default heading + “All” row. Put `id={titleId}` on the visible title inside this slot
   * when you pass `titleId` from the parent, or omit and the default header is used.
   */
  topSlot?: ReactNode
  /** Optional title node id for `aria-labelledby` when `topSlot` renders the visible title. */
  titleId?: string
  /** When set, rendered inside the horizontal track instead of the demo {@link CarouselGridItem} strip. */
  children?: ReactNode
  /**
   * Full-bleed track with `home-viewport-scale` / `--shortcut-scale` (Figma 74916-style carousels).
   * When false, uses inset `px-6` scrolling row like node 70394:111156.
   */
  scaledTrack?: boolean
}

/** Node 70394:111156 — ItemCarousel; header node 70394:111157 */
export function CarouselItem({
  title,
  topSlot,
  titleId,
  children,
  scaledTrack,
}: CarouselItemProps) {
  const headingId = useId()
  const labelledBy = titleId ?? headingId
  const showSrOnlyTitle = Boolean(topSlot && !titleId)
  const trackContent =
    children ??
    tiles.map((tile) => <CarouselGridItem key={`${headingId}-${tile.id}`} variant={tile.variant} />)

  return (
    <section
      className="font-sans flex w-full flex-col items-start gap-3 py-3 text-[#191f1c] md:gap-4"
      aria-labelledby={labelledBy}
    >
      {showSrOnlyTitle ? (
        <h2 id={headingId} className="sr-only">
          {title}
        </h2>
      ) : null}
      {topSlot ? (
        topSlot
      ) : (
        <div className="flex w-full shrink-0 items-center px-6">
          <div className="flex min-w-0 flex-[1_0_0] flex-col items-start justify-center">
            <div className="flex w-full shrink-0 items-center gap-3">
              <div className="flex min-w-0 flex-[1_0_0] items-center gap-1">
                <h2
                  id={headingId}
                  className="min-w-0 shrink-0 truncate text-[20px] font-semibold leading-[25px] tracking-[-0.34px] text-[#191f1c] whitespace-nowrap"
                >
                  {title}
                </h2>
              </div>
              <div className="flex h-[25px] w-10 shrink-0 flex-col items-start pt-[5px]">
                <button
                  type="button"
                  className="flex w-full shrink-0 cursor-pointer items-center justify-end gap-1 rounded text-[#191f1c]"
                >
                  <span className="shrink-0 whitespace-nowrap text-sm font-semibold leading-5 tracking-[-0.084px]">
                    All
                  </span>
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
      )}
      {scaledTrack ? (
        <HomeCarouselRow>{trackContent}</HomeCarouselRow>
      ) : (
        <div className="flex w-full shrink-0 gap-3 overflow-x-auto overscroll-x-contain px-6 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {trackContent}
        </div>
      )}
    </section>
  )
}
