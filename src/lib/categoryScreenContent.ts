import type { CarouselGridItemProps } from '../components/CarouselGridItem'
import { design } from './figmaDesignAssets'

const p = design.categoryScreen.products

export type CategoryScreenProduct = CarouselGridItemProps & { id: string }

/** Milk grid — Figma 80613:192257 / 80613:193017. */
export const CATEGORY_MILK_PRODUCTS: readonly CategoryScreenProduct[] = [
  {
    id: 'cat-milk-1',
    variant: 'discount',
    imageSrc: p[0],
    title: 'Alma, piim 2.5%, 1,5l',
    unitLabel: '200,78 lei/ kg',
    priceNow: '1,50 €',
    priceWas: '3,50 €',
    discountLabel: '−25 %',
  },
  {
    id: 'cat-milk-2',
    variant: 'default',
    imageSrc: p[1],
    title: 'Alma, piim 2.5%, 1l',
    unitLabel: '200,78 lei/ kg',
    price: '1,50 €',
  },
  {
    id: 'cat-milk-3',
    variant: 'default',
    imageSrc: p[2],
    title: 'Alma, piim 3.8-4.2%, 1l',
    unitLabel: '200,78 lei/ kg',
    price: '1,50 €',
  },
  {
    id: 'cat-milk-4',
    variant: 'default',
    imageSrc: p[3],
    title: 'Tere, piim 2.5% laktoosivaba, 1l',
    unitLabel: '200,78 lei/ kg',
    price: '1,50 €',
  },
  {
    id: 'cat-milk-5',
    variant: 'default',
    imageSrc: p[4],
    title: 'Alma, täispiim 3,8-4,2% 1,5l',
    unitLabel: '200,78 lei/ kg',
    price: '1,50 €',
  },
  {
    id: 'cat-milk-6',
    variant: 'default',
    imageSrc: p[5],
    title: 'Alma, piim 2,5% kiles, 1l',
    unitLabel: '200,78 lei/ kg',
    price: '1,50 €',
  },
  {
    id: 'cat-milk-7',
    variant: 'default',
    imageSrc: p[6],
    title: 'Tere, piim 1,8%, 1,5l',
    unitLabel: '200,78 lei/ kg',
    price: '1,50 €',
  },
  {
    id: 'cat-milk-8',
    variant: 'default',
    imageSrc: p[7],
    title: 'Alma, piim 2,5%, 0,5l',
    unitLabel: '200,78 lei/ kg',
    price: '1,50 €',
  },
  {
    id: 'cat-milk-9',
    variant: 'default',
    imageSrc: p[8],
    title: 'Tere, joogipiim 2.5%, 1l',
    unitLabel: '200,78 lei/ kg',
    price: '1,50 €',
  },
  {
    id: 'cat-milk-10',
    variant: 'default',
    imageSrc: p[9],
    title: 'Tere, cappuccino piim 3.2%, 1l',
    unitLabel: '200,78 lei/ kg',
    price: '1,50 €',
  },
]

/** Demo products for non-milk subcategories (reuses milk imagery). */
export function categoryScreenProducts(subcategoryLabel: string): readonly CategoryScreenProduct[] {
  if (subcategoryLabel.toLowerCase() === 'milk') {
    return CATEGORY_MILK_PRODUCTS
  }
  return CATEGORY_MILK_PRODUCTS.map((item, i) => ({
    ...item,
    id: `${item.id}-${subcategoryLabel.toLowerCase().replace(/\s+/g, '-')}-${i}`,
  }))
}
