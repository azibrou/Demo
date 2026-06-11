import { useState } from 'react'
import { CategoryBottomSheet } from './CategoryBottomSheet'
import { ProductSheetAdd } from './ProductSheetAdd'
import { useOrder, type OrderLineInput } from '../context/OrderContext'
import type { OrderProviderRef } from '../lib/orderProvider'
import { formatEuro, parsePrice } from '../lib/price'
import { kalepIcons as ki } from '../lib/kalepIcons'

export type ProductSheetProduct = OrderLineInput & { description?: string }

export type ProductSheetProps = {
  product: ProductSheetProduct
  /** Merchant the product belongs to — added items attribute to it. */
  provider: OrderProviderRef
  onClose: () => void
}

/**
 * Dish bottom sheet — Figma 80656:180636.
 * Slides up from the bottom with a sticky {@link ProductSheetAdd} CTA. The add
 * counter always starts at 1; pressing Add adds that many units to the order.
 */
export function ProductSheet({ product, provider, onClose }: ProductSheetProps) {
  const order = useOrder()
  const [count, setCount] = useState(1)
  const [expanded, setExpanded] = useState(false)

  const inBasket =
    order.provider?.id === provider.id && order.getQtyFor(provider.id, product.id) > 0
  const totalLabel = formatEuro(parsePrice(product.price) * count)
  const hasDescription = (product.description ?? '').trim().length > 0

  const addToOrder = (close: () => void) => {
    for (let i = 0; i < count; i += 1) {
      order.addOne(provider, {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      })
    }
    close()
  }

  return (
    <CategoryBottomSheet ariaLabel={product.title} onClose={onClose}>
      {(close) => (
        <>
          {/* Close button lives outside the scroll area so it stays pinned while content scrolls */}
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="product-sheet__close"
          >
            <img alt="" src={ki.clear} className="block size-5" />
          </button>

          <div className="product-sheet__scroll">
            <div className="product-sheet__media" data-node-id="80656:180637">
              {product.image ? (
                <img alt="" src={product.image} className="product-sheet__media-img" />
              ) : null}
            </div>

            <div className="flex flex-col gap-2 p-6" data-node-id="80656:180640">
              <h2 className="bolt-font-heading-xs-accent text-[var(--color-content-primary)]">
                {product.title}
              </h2>
              <p className="bolt-font-heading-s-accent text-[var(--color-content-primary)]">
                {product.price}
              </p>

              {hasDescription ? (
                <div className="flex flex-col items-start gap-1 pt-1">
                  <p
                    className={[
                      'bolt-font-body-s-regular text-[var(--color-content-secondary)]',
                      expanded ? '' : 'line-clamp-4',
                    ].join(' ')}
                  >
                    {product.description}
                  </p>
                  {!expanded ? (
                    <button
                      type="button"
                      onClick={() => setExpanded(true)}
                      className="bolt-font-body-s-accent text-[var(--color-content-secondary)]"
                    >
                      Show more
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="h-2 w-full shrink-0 bg-[var(--color-layer-floor-2)]" aria-hidden />

            <div className="flex flex-col gap-1 px-6 py-4" data-node-id="80656:180714">
              <p className="bolt-font-body-s-regular text-[var(--color-content-tertiary)]">Add a note</p>
              <p className="bolt-font-body-xs-regular text-[var(--color-content-tertiary)]">
                It may not be possible to meet all requests
              </p>
            </div>
          </div>

          <ProductSheetAdd
            quantity={count}
            totalLabel={totalLabel}
            inBasket={inBasket}
            onIncrement={() => setCount((c) => c + 1)}
            onDecrement={() => setCount((c) => Math.max(1, c - 1))}
            onDelete={() => order.removeItem(product.id)}
            onAdd={() => addToOrder(close)}
          />
        </>
      )}
    </CategoryBottomSheet>
  )
}
