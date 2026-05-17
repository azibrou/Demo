import { AddressSelector } from './AddressSelector'
import { design } from '../lib/figmaDesignAssets'

const eh = design.eaterHome
const qn = design.quickNav

const labelLeading = '[font-feature-settings:"cv03"_1,"cv04"_1,"lnum"_1,"pnum"_1]'

/** Figma 74916:28087 — [Eater] Home top section (hero, address, promo, search). */
export function EaterHomeHero() {
  return (
    <div className={`flex w-full flex-col items-start bg-white ${labelLeading}`}>
      <div className="relative flex h-[288px] w-full shrink-0 flex-col items-start justify-end pb-0 pt-11">
        <div className="absolute bottom-0 right-0 h-[288px] w-[393px] max-w-none overflow-hidden">
          <img
            alt=""
            src={eh.heroIllustration}
            className="pointer-events-none absolute h-full max-w-none"
            style={{ left: '-0.04%', top: '2.48%', width: '100.66%' }}
          />
        </div>

        <div
          className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-between pb-3 pl-[37px] pr-[27px] pt-2.5"
          aria-hidden
        >
          <div className="shrink-0 font-['SF_Pro_Text',Inter,sans-serif] text-[17px] font-semibold leading-[22px] tracking-[-0.34px] text-[#191f1c]">
            9:41
          </div>
          <div className="relative h-[13.333px] w-[67.1px] shrink-0">
            <img alt="" src={eh.statusBarIcons} className="absolute inset-0 block size-full max-w-none" />
          </div>
        </div>

        <div className="relative z-[1] w-full shrink-0">
          <AddressSelector />
        </div>

        <div className="relative z-[1] flex min-h-0 w-full flex-1 items-end pb-6">
          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-2 py-3 pl-6">
            <p className="w-[min-content] min-w-full text-2xl font-semibold leading-[30px] tracking-[-0.48px] text-[#191f1c]">
              Free delivery with Bolt Plus
            </p>
            <button
              type="button"
              className="flex h-5 shrink-0 items-center gap-1 bg-transparent p-0 text-sm font-semibold leading-5 tracking-[-0.084px] text-[#191f1c] outline-none ring-[#002d1e]/20 focus-visible:ring-2"
            >
              Join now
              <span className="relative size-5 shrink-0 rounded-full bg-[rgba(0,160,64,0.12)]" aria-hidden>
                <img
                  alt=""
                  src={design.providerHeader.chevronRight}
                  className="absolute inset-0 m-auto block size-3 max-w-none opacity-80"
                />
              </span>
            </button>
          </div>
          <div className="min-w-0 flex-1" aria-hidden />
        </div>
      </div>

      <div className="relative z-[2] mb-[-26px] flex h-[26px] w-full shrink-0 flex-col items-end justify-center px-6 pb-2" aria-hidden />

      <div className="relative z-[2] flex w-full shrink-0 flex-col items-start px-6 pb-3">
        <div
          className="flex h-12 w-full items-center gap-3 rounded-[199px] border border-transparent px-4"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(0, 45, 30, 0.07) 0%, rgba(0, 45, 30, 0.07) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)',
          }}
        >
          <img alt="" src={qn.search} className="size-5 shrink-0" />
          <span className="min-w-0 flex-1 text-sm font-normal leading-5 tracking-[-0.084px] text-[rgba(0,10,7,0.45)]">
            Food, restaurants, stores...
          </span>
          <button type="button" aria-label="Filters" className="shrink-0 bg-transparent p-0 outline-none ring-[#002d1e]/20 focus-visible:ring-2">
            <img alt="" src={qn.burger} className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
