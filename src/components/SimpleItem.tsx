import { useCallback, useState } from 'react'
import { useMerchantOrderProvider, useOrderOptional } from '../context/OrderContext'
import { design } from '../lib/figmaDesignAssets'
import { QuickAddExpandPill } from './QuickAddExpandPill'

const c = design.carousel

export type SimpleItemTag = {
  label: string
  iconSrc?: string
}

export type SimpleItemProps = {
  /** Stable product id — attributes the add to the active order. */
  itemId?: string
  title: string
  description: string
  price: string
  priceWas?: string
  badge?: string
  tags?: readonly SimpleItemTag[]
  statusLabel?: string
  imageSrc?: string
  hideImage?: boolean
  showDivider?: boolean
  /** Figma node id for traceability — default [Eater] Provider Item */
  nodeId?: string
  onAddClick?: () => void
  /** Tap the row (name/description/image) to open the product detail sheet. */
  onOpenDetails?: () => void
}

/**
 * [Eater] Provider Item — Figma 77237:157049 (restaurant menu list row).
 */
export function SimpleItem({
  itemId,
  title,
  description,
  price,
  priceWas,
  badge,
  tags,
  statusLabel,
  imageSrc,
  hideImage = false,
  showDivider = false,
  nodeId = '77237:157049',
  onAddClick,
  onOpenDetails,
}: SimpleItemProps) {
  const hasImage = !hideImage && imageSrc
  const salePrice = priceWas != null && priceWas !== ''

  const order = useOrderOptional()
  const merchantProvider = useMerchantOrderProvider()
  const addProvider = merchantProvider ?? order?.provider ?? null
  const persisted = itemId != null && itemId !== '' && order != null && addProvider != null

  const [localOpen, setLocalOpen] = useState(false)
  const [localQty, setLocalQty] = useState(1)

  const orderQty = persisted ? order.getQtyFor(addProvider.id, itemId) : 0
  const quickOpen = persisted ? orderQty > 0 : localOpen
  const qty = persisted ? Math.max(1, orderQty) : localQty

  const handleAdd = useCallback(() => {
    if (persisted) {
      order.addOne(addProvider, { id: itemId, title, price, image: imageSrc })
    } else {
      setLocalQty(1)
      setLocalOpen(true)
    }
    onAddClick?.()
  }, [order, addProvider, itemId, persisted, title, price, imageSrc, onAddClick])

  const handleDecrement = useCallback(() => {
    if (persisted) {
      order.decrement(itemId)
      return
    }
    setLocalQty((q) => {
      if (q <= 1) {
        setLocalOpen(false)
        return 1
      }
      return q - 1
    })
  }, [order, itemId, persisted])

  const handleIncrement = useCallback(() => {
    if (persisted) {
      order.increment(itemId)
      return
    }
    setLocalQty((q) => q + 1)
  }, [order, itemId, persisted])

  const bodyContent = (
    <>
      {statusLabel ? (
        <p className="simple-item__status bolt-font-body-xs-regular">{statusLabel}</p>
      ) : null}
      {badge ? <span className="simple-item__badge bolt-font-body-xs-accent">{badge}</span> : null}
      <h3 className="simple-item__title bolt-font-body-m-accent">{title}</h3>
      <p className="simple-item__description bolt-font-body-s-regular">{description}</p>
      {tags && tags.length > 0 ? (
        <div className="simple-item__tags">
          {tags.map((tag) => (
            <span key={tag.label} className="simple-item__tag">
              {tag.iconSrc ? <img alt="" src={tag.iconSrc} className="simple-item__tag-icon" /> : null}
              <span className="bolt-font-body-s-regular text-[var(--color-content-secondary)]">{tag.label}</span>
            </span>
          ))}
        </div>
      ) : null}
      <div className="simple-item__price-row">
        {salePrice ? (
          <>
            <span className="bolt-font-body-m-accent text-[var(--color-content-danger-primary)]">{price}</span>
            <span className="bolt-font-body-m-regular text-[var(--color-content-secondary)]">·</span>
            <span className="bolt-font-body-m-regular text-[var(--color-content-secondary)]">{priceWas}</span>
          </>
        ) : (
          <span className="bolt-font-body-m-accent text-[var(--color-content-primary)]">{price}</span>
        )}
      </div>
    </>
  )

  return (
    <article className="simple-item" data-node-id={nodeId}>
      <div className="simple-item__content">
        {onOpenDetails ? (
          <button type="button" onClick={onOpenDetails} className="simple-item__body simple-item__body--tappable">
            {bodyContent}
          </button>
        ) : (
          <div className="simple-item__body">{bodyContent}</div>
        )}
        {hasImage ? (
          <div className="simple-item__media">
            {onOpenDetails ? (
              <button
                type="button"
                aria-label={`Open ${title}`}
                onClick={onOpenDetails}
                className="simple-item__image-button"
              >
                <img alt="" src={imageSrc} className="simple-item__image" />
              </button>
            ) : (
              <img alt="" src={imageSrc} className="simple-item__image" />
            )}
            <div className="simple-item__quick-add">
              <QuickAddExpandPill
                open={quickOpen}
                quantity={qty}
                plusSrc={c.plus}
                minusSrc={c.minus}
                onAdd={handleAdd}
                onDecrement={handleDecrement}
                onIncrement={handleIncrement}
              />
            </div>
          </div>
        ) : null}
      </div>
      {showDivider ? <div className="simple-item__divider" aria-hidden /> : null}
    </article>
  )
}
