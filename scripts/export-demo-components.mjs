/**
 * Export Demo UI library to ../demo-components (sibling git repo).
 * Usage: npm run components:export [-- --out /path/to/demo-components]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEMO_ROOT = path.resolve(__dirname, '..')
const OUT =
  process.argv.includes('--out')
    ? path.resolve(process.argv[process.argv.indexOf('--out') + 1])
    : path.resolve(DEMO_ROOT, '../demo-components')

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'css-manifest.json'), 'utf8'))

const EXCLUDE_COMPONENTS = new Set(['HomeShoppingStackLayout', 'Layout', 'AppNav'])
let COMPONENT_NAMES = new Set(
  manifest.entries.filter((e) => e.kind === 'component').map((e) => e.name),
)

const EXAMPLE_ENTRIES = new Set([
  'FloatingTabBar',
  'MerchantFTabBar',
  'CarouselGridItem',
  'BasketFab',
  'HomeHeroBlock',
  'HomeRetailBlock',
])

function kebab(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest))
  fs.copyFileSync(src, dest)
}

function writeFile(dest, content) {
  ensureDir(path.dirname(dest))
  fs.writeFileSync(dest, content)
}

function rewriteImports(content, fileRel) {
  let s = content
  const relFromSrc = fileRel.startsWith('src/') ? fileRel.slice(4) : fileRel
  const segments = relFromSrc.split('/').filter(Boolean)
  const depth = segments.length - 1
  const up = '../'.repeat(depth)

  const rewriteRoot = (root) => {
    const re = new RegExp(`from (['"])(\\.\\./)+${root}/([^'"]+)\\1`, 'g')
    s = s.replace(re, (_m, q, _dots, tail) => {
      const withoutExt = tail.replace(/\.tsx?$/, '')
      if (root === 'components' && COMPONENT_NAMES.has(withoutExt)) {
        return `from ${q}${up}${root}/${withoutExt}/${withoutExt}${q}`
      }
      if (root === 'blocks') {
        const blockPath = findBlockImportPath(withoutExt)
        if (blockPath) return `from ${q}${up}${blockPath}${q}`
      }
      return `from ${q}${up}${root}/${tail}${q}`
    })
    s = s.replace(
      new RegExp(`from (['"])${root}/([^'"]+)\\1`, 'g'),
      (_m, q, tail) => `from ${q}${up}${root}/${tail}${q}`,
    )
  }

  for (const root of ['components', 'blocks', 'hooks', 'lib', 'context', 'config']) {
    rewriteRoot(root)
  }

  s = s.replace(/from ['"]\.\.\/sections\//g, `from '${up}blocks/`)
  s = s.replace(/from ['"]\.\.\/\.\.\/sections\//g, `from '${up}blocks/`)

  s = s.replace(
    /import\.meta\.env\.BASE_URL/g,
    "(typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) ? import.meta.env.BASE_URL : '/'",
  )

  // DOM setTimeout ids are numbers; avoid NodeJS.Timeout from mixed @types
  s = s.replace(/useRef<ReturnType<typeof setTimeout>\[\]>/g, 'useRef<number[]>')

  return s
}

function findBlockImportPath(name) {
  for (const sub of ['home', 'stores', 'blocks']) {
    const p = `blocks/${sub}/${name}/${name}`
    if (fs.existsSync(path.join(OUT, 'src', p + '.tsx'))) return p
  }
  return null
}

function exportTsFile(srcAbs, destAbs, fileRel) {
  const content = fs.readFileSync(srcAbs, 'utf8')
  writeFile(destAbs, rewriteImports(content, fileRel))
}

function collectFigmaFiles() {
  const text = fs.readFileSync(path.join(DEMO_ROOT, 'src/lib/figmaDesignAssets.ts'), 'utf8')
  const re = /figma\(['"]([^'"]+)['"]\)/g
  /** @type {Set<string>} */
  const files = new Set()
  let match
  while ((match = re.exec(text)) !== null) files.add(match[1])
  return files
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return
  ensureDir(dest)
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name)
    const d = path.join(dest, ent.name)
    if (ent.isDirectory()) copyDirRecursive(s, d)
    else copyFile(s, d)
  }
}

console.log(`export-demo-components → ${OUT}`)

ensureDir(OUT)

