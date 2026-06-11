import { createPortal } from 'react-dom'

type EmptyBasketDialogProps = {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

/** Checkout — confirm before removing all basket items. */
export function EmptyBasketDialog({ open, onCancel, onConfirm }: EmptyBasketDialogProps) {
  if (!open || typeof document === 'undefined') return null

  const dialog = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="empty-basket-title"
      aria-describedby="empty-basket-subtitle"
    >
      <button
        type="button"
        aria-label="Cancel"
        onClick={onCancel}
        className="absolute inset-0 size-full bg-black/40"
      />
      <div className="relative z-10 w-full max-w-[320px] overflow-hidden rounded-2xl bg-[var(--color-layer-floor-1,#fff)] shadow-[0_8px_32px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-2 px-6 pb-5 pt-6 text-center">
          <h2
            id="empty-basket-title"
            className="bolt-font-heading-xs-accent text-[var(--color-content-primary)]"
          >
            Empty basket
          </h2>
          <p
            id="empty-basket-subtitle"
            className="bolt-font-body-m-regular text-[var(--color-content-secondary)]"
          >
            Are you sure you want to delete all the items in your basket?
          </p>
        </div>
        <div className="flex flex-col gap-2 px-4 pb-4">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 w-full shrink-0 rounded-full bg-[var(--color-bg-neutral-secondary)] bolt-font-body-l-accent text-[var(--color-content-primary)] outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-12 w-full shrink-0 rounded-full bg-[var(--color-bg-action-primary,#2b8659)] bolt-font-body-l-accent text-white outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
          >
            Empty basket
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(dialog, document.body)
}
