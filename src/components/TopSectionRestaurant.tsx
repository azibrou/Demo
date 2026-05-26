import { design } from '../lib/figmaDesignAssets'

const a = design.topSectionRestaurant

export type TopSectionRestaurantProvider = {
  name: string
  rating: string
  reviews: string
  deliveryPrice: string
  deliveryLabel: string
  eta: string
  etaLabel: string
}

export type TopSectionRestaurantProps = {
  provider: TopSectionRestaurantProvider
  onBack?: () => void
}

function NavIconButton({
  label,
  iconSrc,
  onClick,
}: {
  label: string
  iconSrc: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="top-section-restaurant__nav-btn"
      data-name="[Eater] Icon-Nav-Button"
    >
      <span className="top-section-restaurant__nav-btn-bg" aria-hidden />
      <img alt="" src={iconSrc} className="top-section-restaurant__nav-icon" />
    </button>
  )
}

function MetricVDivider({ src, variant }: { src: string; variant: 'start' | 'inner' }) {
  return (
    <div
      className={[
        'top-section-restaurant__metric-divider',
        variant === 'inner' ? 'top-section-restaurant__metric-divider--inner' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden
    >
      <img alt="" src={src} className="top-section-restaurant__metric-divider-img" />
    </div>
  )
}

function MetricColumn({
  iconSrc,
  primary,
  secondary,
  dividers,
}: {
  iconSrc?: string
  primary: string
  secondary: string
  dividers: { start: string; end: string }
}) {
  return (
    <div className="top-section-restaurant__metric-col">
      <MetricVDivider src={dividers.start} variant="start" />
      <div className="top-section-restaurant__metric-body">
        <div className="top-section-restaurant__metric-row-primary">
          {iconSrc ? <img alt="" src={iconSrc} className="top-section-restaurant__metric-icon" /> : null}
          <span className="bolt-font-body-s-accent">{primary}</span>
        </div>
        <span className="bolt-font-body-s-regular text-[var(--color-content-secondary)]">{secondary}</span>
      </div>
      <MetricVDivider src={dividers.end} variant="inner" />
    </div>
  )
}

/**
 * Restaurant provider header — Figma [77303:218235](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=77303-218235).
 */
export function TopSectionRestaurant({ provider, onBack }: TopSectionRestaurantProps) {
  const p = provider

  return (
    <section className="top-section-restaurant w-full" data-node-id="77303:218235">
      <div className="top-section-restaurant__hero" data-node-id="77303:218133" data-name="Content">
        <img alt="" src={a.hero} className="top-section-restaurant__hero-image" />
        <div className="top-section-restaurant__hero-gradient" aria-hidden data-node-id="77303:218233" />

        <div className="top-section-restaurant__nav" data-node-id="77303:218134" data-name="[Eater] Top-nav-bar - Provider">
          <div
            className="top-section-restaurant__nav-bar"
            data-node-id="77303:218196"
            data-name="[Eater] Top-nav-bar - Provider"
          >
            <NavIconButton label="Back" iconSrc={a.arrowLeft} onClick={onBack} />
            <span className="top-section-restaurant__nav-spacer" aria-hidden />
            <NavIconButton label="Share" iconSrc={a.shareIos} />
            <NavIconButton label="Favourites" iconSrc={a.heartOutline} />
          </div>
        </div>

        <div className="top-section-restaurant__title-block" data-node-id="77303:218136" data-name="Provider_title">
          <div className="top-section-restaurant__title-row" data-node-id="77303:218137" data-name="Title">
            <h1 className="top-section-restaurant__title bolt-font-heading-m-accent">{p.name}</h1>
          </div>
          <div className="top-section-restaurant__more-info-row" data-node-id="77303:218139" data-name="More info">
            <button type="button" className="top-section-restaurant__more-info" data-node-id="77303:218146" data-name="More">
              <span className="bolt-font-body-s-accent">More info</span>
              <img alt="" src={a.chevronRight} className="top-section-restaurant__more-info-chevron" />
            </button>
          </div>
        </div>
      </div>

      <div className="top-section-restaurant__metrics" data-node-id="77303:218150" data-name="Top Section">
        <div
          className="top-section-restaurant__metrics-row"
          data-node-id="77303:218151"
          data-name="[Eater] Provider Metrics"
        >
          <MetricColumn
            iconSrc={a.ratingStar}
            primary={p.rating}
            secondary={p.reviews}
            dividers={{ start: a.divider, end: a.dividerAlt }}
          />
          <MetricColumn
            iconSrc={a.bikeDelivery}
            primary={p.deliveryPrice}
            secondary={p.deliveryLabel}
            dividers={{ start: a.divider, end: a.dividerAlt }}
          />
          <MetricColumn
            iconSrc={a.timer}
            primary={p.eta}
            secondary={p.etaLabel}
            dividers={{ start: a.divider, end: a.divider }}
          />
        </div>
      </div>
    </section>
  )
}