execSync(`node "${path.join(__dirname, 'extract-css.mjs')}" --out "${OUT}"`, {
  stdio: 'inherit',
  cwd: DEMO_ROOT,
})

const kalepSrc = path.join(DEMO_ROOT, 'src/css/kalep')
const kalepDest = path.join(OUT, 'foundation/tokens')
for (const f of ['colors-and-type.css', 'kalep-extensions.css', 'kalep-tailwind-theme.css']) {
  copyFile(path.join(kalepSrc, f), path.join(kalepDest, f))
}

for (const sub of ['lib', 'hooks', 'context']) {
  const srcDir = path.join(DEMO_ROOT, 'src', sub)
  if (!fs.existsSync(srcDir)) continue
  for (const file of fs.readdirSync(srcDir)) {
    if (!/\.tsx?$/.test(file)) continue
    const rel = `src/${sub}/${file}`
    exportTsFile(path.join(srcDir, file), path.join(OUT, rel), rel)
  }
}

if (fs.existsSync(path.join(DEMO_ROOT, 'src/assets'))) {
  copyDirRecursive(path.join(DEMO_ROOT, 'src/assets'), path.join(OUT, 'src/assets'))
}

const componentsSrc = path.join(DEMO_ROOT, 'src/components')
for (const file of fs.readdirSync(componentsSrc)) {
  if (!file.endsWith('.tsx')) continue
  const name = file.replace(/\.tsx$/, '')
  if (EXCLUDE_COMPONENTS.has(name)) continue
  const entry = manifest.entries.find((e) => e.name === name && e.kind === 'component')
  const folder = path.join(OUT, 'src/components', name)
  const rel = `src/components/${name}/${name}.tsx`
  exportTsFile(path.join(componentsSrc, file), path.join(folder, `${name}.tsx`), rel)
  writeEntryStyles(name, 'component', folder)
}

const sectionsSrc = path.join(DEMO_ROOT, 'src/sections')
function walkSections(dir, prefix = '') {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${ent.name}` : ent.name
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      walkSections(full, rel)
      continue
    }
    if (!ent.name.endsWith('.tsx') || ent.name === 'index.ts') continue
    const name = ent.name.replace(/\.tsx$/, '')
    const entry = manifest.entries.find((e) => e.name === name)
    if (!entry) continue
    const blockFolder = rel.replace(/\.tsx$/, '')
    const folder = path.join(OUT, 'src/blocks', blockFolder)
    const fileRel = `src/blocks/${blockFolder}/${name}.tsx`
    exportTsFile(full, path.join(folder, `${name}.tsx`), fileRel)
    writeEntryStyles(name, entry.kind, folder)
  }
}
walkSections(sectionsSrc)

for (const sub of ['home', 'stores', 'blocks']) {
  const idx = path.join(sectionsSrc, sub, 'index.ts')
  if (fs.existsSync(idx)) {
    const rel = `src/blocks/${sub}/index.ts`
    exportTsFile(idx, path.join(OUT, rel), rel)
  }
}
const rootIdx = path.join(sectionsSrc, 'index.ts')
if (fs.existsSync(rootIdx)) {
  exportTsFile(rootIdx, path.join(OUT, 'src/blocks/index.ts'), 'src/blocks/index.ts')
}

const figmaFiles = collectFigmaFiles()
const figmaOut = path.join(OUT, 'public/figma')
let missingAssets = 0
for (const f of figmaFiles) {
  const src = path.join(DEMO_ROOT, 'public/figma', f)
  if (!fs.existsSync(src)) {
    console.warn(`missing figma asset: ${f}`)
    missingAssets++
    continue
  }
  copyFile(src, path.join(figmaOut, f))
}

copyDirRecursive(path.join(DEMO_ROOT, 'public/bolt'), path.join(OUT, 'public/bolt'))

writeFile(
  path.join(OUT, 'src/providers/DemoProviders.tsx'),
  `import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { BasketFabProvider } from '../context/BasketFabContext'

/** Wrap previews/examples that use BasketFab, ShortcutItem links, or BasketFab navigation. */
export function DemoProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <BasketFabProvider>{children}</BasketFabProvider>
    </BrowserRouter>
  )
}
`,
)

function writeEntryStyles(name, kind, folder) {
  const sub = kind === 'block' ? 'blocks' : 'components'
  const css = `@import '../../../foundation/styles/foundation.css';
