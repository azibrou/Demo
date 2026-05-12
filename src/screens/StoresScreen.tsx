import { Banner } from '../components/Banner'
import { CardDivider } from '../components/CardDivider'
import { CarouselItem } from '../components/CarouselItem'
import { Categories } from '../components/Categories'
import { MoreToExplore } from '../components/MoreToExplore'
import { ProviderHeader } from '../components/ProviderHeader'
import { QuickNav } from '../components/QuickNav'

export function StoresScreen() {
  return (
    <div className="relative min-h-svh w-full">
      <div className="flex flex-col gap-0">
        <ProviderHeader />
        <CardDivider />
        <QuickNav />
        <Banner />
        <CarouselItem title="Order again" />
        <CarouselItem title="Most popular" />
        <CarouselItem title="Save me" />
        <MoreToExplore />
        <Categories />
      </div>
    </div>
  )
}
