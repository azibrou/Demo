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
 * Expanding quantity control — same motion as grid quick add (max-width transition 100ms).
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
      className={[
        'flex h-9 min-w-0 shrink-0 items-center overflow-hidden rounded-[100px] border border-solid border-[rgba(0,45,30,0.07)] bg-white ease-out',
        'transition-[max-width] duration-100',
        open ? 'w-full max-w-full justify-between px-1' : 'max-w-9 justify-center',
        className,
      ].join(' ')}
    >
      {!open ? (
        <button
          type="button"
          aria-label="Add to basket"
          onClick={onAdd}
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
            onClick={onDecrement}
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
            onClick={onIncrement}
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
