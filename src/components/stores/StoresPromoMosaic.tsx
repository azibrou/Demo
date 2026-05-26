import { design } from '../../lib/figmaDesignAssets'

const tiles = design.storesHubPromo.mosaicTiles

/** Product mosaic — Figma MosaicProducts @ 156×156 (Stores BM Banner). */
export function StoresPromoMosaic() {
  const [primary, topRight, bottomLeft, bottomRight] = tiles

  return (
    <div className="stores-promo-mosaic" aria-hidden>
      <div className="stores-promo-mosaic__tile stores-promo-mosaic__tile--primary">
        <img alt="" src={primary} className="stores-promo-mosaic__img" />
      </div>
      <div className="stores-promo-mosaic__tile stores-promo-mosaic__tile--top-right">
        <img alt="" src={topRight} className="stores-promo-mosaic__img" />
      </div>
      <div className="stores-promo-mosaic__tile stores-promo-mosaic__tile--bottom-left">
        <img alt="" src={bottomLeft} className="stores-promo-mosaic__img" />
      </div>
      <div className="stores-promo-mosaic__tile stores-promo-mosaic__tile--bottom-right">
        <img alt="" src={bottomRight} className="stores-promo-mosaic__img" />
      </div>
    </div>
  )
}
