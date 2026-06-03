/**
 * Captures Bolt Food Tallinn search for banana prefixes (b → banana):
 * - POST deliverySearch
 * - POST getProviderPreviewMenuItems
 *
 *   npm run bolt:search:sync
 */
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const outJson = path.join(root, 'src/lib/boltFoodTallinnSearchData.json')
const imgDir = path.join(root, 'public/bolt/search')

const PREFIXES = ['b', 'ba', 'ban', 'bana', 'banan', 'banana']
const MAX_PROVIDERS = 8
const MAX_ITEMS_PER_PROVIDER = 6
const SEARCH_URL = (q) => `https://food.bolt.eu/en/1-tallinn/search/?query=${encodeURIComponent(q)}`

function slugFromUrl(url) {
  const base = path.basename(new URL(url).pathname)
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 10)
  const ext = path.extname(base) || '.jpeg'
  const stem = base.replace(ext, '').replace(/[^a-z0-9_-]+/gi, '-').slice(0, 36) || 'image'
  return `${stem}-${hash}${ext}`
}

async function downloadImage(url, destDir, cache) {
  if (!url || cache.has(url)) return cache.get(url)
  const file = slugFromUrl(url)
  const rel = `search/${file}`
  const dest = path.join(destDir, file)
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Demo/1.0 (bolt-search-sync)' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await writeFile(dest, Buffer.from(await res.arrayBuffer()))
    cache.set(url, rel)
    return rel
  } catch (err) {
    console.warn(`  SKIP image ${url}: ${err.message}`)
    cache.set(url, null)
    return null
  }
}

function formatEta(eta) {
  if (!eta?.delivery) return ''
  const min = Math.round(eta.delivery.min / 60)
  const max = Math.round(eta.delivery.max / 60)
  return `${min}–${max} min`
}

function dishImageUrl(dish) {
  const map = dish?.images?.menu_item_list_v1?.aspect_ratio_map?.original
  return map?.['3x'] || map?.['2x'] || map?.['1x'] || ''
}

function providerCoverUrl(provider) {
  return provider?.images?.cover ?? ''
}

function normalizeProvider(provider, previewByProvider) {
  const id = String(provider.id)
  const preview = previewByProvider[id]
  const items = preview
    ? Object.values(preview.items ?? {})
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        .slice(0, MAX_ITEMS_PER_PROVIDER)
        .map((dish) => ({
          id: String(dish.id),
          name: dish.name?.value ?? '',
          price: dish.price?.price_str ?? '',
          imageUrl: dishImageUrl(dish),
        }))
    : []

  return {
    id,
    name: provider.name ?? '',
    imageUrl: providerCoverUrl(provider),
    deliveryFee: provider.delivery?.fee?.price_str ?? '',
    eta: formatEta(provider.eta),
    rating: provider.rating?.value ?? '',
    ratingCount: provider.rating?.count ?? '',
    scheduled: Boolean(provider.availability?.delivery?.scheduled),
    items,
    matchedItem: provider.tracking?.matched_reasons?.includes('matched_item') ?? false,
  }
}

function buildSnapshot(searchJson, previewJson, query) {
  const data = searchJson?.data ?? {}
  const providers = data.providers ?? []
  const previewItems = previewJson?.data?.preview_items ?? {}

  const normalized = providers
    .map((p) => normalizeProvider(p, previewItems))
    .filter((p) => p.matchedItem || p.items.length > 0)
    .sort((a, b) => b.items.length - a.items.length)
    .slice(0, MAX_PROVIDERS)

  const withItems = normalized.filter((p) => p.items.length > 0)
  const list = withItems.length > 0 ? withItems : normalized.slice(0, MAX_PROVIDERS)

  return {
    query,
    categoryLabel: `🍌 ${query}`,
    resultCount: providers.length,
    providers: list,
  }
}

async function captureQuery(browser, query) {
  const page = await browser.newPage({
    locale: 'en-US',
    geolocation: { latitude: 59.437, longitude: 24.753 },
    permissions: ['geolocation'],
  })

  let searchJson = null
  let previewJson = null

  page.on('response', async (response) => {
    const url = response.url()
    if (response.status() !== 200) return
    try {
      if (url.includes('deliverySearch') && response.request().method() === 'POST') {
        const body = response.request().postDataJSON()
        if (body?.search_string === query) searchJson = await response.json()
      }
      if (url.includes('getProviderPreviewMenuItems') && response.request().method() === 'POST') {
        const body = response.request().postDataJSON()
        if (body?.search_string === query) previewJson = await response.json()
      }
    } catch {
      /* ignore */
    }
  })

  await page.goto(SEARCH_URL(query), { waitUntil: 'domcontentloaded', timeout: 60_000 })
  for (let i = 0; i < 25 && (!searchJson || !previewJson); i++) {
    await page.waitForTimeout(500)
  }
  await page.close()

  if (!searchJson) throw new Error(`No deliverySearch response for "${query}"`)
  return buildSnapshot(searchJson, previewJson, query)
}

async function main() {
  await mkdir(imgDir, { recursive: true })
  const imageCache = new Map()
  const output = {}

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  })

  for (const query of PREFIXES) {
    console.log(`→ ${query}`)
    const page = await context.newPage()
    let searchJson = null
    let previewJson = null
    page.on('response', async (response) => {
      const url = response.url()
      if (response.status() !== 200) return
      try {
        if (url.includes('deliverySearch') && response.request().method() === 'POST') {
          const body = response.request().postDataJSON()
          if (body?.search_string === query) searchJson = await response.json()
        }
        if (url.includes('getProviderPreviewMenuItems') && response.request().method() === 'POST') {
          const body = response.request().postDataJSON()
          if (body?.search_string === query) previewJson = await response.json()
        }
      } catch {
        /* ignore */
      }
    })
    await page.goto(SEARCH_URL(query), { waitUntil: 'domcontentloaded', timeout: 60_000 })
    for (let i = 0; i < 25 && (!searchJson || !previewJson); i++) await page.waitForTimeout(500)
    await page.close()

    if (!searchJson) {
      console.warn(`  missing search for "${query}"`)
      continue
    }

    const snapshot = buildSnapshot(searchJson, previewJson, query)

    for (const provider of snapshot.providers) {
      if (provider.imageUrl) {
        const rel = await downloadImage(provider.imageUrl, imgDir, imageCache)
        if (rel) provider.imageSrc = rel
        delete provider.imageUrl
      }
      for (const item of provider.items) {
        if (item.imageUrl) {
          const rel = await downloadImage(item.imageUrl, imgDir, imageCache)
          if (rel) item.imageSrc = rel
        }
        delete item.imageUrl
      }
      delete provider.matchedItem
    }

    output[query] = snapshot
    console.log(
      `  ${snapshot.resultCount} providers, showing ${snapshot.providers.length} (${snapshot.providers.filter((p) => p.items.length).length} with dishes)`,
    )
  }

  await browser.close()
  await writeFile(outJson, `${JSON.stringify(output, null, 2)}\n`)
  console.log(`\nWrote ${outJson} (${Object.keys(imageCache).filter((k) => imageCache.get(k)).length} images)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
