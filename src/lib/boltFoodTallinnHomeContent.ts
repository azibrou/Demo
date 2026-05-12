/**
 * Restaurant / store imagery and copy aligned with live Bolt Food Tallinn
 * (`https://food.bolt.eu/et-ee/1-tallinn/`) — data taken from the same public
 * `getScreenContent` payload (screen_id=360003, city_id=1) used by that page.
 * Product-style retail lines are representative Estonian grocery examples; tile photos use the listed stores’ covers from that feed.
 */

/** Order again — same first-row vendors as on the live home carousel when unauthenticated. */
export const orderAgain = [
  {
    line1: 'Bolt Market Toompuiestee',
    line2: 'Toompuiestee 33a',
    imageSrc:
      'https://images.bolt.eu/store/2026/2026-03-03/f23b4550-d6cb-4c7c-8d2e-af499e181eb6.jpeg',
  },
  {
    line1: "McDonald's® Viru",
    line2: 'Viru 24',
    imageSrc:
      'https://images.bolt.eu/store/2021/2021-11-18/b6419a9c-cce7-4557-a0bf-686d93ad5e00.jpeg',
  },
  {
    line1: 'Amijami Sushi Kadriorg',
    line2: 'Vesivärava 50',
    imageSrc:
      'https://images.bolt.eu/store/2023/2023-12-05/3104252c-0aef-4fda-bdbf-e159e097c816.jpeg',
  },
  {
    line1: 'Damak Döner & Kebab',
    line2: 'Kaubamaja 6',
    imageSrc:
      'https://images.bolt.eu/store/2022/2022-03-02/12def9d5-8bb9-45db-8590-2b8450892303.jpeg',
  },
] as const

/** Retail row — “Toidukaubad ja muu” horizontal stores (Rimi, Selver, Bolt Market) + representative item copy. */
export const retailTiles = {
  defaultA: {
    imageSrc:
      'https://images.bolt.eu/store/2026/2026-04-22/38882874-a403-4a93-8b8f-13ad65e0d48a.jpeg',
    title: 'Tere piim 2,8%, 1 l — tarbik enne: vt pakendilt',
    unitLabel: '1 l',
    price: '1,09 €',
  },
  discount: {
    imageSrc:
      'https://images.bolt.eu/store/2026/2026-01-27/f795d7e0-1505-46ba-abe6-4c1791e55514.jpeg',
    title: 'Merevaik Classic jäätis, 480 ml',
    unitLabel: '480 ml',
    priceNow: '2,99 €',
    priceWas: '3,99 €',
    discountLabel: '−25 %',
  },
  defaultB: {
    imageSrc:
      'https://images.bolt.eu/store/2026/2026-03-03/f23b4550-d6cb-4c7c-8d2e-af499e181eb6.jpeg',
    title: 'Polar leib, 440 g',
    unitLabel: '440 g',
    price: '1,89 €',
  },
} as const

/** “Kõrgelt hinnatud” carousel on the same screen payload. */
export const mostPopular = [
  {
    title: 'Pavlova Viru Keskus',
    imageSrc:
      'https://images.bolt.eu/store/2024/2024-02-06/d6a12c3b-0467-4a7c-9ed7-3ad14c4c9425.jpeg',
    deliveryLabel: '1,90 €',
    etaText: '15–20 min',
  },
  {
    title: 'Little Japan Kesklinn',
    imageSrc:
      'https://images.bolt.eu/store/2024/2024-08-01/5dca1b79-6195-46bd-a876-3c5f821c0998.jpeg',
    deliveryLabel: '1,90 €',
    etaText: '40–45 min',
  },
  {
    title: 'Nikolay Bar-buffeé',
    imageSrc:
      'https://images.bolt.eu/store/2021/2021-11-01/dadf2473-9461-4be4-9482-40a04c87869c.jpeg',
    deliveryLabel: '1,90 €',
    etaText: '20–25 min',
  },
] as const

