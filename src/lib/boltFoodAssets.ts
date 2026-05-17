/**
 * Local Bolt Food Tallinn store covers under `public/bolt/`.
 * Refresh binaries: `npm run bolt:assets` (sources in `boltFoodTallinnHomeContent.ts`).
 */
function bolt(file: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}bolt/${file}`
}

function boltProduct(file: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}bolt/products/${file}`
}

export const boltFoodAssets = {
  boltMarketToompuiestee: bolt('bolt-market-toompuiestee.jpeg'),
  mcdonaldsViru: bolt('mcdonalds-viru.jpeg'),
  amijamiSushiKadriorg: bolt('amijami-sushi-kadriorg.jpeg'),
  damakDonerKebab: bolt('damak-doner-kebab.jpeg'),
  pavlovaViruKeskus: bolt('pavlova-viru-keskus.jpeg'),
  littleJapanKesklinn: bolt('little-japan-kesklinn.jpeg'),
  nikolayBarBuffee: bolt('nikolay-bar-buffee.jpeg'),
  amalfiRistorantePizzeria: bolt('amalfi-ristorante-pizzeria.jpeg'),
  shaurmaKebabViruKeskus: bolt('shaurma-kebab-viru-keskus.jpeg'),
  kolmTilliTallinn: bolt('kolm-tilli-tallinn.jpeg'),
  hesburgerViruTanav: bolt('hesburger-viru-tanav.jpeg'),
  tommiGrillMetro: bolt('tommi-grill-metro.jpeg'),
  /** Bolt Market Toompuiestee (`provider_id` 28032) — retail snippet carousel. */
  retailMagnumBonbon: boltProduct('magnum-bonbon-salted-caramel.jpeg'),
  retailMammaPastaHam: boltProduct('mamma-pasta-ham-salad.jpeg'),
  retailTangerine: boltProduct('tangerine-1kg.jpeg'),
  retailFazerRyeBread: boltProduct('fazer-sourdough-rye-bread.png'),
  retailAppleRoyalGala: boltProduct('apple-royal-gala.jpeg'),
  retailAlmaMilk: boltProduct('alma-milk-2-5.jpeg'),
  retailEstoverCheese: boltProduct('estover-sliced-cheese.jpeg'),
  retailPorkTenderloin: boltProduct('noo-pork-tenderloin.png'),
  retailSunfoodBeans: boltProduct('sunfood-baked-beans.jpeg'),
  retailBonVeganTofu: boltProduct('bon-vegan-tofu.jpeg'),
  retailCocaColaZero: boltProduct('coca-cola-zero.png'),
  retailBatteryEnergy: boltProduct('battery-energy-drink.png'),
} as const
