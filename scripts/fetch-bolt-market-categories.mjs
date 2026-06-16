/**
 * Captures full Bolt Market Toompuiestee category assortments and saves them locally:
 * - JSON   → src/lib/boltMarketCategories.json
 * - images → public/bolt/market/
 *
 * Each target navigates straight to its sub-menu-category (smc) URL so the SPA loads
 * that category's full product list, then we read the captured menu JSON.
 *
 *   npm run boltmarket:categories
 */
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const outJson = path.join(root, 'src/lib/boltMarketCategories.json')
const imgDir = path.join(root, 'public/bolt/market')

const PROVIDER_URL =
  'https://food.bolt.eu/en/1-tallinn/p/28032-bolt-market-toompuiestee/?shouldRefreshMenu=false'

// `slug` must match the category id used by the app (see merchantAislesCategories.ts
// labelToId: "Fresh & ready" → "fresh-and-ready"). `title` is the on-site category name.
const TARGETS = [
  {
    slug: 'fresh-and-ready',
    title: 'Fresh & Ready',
    url: 'https://food.bolt.eu/en/1-tallinn/p/28032/smc/5629504026469521/?categoryName=%F0%9F%A5%AA%20Fresh%20%26%20Ready&backPath=%2Fp%2F28032',
  },
  {
    slug: 'bakery',
    title: 'Bakery',
    url: 'https://food.bolt.eu/en/1-tallinn/p/28032/smc/5770246007081370/?categoryName=%F0%9F%8D%9E%20Bakery&backPath=%2Fp%2F28032',
  },
  {
    slug: 'fruits-and-vegetables',
    title: 'Fruits & Vegetables',
    url: 'https://food.bolt.eu/en/1-tallinn/p/28032/smc/5770246007081227/?categoryName=%F0%9F%A5%95%20Fruits%20%26%20Vegetables&backPath=%2Fp%2F28032',
  },
  {
    slug: 'dairy-and-eggs',
    title: 'Dairy & Eggs',
    url: 'https://food.bolt.eu/en/1-tallinn/p/28032/smc/6333330728194251/?categoryName=%F0%9F%A5%9B%20Dairy%20%26%20Eggs&backPath=%2Fp%2F28032',
  },
  {
    slug: 'cheese',
    title: 'Cheese',
    // Emoji-qualified to hit the section heading, not products like "Cream Cheese".
    clickText: '🧀 Cheese',
    url: 'https://food.bolt.eu/en/1-tallinn/p/28032/smc/6333330728194500/?categoryName=%F0%9F%A7%80%20Cheese&backPath=%2Fp%2F28032',
  },
  {
    slug: 'meat-and-fish',
    title: 'Meat & Fish',
    url: 'https://food.bolt.eu/en/1-tallinn/p/28032/smc/6333330728194619/?categoryName=%F0%9F%8D%97%20Meat%20%26%20Fish&backPath=%2Fp%2F28032',
  },
  {
    slug: 'vegan',
    title: 'Vegan',
    url: 'https://food.bolt.eu/en/1-tallinn/p/28032/smc/6333330728194998/?categoryName=%F0%9F%A5%97%20Vegan&backPath=%2Fp%2F28032',
  },
  {
    slug: 'beverages',
    title: 'Beverages',
    url: 'https://food.bolt.eu/en/1-tallinn/p/28032/smc/6333330728195080/?categoryName=%F0%9F%A5%A4%20Beverages&backPath=%2Fp%2F28032',
  },
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
  const items = data?.items
  if (!items || typeof items !== 'object') return []
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
  console.log(`→ ${target.slug}`)
  const jsons = []
  const responseLog = []
  // Dishes attributed to the target category across everything captured so far. The
  // store preview gives 1 per category; opening the category grows this to the full list.
  const targetDishes = () =>
    Math.max(0, ...jsons.map((b) => findCategoryDishes(b?.data ?? b, target.title).length))

  const clickText = target.clickText ?? target.title
  const titleRe = new RegExp(`${target.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i')

  // The in-app category open is flaky/rate-limited, so retry on fresh pages until the
  // category fills out (or attempts run out). Runs are merge-safe so this never regresses.
  const attempts = Number(process.env.BM_RETRIES ?? 4)
  for (let attempt = 0; attempt < attempts && targetDishes() <= 1; attempt++) {
    const page = await context.newPage()
    page.on('response', async (response) => {
      const ct = response.headers()['content-type'] ?? ''
      if (ct.includes('application/json')) {
        try {
          jsons.push(await response.json())
        } catch {
          /* ignore */
        }
      }
      responseLog.push({ url: response.url(), method: response.request().method() })
    })
    try {
      await page.goto(PROVIDER_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 })
      for (let i = 0; i < 24; i++) {
        await page.waitForTimeout(500)
        if (jsons.some((b) => menuDishCount(b?.data ?? b) > 0)) break
      }
      // Render virtualized sections so lower categories (e.g. Cheese) attach handlers.
      for (let i = 0; i < 16; i++) {
        await page.evaluate(() => window.scrollBy(0, 1400)).catch(() => {})
        await page.waitForTimeout(250)
      }
      await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {})
      await page.waitForTimeout(500)

      // Open the category: click its preview dish card, then its heading. Avoid
      // getByText(title) which can match a product like "Cream Cheese".
      const categoryLi = page
        .locator('li.provider-menu-category', {
          has: page.locator('h2.provider-menu-category-title', { hasText: titleRe }),
        })
        .first()
      const candidates = [
        categoryLi.locator('li.provider-menu-dish').first(),
        page.locator('h2.provider-menu-category-title', { hasText: titleRe }).first(),
        page.getByText(clickText, { exact: false }).first(),
      ]
      for (const link of candidates) {
        if (targetDishes() > 1) break
        try {
          await link.scrollIntoViewIfNeeded({ timeout: 12_000 })
          await link.click({ timeout: 12_000 })
          for (let i = 0; i < 24; i++) {
            await page.waitForTimeout(500)
            await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight)).catch(() => {})
            if (targetDishes() > 1) break
          }
        } catch {
          /* try next candidate */
        }
      }
      // Last resort: deep-link to the category URL (often redirects to the preview).
      if (targetDishes() <= 1 && target.url) {
        try {
          await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
          for (let i = 0; i < 20; i++) {
            await page.waitForTimeout(600)
            await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight)).catch(() => {})
            if (targetDishes() > 1) break
          }
        } catch (err2) {
          console.warn(`  could not open category URL: ${err2.message}`)
        }
      }
    } finally {
      await page.close()
    }
    if (targetDishes() <= 1 && attempt < attempts - 1) {
      console.log(`  retry ${target.slug} (${attempt + 1}/${attempts})`)
    }
  }

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

async function readExistingJson() {
  try {
    return JSON.parse(await readFile(outJson, 'utf8'))
  } catch {
    return {}
  }
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

  // BM_ONLY=cheese,vegan re-scrapes just those slugs. Every run merges into the
  // existing JSON and never downgrades a category, so retries are always safe.
  const only = (process.env.BM_ONLY ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const out = await readExistingJson()
  const targets = only.length > 0 ? TARGETS.filter((t) => only.includes(t.slug)) : TARGETS

  const cache = new Map()
  for (const target of targets) {
    const result = await captureCategory(context, target, cache)
    // Keep a previous good capture if a re-run flakes to ≤1 item.
    if (result.items.length <= 1 && (out[result.slug]?.items?.length ?? 0) > result.items.length) {
      console.warn(`  keeping previous ${result.slug} (${out[result.slug].items.length} items)`)
      continue
    }
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
