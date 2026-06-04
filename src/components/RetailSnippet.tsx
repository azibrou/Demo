import { useId } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  retailSnippetProducts,
  retailSnippetStore,
  type RetailSnippetProduct,
} from '../lib/boltFoodTallinnHomeContent'
import type { RetailSnippetHeaderStore } from './RetailSnippetHeader'
import { design } from '../lib/figmaDesignAssets'
import { boltMarketToompuiesteeStoreNavState } from '../lib/merchantNavigation'
import { CarouselGridItem } from './CarouselGridItem'
import { CarouselItem } from './CarouselItem'
import { RetailSnippetHeader } from './RetailSnippetHeader'

const c = design.carousel

function RetailSnippetViewMore() {
  return (
    <div className="carousel-grid-item bolt-font-base flex min-w-0 shrink-0 flex-col items-stretch">
      <div className="flex aspect-square w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-[8px]">
        <button
          type="button"
          aria-label="View more products"
          className="flex flex-col items-center gap-2 rounded-lg p-2 text-[var(--color-content-primary)] outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-content-primary)]"
        >
          <span
            className="relative shrink-0 rounded-full bg-[var(--color-bg-neutral-secondary)] [width:calc(56px*var(--shortcut-scale))] [height:calc(56px*var(--shortcut-scale))]"
            aria-hidden
          >
            <span className="absolute left-1/2 top-1/2 block size-[calc(24px*var(--shortcut-scale))] -translate-x-1/2 -translate-y-1/2 scale-x-[-1]">
              <img alt="" src={c.allChevron} className="pointer-events-none block size-full max-w-none object-contain opacity-70" />
            </span>
          </span>
          <span className="bolt-font-body-xs-accent max-w-full px-1 text-center">View more</span>
        </button>
      </div>
    </div>
  )
}

export type RetailSnippetProps = {
  store?: RetailSnippetHeaderStore
  products?: readonly RetailSnippetProduct[]
}

/**
 * Figma retail-snippet — provider Snippet header [77237:148102](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=77237-148102)
 * + horizontally scrolling product tiles ({@link CarouselGridItem}).
 * Live copy from {@link retailSnippetStore} / {@link retailSnippetProducts} (Bolt Market Toompuiestee).
 */
export function RetailSnippet({
  store = retailSnippetStore,
  products = retailSnippetProducts,
}: RetailSnippetProps) {
  const navigate = useNavigate()
  const titleId = `retail-snippet-title-${useId().replace(/:/g, '')}`

  return (
    <CarouselItem
      title={store.name}
      titleId={titleId}
      scaledTrack
      topSlot={
        <RetailSnippetHeader
          store={store}
          titleId={titleId}
          onHeaderClick={() =>
            navigate('/store-merchant', { state: boltMarketToompuiesteeStoreNavState() })
          }
        />
      }
    >
      {products.map((p) =>
        p.variant === 'discount' ? (
          <CarouselGridItem
            key={p.id}
            variant="discount"
            imageSrc={p.imageSrc}
            title={p.title}
            unitLabel={p.unitLabel}
            priceNow={p.priceNow}
            priceWas={p.priceWas}
            discountLabel={p.discountLabel}
          />
        ) : (
          <CarouselGridItem
            key={p.id}
            variant="default"
            imageSrc={p.imageSrc}
            title={p.title}
            unitLabel={p.unitLabel}
            price={p.price}
          />
        ),
      )}
      <RetailSnippetViewMore />
    </CarouselItem>
  )
}
