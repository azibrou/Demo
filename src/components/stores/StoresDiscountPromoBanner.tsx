import { StoresPromoMosaic } from './StoresPromoMosaic'

/** BM Banner — Figma 77303:218315 (discount on fruits & vegetables). */
export function StoresDiscountPromoBanner() {
  return (
    <article className="stores-promo-banner stores-promo-banner--discount">
      <div className="stores-promo-banner__inner">
        <div className="stores-promo-banner__copy">
          <p className="stores-promo-banner__title bolt-font-body-l-accent text-[var(--color-content-primary)]">
            Up to 30% discount
          </p>
          <p className="stores-promo-banner__subtitle bolt-font-body-xs-regular text-[var(--color-content-secondary)]">
            On fruits and vegetables
          </p>
          <p className="stores-promo-banner__validity">Valid till 25 Aug 2024</p>
        </div>
        <StoresPromoMosaic />
      </div>
    </article>
  )
}
