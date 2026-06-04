import { useCallback, useState } from 'react'
import { ListItem } from '../../components/ListItem'
import { useBasketFabOptional } from '../../context/BasketFabContext'
import { design } from '../../lib/figmaDesignAssets'

const ml = design.merchantList

const LIST_ITEMS = [
  { id: '1', title: 'Banana 1 kg', price: '9,00 €', image: ml.rowThumb[0]! },
  { id: '2', title: 'Mini Bananas,\u00a0250g', price: '9,00 €', image: ml.rowThumb[1]! },
  { id: '3', title: 'Banana Curd Pancakes, 200g', price: '9,00 €', image: ml.rowThumb[2]! },
  { id: '4', title: 'Frezza, Banana Coffee Drink, 250ml', price: '9,00 €', image: ml.rowThumb[3]! },
  { id: '5', title: 'Little Tom, Pasteurized Banana Milk, 0,2l', price: '9,00 €', image: ml.rowThumb[4]! },
  { id: '6', title: 'Tere, Emma \u200b\u200bBanana Curd Paste, 150g', price: '9,00 €', image: ml.rowThumb[5]! },
  {
    id: '7',
    title: 'Apple-Banana-Strawberry Fruit Mix, 4x100g',
    price: '9,00 €',
    image: ml.rowThumb[6]!,
  },
] as const

function merchantListItemId(rowId: string) {
  return `merchant-list:${rowId}`
}

type MerchantListRowProps = {
  row: (typeof LIST_ITEMS)[number]
  showDivider: boolean
}

function MerchantListRow({ row, showDivider }: MerchantListRowProps) {
  const basket = useBasketFabOptional()
  const itemId = merchantListItemId(row.id)
  const qty = basket?.getCarouselItemQty(itemId) ?? 0

  const onAdd = useCallback(() => {
    basket?.setCarouselItemQty(itemId, 1)
  }, [basket, itemId])

  const onIncrement = useCallback(() => {
    basket?.setCarouselItemQty(itemId, qty + 1)
  }, [basket, itemId, qty])

  const onDecrement = useCallback(() => {
    if (qty <= 1) basket?.setCarouselItemQty(itemId, 0)
    else basket?.setCarouselItemQty(itemId, qty - 1)
  }, [basket, itemId, qty])

  return (
    <ListItem
      variant={qty > 0 ? 'added' : 'add'}
      title={row.title}
      price={row.price}
      imageSrc={row.image}
      basketQty={Math.max(1, qty)}
      showDivider={showDivider}
      onAddClick={onAdd}
      onBasketIncrement={onIncrement}
      onBasketDecrement={onDecrement}
    />
  )
}

/**
 * Merchant List tab — Figma [77943:161673](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=77943-161673).
 */
export function MerchantListTab() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="flex flex-col bg-[var(--color-layer-floor-1)]" data-node-id="77943:161673">
      <header
        className="flex h-12 items-center justify-between px-6 pb-2 pt-1"
        data-node-id="77943:161688"
      >
        <h1 className="bolt-font-heading-m-accent shrink-0 whitespace-nowrap text-[var(--color-content-primary)]">
          My list
        </h1>
        <div className="flex shrink-0 items-center gap-4" data-name="[end] slot">
          <button type="button" className="relative size-6 shrink-0" aria-label="Add item">
            <img alt="" src={ml.navAdd} className="absolute inset-0 block size-full max-w-none" />
          </button>
          <button
            type="button"
            className="relative size-6 shrink-0"
            aria-label={isEditing ? 'Done editing' : 'Edit list'}
            aria-pressed={isEditing}
            onClick={() => setIsEditing((v) => !v)}
          >
            <img alt="" src={ml.navEdit} className="absolute inset-0 block size-full max-w-none" />
          </button>
        </div>
      </header>

      <section className="flex flex-col py-5" data-node-id="77943:161708" aria-label="List results">
        <div className="flex items-center justify-between gap-3 px-6">
          <h2 className="bolt-font-heading-xs-accent min-w-0 text-[var(--color-content-primary)]">
            {LIST_ITEMS.length} Items
          </h2>
          <button
            type="button"
            className="bolt-font-body-s-accent shrink-0 rounded-full bg-[var(--color-bg-neutral-secondary)] px-3 py-2 text-[var(--color-content-primary)]"
            data-node-id="77943:161950"
          >
            Add all to basket
          </button>
        </div>

        {LIST_ITEMS.map((row, index) => (
          <MerchantListRow
            key={row.id}
            row={row}
            showDivider={index < LIST_ITEMS.length - 1}
          />
        ))}
      </section>
    </div>
  )
}
