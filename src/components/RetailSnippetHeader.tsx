import { design } from '../lib/figmaDesignAssets'

const rsp = design.retailSnippetProvider

export type RetailSnippetHeaderStore = {
  name: string
  imageSrc: string
  deliveryPrice: string
  eta: string
  rating: string
  reviews: string
}

export type RetailSnippetHeaderProps = {
  store: RetailSnippetHeaderStore
  titleId: string
  /** When set, the store row (logo + title + meta) navigates to the merchant screen. */
  onHeaderClick?: () => void
}

/**
 * Figma Snippet header — [77237:148102](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=77237-148102).
 */
export function RetailSnippetHeader({ store, titleId, onHeaderClick }: RetailSnippetHeaderProps) {
  const storeRow = (
    <>
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[var(--color-layer-floor-1)]">
        <img alt="" src={store.imageSrc} className="pointer-events-none size-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-[rgba(0,45,30,0.06)]" aria-hidden />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 overflow-hidden text-left">
        <p
          id={titleId}
          className="bolt-font-heading-xs-accent truncate text-[var(--color-content-primary)]"
        >
          {store.name}
        </p>
        <div className="flex w-full min-w-0 items-center gap-2 text-[var(--color-content-primary)]">
          <span className="inline-flex shrink-0 items-center gap-1">
            <span className="relative size-3 shrink-0" aria-hidden>
              <img
                alt=""
                src={rsp.bikeDelivery}
                className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain"
              />
            </span>
            <span className="bolt-font-body-xs-regular whitespace-nowrap">{store.deliveryPrice}</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1">
            <span className="relative size-3 shrink-0" aria-hidden>
              <img
                alt=""
                src={rsp.timer}
                className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain"
              />
            </span>
            <span className="bolt-font-body-xs-regular whitespace-nowrap">{store.eta}</span>
          </span>
          <span className="inline-flex min-w-0 flex-1 items-center gap-1">
            <span className="relative size-3 shrink-0" aria-hidden>
              <img
                alt=""
                src={rsp.ratingStar}
                className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain"
              />
            </span>
            <span className="bolt-font-body-xs-regular flex min-w-0 items-baseline gap-0.5">
              <span className="shrink-0 whitespace-nowrap">{store.rating}</span>
              <span className="min-w-0 flex-1 truncate">{store.reviews}</span>
            </span>
          </span>
        </div>
      </div>
    </>
  )

  return (
    <div className="home-gutter-inline relative w-full shrink-0">
      <button
        type="button"
        aria-label="Schedule delivery"
        className="absolute left-2 top-4 z-[1] flex size-3 shrink-0 items-center justify-center rounded text-[var(--color-content-primary)] outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-content-primary)]"
      >
        <img alt="" src={rsp.calendarFilled} className="pointer-events-none block size-full max-w-none object-contain" />
      </button>
      {onHeaderClick ? (
        <button
          type="button"
          onClick={onHeaderClick}
          className="flex w-full min-w-0 items-center gap-3 rounded-lg text-left outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
        >
          {storeRow}
        </button>
      ) : (
        <div className="flex min-w-0 items-center gap-3">{storeRow}</div>
      )}
    </div>
  )
}
