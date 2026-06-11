/**
 * Captures the iL Forno Pärnu mnt menu from Bolt Food and saves it locally:
 * - menu JSON  → src/lib/ilFornoMenu.json
 * - item/cover images → public/bolt/ilforno/
 *
 *   npm run ilforno:menu
 */
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const outJson = path.join(root, 'src/lib/ilFornoMenu.json')
const imgDir = path.join(root, 'public/bolt/ilforno')

const PROVIDER_URL = 'https://food.bolt.eu/et-ee/1-tallinn/p/44766-il-forno-parnu-mnt/'
/** Provider cover from the page <meta> (used if the API response omits it). */
const COVER_FALLBACK =
  'https://images.bolt.eu/store/2023/2023-09-06/f9dc2867-2a76-4106-898c-fa8415e26052.jpeg'

function slugFromUrl(url) {
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 12)
  const ext = (path.extname(new URL(url).pathname) || '.jpeg').split('?')[0]
  return `ilforno-${hash}${ext}`
}

async function downloadImage(url, cache) {
  if (!url) return undefined
  if (cache.has(url)) return cache.get(url)
  const file = slugFromUrl(url)
  const rel = `ilforno/${file}`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Demo/1.0 (ilforno-menu-sync)' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await writeFile(path.join(imgDir, file), Buffer.from(await res.arrayBuffer()))
    cache.set(url, rel)
    return rel
  } catch (err) {
    console.warn(`  SKIP image ${url}: ${err.message}`)
    cache.set(url, undefined)
    return undefined
  }
}

function dishImageUrl(dish) {
  const map = dish?.images?.menu_item_list_v1?.aspect_ratio_map?.original
  return map?.['3x'] || map?.['2x'] || map?.['1x'] || dish?.image_url || ''
}

function asString(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && typeof value.value === 'string') return value.value
  return ''
}

function slugId(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section'
}

async function main() {
  await mkdir(imgDir, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    locale: 'et-EE',
    geolocation: { latitude: 59.437, longitude: 24.753 },
    permissions: ['geolocation'],
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  const jsons = []
  page.on('response', async (response) => {
    const ct = response.headers()['content-type'] ?? ''
    if (!ct.includes('application/json')) return
    try {
      jsons.push({ url: response.url(), body: await response.json() })
    } catch {
      /* ignore */
    }
  })

  console.log(`→ ${PROVIDER_URL}`)
  await page.goto(PROVIDER_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 })

  // Let the SPA fetch the menu; nudge lazy sections by scrolling.
  const dishesSeen = () => jsons.some((j) => {
    const d = new Map()
    const c = []
    try { collect(j.body, d, c) } catch { /* ignore */ }
    return d.size > 0
  })
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(700)
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight)).catch(() => {})
    if (i > 6 && dishesSeen()) break
  }
  await browser.close()

  // The menu lives in getMenuCategories: an `items` map of typed nodes
  // (menu → category → dish) linked by parent_id / child_ids.
  const menuResponses = jsons
    .map(({ body }) => body?.data ?? body)
    .filter((d) => d && typeof d.items === 'object' && d.root_id != null)
    .map((d) => ({ d, dishCount: Object.values(d.items).filter((n) => n?.type === 'dish').length }))
    .sort((a, b) => b.dishCount - a.dishCount)

  if (menuResponses.length === 0) {
    throw new Error('No getMenuCategories response captured')
  }

  const items = menuResponses[0].d.items
  const node = (id) => items[id]
  const byIndex = (a, b) => (a.index ?? 0) - (b.index ?? 0)

  const categoryNodes = Object.values(items)
    .filter((n) => n.type === 'category' && Array.isArray(n.child_ids))
    .sort(byIndex)

  const sections = categoryNodes
    .map((cat) => {
      const dishes = cat.child_ids
        .map(node)
        .filter((n) => n?.type === 'dish')
        .sort(byIndex)
        .map((dish) => ({
          title: asString(dish.name),
          description: asString(dish.description),
          price: dish.price?.price_str ?? '',
          imageUrl: dishImageUrl(dish),
        }))
      return { title: asString(cat.name), dishes }
    })
    .filter((section) => section.dishes.length > 0)

  const providerName = 'iL Forno Pärnu mnt'
  const rating = ''
  const ratingCount = ''
  const deliveryFee = ''
  let cover = ''
  for (const { body } of jsons) {
    const prov = (body?.data ?? body)?.provider
    if (prov?.images?.cover) { cover = prov.images.cover; break }
  }
  if (!cover) cover = COVER_FALLBACK

  const dishTotal = sections.reduce((n, s) => n + s.dishes.length, 0)
  console.log(`  captured ${jsons.length} JSON responses → ${sections.length} categories, ${dishTotal} dishes`)

  // Download images (dishes + cover).
  const cache = new Map()
  const coverRel = await downloadImage(cover, cache)
  for (const section of sections) {
    for (const dish of section.dishes) {
      dish.imageSrc = await downloadImage(dish.imageUrl, cache)
      delete dish.imageUrl
    }
  }

  const usedIds = new Set()
  const outSections = sections.map((section, i) => {
    let id = slugId(section.title)
    while (usedIds.has(id)) id = `${id}-${i}`
    usedIds.add(id)
    return {
      id,
      title: section.title,
      items: section.dishes.map((dish, j) => ({
        id: `ilf-${id}-${j}`,
        title: dish.title,
        description: dish.description,
        price: dish.price,
        imageSrc: dish.imageSrc ?? null,
      })),
    }
  })

  const out = {
    source: PROVIDER_URL,
    provider: { name: providerName, rating, ratingCount, deliveryFee, cover: coverRel ?? null },
    sections: outSections,
  }

  await writeFile(outJson, `${JSON.stringify(out, null, 2)}\n`)
  const imageCount = [...cache.values()].filter(Boolean).length
  console.log(`\nWrote ${outJson}`)
  console.log(`  ${outSections.length} sections, ${outSections.reduce((n, s) => n + s.items.length, 0)} items, ${imageCount} images`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
