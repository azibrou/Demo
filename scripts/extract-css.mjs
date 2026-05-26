/**
 * Split Demo styles.css into foundation + per-entry slices (css-manifest.json).
 * Usage: node scripts/extract-css.mjs [--out ../demo-components]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEMO_ROOT = path.resolve(__dirname, '..')
const OUT =
  process.argv.includes('--out')
    ? path.resolve(process.argv[process.argv.indexOf('--out') + 1])
    : path.resolve(DEMO_ROOT, '../demo-components')

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'css-manifest.json'), 'utf8'))
const stylesPath = path.join(DEMO_ROOT, 'src/css/styles.css')
const raw = fs.readFileSync(stylesPath, 'utf8')

const outStyles = path.join(OUT, 'foundation/styles')
const outComponents = path.join(outStyles, 'components')
const outBlocks = path.join(outStyles, 'blocks')
for (const d of [outStyles, outComponents, outBlocks]) {
  fs.mkdirSync(d, { recursive: true })
}

/** @type {string[]} */
const preamble = []
const importRe = /^@import\s+[^;]+;\s*$/gm
let m
while ((m = importRe.exec(raw)) !== null) preamble.push(m[0])

const themeMatch = raw.match(/@theme\s*\{[\s\S]*?\n\}/)
if (themeMatch) preamble.push(themeMatch[0])

const keyframesGlobal = []
const kfRe = /@keyframes\s+([\w-]+)\s*\{[\s\S]*?\n\}/g
while ((m = kfRe.exec(raw)) !== null) {
  keyframesGlobal.push({ name: m[1], text: m[0] })
}

const layerMatch = raw.match(/@layer components\s*\{([\s\S]*)\}\s*(?:@source|$)/)
const layerBody = layerMatch ? layerMatch[1] : ''

/** Split layer into top-level rules (brace-aware). */
function splitRules(css) {
  /** @type {string[]} */
  const rules = []
  let depth = 0
  let start = 0
  for (let i = 0; i < css.length; i++) {
    const ch = css[i]
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) {
        const chunk = css.slice(start, i + 1).trim()
        if (chunk) rules.push(chunk)
        start = i + 1
      }
    }
  }
  return rules
}

const rules = splitRules(layerBody)

function ruleMatchesPrefixes(rule, prefixes) {
  if (!prefixes?.length) return false
  return prefixes.some((p) => {
    const re = new RegExp(`\\.${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\s_:\\[,>+~]|$)`)
    return re.test(rule)
  })
}

function ruleMatchesKeyframeName(rule, names) {
  if (!names?.length) return false
  return names.some((n) => rule.includes(`@keyframes ${n}`))
}

const foundationPrefixes = new Set(manifest.foundation?.prefixes ?? [])
const foundationKeyframes = new Set(manifest.foundation?.keyframes ?? [])

/** @type {Map<string, Set<string>>} */
const entryRules = new Map()
for (const entry of manifest.entries) {
  entryRules.set(entry.name, new Set())
}

/** @type {Set<string>} */
const assigned = new Set()

for (const rule of rules) {
  let matched = false
  for (const entry of manifest.entries) {
    const prefixes = entry.prefixes ?? []
    const kfs = entry.keyframes ?? []
    if (ruleMatchesPrefixes(rule, prefixes) || ruleMatchesKeyframeName(rule, kfs)) {
      entryRules.get(entry.name).add(rule)
      matched = true
    }
  }
  if (
    !matched &&
    (ruleMatchesPrefixes(rule, [...foundationPrefixes]) ||
      ruleMatchesKeyframeName(rule, [...foundationKeyframes]))
  ) {
    if (!entryRules.has('__foundation__')) entryRules.set('__foundation__', new Set())
    entryRules.get('__foundation__').add(rule)
    matched = true
  }
  if (matched) assigned.add(rule)
}

const unassigned = rules.filter((r) => !assigned.has(r))
if (unassigned.length) {
  if (!entryRules.has('__foundation__')) entryRules.set('__foundation__', new Set())
  for (const r of unassigned) entryRules.get('__foundation__').add(r)
}

function writeSlice(filePath, ruleSet, extraKeyframes = []) {
  const parts = [...ruleSet]
  const kfNames = new Set(extraKeyframes)
  for (const kf of keyframesGlobal) {
    if (kfNames.has(kf.name)) parts.push(kf.text)
  }
  const body = parts.length ? `@layer components {\n${parts.join('\n\n')}\n}\n` : ''
  fs.writeFileSync(filePath, body)
}

const foundationSet = entryRules.get('__foundation__') ?? new Set()
writeSlice(
  path.join(outStyles, 'foundation.css'),
  foundationSet,
  manifest.foundation?.keyframes ?? [],
)

for (const entry of manifest.entries) {
  const set = entryRules.get(entry.name) ?? new Set()
  const dir = entry.kind === 'block' ? outBlocks : outComponents
  const file = path.join(dir, `${kebab(entry.name)}.css`)
  writeSlice(file, set, entry.keyframes ?? [])
}

function kebab(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

const tokenImports = `@import '../tokens/colors-and-type.css';
@import '../tokens/kalep-extensions.css';
@import '../tokens/kalep-tailwind-theme.css';
`

const indexLines = [
  '/* Auto-generated — run `npm run components:export` in Demo */',
  tokenImports,
  "@import './demo-full.css';",
  "@import './foundation.css';",
  ...manifest.entries.map((e) => {
    const sub = e.kind === 'block' ? 'blocks' : 'components'
    return `@import './${sub}/${kebab(e.name)}.css';`
  }),
]
fs.writeFileSync(path.join(outStyles, 'index.css'), indexLines.join('\n') + '\n')

fs.copyFileSync(stylesPath, path.join(outStyles, 'demo-full.css'))

console.log(`extract-css: wrote ${manifest.entries.length} slices + foundation to ${outStyles}`)
