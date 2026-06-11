import { storesOrderAgain } from '../../lib/boltFoodTallinnStoresContent'
import { HomeScaledRow } from '../../components/HomeScaledRow'
import { ThumbnailXs } from '../../components/ThumbnailXs'
import { useEaterNavigate } from '../../hooks/useEaterNavigate'
import {
  boltMarketToompuiesteeStoreNavState,
  isBoltMarketToompuiesteeLabel,
} from '../../lib/merchantNavigation'

/** Stores tab “Order again” — only Bolt Market Toompuiestee opens the demo merchant. */
export function StoresOrderAgainBlock() {
  const navigate = useEaterNavigate()

  return (
    <section className="order-again pb-4 pt-0" aria-labelledby="stores-order-again-heading">
      <div className="order-again__header home-gutter-inline">
        <h2 id="stores-order-again-heading" className="bolt-font-heading-xs-accent text-[var(--color-content-primary)]">
          Order again
        </h2>
      </div>
      <HomeScaledRow ariaLabel="Order again">
        {storesOrderAgain.map((item) => (
          <ThumbnailXs
            key={item.line1}
            variant="scaled"
            imageSrc={item.imageSrc}
            line1={item.line1}
            line2={item.line2}
            onClick={
              isBoltMarketToompuiesteeLabel(item.line1)
                ? () => navigate('/store-merchant', { state: boltMarketToompuiesteeStoreNavState() })
                : undefined
            }
          />
        ))}
      </HomeScaledRow>
    </section>
  )
}
