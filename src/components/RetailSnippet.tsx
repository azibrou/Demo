import { useId } from 'react'
import { retailSnippetProducts, retailSnippetStore } from '../lib/boltFoodTallinnHomeContent'
import { RETAIL_TILE_WIDTH } from '../lib/carouselTileWidth'
import { design } from '../lib/figmaDesignAssets'
import { CarouselGridItem } from './CarouselGridItem'
import { CarouselItem } from './CarouselItem'

const rsp = design.retailSnippetProvider
const c = design.carousel

function RetailSnippetProviderHeader({ titleId }: { titleId: string }) {
  const s = retailSnippetStore
  return (
    <div className="w-full shrink-0 px-6 pt-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-white">
          <img alt="" src={rsp.storeBranding} className="pointer-events-none size-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-[rgba(0,45,30,0.06)]" aria-hidden />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1 overflow-hidden">
          <p
            id={titleId}
            className="truncate text-[20px] font-semibold leading-[25px] tracking-[-0.34px] text-[#191f1c] [font-feature-settings:'cv03'_1,'cv04'_1,'lnum'_1,'pnum'_1]"
          >
            {s.name}
          </p>
          <div className="flex min-w-0 flex-wrap items-center gap-2 text-[#191f1c]">
            <span className="inline-flex shrink-0 items-center gap-1">
              <img alt="" src={rsp.bikeDelivery} className="size-3 shrink-0" />
              <span className="whitespace-nowrap text-sm font-normal leading-5 tracking-[-0.084px] [font-feature-settings:'cv03'_1,'cv04'_1,'lnum'_1,'pnum'_1]">
                {s.deliveryPrice}
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1">
              <img alt="" src={rsp.timer} className="size-3 shrink-0" />
              <span className="whitespace-nowrap text-xs font-normal leading-4 [font-feature-settings:'cv03'_1,'cv04'_1,'lnum'_1,'pnum'_1]">
                {s.eta}
              </span>
            </span>
            <span className="inline-flex min-w-0 max-w-full items-baseline gap-1">
              <span className="relative size-3 shrink-0 self-center" aria-hidden>
                <img
                  alt=""
                  src={rsp.ratingStar}
                  className="pointer-events-none absolute inset-0 size-full max-w-none object-contain"
                />
              </span>
              <span className="flex min-w-0 items-baseline gap-0.5 text-xs font-normal leading-4 [font-feature-settings:'cv03'_1,'cv04'_1,'lnum'_1,'pnum'_1]">
                <span className="shrink-0 whitespace-nowrap">{s.rating}</span>
                <span className="shrink-0 text-[rgba(0,10,7,0.63)]">{s.reviews}</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function RetailSnippetViewMore({ tileWidth }: { tileWidth: string }) {
  return (
    <div style={{ width: tileWidth }} className="font-sans flex min-w-0 shrink-0 flex-col items-stretch">
      <div className="flex aspect-square w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-[8px]">
        <button
          type="button"
          aria-label="View more products"
          className="flex flex-col items-center gap-2 rounded-lg p-2 text-[#191f1c] outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#191f1c]"
        >
          <span
            className="relative shrink-0 rounded-full bg-[rgba(0,45,30,0.07)] [width:calc(56px*var(--shortcut-scale))] [height:calc(56px*var(--shortcut-scale))]"
            aria-hidden
          >
            <span className="absolute left-1/2 top-1/2 block size-[calc(24px*var(--shortcut-scale))] -translate-x-1/2 -translate-y-1/2 scale-x-[-1]">
              <img alt="" src={c.allChevron} className="pointer-events-none block size-full max-w-none object-contain opacity-70" />
            </span>
          </span>
          <span className="max-w-full px-1 text-center text-xs font-semibold leading-4 [font-feature-settings:'cv03'_1,'cv04'_1,'lnum'_1,'pnum'_1]">
            View more
          </span>
        </button>
      </div>
    </div>
  )
}

/**
 * Figma [74923:235051](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=74923-235051) — retail-snippet:
 * compact provider row + horizontally scrolling product tiles using {@link CarouselItem} and {@link CarouselGridItem}.
 * Provider header: [74930:235390](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=74930-235390).
 * Live store line and product copy come from {@link retailSnippetStore} / {@link retailSnippetProducts} in
 * `boltFoodTallinnHomeContent.ts` (Bolt Market Sõle, `provider_id` 28630).
 */
export function RetailSnippet() {
  const titleId = `retail-snippet-title-${useId().replace(/:/g, '')}`

  return (
    <CarouselItem
      title={retailSnippetStore.name}
      titleId={titleId}
      scaledTrack
      topSlot={<RetailSnippetProviderHeader titleId={titleId} />}
    >
      {retailSnippetProducts.map((p) =>
        p.variant === 'discount' ? (
          <CarouselGridItem
            key={p.id}
            variant="discount"
            tileWidth={RETAIL_TILE_WIDTH}
            imageSrc={p.imageSrc}
            title={p.title}
            unitLabel={p.unitLabel}
            priceNow={p.priceNow}
            priceWas={p.priceWas}
            discountLabel={p.discountLabel}
            accentLabel={p.accentLabel}
          />
        ) : (
          <CarouselGridItem
            key={p.id}
            variant="default"
            tileWidth={RETAIL_TILE_WIDTH}
            imageSrc={p.imageSrc}
            title={p.title}
            unitLabel={p.unitLabel}
            price={p.price}
            accentLabel={p.accentLabel}
          />
        ),
      )}
      <RetailSnippetViewMore tileWidth={RETAIL_TILE_WIDTH} />
    </CarouselItem>
  )
}
