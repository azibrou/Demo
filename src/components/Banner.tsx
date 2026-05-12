import { design } from '../lib/figmaDesignAssets'

/** Node 70394:111155 — full-width promo image */
export function Banner() {
  return (
    <div className="font-sans flex w-full flex-col items-start px-6 py-3">
      <div className="relative aspect-[654/312] w-full shrink-0 overflow-hidden rounded-[8px]">
        <img
          alt=""
          src={design.banner}
          className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[8px] object-cover"
        />
      </div>
    </div>
  )
}
