import { CarouselItem } from '../../components/CarouselItem'

export type StoreProductCarouselBlockProps = {
  title: string
}

/** Stores page block — horizontal product carousel with heading (Figma ItemCarousel). */
export function StoreProductCarouselBlock({ title }: StoreProductCarouselBlockProps) {
  return <CarouselItem title={title} />
}
