import { kalepIcons as ki } from '../lib/kalepIcons'

export type ProductSheetAddProps = {
  /** Add quantity (starts at 1, independent of basket qty). */
  quantity: number
  /** Total label for the CTA, e.g. `3,00 €`. */
  totalLabel: string
  /** Item already exists in the order — show the red delete control. */
  inBasket: boolean
  onIncrement: () => void
  onDecrement: () => void
  onDelete: () => void
  onAdd: () => void
}

/**
 * Sticky bottom CTA for {@link ProductSheet} — Figma 80656:180785.
 * Counter (add quantity) + green "Add {total}". When the item is already in the
 * basket and quantity is 1, the left control becomes the red delete button.
 */
export function ProductSheetAdd({
  quantity,
  totalLabel,
  inBasket,
  onIncrement,
  onDecrement,
  onDelete,
  onAdd,
}: ProductSheetAddProps) {
  const showDelete = inBasket && quantity <= 1

  return (
    <div className="product-sheet-add">
      <div className="product-sheet-add__divider" aria-hidden />
      <div className="product-sheet-add__content">
        <div className="product-sheet-add__counter" data-node-id="50382:135038">
          {showDelete ? (
            <button
              type="button"
              aria-label="Remove from basket"
              onClick={onDelete}
              className="product-sheet-add__delete"
            >
              <img alt="" src={ki.bin} className="product-sheet-add__delete-icon" />
            </button>
          ) : (
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={onDecrement}
              disabled={quantity <= 1}
              className="product-sheet-add__step"
            >
              <img alt="" src={ki.minus} className="product-sheet-add__step-icon" />
            </button>
          )}
          <span className="product-sheet-add__count bolt-font-body-l-regular">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={onIncrement}
            className="product-sheet-add__step"
          >
            <img alt="" src={ki.plus} className="product-sheet-add__step-icon" />
          </button>
        </div>

        <button type="button" onClick={onAdd} className="product-sheet-add__cta" data-node-id="50382:135039">
          <span className="bolt-font-body-l-accent leading-[22px]">Add</span>
          <span className="bolt-font-body-l-accent leading-[22px]">{totalLabel}</span>
        </button>
      </div>
    </div>
  )
}
