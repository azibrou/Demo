import { useRef, type CSSProperties, type ReactNode } from 'react'
import { THUMBNAIL_M_DESIGN } from '../lib/thumbnailMScale'
import { useThumbnailMScale } from '../hooks/useThumbnailMScale'

export type ThumbnailMCarouselProps = {
  children: ReactNode
  ariaLabel: string
}

/**
 * Horizontal Thumbnail M strip — 1.5 tiles visible @ 375px; 24px scroll gutters.
 */
export function ThumbnailMCarousel({ children, ariaLabel }: ThumbnailMCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const scale = useThumbnailMScale(rootRef)

  const style = {
    '--thumbnail-m-scale': String(scale),
    '--thumbnail-m-gutter': `${THUMBNAIL_M_DESIGN.gutter}px`,
    '--thumbnail-m-gap': `${THUMBNAIL_M_DESIGN.gap}px`,
  } as CSSProperties

  return (
    <div ref={rootRef} className="thumbnail-m-carousel" style={style}>
      <div className="thumbnail-m-carousel__scroll" aria-label={ariaLabel}>
        <div className="thumbnail-m-carousel__track">{children}</div>
      </div>
    </div>
  )
}

