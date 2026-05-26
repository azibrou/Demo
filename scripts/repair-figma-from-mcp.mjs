/**
 * Overwrites placeholder `public/figma/*` files using fresh Figma MCP asset URLs.
 * Run after accidental `figma:seed` — never run seed on a populated assets folder.
 *
 *   node scripts/repair-figma-from-mcp.mjs
 */
import { readFile, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'figma')
const manifestPath = path.join(__dirname, 'figma-mcp-assets.json')

/** local filename → Figma MCP asset URL (from get_design_context, May 2026) */
const REPAIR_MAP = {
  // Floating tab bar — 76281:68555
  'ebdbbcb3ecdd4d52b269c60ebfc80ad7.svg':
    'https://www.figma.com/api/mcp/asset/701a5854-87f6-476a-b2f1-0e2bfc2cfd1a',
  '26b72e3899b14e24bfe7380dcded8db5.svg':
    'https://www.figma.com/api/mcp/asset/2b421a35-c04c-4441-b71f-5bd86809a476',
  '50993720489642e59620d352887a5c3e.svg':
    'https://www.figma.com/api/mcp/asset/4d88b37e-0ae1-4dbc-8e76-27e773b9d573',
  'baa3b78a6cc04bd49e06df4dcaf11263.svg':
    'https://www.figma.com/api/mcp/asset/fad657e6-7b54-4630-a1a2-a55901cd83c4',

  // Restaurant TopSection — 77303:218235
  '0badf44655b34842bbd189000200e987.png':
    'https://www.figma.com/api/mcp/asset/a4c50423-874c-4e51-ac80-1b68f447e466',
  'f3af9a0d77ae49d3bc880499ec3aacda.svg':
    'https://www.figma.com/api/mcp/asset/57983132-32a2-485c-9931-8402a818ee83',
  '8cc8dc4ecdaa465898608dd2ac2d753f.svg':
    'https://www.figma.com/api/mcp/asset/b495dc76-8971-46c4-a638-ce920c193fca',
  '38192fa0ac9a465a841ddfa5ad6ca2b4.svg':
    'https://www.figma.com/api/mcp/asset/3d2020f4-c064-447c-8c2d-eb739f0e0142',
  '9db1af267adb43b1839804ca532fddc5.svg':
    'https://www.figma.com/api/mcp/asset/20939373-ef87-4197-aabd-7d711aca94b1',
  'faaa8d12959b45fb8a2b2d523d68b677.svg':
    'https://www.figma.com/api/mcp/asset/02023bf2-1c92-4c3c-8307-f59032973a3c',
  '3b0667e530e24a00b29c451d54b6213a.svg':
    'https://www.figma.com/api/mcp/asset/096923bc-181e-4be6-b970-0c5086c5eb28',
  '952e7608b96d4e2ba8c2c0886e9a0ebe.svg':
    'https://www.figma.com/api/mcp/asset/2317910f-d821-4de3-bce6-e1a0558ef67c',
  'bc216cb19e904077b8ee23bff7a4a982.svg':
    'https://www.figma.com/api/mcp/asset/ee3c1be3-ae3d-4e96-8ef2-cecbb045cf1d',
  '27e42070e94a49c6bcb7033096f39ae9.svg':
    'https://www.figma.com/api/mcp/asset/b2691855-14ef-432e-9e62-6aeadd49c2b0',

  // Store merchant header — 77237:151500
  '5823075e34d24ce5bfcd39e48e93f08f.png':
    'https://www.figma.com/api/mcp/asset/2d6dbc13-17d5-4f10-87db-27f4b8770930',
  '09efda5741964126a57455f135e5f3aa.png':
    'https://www.figma.com/api/mcp/asset/52c11ea3-6f01-4b91-87e9-d062653845eb',
  '511560e2cd954e7cbc56b7d47b6363d19.svg':
    'https://www.figma.com/api/mcp/asset/5903c842-f71a-4379-860b-c9aeed5a75d5',
  '8814ba82c78345bcb7335442adc42a07.svg':
    'https://www.figma.com/api/mcp/asset/d3c0ea5c-5201-451c-9eab-b491e7bd5f17',
  '86823908271643a8933486085d217db1.svg':
    'https://www.figma.com/api/mcp/asset/97da1824-62ee-4e05-b6a0-34fa5d59054b',
  '4db12b061c83433bb94ddec4796955cf.svg':
    'https://www.figma.com/api/mcp/asset/a7ae4f15-26ba-427f-9783-9223a5f69942',
  'aa99708eaaad4cef6e1b842bb1b0102d.svg':
    'https://www.figma.com/api/mcp/asset/4a96190e-6092-4e9c-8948-542ebe694621',
  '5e7060d2d31249a7a5e3f8fd85612057e.svg':
    'https://www.figma.com/api/mcp/asset/0396ec1f-023c-452f-9e2d-5bb47777cbee',
  '226fcf7c7aac456589bda2670331dbeb.svg':
    'https://www.figma.com/api/mcp/asset/cfe386dc-0dcf-4340-babd-ef2d92aae59d',
  'e77e98931cb8472581e48dc2fdf066ff.svg':
    'https://www.figma.com/api/mcp/asset/a070e88f-d6b5-454b-9a32-0b3e822360d9',

  // topSectionStore (shared nav icons with restaurant)
  'd11d9b710dce44df98d9b50def822d8e.png':
    'https://www.figma.com/api/mcp/asset/a4c50423-874c-4e51-ac80-1b68f447e466',
  '7937d90c2c3644338c1a5ec88aa1d66f.svg':
    'https://www.figma.com/api/mcp/asset/57983132-32a2-485c-9931-8402a818ee83',
  'cd3e0e21c0234614b0758d430408afcb.svg':
    'https://www.figma.com/api/mcp/asset/b495dc76-8971-46c4-a638-ce920c193fca',
  'df5e7ae0cc8c4cd1bc1d15341264a87c.svg':
    'https://www.figma.com/api/mcp/asset/3d2020f4-c064-447c-8c2d-eb739f0e0142',
  'adb5c008ed134052aec2c6f7c6a81e8e.svg':
    'https://www.figma.com/api/mcp/asset/02023bf2-1c92-4c3c-8307-f59032973a3c',
  '9f42788368dd45ae887eba79a6282cbb.svg':
    'https://www.figma.com/api/mcp/asset/096923bc-181e-4be6-b970-0c5086c5eb28',
  'e95da0397a1e4208bf4ba7c616c7deda.svg':
    'https://www.figma.com/api/mcp/asset/2317910f-d821-4de3-bce6-e1a0558ef67c',
  '9ddee1d7627c4c49bf78d5110af08194.svg':
    'https://www.figma.com/api/mcp/asset/ee3c1be3-ae3d-4e96-8ef2-cecbb045cf1d',
  '6472e44360444f998a84e91c3e979d0f.svg':
    'https://www.figma.com/api/mcp/asset/b2691855-14ef-432e-9e62-6aeadd49c2b0',

  // providerHeader (stores list) — shared nav/metrics icons
  '830623b6cb9f2b5dfe67faca0a2fdd1caf8a6668.svg':
    'https://www.figma.com/api/mcp/asset/5903c842-f71a-4379-860b-c9aeed5a75d5',
  'ded5bd5938034f893d8bfde49b9334be68e12aa2.svg':
    'https://www.figma.com/api/mcp/asset/97da1824-62ee-4e05-b6a0-34fa5d59054b',
  'dc97c89954f5afee1cee9f7cd4e8bd787c09b3bf.svg':
    'https://www.figma.com/api/mcp/asset/d3c0ea5c-5201-451c-9eab-b491e7bd5f17',
  'd85d41c3e7f64475779480bcbae9f755c4cea1a7.svg':
    'https://www.figma.com/api/mcp/asset/fad657e6-7b54-4630-a1a2-a55901cd83c4',
  '51e82b049bbaa576344e06daaf91f62e6671733c.svg':
    'https://www.figma.com/api/mcp/asset/20939373-ef87-4197-aabd-7d711aca94b1',
  'b2d9e757e5e0cb809658e7859be8b486c883d0de.svg':
    'https://www.figma.com/api/mcp/asset/0396ec1f-023c-452f-9e2d-5bb47777cbee',
  '7b71392494cec1622b1bd0796589f815638191de.svg':
    'https://www.figma.com/api/mcp/asset/a7ae4f15-26ba-427f-9783-9223a5f69942',
  '5411a02fe588351f4fd27269e5629d22c51b8353.svg':
    'https://www.figma.com/api/mcp/asset/4a96190e-6092-4e9c-8948-542ebe694621',
  'fdd557a01ca2b4ce6995a5fac02a2dd3137e6baa.svg':
    'https://www.figma.com/api/mcp/asset/cfe386dc-0dcf-4340-babd-ef2d92aae59d',
  '4152dd9e851645f0022ebf46f55ce17bb7936198.svg':
    'https://www.figma.com/api/mcp/asset/a070e88f-d6b5-454b-9a32-0b3e822360d9',
  'cdd5ae3658573fd29d8e72fcdd6c09cc383da495.png':
    'https://www.figma.com/api/mcp/asset/2d6dbc13-17d5-4f10-87db-27f4b8770930',
  '53b5c8dbf70c0b098d69e8552903cf885dfbc9a7.png':
    'https://www.figma.com/api/mcp/asset/52c11ea3-6f01-4b91-87e9-d062653845eb',

  // Search + home hero — 76330:70427, 76281:33163, 76281:32783
  '31d60d10b64243788407fd18875dd0ef.svg':
    'https://www.figma.com/api/mcp/asset/5dbb9fff-363d-425d-85be-65c66ee7f2d7',
  'b06015295684f55bb4a57f798dd810.svg':
    'https://www.figma.com/api/mcp/asset/2dc44b4c-e9b8-4be7-83a4-6abc5faaf0b6',
  '16d1cc0e672140a0bb44d24db377d068.svg':
    'https://www.figma.com/api/mcp/asset/f0ee2b08-d4db-4acb-9a74-89121b7f079a',
  '7a881368c0cc4d979f9a0564865ba57b.svg':
    'https://www.figma.com/api/mcp/asset/cabf0497-bc4a-4cbb-b86e-116fee69d26d',
  '768a268423a94f5da23949750be3f8c1.png':
    'https://www.figma.com/api/mcp/asset/8eca4e84-b095-4be6-aa13-0e6616ecad7a',
  '31626d35a5c74848b4ed2e477663a27d.svg':
    'https://www.figma.com/api/mcp/asset/4cfe1f98-9a2d-4562-8177-1b3a78eb82b6',
  '113b2838bc37438abe35e08b2e29fe7f.png':
    'https://www.figma.com/api/mcp/asset/8eca4e84-b095-4be6-aa13-0e6616ecad7a',
  '732743e7311b402c94812a4fba212b6a.svg':
    'https://www.figma.com/api/mcp/asset/bfe98afc-1fd0-459d-855b-86478fde2938',

  // CardDivider — 77857:92979
  '7141b9d1a8f340223fc6796ab0319a0127f687c2.svg':
    'http://localhost:3845/assets/7141b9d1a8f340223fc6796ab0319a0127f687c2.svg',
  '3611b87fe23b8a63aa1ee11492fac91d197e5b4e.svg':
    'http://localhost:3845/assets/3611b87fe23b8a63aa1ee11492fac91d197e5b4e.svg',

  // BannerCarousel — 77842:552848, 77842:552851 (Figma desktop MCP hash filenames)
  'c330424f7c1c84c9765587f0221b9093abbeaade.png':
    'http://localhost:3845/assets/c330424f7c1c84c9765587f0221b9093abbeaade.png',
  'c7a3f4fdcce2c176e2aa7d0b620d3276fdf97edc.png':
    'http://localhost:3845/assets/c7a3f4fdcce2c176e2aa7d0b620d3276fdf97edc.png',

  // ThumbnailM — 76330:71602
  '1bc903fbf59945b791fa1aef041a4d4c.svg':
    'https://www.figma.com/api/mcp/asset/37fab39a-4b2c-437f-89df-0d737f75200c',
  '59d5ed0197514d2d86b5c58844d79dcb.svg':
    'https://www.figma.com/api/mcp/asset/bb877ea2-e2f5-4ec1-8df1-9295afb309f3',
  'b88da32a312648e19465442b8187cf60.svg':
    'https://www.figma.com/api/mcp/asset/53a02469-2b3a-453a-9ad6-edce76fd30a8',
  '05b798f7b7b54b0ba7c381acd6b9a505.svg':
    'https://www.figma.com/api/mcp/asset/06cfe14a-b115-4ee3-a385-972520319c7a',
  '2c2fe8c2adab3abdcf334211f793273699a9b669.svg':
    'http://localhost:3845/assets/2c2fe8c2adab3abdcf334211f793273699a9b669.svg',

  // Merchant tab bar — 77237:148679 area (reuse floating icons where matched)
  '77ac5126f0174e76be05f139bbc45051.svg':
    'https://www.figma.com/api/mcp/asset/5903c842-f71a-4379-860b-c9aeed5a75d5',
  'f986f75e0f8d4936b32ad3da4485f464.svg':
    'https://www.figma.com/api/mcp/asset/fad657e6-7b54-4630-a1a2-a55901cd83c4',
  '91d28e75e71f4238b5e231b7c4718380.svg':
    'https://www.figma.com/api/mcp/asset/fad657e6-7b54-4630-a1a2-a55901cd83c4',
}

async function download(file, url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Demo/repair-figma-from-mcp' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length <= 100) throw new Error(`too small (${buf.length}b)`)
  const dest = path.join(outDir, file)
  await writeFile(dest, buf)
  return buf.length
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
let ok = 0
let fail = 0

for (const [file, url] of Object.entries(REPAIR_MAP)) {
  try {
    const before = (await stat(path.join(outDir, file))).size
    const after = await download(file, url)
    manifest[file] = url
    console.log(`OK ${file} ${before}b → ${after}b`)
    ok++
  } catch (e) {
    console.error(`FAIL ${file}`, e.message)
    fail++
  }
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`\nRepaired ${ok}, failed ${fail}. Updated ${manifestPath}`)