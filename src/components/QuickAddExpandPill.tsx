import { triggerHaptic } from '../lib/haptic'

export type QuickAddExpandPillProps = {
  open: boolean
  quantity: number
  plusSrc: string
  minusSrc: string
  onAdd: () => void
  onDecrement: () => void
  onIncrement: () => void
  /** Extra classes on the animating pill (e.g. width constraints from parent) */
  className?: string
  quantityClassName?: string
}

/**
 * Expanding quantity control — width transition 100ms ease-out (grid + list).
 */
export function QuickAddExpandPill({
  open,
  quantity,
  plusSrc,
  minusSrc,
  onAdd,
  onDecrement,
  onIncrement,
  className = '',
  quantityClassName = 'text-lg font-semibold leading-6 tracking-[-0.252px]',
}: QuickAddExpandPillProps) {
  return (
    <div
      data-open={open ? 'true' : 'false'}
      className={[
        'quick-add-expand-pill flex h-9 min-w-0 shrink-0 items-center overflow-hidden rounded-[100px] border border-solid border-[rgba(0,45,30,0.07)] bg-white',
        open ? 'justify-between px-1' : 'justify-center',
        className,
      ].join(' ')}
    >
      {!open ? (
        <button
          type="button"
          aria-label="Add to basket"
          onClick={() => {
            triggerHaptic('light')
            onAdd()
          }}
          className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-[100px]"
        >
          <span className="relative size-6 shrink-0" aria-hidden>
            <img alt="" src={plusSrc} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
          </span>
        </button>
      ) : (
        <>
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => {
              triggerHaptic('light')
              onDecrement()
            }}
            className="grid size-6 shrink-0 place-items-center rounded-full"
          >
            <span className="relative size-6 shrink-0" aria-hidden>
              <img alt="" src={minusSrc} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
            </span>
          </button>
          <span className={`min-w-0 flex-[1_0_0] text-center ${quantityClassName} text-[#191f1c]`}>{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => {
              triggerHaptic('light')
              onIncrement()
            }}
            className="grid size-6 shrink-0 place-items-center rounded-full"
          >
            <span className="relative size-6 shrink-0" aria-hidden>
              <img alt="" src={plusSrc} className="pointer-events-none absolute inset-0 block size-full max-w-none" />
            </span>
          </button>
        </>
      )}
    </div>
  )
}
