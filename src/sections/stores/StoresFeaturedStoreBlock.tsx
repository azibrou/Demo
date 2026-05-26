import { useRef, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThumbnailL } from '../../components/ThumbnailL'
import { useThumbnailLScale } from '../../hooks/useThumbnailLScale'
import { storesFeatured } from '../../lib/boltFoodTallinnStoresContent'

/** Featured store card — Figma 77303:218318. */
export function StoresFeaturedStoreBlock() {
  const navigate = useNavigate()
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
      <button
        type="button"
        onClick={() => navigate('/store-merchant')}
        className="w-full cursor-pointer text-left"
      >
        <ThumbnailL variant="scaled" {...storesFeatured} />
      </button>
    </section>
  )
}