/** “Kiireim kohalevedu” carousel. */
export const saveMe = [
  {
    title: 'Amalfi Ristorante Pizzeria',
    imageSrc:
      'https://images.bolt.eu/store/2021/2021-01-06/21435281-c348-43a8-b6de-334feb604dfb.jpeg',
    deliveryLabel: '1,90 €',
    etaText: '10–15 min',
  },
  {
    title: 'Shaurma Kebab Viru Keskus',
    imageSrc: 'https://images.bolt.eu/store/2019/2019-09-12/d10e19a0-1b0a-409d-9fbb-0fc893297912',
    deliveryLabel: '1,90 €',
    etaText: '10–15 min',
  },
] as const

/** First row of “Vaata kõiki kohti” list in the same payload. */
export const allRestaurants = [
  {
    title: 'Kolm Tilli Tallinn',
    imageSrc:
      'https://images.bolt.eu/store/2025/2025-02-21/e90c1f5b-877f-4139-b9c3-f2807afe03c0.jpeg',
    deliveryLabel: '1,90 €',
    etaText: '15–25 min',
    discountPct: null,
    rating: '4.6',
    reviews: '(210)',
  },
  {
    title: 'Hesburger Viru tänav',
    imageSrc:
      'https://images.bolt.eu/store/2025/2025-04-08/68142fda-71f1-4543-ace1-8c11c22873ae.jpeg',
    deliveryLabel: '1,90 €',
    etaText: '15–25 min',
    discountPct: null,
    rating: '4.5',
    reviews: '(500+)',
  },
  {
    title: 'Tommi Grill Metro',
    imageSrc:
      'https://images.bolt.eu/store/2019/2019-10-17/bc7337e8-61f0-417b-a34d-7ff0cc4899f1.jpeg',
    deliveryLabel: '1,90 €',
    etaText: '15–25 min',
    discountPct: null,
    rating: '4.5',
    reviews: '(500+)',
  },
] as const

/**
 * Figma retail-snippet provider row — live Bolt Market Sõle (`provider_id` 28630) from
 * `deliveryClient/public/getProviderDetails` (Tallinn coords 59.436961, 24.753575), May 2026.
 *
 * Product strip: first 12 dishes from `getMenuDishes` for on-menu category **🍬 Sweet Snacks**
 * (`category_id` 6192515788521012) at the same store. The **Most popular** smart-menu strip
 * (`/p/28630/smc/-374/?categoryName=Most%20popular`, see
 * [Bolt Food](https://food.bolt.eu/en/1-tallinn/p/28630/smc/-374/?categoryName=Most%20popular&backPath=%2Fp%2F28630))
 * is served via authenticated `getAssortmentSnippetDishes` and is not reproducible with the
 * public `category_id` query alone, so this dataset uses the closest rich public category feed.
 */
export const retailSnippetStore = {
  name: 'Bolt Market Sõle',
  logoSrc:
    'https://images.bolt.eu/store/2025/2025-09-04/93c639b7-06c7-4677-acf3-6be2b1f47a77.png',
  deliveryPrice: '4,28 €',
  showSurge: false,
  eta: '30–35 min',
  rating: '4.9',
  reviews: '(500+)',
} as const

/** One carousel tile row for {@link retailSnippetProducts} (default or discount). */
export type RetailSnippetCarouselRow =
  | {
      id: string
      variant: 'default'
      imageSrc: string
      title: string
      unitLabel: string
      price: string
      accentLabel?: string
    }
  | {
      id: string
      variant: 'discount'
      imageSrc: string
      title: string
      unitLabel: string
      priceNow: string
      priceWas: string
      discountLabel: string
      accentLabel?: string
    }

