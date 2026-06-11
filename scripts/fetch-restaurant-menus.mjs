/**
 * Scrapes real menu data + images for all 9 restaurants from live Bolt Food pages.
 * Saves per-restaurant JSON to src/lib/restaurantMenus/<slug>.json and images to
 * public/bolt/<slug>/.
 *
 *   npm run restaurants:menu
 *
 * Uses the same Playwright intercept technique as fetch-ilforno-menu.mjs.
 */
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const RESTAURANTS = [
  {
    slug: 'amijami',
    name: 'Amijami Sushi Kadriorg',
    url: 'https://food.bolt.eu/en/1-tallinn/p/1353-amijami-sushi-kadriorg/',
  },
  {
    slug: 'damak',
    name: 'Damak Döner & Kebab',
    url: 'https://food.bolt.eu/en/1-tallinn/p/127-damak-doner-kebab/',
  },
  {
    slug: 'poke-bowl-kristiine',
    name: 'Poke Bowl Kristiine',
    url: 'https://food.bolt.eu/en/1-tallinn/p/4-poke-bowl-kristiine/',
  },
  {
    slug: 'nikolay',
    name: 'Nikolay Bar-buffeé',
    url: 'https://food.bolt.eu/en/1-tallinn/p/21700-nikolay-bar-buffee/',
  },
  {
    slug: 'amalfi',
    name: 'Amalfi Ristorante Pizzeria',
    url: 'https://food.bolt.eu/en/1-tallinn/p/620-amalfi-ristorante-pizzeria/',
  },
  {
    slug: 'shaurma',
    name: 'Shaurma Kebab Viru Keskus',
    url: 'https://food.bolt.eu/en/1-tallinn/p/33474-shaurma-kebab-viru-keskus/',
  },
  {
    slug: 'kolm-tilli',
    name: 'Kolm Tilli Tallinn',
    url: 'https://food.bolt.eu/en/1-tallinn/p/133309-kolm-tilli-tallinn/',
  },
  {
    slug: 'hesburger',
    name: 'Hesburger Viru tänav',
    url: 'https://food.bolt.eu/en/1-tallinn/p/5064-hesburger-viru-tanav/',
  },
  {
    slug: 'tommi-grill',
    name: 'Tommi Grill Metro',
    url: 'https://food.bolt.eu/en/1-tallinn/p/225-tommi-grill-metro/',
  },
]

function imageSlug(url, prefix) {
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 12)
  const ext = (path.extname(new URL(url).pathname) || '.jpeg').split('?')[0]
  return `${prefix}-${hash}${ext}`
}

async function downloadImage(url, imgDir, slug, cache) {
  if (!url) return undefined
  if (cache.has(url)) return cache.get(url)
  const file = imageSlug(url, slug)
  const rel = `${slug}/${file}`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Demo/1.0 (restaurant-menu-sync)' } })
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

async function scrapeOne(restaurant, browser) {
  const { slug, name, url } = restaurant
  const imgDir = path.join(root, 'public/bolt', slug)
  const outJson = path.join(root, 'src/lib/restaurantMenus', `${slug}.json`)
  await mkdir(imgDir, { recursive: true })

  const context = await browser.newContext({
    locale: 'en-US',
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
    try { jsons.push({ url: response.url(), body: await response.json() }) } catch { /* ignore */ }
  })

  console.log(`\n→ [${slug}] ${url}`)
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })

  const dishesSeen = () => jsons.some((j) => {
    try {
      const d = j.body?.data ?? j.body
      return d && typeof d.items === 'object' && d.root_id != null &&
        Object.values(d.items).some((n) => n?.type === 'dish')
    } catch { return false }
  })

  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(700)
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight)).catch(() => {})
    if (i > 6 && dishesSeen()) break
  }
  await context.close()

  const menuResponses = jsons
    .map(({ body }) => body?.data ?? body)
    .filter((d) => d && typeof d.items === 'object' && d.root_id != null)
    .map((d) => ({ d, dishCount: Object.values(d.items).filter((n) => n?.type === 'dish').length }))
    .sort((a, b) => b.dishCount - a.dishCount)

  if (menuResponses.length === 0) {
    console.warn(`  [${slug}] No menu data captured — skipping`)
    return false
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
        .map((dish) => ({ title: asString(dish.name), description: asString(dish.description), price: dish.price?.price_str ?? '', imageUrl: dishImageUrl(dish) }))
      return { title: asString(cat.name), dishes }
    })
    .filter((s) => s.dishes.length > 0)

  let cover = ''
  for (const { body } of jsons) {
    const prov = (body?.data ?? body)?.provider
    if (prov?.images?.cover) { cover = prov.images.cover; break }
  }

  // Download images
  const cache = new Map()
  const coverRel = cover ? await downloadImage(cover, imgDir, slug, cache) : null
  for (const section of sections) {
    for (const dish of section.dishes) {
      dish.imageSrc = await downloadImage(dish.imageUrl, imgDir, slug, cache)
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
        id: `${slug}-${id}-${j}`,
        title: dish.title,
        description: dish.description || undefined,
        price: dish.price,
        imageSrc: dish.imageSrc ?? null,
      })),
    }
  })

  const out = {
    source: url,
    provider: { name, cover: coverRel ?? null },
    sections: outSections,
  }

  await writeFile(outJson, `${JSON.stringify(out, null, 2)}\n`)
  const imageCount = [...cache.values()].filter(Boolean).length
  const dishTotal = outSections.reduce((n, s) => n + s.items.length, 0)
  console.log(`  ✓ ${outSections.length} sections, ${dishTotal} dishes, ${imageCount} images → ${outJson}`)
  return true
}

async function main() {
  await mkdir(path.join(root, 'src/lib/restaurantMenus'), { recursive: true })

  const browser = await chromium.launch({ headless: true })
  let ok = 0
  for (const restaurant of RESTAURANTS) {
    try {
      const success = await scrapeOne(restaurant, browser)
      if (success) ok++
    } catch (err) {
      console.error(`  [${restaurant.slug}] ERROR: ${err.message}`)
    }
  }
  await browser.close()
  console.log(`\nDone: ${ok}/${RESTAURANTS.length} restaurants scraped.`)
}

main().catch((err) => { console.error(err); process.exit(1) })
