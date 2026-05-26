import { design } from '../../lib/figmaDesignAssets'

const { boltPlusHero, boltPlusLogoUnion, boltPlusLogoGroup } = design.storesHubPromo

/** HomeBanner Bolt Plus — Figma 77303:218315. */
export function StoresBoltPlusPromoBanner() {
  return (
    <article className="stores-promo-banner stores-promo-banner--bolt-plus">
      <div className="stores-promo-banner__inner">
        <div className="stores-promo-banner__copy stores-promo-banner__copy--bolt-plus">
          <div className="stores-promo-banner__bolt-logo" aria-hidden>
            <img alt="" src={boltPlusLogoUnion} className="stores-promo-banner__bolt-logo-union" />
            <img alt="" src={boltPlusLogoGroup} className="stores-promo-banner__bolt-logo-plus" />
          </div>
          <p className="stores-promo-banner__title bolt-font-body-l-accent text-white">Join Bolt Plus</p>
          <p className="stores-promo-banner__subtitle bolt-font-body-xs-regular text-white/90">
            Free delivery and 10% reward on rides
          </p>
        </div>
        <div className="stores-promo-banner__bolt-hero">
          <img alt="" src={boltPlusHero} className="stores-promo-banner__bolt-hero-img" />
        </div>
      </div>
    </article>
  )
}
