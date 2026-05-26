import type { ReactNode } from 'react'
import { design } from '../../lib/figmaDesignAssets'

const a = design.providerHeader

function NavIconButton({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative grid size-10 shrink-0 place-items-center rounded-full bg-white text-[#191f1c] md:size-11"
    >
      {children}
    </button>
  )
}

function VDivider({ src }: { src: string }) {
  return (
    <div className="flex h-8 w-0 shrink-0 items-center justify-center md:h-9" aria-hidden>
      <div className="flex-none rotate-90">
        <div className="relative h-0 w-8 md:w-9">
          <img alt="" src={src} className="block size-full max-w-none" />
        </div>
      </div>
    </div>
  )
}

export function StoreProviderHeaderBlock() {
  return (
    <section className="w-full max-w-none pb-0 font-sans text-[#191f1c]">
      <div className="w-full min-w-0">
        <div className="relative mb-[-4rem] h-[clamp(215px,38vw,520px)] min-h-[215px] w-full min-w-0 overflow-hidden md:mb-[-4rem] md:min-h-[280px] lg:h-[clamp(280px,32vw,560px)] lg:min-h-[min(360px,32vw)]">
          <img
            alt=""
            src={a.hero}
            className="pointer-events-none absolute inset-0 z-0 size-full max-w-none object-cover object-center"
          />
          <div className="relative z-[1] flex h-14 w-full shrink-0 items-center px-3.5 md:h-16">
            <div className="flex w-full min-w-0 items-center gap-2 md:gap-3">
              <NavIconButton label="Back">
                <img alt="" src={a.arrowLeft} className="size-5 md:size-[22px]" />
              </NavIconButton>
              <span className="sr-only">Store</span>
              <div className="min-w-0 flex-1" aria-hidden />
              <NavIconButton label="Favourites">
                <img alt="" src={a.heartOutline} className="size-5 md:size-[22px]" />
              </NavIconButton>
              <NavIconButton label="Share">
                <img alt="" src={a.shareIos} className="size-5 md:size-[22px]" />
              </NavIconButton>
              <NavIconButton label="Search">
                <img alt="" src={a.search} className="size-5 md:size-[22px]" />
              </NavIconButton>
            </div>
          </div>
        </div>

        <div className="relative isolate flex w-full flex-col items-center pb-6 md:pb-8">
          <div className="z-[2] mb-[-24px] size-[72px] shrink-0 overflow-hidden rounded-xl bg-white md:mb-[-28px] md:size-20 md:rounded-2xl lg:size-[88px]">
            <img alt="" src={a.logo} className="pointer-events-none size-full object-cover" />
          </div>
          <div className="z-[1] mb-[-24px] w-full min-w-0 shrink-0 rounded-t-2xl bg-white px-2 pb-5 pt-9 md:mb-[-28px] md:rounded-t-3xl md:pb-6 md:pt-10 lg:pb-7 lg:pt-11">
            <div className="flex w-full min-w-0 flex-col items-center px-4 pb-4 md:pb-5">
              <h1 className="w-full text-center text-[28px] font-semibold leading-9 tracking-[-0.56px] md:text-3xl md:leading-[2.5rem] lg:text-[2rem] lg:leading-10">
                Bolt Market Tulika
              </h1>
              <button
                type="button"
                className="mt-1 flex items-center gap-0.5 overflow-hidden rounded-[199px] text-[14px] font-semibold leading-5 tracking-[-0.08px] text-[#191f1c]"
              >
                More info
                <span className="relative size-4 shrink-0" aria-hidden>
                  <img
                    alt=""
                    src={a.chevronRight}
                    className="pointer-events-none absolute inset-0 size-full max-w-none object-contain"
                  />
                </span>
              </button>
            </div>

            <div className="flex h-10 w-full min-w-0 items-center justify-between gap-0.5 px-2 md:h-11 md:gap-2 md:px-3">
              <div className="flex min-w-0 flex-1 items-center justify-between">
                <VDivider src={a.divider} />
                <div className="flex flex-col items-center gap-0.5 px-0.5 md:px-1">
                  <div className="flex items-center gap-1">
                    <img alt="" src={a.ratingStar} className="size-4 md:size-[18px]" />
                    <span className="text-sm font-semibold leading-5 tracking-tight md:text-[15px]">
                      4.8
                    </span>
                  </div>
                  <span className="text-sm font-normal leading-5 text-[rgba(0,10,7,0.63)] md:text-[15px]">
                    (232)
                  </span>
                </div>
                <VDivider src={a.dividerAlt} />
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between">
                <VDivider src={a.divider} />
                <div className="flex flex-col items-center gap-0.5 px-0.5 md:px-1">
                  <div className="flex items-center gap-1">
                    <img alt="" src={a.bikeDelivery} className="size-4 shrink-0 md:size-[18px]" />
                    <span className="text-sm font-semibold leading-5 tracking-tight md:text-[15px]">
                      3,50 €
                    </span>
                  </div>
                  <span className="text-sm font-normal leading-5 text-[rgba(0,10,7,0.63)] md:text-[15px]">
                    delivery
                  </span>
                </div>
                <VDivider src={a.dividerAlt} />
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between">
                <VDivider src={a.divider} />
                <div className="flex flex-col items-center gap-0.5 px-0.5 md:px-1">
                  <div className="flex items-center gap-1">
                    <img alt="" src={a.timer} className="size-4 shrink-0 md:size-[18px]" />
                    <span className="text-sm font-semibold leading-5 tracking-tight md:text-[15px]">
                      15-20
                    </span>
                  </div>
                  <span className="text-sm font-normal leading-5 text-[rgba(0,10,7,0.63)] md:text-[15px]">
                    min
                  </span>
                </div>
                <VDivider src={a.divider} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
