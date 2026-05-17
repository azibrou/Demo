/**
 * Downloads assets from `scripts/figma-mcp-assets.json` into `public/figma/`.
 * Use when Figma desktop MCP is unavailable or after `get_design_context` returns MCP URLs.
 *
 *   npm run figma:sync
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { syncMcpAssets } from './lib/figma-mcp-sync.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const manifestPath = path.join(__dirname, 'figma-mcp-assets.json')
const outDir = path.join(root, 'public', 'figma')

const { ok, fail, skip } = await syncMcpAssets({ manifestPath, outDir })

console.log(`\nMCP sync: ${ok} saved, ${skip} skipped, ${fail} failed → ${outDir}`)
if (fail > 0) process.exit(1)
