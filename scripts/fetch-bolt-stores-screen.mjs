/**
 * Fetches live Stores tab content from Bolt Food Tallinn
 * (`https://food.bolt.eu/en/1-tallinn/stores/`, screen_id 120001),
 * downloads provider cover images to `public/bolt/stores/`, and writes
 * `src/lib/boltFoodTallinnStoresScreen.json`.
 *
 *   npm run bolt:stores:sync
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const outDir = path.join(root, 'public', 'bolt', 'stores')
const jsonOut = path.join(root, 'src', 'lib', 'boltFoodTallinnStoresScreen.json')

const DEVICE_QS = new URLSearchParams({
  language: 'en',
  deviceId: 'demo-bolt-stores-sync',
  deviceType: 'desktop',
  device_name: 'Chrome',
  device_os_version: 'macOS',
  version: 'CI.196.0',
})

/** Rotermanni 6 — matches demo {@link AddressSelector} default. */
const DELIVERY = { city_id: 1, delivery_lat: 59.437, delivery_lng: 24.7536 }
const STORES_SCREEN_ID = 120001

/** Category ids from getScreenContent segments on the live Stores tab. */
const SECTIONS = {
  orderAgain: { categoryIds: [2996], limit: 4 },
  featured: { categoryIds: [4130], limit: 1 },
  allGroceryStores: { categoryIds: [3327], limit: 10 },
  boltPlusDiscounts: { categoryIds: [4863], limit: 3, preferBoltMarket: true },
  bakerySweets: { categoryIds: [3104], limit: 10 },
  allStores: { categoryIds: [2996], limit: 8 },
}

function slugify(name, providerId) {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
  return `${base}-${providerId}`
}

function extFromUrl(url) {
  const m = url.match(/\.(jpe?g|png|webp)(?:\?|$)/i)
  return m ? m[1].toLowerCase().replace('jpeg', 'jpeg') : 'jpeg'
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchJson(url, init, retries = 4) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, {
      ...init,
      headers: { 'User-Agent': 'Demo/1.0 (bolt-stores-sync)', ...(init?.headers ?? {}) },
    })
    if (res.status === 429 && attempt < retries) {
      await sleep(800 * (attempt + 1))
      continue
    }
    if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`)
    return res.json()
  }
  throw new Error(`${url} → exhausted retries`)
}

async function getScreenContent() {
  const qs = new URLSearchParams({
    ...Object.fromEntries(DEVICE_QS),
    city_id: String(DELIVERY.city_id),
    screen_id: String(STORES_SCREEN_ID),
    delivery_lat: String(DELIVERY.delivery_lat),
    delivery_lng: String(DELIVERY.delivery_lng),
  })
  const url = `https://node.bolt.eu/delivery-eater-screen/deliveryClient/public/getScreenContent?${qs}`
  const body = await fetchJson(url)
  if (body.code !== 0) throw new Error(`getScreenContent failed: ${JSON.stringify(body)}`)
  return body.data
}

async function getProviderDetails(providerId) {
  const qs = new URLSearchParams({
    ...Object.fromEntries(DEVICE_QS),
    city_id: String(DELIVERY.city_id),
    delivery_lat: String(DELIVERY.delivery_lat),
    delivery_lng: String(DELIVERY.delivery_lng),
    provider_id: String(providerId),
  })
  const url = `https://node.bolt.eu/delivery-provider-search/deliveryClient/public/getProviderDetails?${qs}`
  const body = await fetchJson(url)
  if (body.code !== 0 || !body.data?.provider) return null
  return body.data.provider
}

function normalizeProvider(provider, localFile) {
  const rating = provider.rating_info ?? {}
  const promo = provider.promotion ?? {}
  const orig = promo.delivery_price_before_discount ?? {}
  const deliveryLabel = provider.delivery_price?.price_str?.replace(/\u00a0/g, ' ') ?? ''
  const deliveryOriginalPrice = orig.price_str?.replace(/\u00a0/g, ' ') || undefined
  const imageUrl =
    provider.images?.provider_list_v1?.aspect_ratio_map?.original?.['1x'] ??
    provider.images?.provider_list_v1?.aspect_ratio_map?.original?.['2x'] ??
    null

  return {
    providerId: provider.provider_id,
    title: provider.name?.value ?? '',
    address: provider.address ?? '',
    deliveryLabel,
    deliveryOriginalPrice,
    etaText: `${Math.round(provider.min_delivery_eta / 60)}–${Math.round(provider.max_delivery_eta / 60)} min`,
    rating: rating.rating != null ? Number(rating.rating).toFixed(1) : undefined,
    reviews: rating.count_label ? `(${rating.count_label})` : undefined,
    imageUrl,
    localFile,
    assetKey: localFile ? localFile.replace(/\.[^.]+$/, '').replace(/-/g, '_') : undefined,
  }
}

async function downloadImage(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Demo/1.0 (bolt-stores-sync)' } })
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(dest, buf)
  return buf.length
}

function collectProviderIds(screen, section) {
  const cats = screen.provider_categories?.data ?? {}
  const ids = []
  for (const cid of section.categoryIds) {
    const cat = cats[String(cid)]
    if (!cat?.provider_ids) continue
    for (const pid of cat.provider_ids) {
      if (!ids.includes(pid)) ids.push(pid)
    }
  }
  if (section.preferBoltMarket) {
    const bolt = ids.find((id) => id === 28032)
    if (bolt) return [bolt, ...ids.filter((id) => id !== 28032)].slice(0, section.limit)
  }
  return ids.slice(0, section.limit)
}

async function resolveSection(screen, sectionKey, section, cache, downloaded) {
  const ids = collectProviderIds(screen, section)
  const items = []
  for (const pid of ids) {
    if (cache.has(pid)) {
      items.push(cache.get(pid))
      continue
    }
    const raw = await getProviderDetails(pid)
    if (!raw) {
      console.warn(`⚠ skip provider ${pid} (no details)`)
      continue
    }
    await sleep(120)
    const title = raw.name?.value ?? `provider-${pid}`
    const imageUrl =
      raw.images?.provider_list_v1?.aspect_ratio_map?.original?.['1x'] ??
      raw.images?.provider_list_v1?.aspect_ratio_map?.original?.['2x']
    let localFile
    if (imageUrl) {
      localFile = `${slugify(title, pid)}.${extFromUrl(imageUrl)}`
      if (!downloaded.has(localFile)) {
        const bytes = await downloadImage(imageUrl, path.join(outDir, localFile))
        console.log(`✓ ${localFile} (${bytes} bytes)`)
        downloaded.add(localFile)
      }
    }
    const item = normalizeProvider(raw, localFile)
    cache.set(pid, item)
    items.push(item)
  }
  return items
}

const screen = await getScreenContent()
console.log(`Stores screen "${screen.title}" — ${Object.keys(screen.provider_categories?.data ?? {}).length} categories`)

await mkdir(outDir, { recursive: true })

const cache = new Map()
const downloaded = new Set()
const payload = {
  source: 'https://food.bolt.eu/en/1-tallinn/stores/',
  screenId: STORES_SCREEN_ID,
  fetchedAt: new Date().toISOString(),
  delivery: DELIVERY,
  sections: {},
}

for (const [key, section] of Object.entries(SECTIONS)) {
  payload.sections[key] = await resolveSection(screen, key, section, cache, downloaded)
  console.log(`  ${key}: ${payload.sections[key].length} providers`)
}

await writeFile(jsonOut, `${JSON.stringify(payload, null, 2)}\n`)
console.log(`\nWrote ${jsonOut}`)
console.log(`Downloaded ${downloaded.size} images to public/bolt/stores/`)
