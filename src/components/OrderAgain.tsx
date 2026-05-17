import { orderAgain } from '../lib/boltFoodTallinnHomeContent'
import { HomeScaledRow } from './HomeScaledRow'
import { ThumbnailXs } from './ThumbnailXs'

/** Home “Order again” — scaled XS thumb row (same scale model as {@link ShortcutsCarousel}). */
export function OrderAgain() {
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
          />
        ))}
      </HomeScaledRow>
    </section>
  )
}
