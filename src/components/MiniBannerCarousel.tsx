import type { MiniBannerCarouselItem } from '../lib/miniBannerCarouselContent'

export type MiniBannerCarouselProps = {
  items: readonly MiniBannerCarouselItem[]
  className?: string
  'aria-label'?: string
}

/**
 * Mini banner carousel — Figma 77303:218074 (inline notifications, 68px tall).
 */
export function MiniBannerCarousel({
  items,
  className = '',
  'aria-label': ariaLabel = 'Promotions',
}: MiniBannerCarouselProps) {
  return (
    <div
      className={['mini-banner-carousel bolt-font-base', className].filter(Boolean).join(' ')}
      role="region"
      aria-label={ariaLabel}
      data-node-id="77303:218074"
    >
      <div className="home-horizontal-scroll-outer" aria-label={ariaLabel}>
        <div className="home-horizontal-scroll-row">
          <div className="home-horizontal-scroll-track gap-3">
            {items.map((item) => (
              <article
                key={item.id}
                className={[
                  'mini-banner-carousel__tile',
                  item.variant === 'action' ? 'mini-banner-carousel__tile--action' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="mini-banner-carousel__media">
                  <img alt="" src={item.imageSrc} className="mini-banner-carousel__image" />
                </div>
                <div className="mini-banner-carousel__message">
                  <p className="bolt-font-body-s-accent">{item.title}</p>
                  <p className="bolt-font-body-s-regular">{item.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
