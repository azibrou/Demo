/**
 * Downloads store cover images for ThumbnailXs / ThumbnailM / ThumbnailL home sections
 * from Bolt Food Tallinn (`https://food.bolt.eu/et-ee/1-tallinn/`).
 * Sources match `src/lib/boltFoodTallinnHomeContent.ts` (getScreenContent feed).
 *
 *   npm run bolt:assets
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'bolt')
const productsDir = path.join(outDir, 'products')

/** Stable local name → remote URL (unique set for home thumbnails). */
const assets = {
  'bolt-market-toompuiestee.jpeg':
    'https://images.bolt.eu/store/2026/2026-03-03/f23b4550-d6cb-4c7c-8d2e-af499e181eb6.jpeg',
  'mcdonalds-viru.jpeg':
    'https://images.bolt.eu/store/2021/2021-11-18/b6419a9c-cce7-4557-a0bf-686d93ad5e00.jpeg',
  'amijami-sushi-kadriorg.jpeg':
    'https://images.bolt.eu/store/2023/2023-12-05/3104252c-0aef-4fda-bdbf-e159e097c816.jpeg',
  'damak-doner-kebab.jpeg':
    'https://images.bolt.eu/store/2022/2022-03-02/12def9d5-8bb9-45db-8590-2b8450892303.jpeg',
  'pavlova-viru-keskus.jpeg':
    'https://images.bolt.eu/store/2024/2024-02-06/d6a12c3b-0467-4a7c-9ed7-3ad14c4c9425.jpeg',
  'little-japan-kesklinn.jpeg':
    'https://images.bolt.eu/store/2024/2024-08-01/5dca1b79-6195-46bd-a876-3c5f821c0998.jpeg',
  'nikolay-bar-buffee.jpeg':
    'https://images.bolt.eu/store/2021/2021-11-01/dadf2473-9461-4be4-9482-40a04c87869c.jpeg',
  'amalfi-ristorante-pizzeria.jpeg':
    'https://images.bolt.eu/store/2021/2021-01-06/21435281-c348-43a8-b6de-334feb604dfb.jpeg',
  'shaurma-kebab-viru-keskus.jpeg':
    'https://images.bolt.eu/store/2019/2019-09-12/d10e19a0-1b0a-409d-9fbb-0fc893297912',
  'kolm-tilli-tallinn.jpeg':
    'https://images.bolt.eu/store/2025/2025-02-21/e90c1f5b-877f-4139-b9c3-f2807afe03c0.jpeg',
  'hesburger-viru-tanav.jpeg':
    'https://images.bolt.eu/store/2025/2025-04-08/68142fda-71f1-4543-ace1-8c11c22873ae.jpeg',
  'tommi-grill-metro.jpeg':
    'https://images.bolt.eu/store/2019/2019-10-17/bc7337e8-61f0-417b-a34d-7ff0cc4899f1.jpeg',
}

/** Retail snippet — Bolt Market Toompuiestee menu (first SKU per category, ×12). */
const productAssets = {
  'magnum-bonbon-salted-caramel.jpeg':
    'https://images.bolt.eu/store/2025/2025-01-16/5244f1ec-26bb-42c1-a9f3-db7b58e3877e.jpeg',
  'mamma-pasta-ham-salad.jpeg':
    'https://images.bolt.eu/store/2024/2024-10-11/25e821b1-8af9-4237-b043-2db7ce7e772b.jpeg',
  'tangerine-1kg.jpeg':
    'https://images.bolt.eu/store/2024/2024-01-23/4fed6846-77a5-40c3-9a41-08e2085fd05a.jpeg',
  'fazer-sourdough-rye-bread.png':
    'https://images.bolt.eu/store/2025/2025-04-16/68f5b5b2-1b47-4089-a729-24c20e44e5d1.png',
  'apple-royal-gala.jpeg':
    'https://images.bolt.eu/store/2024/2024-01-23/4c5d2536-431c-423e-ba4c-b8f2a46f5658.jpeg',
  'alma-milk-2-5.jpeg':
    'https://images.bolt.eu/store/2022/2022-08-15/ec549189-564a-4abf-ac91-232e4cf46c8d.jpeg',
  'estover-sliced-cheese.jpeg':
    'https://images.bolt.eu/store/2022/2022-08-15/b10c3338-9639-4904-ac2e-e1f97d0729cc.jpeg',
  'noo-pork-tenderloin.png':
    'https://images.bolt.eu/store/2024/2024-01-31/80f54beb-2295-4654-bbb9-6b63943d3de7.png',
  'sunfood-baked-beans.jpeg':
    'https://images.bolt.eu/store/2022/2022-10-24/0f6d0265-0e1f-4322-b09c-c73fa45f6119.jpeg',
  'bon-vegan-tofu.jpeg':
    'https://images.bolt.eu/store/2022/2022-08-15/125247bf-1a05-4481-b913-2d5f1e6cd04f.jpeg',
  'coca-cola-zero.png':
    'https://images.bolt.eu/store/2026/2026-05-12/16c25392-556f-4e2b-ba1e-3488a78ffc89.png',
  'battery-energy-drink.png':
    'https://images.bolt.eu/store/2026/2026-04-15/a6200bca-82a5-4aa6-a254-de033944926d.png',
}

async function download(dir, name, url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Demo/1.0 (bolt-food-asset-sync)' },
  })
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const dest = path.join(dir, name)
  await writeFile(dest, buf)
  console.log(`✓ ${name} (${buf.length} bytes)`)
}

await mkdir(outDir, { recursive: true })
await mkdir(productsDir, { recursive: true })
for (const [name, url] of Object.entries(assets)) {
  await download(outDir, name, url)
}
for (const [name, url] of Object.entries(productAssets)) {
  await download(productsDir, name, url)
}
console.log(
  `\nWrote ${Object.keys(assets).length} store covers and ${Object.keys(productAssets).length} product images to public/bolt/`,
)
