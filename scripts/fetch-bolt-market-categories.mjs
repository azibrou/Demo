/**
 * Captures full Bolt Market Toompuiestee category assortments (Dairy & Eggs, Meat & Fish)
 * and saves them locally:
 * - JSON   → src/lib/boltMarketCategories.json
 * - images → public/bolt/market/
 *
 *   npm run boltmarket:categories
 */
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const outJson = path.join(root, 'src/lib/boltMarketCategories.json')
const imgDir = path.join(root, 'public/bolt/market')

const PROVIDER_URL =
  'https://food.bolt.eu/en/1-tallinn/p/28032-bolt-market-toompuiestee/?shouldRefreshMenu=false'

const TARGETS = [
  { slug: 'dairy-and-eggs', title: 'Dairy & Eggs', clickText: 'Dairy & Eggs' },
  { slug: 'meat-and-fish', title: 'Meat & Fish', clickText: 'Meat & Fish' },
]

function normTitle(value) {
  return value
    .replace(/^[^\p{L}]+/u, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function slugFromUrl(url) {
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 12)
  const ext = (path.extname(new URL(url).pathname) || '.jpeg').split('?')[0]
  return `market-${hash}${ext}`
}

async function downloadImage(url, cache) {
  if (!url) return undefined
  if (cache.has(url)) return cache.get(url)
  const file = slugFromUrl(url)
  const rel = `market/${file}`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Demo/1.0 (boltmarket-categories-sync)' } })
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

function menuDishCount(data) {
  if (!data || typeof data.items !== 'object' || data.root_id == null) return 0
  return Object.values(data.items).filter((n) => n?.type === 'dish').length
}

/** All dish descendants under a category node (recurses through subcategories). */
function collectDishesUnder(items, categoryNode) {
  const byIndex = (a, b) => (a.index ?? 0) - (b.index ?? 0)
  const out = []
  const visit = (node) => {
    if (!node) return
    if (node.type === 'dish') {
      out.push(node)
      return
    }
    const kids = (node.child_ids ?? []).map((id) => items[id]).filter(Boolean).sort(byIndex)
    for (const kid of kids) visit(kid)
  }
  const kids = (categoryNode.child_ids ?? []).map((id) => items[id]).filter(Boolean).sort(byIndex)
  for (const kid of kids) visit(kid)
  return out
}

/** Find the top category node matching `title` with the most dish descendants. */
function findCategoryDishes(data, title) {
  const items = data.items
  const wanted = normTitle(title)
  let best = null
  for (const node of Object.values(items)) {
    if (node.type !== 'category' || !Array.isArray(node.child_ids)) continue
    if (normTitle(asString(node.name)) !== wanted) continue
    const dishes = collectDishesUnder(items, node)
    if (!best || dishes.length > best.length) best = dishes
  }
  return best ?? []
}

async function captureCategory(context, target, cache) {
  const page = await context.newPage()
  const jsons = []
  page.on('response', async (response) => {
    const ct = response.headers()['content-type'] ?? ''
    if (!ct.includes('application/json')) return
    try {
      jsons.push(await response.json())
    } catch {
      /* ignore */
    }
  })

  console.log(`→ ${target.slug}`)
  const responseLog = []
  page.on('response', (response) => {
    responseLog.push({ url: response.url(), method: response.request().method() })
  })
  await page.goto(PROVIDER_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  // Wait for the preview menu to render, then open the category within the SPA.
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(500)
    if (jsons.some((b) => menuDishCount(b?.data ?? b) > 0)) break
  }
  try {
    const link = page.getByText(target.clickText, { exact: false }).first()
    await link.scrollIntoViewIfNeeded({ timeout: 5_000 })
    await link.click({ timeout: 5_000 })
  } catch (err) {
    console.warn(`  could not click "${target.clickText}": ${err.message}`)
  }

  const seen = () => jsons.some((b) => menuDishCount(b?.data ?? b) > 1)
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(700)
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight)).catch(() => {})
    if (i > 8 && seen()) break
  }
  await page.close()

  if (process.env.BM_DEBUG) {
    const countDishesDeep = (root) => {
      let n = 0
      const visit = (node) => {
        if (Array.isArray(node)) return node.forEach(visit)
        if (!node || typeof node !== 'object') return
        if (asString(node.name) && typeof node.price?.price_str === 'string') n += 1
        for (const v of Object.values(node)) visit(v)
      }
      visit(root)
      return n
    }
    const summary = jsons.map((b, i) => ({
      i,
      keys: Object.keys(b?.data ?? b ?? {}).slice(0, 10),
      menuDishes: menuDishCount(b?.data ?? b),
      deepDishes: countDishesDeep(b),
    }))
    await writeFile(`/tmp/bm-${target.slug}-summary.json`, `${JSON.stringify(summary, null, 2)}\n`)
    await writeFile(
      `/tmp/bm-${target.slug}-urls.json`,
      `${JSON.stringify([...new Set(responseLog.map((r) => `${r.method} ${r.url}`))].filter((u) => /menu|categor|item|product|search/i.test(u)), null, 2)}\n`,
    )
    const richest = jsons
      .map((b) => ({ b, n: countDishesDeep(b) }))
      .sort((a, c) => c.n - a.n)[0]
    if (richest) await writeFile(`/tmp/bm-${target.slug}-richest.json`, `${JSON.stringify(richest.b, null, 2).slice(0, 200000)}\n`)
    console.log(`  debug → /tmp/bm-${target.slug}-summary.json (deep dish counts), urls, richest`)
  }

  const menus = jsons
    .map((b) => b?.data ?? b)
    .filter((d) => menuDishCount(d) > 0)
    .sort((a, b) => menuDishCount(b) - menuDishCount(a))

  // Use the fullest captured menu, then gather every dish under the target category.
  let dishes = []
  for (const data of menus) {
    const found = findCategoryDishes(data, target.title)
    if (found.length > dishes.length) dishes = found
  }
  if (dishes.length === 0) {
    console.warn(`  no "${target.title}" category found`)
    return { slug: target.slug, title: target.title, items: [] }
  }

  // De-duplicate by product id (subcategories can repeat featured items).
  const seenIds = new Set()
  const items = []
  for (const dish of dishes) {
    const key = String(dish.id ?? asString(dish.name))
    if (seenIds.has(key)) continue
    seenIds.add(key)
    const imageSrc = await downloadImage(dishImageUrl(dish), cache)
    items.push({
      id: `bm-${target.slug}-${items.length}`,
      title: asString(dish.name),
      price: dish.price?.price_str ?? '',
      imageSrc: imageSrc ?? null,
    })
  }
  console.log(`  ${target.title} → ${items.length} items`)
  return { slug: target.slug, title: target.title, items }
}

async function main() {
  await mkdir(imgDir, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    locale: 'en-US',
    geolocation: { latitude: 59.437, longitude: 24.753 },
    permissions: ['geolocation'],
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  })

  const cache = new Map()
  const out = {}
  for (const target of TARGETS) {
    const result = await captureCategory(context, target, cache)
    out[result.slug] = { title: result.title, items: result.items }
  }
  await browser.close()

  await writeFile(outJson, `${JSON.stringify(out, null, 2)}\n`)
  const total = Object.values(out).reduce((n, c) => n + c.items.length, 0)
  console.log(`\nWrote ${outJson} (${total} items, ${[...cache.values()].filter(Boolean).length} images)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
