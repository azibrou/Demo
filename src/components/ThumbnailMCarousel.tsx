import { Children, isValidElement, type ReactNode } from 'react'

/**
 * Horizontal strip for {@link ThumbnailM}.
 *
 * **Layout:** `outer` = container query only (never `overflow-x`). `thumbnail-m-carousel` = 100% width
 * scrollport with **inner** horizontal padding (24px + safe-area) on the same node as `overflow-x: auto`
 * — gutters stay visible; only `overflow-x: hidden`/`clip` would clip (we avoid those).
 */
export function ThumbnailMCarousel({ children }: { children: ReactNode }) {
  const tiles = Children.toArray(children).filter(isValidElement)

  return (
    <div className="thumbnail-m-carousel-outer">
      <div className="thumbnail-m-carousel">
        <div className="thumbnail-m-carousel__track">
          {tiles.map((child) => (
            <div key={child.key} className="thumbnail-m-carousel__tile">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
