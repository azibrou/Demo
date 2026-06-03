/**
 * Removes UI glyphs now served from @bolteu/kalep-icons-svg from figma sync manifests.
 * Run after kalep migration: node scripts/prune-figma-glyph-sync.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const GLYPH_FILES = new Set([
  '31d60d10b64243788407fd18875dd0ef.svg',
  'f8d280a83b694e7abe0b4d007a8eb7b9.svg',
  'b06015295684f55bb4a57f798dd810.svg',
  '5ca7ed033b634c9091512caef6d7ae45.svg',
  '830623b6cb9f2b5dfe67faca0a2fdd1caf8a6668.svg',
  '511560e2cd954e7cbc56b7d47b6363d19.svg',
  '7937d90c2c3644338c1a5ec88aa1d66f.svg',
  'f3af9a0d77ae49d3bc880499ec3aacda.svg',
  'dc97c89954f5afee1cee9f7cd4e8bd787c09b3bf.svg',
  '8814ba82c78345bcb7335442adc42a07.svg',
  'cd3e0e21c0234614b0758d430408afcb.svg',
  '8cc8dc4ecdaa465898608dd2ac2d753f.svg',
  'ded5bd5938034f893d8bfde49b9334be68e12aa2.svg',
  '86823908271643a8933486085d217db1.svg',
  'df5e7ae0cc8c4cd1bc1d15341264a87c.svg',
  '38192fa0ac9a465a841ddfa5ad6ca2b4.svg',
  '2c2fe8c2adab3abdcf334211f793273699a9b669.svg',
  '71463b871ee540648e5089aa345f56fe.svg',
  '2ba6fd546e8449e3986d3c2f6b626f35.svg',
  '51e82b049bbaa576344e06daaf91f62e6671733c.svg',
  '9db1af267adb43b1839804ca532fddc5.svg',
  '2901061f12234863ba241ec5a3934161.svg',
  'b88da32a312648e19465442b8187cf60.svg',
  'b2d9e757e5e0cb809658e7859be8b486c883d0de.svg',
  '31f9394eb9f14f14b22eb81377e65075.svg',
  '1bc903fbf59945b791fa1aef041a4d4c.svg',
  'ff16af5a16c543b28dd56cd8db118bb1.svg',
  '59d5ed0197514d2d86b5c58844d79dcb.svg',
  '3784193f2e214d909a2c99a0220d3665.svg',
  '662acdfc2ef8402fb26cabf338c1b8ac.svg',
  'f19388e2531e4f73a7cf6b204ed9d31b.svg',
  'f653b4db388b4d31b0fc252a00ffa5f0.svg',
  '320c5b624862421780113cf267cd5a6.svg',
  '96a6c759f80c4184808ccf7c0334c87.svg',
  'fe4b89da01494171b2c4a364af3ba54e.svg',
  '81bcfde644c843a69e819bee95558925.svg',
  '732743e7311b402c94812a4fba212b6a.svg',
  '6ab084277e6b4f8aaec46b75b34c4781.svg',
  '3008f1543b9d479488f96fe5af1a168c.svg',
  '32af85e6998a47f8a6f1dfd22a5f009f.svg',
  '502b0b9ec7774b82bf32d3091cdb907c.svg',
  '8790d5fa52c14adc82982dba36f50a19.svg',
  '0033caa53ad446fab285f22dd1ee71a2.svg',
  '0fd25b5cde9aaa4654192a000ff9ccf46d4f446c.svg',
  '31626d35a5c74848b4ed2e477663a27d.svg',
  '797e557face7bb86bb24296c09c86b781bcbd662.svg',
  '3357b3f7b465c674b69dd4af9ab2cf1792e1d80d.svg',
  '147386f6ac174a6ca592c023dfb6b1de.svg',
  'e48f54df6d1b44f79a467aea0fbcab68.svg',
  '73544b0e2da44129ab0b33a7c1f6446.svg',
  '0aef5aab283a4e2ccc8b71db776fe83235bacae1.svg',
  '746fcef064fcab5c57266f85a1d3ea4e216e6355.svg',
  '8e90a2751b5944bd92fe997b0417743e.svg',
  'ebdbbcb3ecdd4d52b269c60ebfc80ad7.svg',
  '7629068781.svg',
  '26b72e3899b14e24bfe7380dcded8db5.svg',
  '1d9cb7d6927c4759969f3c0ce62d31f4.svg',
  '50993720489642e59620d352887a5c3e.svg',
  '5eb7ad963fab4e3e9e49351cff8c268a.svg',
  'baa3b78a6cc04bd49e06df4dcaf11263.svg',
  'a66c7b9a90b9400781470d566e27185d.svg',
  '7490623732c0a3bb9e0f4bcc9705190759789821.svg',
  '74906237b0917f1540674bd2b09a09cecfd5f497.svg',
  '74906223191fdd2543acc1484db01091a9eec7d4.svg',
  '749112349bc74dcc23c243108680fa99e6996a37.svg',
  '74911234eb6983fb5dc04d3eafd7d19d412ee941.svg',
  'feee67782c1b458fbca39f0abca7c4ba.svg',
  '489dcdf80e3d484082e2961e3796d613.svg',
  'd0d29941e95542c78824262fffa9dda.svg',
  '8ae5a2d6f0774612a8f02f9ec6277174.svg',
  'b5a2b0ef79e34bcdb2181f24fb4dd968.svg',
  'e42806b8434d4ff28379e6bc00810c6d.svg',
  '91d28e75e71f4238b5e231b7c4718380.svg',
  '15e901c7f3b94cf99f9000503d88f21b.svg',
  '6b8a0517101648f38473528f4179856c.svg',
  '9b1149b5209d430b813b1f9d75ef1446.svg',
  '4dc319bcec20447a8a7325522122037a.svg',
  '16d1cc0e672140a0bb44d24db377d068.svg',
  '7a881368c0cc4d979f9a0564865ba57b.svg',
  'c4d5b42846eaa08e2a35a7aae358c92b141f371d.svg',
  'd85d41c3e7f64475779480bcbae9f755c4cea1a7.svg',
  'd1234c231381c1fec7bbdab696a29b6cde8a761e.svg',
])

function pruneFilesArray(content, label) {
  const re = /const files = \[([\s\S]*?)\]/
  const match = content.match(re)
  if (!match) throw new Error(`files array not found in ${label}`)
  const items = [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1])
  const kept = items.filter((f) => !GLYPH_FILES.has(f))
  const removed = items.length - kept.length
  const next = content.replace(
    re,
    `const files = [\n${kept.map((f) => `  '${f}',`).join('\n')}\n]`,
  )
  return { next, removed }
}

const manifestPath = path.join(root, 'scripts', 'figma-mcp-assets.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
let manifestRemoved = 0
for (const key of Object.keys(manifest)) {
  if (GLYPH_FILES.has(key)) {
    delete manifest[key]
    manifestRemoved++
  }
}
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

for (const name of ['download-figma-assets.mjs', 'seed-figma-placeholders.mjs']) {
  const filePath = path.join(root, 'scripts', name)
  const content = await readFile(filePath, 'utf8')
  const { next, removed } = pruneFilesArray(content, name)
  await writeFile(filePath, next)
  console.log(`${name}: removed ${removed} glyph entries`)
}

console.log(`figma-mcp-assets.json: removed ${manifestRemoved} glyph entries`)
