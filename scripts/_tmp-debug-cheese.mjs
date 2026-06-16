import { chromium } from 'playwright'

const PROVIDER_URL =
  'https://food.bolt.eu/en/1-tallinn/p/28032-bolt-market-toompuiestee/?shouldRefreshMenu=false'

function asString(v) { if (v == null) return ''; if (typeof v === 'string') return v; if (typeof v === 'object' && typeof v.value === 'string') return v.value; return '' }
function normTitle(v) { return v.replace(/^[^\p{L}]+/u, '').toLowerCase().replace(/\s+/g, ' ').trim() }
function menuDishCount(d) { if (!d || typeof d.items !== 'object' || d.root_id == null) return 0; return Object.values(d.items).filter((n) => n?.type === 'dish').length }
function collectDishesUnder(items, node) { const out = []; const visit = (n) => { if (!n) return; if (n.type === 'dish') return out.push(n); for (const id of n.child_ids ?? []) visit(items[id]) }; for (const id of node.child_ids ?? []) visit(items[id]); return out }
function findCategoryDishes(d, title) { const items = d?.items; if (!items || typeof items !== 'object') return []; const wanted = normTitle(title); let best = []; for (const node of Object.values(items)) { if (node.type !== 'category' || !Array.isArray(node.child_ids)) continue; if (normTitle(asString(node.name)) !== wanted) continue; const dishes = collectDishesUnder(items, node); if (dishes.length > best.length) best = dishes } return best }

async function run(title) {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ locale: 'en-US', geolocation: { latitude: 59.437, longitude: 24.753 }, permissions: ['geolocation'] })
  const page = await context.newPage()
  const jsons = []
  page.on('response', async (r) => { if (!(r.headers()['content-type'] ?? '').includes('application/json')) return; try { jsons.push(await r.json()) } catch { /* */ } })
  await page.goto(PROVIDER_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  for (let i = 0; i < 24; i++) { await page.waitForTimeout(500); if (jsons.some((b) => menuDishCount(b?.data ?? b) > 0)) break }
  const re = new RegExp(`${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i')
  const li = page.locator('li.provider-menu-category', { has: page.locator('h2.provider-menu-category-title', { hasText: re }) }).first()
  const dishCard = li.locator('li.provider-menu-dish').first()
  try {
    await dishCard.scrollIntoViewIfNeeded({ timeout: 10000 })
    await dishCard.click({ timeout: 10000 })
  } catch (e) { console.log(`[${title}] click err`, e.message.split('\n')[0]) }
  let got = 0
  for (let i = 0; i < 30; i++) { await page.waitForTimeout(600); await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight)).catch(() => {}); got = Math.max(0, ...jsons.map((b) => findCategoryDishes(b?.data ?? b, title).length)); if (got > 1) break }
  console.log(`[${title}] dishes=${got} url=${page.url().slice(40, 100)}`)
  await browser.close()
}
await run('Meat & Fish')
await run('Cheese')
