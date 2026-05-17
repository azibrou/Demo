/**
 * After `vite build`: verify GitHub Pages output and add SPA fallback.
 */
import { copyFileSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const indexPath = path.join(root, 'dist', 'index.html')
const html = readFileSync(indexPath, 'utf8')

if (html.includes('/src/main.tsx')) {
  console.error('pages-postbuild: dist/index.html still references /src/main.tsx (dev entry).')
  process.exit(1)
}

if (!html.includes('/Demo/assets/')) {
  console.error('pages-postbuild: dist/index.html must reference /Demo/assets/ for project site Demo.')
  process.exit(1)
}

copyFileSync(indexPath, path.join(root, 'dist', '404.html'))
console.log('pages-postbuild: OK — production index + 404.html for GitHub Pages')
