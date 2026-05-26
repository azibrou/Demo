import { StoresBoltPlusPromoBanner } from '../../components/stores/StoresBoltPlusPromoBanner'
import { StoresDiscountPromoBanner } from '../../components/stores/StoresDiscountPromoBanner'

/** Stores hub promo banners — Figma 77303:218315 (BannerCarousel Multiple 375). */
export function StorePromoBannerBlock() {
  return (
    <section
      className="banner-carousel bolt-font-base w-full"
      role="region"
      aria-label="Promotions"
      data-node-id="77303:218315"
    >
      <div className="banner-carousel__scroll" aria-label="Promotions">
        <div className="banner-carousel__track">
          <div className="banner-carousel__slide banner-carousel__slide--composed">
            <StoresDiscountPromoBanner />
          </div>
          <div className="banner-carousel__slide banner-carousel__slide--composed">
            <StoresBoltPlusPromoBanner />
          </div>
        </div>
      </div>
    </section>
  )
}
