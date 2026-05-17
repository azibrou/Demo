import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * @param {{ manifestPath: string, outDir: string, skipUnchanged?: boolean }} opts
 * @returns {Promise<{ ok: number, fail: number, skip: number }>}
 */
export async function syncMcpAssets({ manifestPath, outDir, skipUnchanged = true }) {
  const raw = await readFile(manifestPath, 'utf8')
  const manifest = JSON.parse(raw)

  if (typeof manifest !== 'object' || manifest === null || Array.isArray(manifest)) {
    throw new Error(`${manifestPath}: expected a JSON object of filename → url`)
  }

  await mkdir(outDir, { recursive: true })

  let ok = 0
  let fail = 0
  let skip = 0

  for (const [file, url] of Object.entries(manifest)) {
    const dest = path.join(outDir, file)
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Demo/figma-asset-sync' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const buf = Buffer.from(await res.arrayBuffer())

      if (skipUnchanged) {
        try {
          const existing = await stat(dest)
          if (existing.size === buf.length) {
            console.log(`SKIP ${file} (unchanged)`)
            skip++
            continue
          }
        } catch {
          /* file missing — write */
        }
      }

      await writeFile(dest, buf)
      console.log(`OK ${file} (${buf.length}b) [mcp]`)
      ok++
    } catch (e) {
      console.error(`FAIL ${file}`, e instanceof Error ? e.message : e)
      fail++
    }
  }

  return { ok, fail, skip }
}