/** First 12 SKUs from Sweet Snacks grid at Bolt Market Sõle — names, unit lines, prices, 3× art from Bolt CDN. */
export const retailSnippetProducts: readonly RetailSnippetCarouselRow[] = [
  {
    id: 'mp-1',
    variant: 'default',
    imageSrc: 'https://images.bolt.eu/store/2022/2022-09-12/44a2c198-7dda-41ea-b538-e24b0ce5a4a3.png',
    title: 'Milka, Bubbly Milk and White Chocolate, 95g',
    unitLabel: '31,05 €/kg',
    price: '2,95 €',
  },
  {
    id: 'mp-2',
    variant: 'default',
    imageSrc: 'https://images.bolt.eu/store/2024/2024-11-08/bd4c14fe-849a-43ac-8793-22c892154fc2.jpeg',
    title: 'Geisha, Chocolate, 100g',
    unitLabel: '27,90 €/kg',
    price: '2,79 €',
  },
  {
    id: 'mp-3',
    variant: 'default',
    imageSrc: 'https://images.bolt.eu/store/2026/2026-02-13/e313aea9-0a05-4f89-b391-1f6aad75a39c.png',
    title: 'Karl Fazer, Chocolate with Whole Nuts, 200g',
    unitLabel: '28,95 €/kg',
    price: '5,79 €',
  },
  {
    id: 'mp-4',
    variant: 'default',
    imageSrc: 'https://images.bolt.eu/store/2023/2023-08-04/3a5e811c-b96e-405e-a356-41b102e42cf9.jpeg',
    title: 'Ritter Sport, White Chocolate with Whole Hazelnuts, 100g',
    unitLabel: '33,90 €/kg',
    price: '3,39 €',
  },
  {
    id: 'mp-5',
    variant: 'default',
    imageSrc: 'https://images.bolt.eu/store/2025/2025-09-11/b6fef142-c31d-44b5-80c5-24ec9f738750.jpeg',
    title: 'Karl Fazer, Milk Chocolate, 180g',
    unitLabel: '31,61 €/kg',
    price: '5,69 €',
  },
  {
    id: 'mp-6',
    variant: 'default',
    imageSrc: 'https://images.bolt.eu/store/2022/2022-09-12/c7f1564a-578c-4f62-9330-e25972c2bad8.png',
    title: 'Milka, Milk Chocolate Oreo, 100g',
    unitLabel: '28,90 €/kg',
    price: '2,89 €',
  },
  {
    id: 'mp-7',
    variant: 'default',
    imageSrc: 'https://images.bolt.eu/store/2025/2025-03-10/10c09beb-27c5-49ca-b1b7-efc70aa6859d.webp',
    title: 'Milka, Milk And White Chocolate Mix Cowspot, 90g',
    unitLabel: '33,89 €/kg',
    price: '3,05 €',
  },
  {
    id: 'mp-8',
    variant: 'default',
    imageSrc: 'https://images.bolt.eu/store/2025/2025-04-07/69fea598-0983-4a0f-8670-908a65480153.jpeg',
    title: 'Karl Fazer, Milk Chocolate With Red Berries And Rice Crisps, 180g',
    unitLabel: '31,61 €/kg',
    price: '5,69 €',
  },
  {
    id: 'mp-9',
    variant: 'default',
    imageSrc: 'https://images.bolt.eu/store/2023/2023-08-04/dd3890eb-8227-483b-be32-6fc91ce10d27.jpeg',
    title: 'Ritter Sport, Chocolate with Whole Nuts, 100g',
    unitLabel: '33,90 €/kg',
    price: '3,39 €',
  },
  {
    id: 'mp-10',
    variant: 'default',
    imageSrc: 'https://images.bolt.eu/store/2025/2025-11-25/ba089d7f-b965-415a-be78-14dab9da2128.jpeg',
    title: 'Ritter Sport, Dark Chocolate With Whole Hazelnuts, 100g',
    unitLabel: '33,90 €/kg',
    price: '3,39 €',
  },
  {
    id: 'mp-11',
    variant: 'default',
    imageSrc: 'https://images.bolt.eu/store/2025/2025-02-12/ac69fd19-8784-4725-929d-642bbf219a73.jpeg',
    title: 'Geisha, Crispy Dream Milk Chocolate, 100g',
    unitLabel: '27,90 €/kg',
    price: '2,79 €',
  },
  {
    id: 'mp-12',
    variant: 'default',
    imageSrc: 'https://images.bolt.eu/store/2025/2025-11-10/9a05fa71-87b1-4a53-bae1-91769d816e08.jpeg',
    title: 'Milka, Milk Chocolate with Whole Nuts, 95g',
    unitLabel: '31,90 €/kg',
    price: '3,19 €',
  },
]
