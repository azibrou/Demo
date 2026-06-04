import { KalepIcon } from './KalepIcon'
import { design } from '../lib/figmaDesignAssets'
import type { KalepIconStem } from '../lib/kalepIcons'

const a = design.topSectionStore

export type TopSectionStoreProvider = {
  name: string
  rating: string
  reviews: string
  deliveryPrice: string
  deliveryLabel: string
  eta: string
  etaLabel: string
  heroImageSrc?: string
  logoImageSrc?: string
}

export type TopSectionStoreProps = {
  provider: TopSectionStoreProvider
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
      className="top-section-store__nav-btn"
      data-name="[Eater] Icon-Nav-Button"
    >
      <span className="top-section-store__nav-btn-bg" aria-hidden />
      <img alt="" src={iconSrc} className="top-section-store__nav-icon" />
    </button>
  )
}

function MetricVDivider({ src, variant }: { src: string; variant: 'start' | 'inner' }) {
  return (
    <div
      className={[
        'top-section-store__metric-divider',
        variant === 'inner' ? 'top-section-store__metric-divider--inner' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden
    >
      <img alt="" src={src} className="top-section-store__metric-divider-img" />
    </div>
  )
}

function MetricColumn({
  iconSrc,
  kalepIcon,
  primary,
  secondary,
  dividers,
}: {
  iconSrc?: string
  kalepIcon?: KalepIconStem
  primary: string
  secondary: string
  dividers: { start: string; end: string }
}) {
  return (
    <div className="top-section-store__metric-col">
      <MetricVDivider src={dividers.start} variant="start" />
      <div className="top-section-store__metric-body">
        <div className="top-section-store__metric-row-primary">
          {kalepIcon ? (
            <KalepIcon name={kalepIcon} size={16} className="top-section-store__metric-kalep shrink-0" />
          ) : iconSrc ? (
            <img alt="" src={iconSrc} className="top-section-store__metric-icon" />
          ) : null}
          <span className="bolt-font-body-s-accent">{primary}</span>
        </div>
        <span className="bolt-font-body-s-regular text-[var(--color-content-secondary)]">{secondary}</span>
      </div>
      <MetricVDivider src={dividers.end} variant="inner" />
    </div>
  )
}

/**
 * Grocery store provider header — Figma [77303:218308](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=77303-218308).
 */
export function TopSectionStore({ provider, onBack }: TopSectionStoreProps) {
  const p = provider
  const heroSrc = p.heroImageSrc ?? a.hero
  const logoSrc = p.logoImageSrc ?? a.logo

  return (
    <section className="top-section-store w-full" data-node-id="77303:218308">
      <div className="top-section-store__hero" data-node-id="77303:218237" data-name="Img">
        <img alt="" src={heroSrc} className="top-section-store__hero-image" />
        <div className="top-section-store__hero-gradient" aria-hidden data-node-id="77303:218240" data-name="fader" />

        <div className="top-section-store__nav" data-node-id="77303:218241" data-name="[Eater] Top-nav-bar - Provider">
          <div
            className="top-section-store__nav-bar"
            data-node-id="77303:218242"
            data-name="[Eater] Top-nav-bar - Provider"
          >
            <NavIconButton label="Back" iconSrc={a.arrowLeft} onClick={onBack} />
            <span className="top-section-store__nav-spacer" aria-hidden />
            <NavIconButton label="Share" iconSrc={a.shareIos} />
            <NavIconButton label="Favourites" iconSrc={a.heartOutline} />
          </div>
        </div>
      </div>

      <div className="top-section-store__body" data-node-id="77303:218236" data-name="Provider header">
        <div className="top-section-store__title-stack" data-node-id="77303:218258" data-name="[Eater] Store_title">
          <div className="top-section-store__logo" data-node-id="77303:218259">
            <img alt="" src={logoSrc} className="top-section-store__logo-image" />
          </div>

          <div className="top-section-store__card" data-node-id="77303:218260" data-name="Top Section">
            <div className="top-section-store__title-block" data-node-id="77303:218261" data-name="Provider_title">
              <div className="top-section-store__title-row" data-node-id="77303:218262" data-name="Title">
                <h1 className="top-section-store__title bolt-font-heading-m-accent">{p.name}</h1>
              </div>
              <div className="top-section-store__more-info-row" data-node-id="77303:218264" data-name="Row">
                <button type="button" className="top-section-store__more-info" data-node-id="77303:218271" data-name="More">
                  <span className="bolt-font-body-s-accent">More info</span>
                  <img alt="" src={a.chevronRight} className="top-section-store__more-info-chevron" />
                </button>
              </div>
            </div>

            <div
              className="top-section-store__metrics-row"
              data-node-id="77303:218274"
              data-name="[Eater] Provider Metrics"
            >
              <MetricColumn
                kalepIcon="rating-star-provider"
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
        </div>
      </div>
    </section>
  )
}