@import '../../../foundation/styles/${sub}/${kebab(name)}.css';
`
  writeFile(path.join(folder, 'styles.css'), css)
}

function buildCatalog() {
  let gitSha = ''
  try {
    gitSha = execSync('git rev-parse --short HEAD', { cwd: DEMO_ROOT, encoding: 'utf8' }).trim()
  } catch {
    gitSha = 'unknown'
  }

  const entries = manifest.entries.map((e) => {
    const sub = e.kind === 'block' ? 'blocks' : 'components'
    const folder = e.kind === 'block' ? findBlockFolder(e.name) : `src/components/${e.name}`
    return {
      name: e.name,
      kind: e.kind,
      export: e.export ?? e.name,
      path: `${folder}/${e.name}.tsx`,
      styles: [
        'foundation/styles/index.css',
        `foundation/styles/foundation.css`,
        `foundation/styles/${sub}/${kebab(e.name)}.css`,
      ],
      stylesLocal: 'styles.css',
      figma: e.figma ?? [],
      dependsOn: e.dependsOn ?? [],
      contentAssets: e.contentAssets ?? [],
      summary: e.summary ?? '',
    }
  })

  return {
    $schema: './catalog.schema.json',
    source: { repo: 'Demo', path: DEMO_ROOT, gitSha, exportedAt: new Date().toISOString() },
    entries: entries.sort((a, b) => a.name.localeCompare(b.name)),
  }
}

function findBlockFolder(name) {
  for (const sub of ['home', 'stores', 'blocks']) {
    const p = path.join(OUT, 'src/blocks', sub, name)
    if (fs.existsSync(path.join(p, `${name}.tsx`))) return `src/blocks/${sub}/${name}`
  }
  return `src/blocks/${name}`
}

const catalog = buildCatalog()
writeFile(path.join(OUT, 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n')

writeFile(
  path.join(OUT, 'catalog.schema.json'),
  JSON.stringify(
    {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      required: ['entries', 'source'],
      properties: {
        source: { type: 'object' },
        entries: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'kind', 'export', 'path'],
          },
        },
      },
    },
    null,
    2,
  ) + '\n',
)

for (const entry of catalog.entries) {
  writeEntryReadme(entry)
  maybeWriteExample(entry)
}

const componentNames = [...COMPONENT_NAMES]
fixPeerComponentImports(componentNames)
fixBlockSiblingImports()
fixBlockBarrelExports()
writeComponentsBarrel(componentNames)

writeScaffoldFiles(catalog, missingAssets)

console.log(`export complete: ${catalog.entries.length} entries, ${missingAssets} missing figma assets`)

function fixPeerComponentImports(names) {
  const set = new Set(names)
  for (const name of names) {
    const file = path.join(OUT, 'src/components', name, `${name}.tsx`)
    if (!fs.existsSync(file)) continue
    let s = fs.readFileSync(file, 'utf8')
    for (const other of set) {
      if (other === name) continue
      s = s.replaceAll(`from './${other}'`, `from '../${other}/${other}'`)
      s = s.replaceAll(`from "./${other}"`, `from "../${other}/${other}"`)
    }
    fs.writeFileSync(file, s)
  }
}

function writeComponentsBarrel(names) {
  const lines = names.map((n) => `export * from './${n}/${n}'`)
  writeFile(path.join(OUT, 'src/components/index.ts'), `${lines.join('\n')}\n`)
}

function fixBlockSiblingImports() {
  const blocksRoot = path.join(OUT, 'src/blocks')
  function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name)
      if (!ent.isDirectory()) continue
      const file = path.join(full, `${ent.name}.tsx`)
      if (fs.existsSync(file)) {
        const categoryDir = path.dirname(path.dirname(file))
        let s = fs.readFileSync(file, 'utf8')
        s = s.replace(/from '\.\/([^']+)'/g, (match, seg) => {
          const sibling = path.join(categoryDir, seg, `${seg}.tsx`)
          if (fs.existsSync(sibling)) return `from '../${seg}/${seg}'`
          return match
        })
        fs.writeFileSync(file, s)
      }
      walk(full)
    }
  }
  if (fs.existsSync(blocksRoot)) walk(blocksRoot)
}

function fixBlockBarrelExports() {
  const blocksRoot = path.join(OUT, 'src/blocks')
  function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name)
      if (ent.isDirectory()) walk(full)
      else if (ent.name === 'index.ts') {
        let s = fs.readFileSync(full, 'utf8')
        s = s.replace(/from '\.\/([^']+)'/g, (match, seg) => {
          if (seg.includes('/')) {
            const leaf = seg.split('/').pop()
            const nested = path.join(path.dirname(full), seg, `${leaf}.tsx`)
            if (fs.existsSync(nested)) return `from './${seg}/${leaf}'`
            return match
          }
          const tsx = path.join(path.dirname(full), seg, `${seg}.tsx`)
          if (fs.existsSync(tsx)) return `from './${seg}/${seg}'`
          return match
        })
        fs.writeFileSync(full, s)
      }
    }
  }
  if (fs.existsSync(blocksRoot)) walk(blocksRoot)
}

function writeEntryReadme(entry) {
  const dir = path.join(OUT, path.dirname(entry.path))
  const deps =
    entry.dependsOn.length > 0
      ? entry.dependsOn.map((d) => `- \`${d}\``).join('\n')
      : '- _(none)_'
  const figma =
    entry.figma.length > 0 ? entry.figma.map((id) => `- Figma \`${id}\``).join('\n') : '- _(none)_'

  writeFile(
    path.join(dir, 'README.md'),
    `# ${entry.name}

${entry.summary}

- **Kind:** ${entry.kind}
- **Export:** \`${entry.export}\`
- **Module:** [\`${entry.name}.tsx\`](./${entry.name}.tsx)

## Styles

Import once per app (full library):

\`\`\`css
@import '../../foundation/styles/index.css';
\`\`\`

Or this entry only:

\`\`\`css
@import './styles.css';
\`\`\`

## Dependencies

${deps}

## Figma

${figma}

${entry.contentAssets.length ? `## Content assets\n\nRequires: ${entry.contentAssets.join(', ')} (copied under \`public/\`).\n` : ''}
`,
  )
}

function maybeWriteExample(entry) {
  if (!EXAMPLE_ENTRIES.has(entry.name)) return
  const importPath = `../${path.dirname(entry.path)}/${entry.export}`
  const needsProviders = [
    'FloatingTabBar',
    'MerchantFTabBar',
    'CarouselGridItem',
    'BasketFab',
    'HomeRetailBlock',
  ].includes(entry.name)

  const body = needsProviders
    ? `import { ${entry.export} } from '${importPath}'
import { DemoProviders } from '../providers/DemoProviders'
import '../../foundation/styles/index.css'

export function Example() {
  return (
    <DemoProviders>
      <${entry.export} />
    </DemoProviders>
  )
}
`
    : `import { ${entry.export} } from '${importPath}'
import '../../foundation/styles/index.css'

export function Example() {
  return <${entry.export} />
}
`

  writeFile(path.join(OUT, 'examples', `${entry.name}.example.tsx`), body)
}

function writeScaffoldFiles(catalog, missingAssets) {
  writeFile(
    path.join(OUT, 'README.md'),
    `# demo-components

Portable **Bolt Food / Kalep** UI reference extracted from the [Demo](../Demo) app.

Use this repo as context for **Claude Code** or **Claude Design**: attach \`CLAUDE.md\`, \`catalog.json\`, and individual component \`README.md\` files.

## Quick start

1. Attach this folder to your Claude project (or add as a git submodule).
2. Read [\`CLAUDE.md\`](./CLAUDE.md) for conventions (**component** vs **block**, tokens, assets).
3. Pick an entry from [\`catalog.json\`](./catalog.json) and import its styles before rendering.

## Refresh from Demo

\`\`\`bash
cd ../Demo
npm run components:export
\`\`\`

Source commit at last export: \`${catalog.source.gitSha}\` (${catalog.source.exportedAt})

## Layout

| Path | Purpose |
|------|---------|
| \`src/components/\` | Leaf UI (FAB, pills, thumbnails, tab bar) |
| \`src/blocks/\` | Page sections (\`*Block\` naming) |
| \`foundation/tokens/\` | Kalep design tokens (do not edit \`colors-and-type.css\`) |
| \`foundation/styles/\` | Split CSS from Demo + \`demo-full.css\` fallback |
| \`public/figma/\` | Local Figma MCP assets |
| \`public/bolt/\` | Sample content images for blocks |
| \`examples/\` | Minimal usage snippets |

${missingAssets > 0 ? `\n> Warning: ${missingAssets} Figma asset(s) missing — run \`npm run figma:sync\` in Demo and re-export.\n` : ''}
`,
  )

  const indexLines = catalog.entries
    .map((e) => `- [\`${e.name}\`](./${path.dirname(e.path)}/README.md) — ${e.summary}`)
    .join('\n')

  writeFile(
    path.join(OUT, 'CLAUDE.md'),
    `# demo-components — agent guide

## What this repo is

- **components** (\`src/components/\`): small reusable UI (FAB, tab bar, carousel tile, thumbnails).
- **blocks** (\`src/blocks/\`): full-width page sections composed from components (\`HomeHeroBlock\`, \`HomeRetailBlock\`, etc.).
- **foundation**: Kalep tokens + CSS. Prefer semantic tokens (\`var(--color-content-primary)\`) and \`bolt-font-*\` classes.

## Before implementing UI

1. Open [\`catalog.json\`](./catalog.json) and find the closest entry.
2. Read that entry's \`README.md\` and import \`styles.css\` or \`foundation/styles/index.css\`.
3. Never use remote Figma URLs in code — assets live under \`public/figma/\`.
4. Wrap router/basket-dependent UI in \`DemoProviders\` (see \`examples/\`).

## Import order (CSS)

\`\`\`css
@import './foundation/styles/index.css';
\`\`\`

## Component index

${indexLines}

## Token rules

- Canonical tokens: \`foundation/tokens/colors-and-type.css\` — **do not edit**.
- Project extensions: \`foundation/tokens/kalep-extensions.css\`.
- Tailwind theme: \`foundation/tokens/kalep-tailwind-theme.css\`.
`,
  )

  const pkgPath = path.join(OUT, 'package.json')
  const pkgBase = {
    name: 'demo-components',
    private: true,
    version: '0.1.0',
    type: 'module',
    description: 'Bolt Food Demo UI reference library for Claude / design-to-code',
    scripts: {
      export: 'node ../Demo/scripts/export-demo-components.mjs --out .',
      preview: 'vite --config preview/vite.config.ts',
      typecheck: 'tsc -p tsconfig.json',
    },
    devDependencies: {
      '@types/react': '^19.2.14',
      '@types/react-dom': '^19.2.3',
      '@vitejs/plugin-react': '^6.0.1',
      react: '^19.2.5',
      'react-dom': '^19.2.5',
      'react-router-dom': '^7.14.1',
      typescript: '~6.0.2',
      vite: '^8.0.9',
    },
    peerDependencies: {
      react: '>=18',
      'react-dom': '>=18',
      'react-router-dom': '>=6',
    },
  }
  if (fs.existsSync(pkgPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      pkgBase.scripts = { ...pkgBase.scripts, ...existing.scripts }
      pkgBase.devDependencies = { ...pkgBase.devDependencies, ...existing.devDependencies }
    } catch {
      /* use base */
    }
  }
  writeFile(pkgPath, JSON.stringify(pkgBase, null, 2) + '\n')

  writeFile(
    path.join(OUT, '.gitignore'),
    `node_modules/
.DS_Store
dist/
`,
  )

  writeFile(
    path.join(OUT, 'src/vite-env.d.ts'),
    `/// <reference types="vite/client" />

declare module '*.svg?url' {
  const url: string
  export default url
}
`,
  )

  writeFile(
    path.join(OUT, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          moduleResolution: 'bundler',
          jsx: 'react-jsx',
          strict: true,
          types: ['vite/client'],
          skipLibCheck: true,
          noEmit: true,
          isolatedModules: true,
          resolveJsonModule: true,
          allowImportingTsExtensions: true,
        },
        include: ['src/**/*', 'preview/**/*'],
        exclude: ['examples/**/*'],
      },
      null,
      2,
    ) + '\n',
  )

  writeFile(
    path.join(OUT, 'scripts/sync-from-demo.mjs'),
    `#!/usr/bin/env node
/** Re-export from Demo — run \`npm run components:export\` in the Demo repo. */
import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const demo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../Demo')
execSync('npm run components:export', { cwd: demo, stdio: 'inherit' })
`,
  )
}
