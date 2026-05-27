import { useCallback, useRef, useState } from 'react'
import { useBasketFabOptional } from '../context/BasketFabContext'
import { design } from '../lib/figmaDesignAssets'
import { QuickAddExpandPill } from './QuickAddExpandPill'

const c = design.carousel

export type SimpleItemTag = {
  label: string
  iconSrc?: string
}

export type SimpleItemProps = {
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
}

/**
 * [Eater] Provider Item — Figma 77237:157049 (restaurant menu list row).
 */
export function SimpleItem({
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
}: SimpleItemProps) {
  const hasImage = !hideImage && imageSrc
  const salePrice = priceWas != null && priceWas !== ''

  const basket = useBasketFabOptional()
  const [quickOpen, setQuickOpen] = useState(false)
  const [qty, setQty] = useState(1)
  const contributedRef = useRef(0)

  const adjustBasketRef = useRef(basket?.adjustCarouselBasketUnits)
  adjustBasketRef.current = basket?.adjustCarouselBasketUnits

  const syncBasketUnits = useCallback((nextQty: number, open: boolean) => {
    const units = open ? nextQty : 0
    const delta = units - contributedRef.current
    contributedRef.current = units
    if (delta !== 0) adjustBasketRef.current?.(delta)
  }, [])

  const handleAdd = useCallback(() => {
    setQty(1)
    setQuickOpen(true)
    syncBasketUnits(1, true)
    onAddClick?.()
  }, [onAddClick, syncBasketUnits])

  const handleDecrement = useCallback(() => {
    setQty((q) => {
      if (q <= 1) {
        setQuickOpen(false)
        syncBasketUnits(1, false)
        return 1
      }
      const next = q - 1
      syncBasketUnits(next, true)
      return next
    })
  }, [syncBasketUnits])

  const handleIncrement = useCallback(() => {
    setQty((q) => {
      const next = q + 1
      syncBasketUnits(next, true)
      return next
    })
  }, [syncBasketUnits])

  return (
    <article className="simple-item" data-node-id={nodeId}>
      <div className="simple-item__content">
        <div className="simple-item__body">
          {statusLabel ? (
            <p className="simple-item__status bolt-font-body-xs-regular">{statusLabel}</p>
          ) : null}
          {badge ? (
            <span className="simple-item__badge bolt-font-body-xs-accent">{badge}</span>
          ) : null}
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
        </div>
        {hasImage ? (
          <div className="simple-item__media">
            <img alt="" src={imageSrc} className="simple-item__image" />
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
