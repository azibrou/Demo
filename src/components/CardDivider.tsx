import { design } from '../lib/figmaDesignAssets'

const d = design.cardDivider

/** Node 70416:856494 — full-width divider with end caps and flexible center bar */
export function CardDivider() {
  return (
    <div className="relative flex w-full shrink-0 items-center" aria-hidden>
      <div className="relative h-[41px] w-4 shrink-0">
        <img
          alt=""
          src={d.leftCap}
          className="pointer-events-none absolute inset-0 block size-full max-w-none"
        />
      </div>
      <div className="h-[9px] min-w-0 flex-[1_0_0] bg-[rgba(0,45,30,0.07)]" />
      <div className="relative h-[41px] w-4 shrink-0">
        <img
          alt=""
          src={d.rightCap}
          className="pointer-events-none absolute inset-0 block size-full max-w-none"
        />
      </div>
    </div>
  )
}
