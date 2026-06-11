import { CarouselGridItem } from './CarouselGridItem'
import { CarouselItem } from './CarouselItem'
import { KalepIcon } from './KalepIcon'
import { MerchantOrderProvider } from '../context/OrderContext'
import {
  boltSearchOrderProviderRef,
  type BoltSearchProvider,
} from '../lib/boltFoodTallinnSearchData'

export type HomeSearchProviderResultProps = {
  provider: BoltSearchProvider
  /** Opens the provider's merchant screen (closes the search overlay first). */
  onSelectProvider?: (provider: BoltSearchProvider) => void
}

function HomeSearchProviderHeader({
  provider,
  onSelectProvider,
}: {
  provider: BoltSearchProvider
  onSelectProvider?: (provider: BoltSearchProvider) => void
}) {
  const body = (
    <>
      {provider.scheduled ? (
        <span
          className="home-search-provider__schedule absolute left-2 top-4 z-[1] size-3"
          aria-hidden
        >
          <KalepIcon name="calendar-filled" size={16} />
        </span>
      ) : null}
      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-[var(--color-layer-floor-1)]">
        {provider.imageSrc ? (
          <img
            alt=""
            src={provider.imageSrc}
            className="thumbnail-fill-img pointer-events-none"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--color-bg-neutral-secondary)]" aria-hidden />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <p className="bolt-font-body-m-accent truncate text-[var(--color-content-primary)]">
          {provider.name}
        </p>
        <div className="flex min-w-0 items-center gap-2">
          {provider.deliveryFee ? (
            <span className="flex shrink-0 items-center gap-1">
              <KalepIcon name="bike-delivery-outline" size={16} className="!size-3" />
              <span className="bolt-font-body-xs-regular whitespace-nowrap text-[var(--color-content-primary)]">
                {provider.deliveryFee}
              </span>
            </span>
          ) : null}
          {provider.eta ? (
            <span className="flex shrink-0 items-center gap-1">
              <KalepIcon name="timer-outline" size={16} className="!size-3" />
              <span className="bolt-font-body-xs-regular whitespace-nowrap text-[var(--color-content-primary)]">
                {provider.eta}
              </span>
            </span>
          ) : null}
          {provider.rating ? (
            <span className="flex min-w-0 flex-1 items-baseline gap-3">
              <KalepIcon name="rating-star" size={16} className="!size-3 shrink-0" />
              <span className="bolt-font-body-xs-regular shrink-0 text-[var(--color-content-primary)]">
                {provider.rating}
              </span>
              {provider.ratingCount ? (
                <span className="bolt-font-body-xs-regular min-w-0 truncate text-[var(--color-content-primary)]">
                  ({provider.ratingCount})
                </span>
              ) : null}
            </span>
          ) : null}
        </div>
      </div>
    </>
  )

  return (
    <div className="home-search-provider__top home-gutter-inline flex w-full flex-col gap-[11px] pt-3">
      {onSelectProvider ? (
        <button
          type="button"
          onClick={() => onSelectProvider(provider)}
          aria-label={`Open ${provider.name}`}
          className="relative flex w-full items-center gap-3 rounded-lg text-left outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
        >
          {body}
        </button>
      ) : (
        <div className="relative flex w-full items-center gap-3">{body}</div>
      )}
    </div>
  )
}

/**
 * Figma [Eater] SearchItem — provider header + horizontal dish carousel (77656:280059).
 */
export function HomeSearchProviderResult({ provider, onSelectProvider }: HomeSearchProviderResultProps) {
  const header = <HomeSearchProviderHeader provider={provider} onSelectProvider={onSelectProvider} />
  const orderProvider = boltSearchOrderProviderRef(provider)

  if (provider.items.length === 0) {
    return (
      <section
        className="home-search-provider bolt-font-base flex w-full min-w-0 max-w-full flex-col items-stretch gap-3 text-[var(--color-content-primary)]"
        data-name="[Eater] SearchItem"
      >
        {header}
      </section>
    )
  }

  return (
    <CarouselItem
      title={provider.name}
      topSlot={header}
      scaledTrack
      className="home-search-provider bolt-font-base flex w-full min-w-0 max-w-full flex-col items-stretch gap-3 text-[var(--color-content-primary)]"
      data-name="[Eater] SearchItem"
    >
      <MerchantOrderProvider provider={orderProvider}>
        {provider.items.map((item) => (
          <CarouselGridItem
            key={item.id}
            itemId={item.id}
            imageSrc={item.imageSrc}
            title={item.name}
            price={item.price}
          />
        ))}
      </MerchantOrderProvider>
    </CarouselItem>
  )
}
