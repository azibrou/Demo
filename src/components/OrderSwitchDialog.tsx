import { useOrder } from '../context/OrderContext'

/**
 * Cross-merchant order switch confirmation.
 * Shown when adding an item from a different merchant than the active order.
 */
export function OrderSwitchDialog() {
  const { pendingProviderName, confirmSwitch, cancelSwitch } = useOrder()
  const open = pendingProviderName != null

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-switch-title"
      aria-describedby="order-switch-subtitle"
    >
      <button
        type="button"
        aria-label="Cancel"
        onClick={cancelSwitch}
        className="absolute inset-0 size-full bg-black/40"
      />
      <div className="relative w-full max-w-[320px] overflow-hidden rounded-2xl bg-[var(--color-layer-floor-1,#fff)] shadow-[0_8px_32px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-2 px-6 pb-5 pt-6 text-center">
          <h2
            id="order-switch-title"
            className="bolt-font-heading-xs-accent text-[var(--color-content-primary)]"
          >
            Start a new order?
          </h2>
          <p
            id="order-switch-subtitle"
            className="bolt-font-body-m-regular text-[var(--color-content-secondary)]"
          >
            This will remove your {pendingProviderName} order
          </p>
        </div>
        <div className="flex flex-col gap-2 px-4 pb-4">
          <button
            type="button"
            onClick={confirmSwitch}
            className="h-12 w-full shrink-0 rounded-full bg-[var(--color-bg-action-primary,#2b8659)] bolt-font-body-l-accent text-white outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={cancelSwitch}
            className="h-12 w-full shrink-0 rounded-full bg-[var(--color-bg-neutral-secondary)] bolt-font-body-l-accent text-[var(--color-content-primary)] outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
