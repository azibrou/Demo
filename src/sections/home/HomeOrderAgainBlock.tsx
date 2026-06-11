import { orderAgain } from '../../lib/boltFoodTallinnHomeContent'
import { HomeScaledRow } from '../../components/HomeScaledRow'
import { ThumbnailXs } from '../../components/ThumbnailXs'
import { useEaterNavigate } from '../../hooks/useEaterNavigate'
import {
  boltMarketToompuiesteeStoreNavState,
  isBoltMarketToompuiesteeLabel,
  orderAgainRestaurantNavState,
} from '../../lib/merchantNavigation'

/** Home “Order again” block — scaled XS thumb row (same scale model as {@link HomeShortcutsBlock}). */
export function HomeOrderAgainBlock() {
  const navigate = useEaterNavigate()

  return (
    <section className="order-again pb-4 pt-0" aria-labelledby="order-again-heading">
      <div className="order-again__header home-gutter-inline">
        <h2 id="order-again-heading" className="bolt-font-heading-xs-accent text-[var(--color-content-primary)]">
          Order again
        </h2>
      </div>
      <HomeScaledRow ariaLabel="Order again">
        {orderAgain.map((item) => (
          <ThumbnailXs
            key={item.line1}
            variant="scaled"
            imageSrc={item.imageSrc}
            line1={item.line1}
            line2={item.line2}
            onClick={
              isBoltMarketToompuiesteeLabel(item.line1)
                ? () => navigate('/store-merchant', { state: boltMarketToompuiesteeStoreNavState() })
                : () => navigate('/restaurant', { state: orderAgainRestaurantNavState(item.line1, item.imageSrc) })
            }
          />
        ))}
      </HomeScaledRow>
    </section>
  )
}
