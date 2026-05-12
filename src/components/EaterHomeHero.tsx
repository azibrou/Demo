import { design } from '../lib/figmaDesignAssets'

const eh = design.eaterHome
const qn = design.quickNav

function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2C6.68629 2 4 4.68629 4 8C4 11.3137 10 18 10 18C10 18 16 11.3137 16 8C16 4.68629 13.3137 2 10 2ZM10 10.5C11.3807 10.5 12.5 9.38071 12.5 8C12.5 6.61929 11.3807 5.5 10 5.5C8.61929 5.5 7.5 6.61929 7.5 8C7.5 9.38071 8.61929 10.5 10 10.5Z"
        fill="#191F1C"
      />
    </svg>
  )
}

const labelLeading = '[font-feature-settings:"cv03"_1,"cv04"_1,"lnum"_1,"pnum"_1]'

function ArrowCircleRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="10" fill="rgb(0, 160, 64)" />
      <path
        d="M9.25 6.5L12.75 10L9.25 13.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Figma 74921:234989 — [Eater] Home top section (hero, address, promo, search). */
export function EaterHomeHero() {
  return (
    <div className={`flex w-full flex-col items-start bg-transparent ${labelLeading}`}>
      <div className="relative mb-[-26px] flex h-[248px] w-full shrink-0 flex-col items-start justify-end pt-11">
        <div className="absolute bottom-0 right-0 h-[288px] w-[393px] max-w-none overflow-hidden">
          <img
            alt=""
            src={eh.heroIllustration}
            className="pointer-events-none absolute h-full max-w-none"
            style={{ left: '-0.04%', top: '2.48%', width: '100.66%' }}
          />
        </div>

        <div className="relative z-[1] flex w-full shrink-0 items-center gap-2 px-6 py-3">
          <div className="flex shrink-0 items-center justify-center">
            <PinIcon className="size-5 shrink-0" />
          </div>
          <div className="relative flex min-w-0 flex-1 flex-col items-start justify-center overflow-hidden">
            <div className="flex w-full items-center gap-1">
              <p className="min-w-0 flex-1 text-sm font-semibold leading-5 tracking-[-0.084px] text-[#191f1c]">Rotermanni 6</p>
            </div>
            <div className="flex w-full items-center gap-1">
              <p className="min-w-0 flex-1 text-xs font-normal leading-4 text-[rgba(0,10,7,0.63)]">Tallinn, Estonia</p>
            </div>
          </div>
          <div className="relative size-12 shrink-0">
            <img alt="" src={eh.eaterAvatarRing} className="absolute inset-0 block size-full max-w-none" />
            <div className="absolute inset-[4.55%] flex flex-col items-center justify-center rounded-full bg-[rgba(0,160,64,0.09)] p-2">
              <span className="text-center text-base font-semibold leading-6 tracking-[-0.176px] text-[rgba(0,112,66,0.92)]">
                AZ
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-[1] flex min-h-px w-full flex-1 items-end pb-6">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col items-start justify-center gap-2 py-3 pl-6">
            <p className="w-[min-content] min-w-full text-2xl font-semibold leading-[30px] tracking-[-0.48px] text-[#191f1c]">
              Free delivery with Bolt Plus
            </p>
            <button
              type="button"
              className="flex h-5 shrink-0 items-center gap-1 bg-transparent p-0 text-sm font-semibold leading-5 tracking-[-0.084px] text-[#191f1c] outline-none ring-[#002d1e]/20 focus-visible:ring-2"
            >
              Join now
              <ArrowCircleRightIcon className="size-5 shrink-0" />
            </button>
          </div>
          <div className="relative h-full min-w-0 flex-1" aria-hidden />
        </div>
      </div>

      <div
        className="relative z-[2] mb-[-26px] flex h-[26px] w-full shrink-0 flex-col items-end justify-center px-6 pb-2"
        aria-hidden
      />

      <div id="eater-home-search" className="relative z-[2] flex w-full shrink-0 scroll-mt-4 flex-col items-start px-6 pb-3">
        <div
          className="flex h-12 w-full items-center gap-3 rounded-[199px] border border-transparent px-4"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(0, 45, 30, 0.07) 0%, rgba(0, 45, 30, 0.07) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)',
          }}
        >
          <img alt="" src={qn.search} className="size-5 shrink-0" />
          <span className="min-w-0 flex-1 text-sm font-normal leading-5 tracking-[-0.084px] text-[#707070]">
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
