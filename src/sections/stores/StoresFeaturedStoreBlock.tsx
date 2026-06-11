import { useRef, type CSSProperties } from 'react'
import { ThumbnailL } from '../../components/ThumbnailL'
import { useThumbnailLScale } from '../../hooks/useThumbnailLScale'
import { storesFeatured } from '../../lib/boltFoodTallinnStoresContent'

/** Featured store card — display-only promo on the stores tab. */
export function StoresFeaturedStoreBlock() {
  const rootRef = useRef<HTMLElement>(null)
  const scale = useThumbnailLScale(rootRef)

  const style = {
    '--thumbnail-l-scale': String(scale),
  } as CSSProperties

  return (
    <section
      ref={rootRef}
      className="thumbnail-l-section home-gutter-inline py-3"
      style={style}
      data-node-id="77303:218318"
      aria-label={storesFeatured.title}
    >
      <ThumbnailL variant="scaled" {...storesFeatured} />
    </section>
  )
}
