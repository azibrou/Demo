import { EaterHomeHero } from '../components/EaterHomeHero'
import { HomeCarouselRow } from '../components/HomeCarouselRow'
import { RetailSnippet } from '../components/RetailSnippet'
import { ShortcutsCarousel } from '../components/ShortcutsCarousel'
import { ThumbnailL } from '../components/ThumbnailL'
import { ThumbnailMCarousel } from '../components/ThumbnailMCarousel'
import { ThumbnailM } from '../components/ThumbnailM'
import { ThumbnailXs } from '../components/ThumbnailXs'
import {
  allRestaurants,
  mostPopular,
  orderAgain,
  saveMe,
} from '../lib/boltFoodTallinnHomeContent'

/** Figma [74919:234928](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=74919-234928) — Heading / Heading XS accent. */
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex min-h-[25px] w-full shrink-0 items-center">
      <h2 className="font-sans text-[20px] font-semibold leading-[25px] tracking-[-0.34px] text-[#191f1c] [font-feature-settings:'cv03'_1,'cv04'_1,'lnum'_1,'pnum'_1]">
        {title}
      </h2>
    </div>
  )
}

/**
 * [Eater] Home — Figma 74916:23389.
 * Store browse (tabs, provider header) lives on {@link StoresScreen} at `/stores`.
 */
export function HomeScreen() {
  return (
    <div className="min-h-svh w-full overflow-x-visible bg-white pb-10 font-sans">
      <EaterHomeHero />

      <ShortcutsCarousel />

      <div className="mt-6 flex w-full min-w-0 flex-col gap-4">
        <div className="mx-auto w-full max-w-[390px] px-6">
          <SectionHeader title="Order again" />
        </div>
        <HomeCarouselRow>
          {orderAgain.map((o) => (
            <ThumbnailXs key={o.line1} variant="scaled" imageSrc={o.imageSrc} line1={o.line1} line2={o.line2} />
          ))}
        </HomeCarouselRow>
      </div>

      <div className="mt-6 w-full min-w-0">
        <RetailSnippet />
      </div>

      <main className="mx-auto flex w-full min-w-0 max-w-none flex-col overflow-x-visible">
        <section className="mt-8 flex w-full min-w-0 flex-col gap-4 overflow-x-visible">
          <div className="mx-auto w-full max-w-[390px] px-6">
            <SectionHeader title="Most popular" />
          </div>
          <ThumbnailMCarousel>
            {mostPopular.map((p) => (
              <ThumbnailM
                key={p.title}
                imageSrc={p.imageSrc}
                title={p.title}
                deliveryLabel={p.deliveryLabel}
                etaText={p.etaText}
              />
            ))}
          </ThumbnailMCarousel>
        </section>

        <section className="mt-8 flex w-full min-w-0 flex-col gap-4 overflow-x-visible">
          <div className="mx-auto w-full max-w-[390px] px-6">
            <SectionHeader title="Save me" />
          </div>
          <ThumbnailMCarousel>
            {saveMe.map((p) => (
              <ThumbnailM
                key={p.title}
                imageSrc={p.imageSrc}
                title={p.title}
                deliveryLabel={p.deliveryLabel}
                etaText={p.etaText}
              />
            ))}
          </ThumbnailMCarousel>
        </section>

        <section className="mt-10 flex w-full flex-col gap-4 overflow-x-visible">
          <div className="mx-auto w-full max-w-[390px] px-6">
            <SectionHeader title="All restaurants" />
          </div>
          <div className="mx-auto w-full max-w-[390px] px-6">
            <div className="flex flex-col gap-6">
              {allRestaurants.map((r) => (
                <ThumbnailL
                  key={r.title}
                  imageSrc={r.imageSrc}
                  title={r.title}
                  deliveryLabel={r.deliveryLabel}
                  etaText={r.etaText}
                  discountPct={r.discountPct}
                  rating={r.rating}
                  reviews={r.reviews}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
