/**
 * Seeds vendor/kalep-icons-svg from public/figma for local dev when GitHub Packages
 * auth is unavailable. Replace with registry install when you have read:packages + bolteu SSO:
 *   npm install @bolteu/kalep-icons-svg
 */
import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const figmaDir = path.join(root, 'public', 'figma')
const vendorDir = path.join(root, 'vendor', 'kalep-icons-svg')

/** Kalep stem → figma hash filename (UI glyphs only). */
const GLYPH_MAP = {
  search: '31d60d10b64243788407fd18875dd0ef.svg',
  clear: 'dd585efabbc4156bc12d8ac849cc398.svg',
  'search-dineout': 'f8d280a83b694e7abe0b4d007a8eb7b9.svg',
  filters: 'b06015295684f55bb4a57f798dd810.svg',
  'filters-alt': '5ca7ed033b634c9091512caef6d7ae45.svg',
  'arrow-left': '830623b6cb9f2b5dfe67faca0a2fdd1caf8a6668.svg',
  'arrow-left-store': '511560e2cd954e7cbc56b7d47b6363d19.svg',
  'arrow-left-top': '7937d90c2c3644338c1a5ec88aa1d66f.svg',
  'arrow-left-restaurant': 'f3af9a0d77ae49d3bc880499ec3aacda.svg',
  'share-ios': 'dc97c89954f5afee1cee9f7cd4e8bd787c09b3bf.svg',
  'share-ios-store': '8814ba82c78345bcb7335442adc42a07.svg',
  'share-ios-top': 'cd3e0e21c0234614b0758d430408afcb.svg',
  'share-ios-restaurant': '8cc8dc4ecdaa465898608dd2ac2d753f.svg',
  'heart-outline': 'ded5bd5938034f893d8bfde49b9334be68e12aa2.svg',
  'heart-outline-store': '86823908271643a8933486085d217db1.svg',
  'heart-outline-top': 'df5e7ae0cc8c4cd1bc1d15341264a87c.svg',
  'heart-outline-restaurant': '38192fa0ac9a465a841ddfa5ad6ca2b4.svg',
  'heart-filled': '2c2fe8c2adab3abdcf334211f793273699a9b669.svg',
  'thumb-heart-filled': '71463b871ee540648e5089aa345f56fe.svg',
  'thumb-heart-outline': '2ba6fd546e8449e3986d3c2f6b626f35.svg',
  'chevron-right': '51e82b049bbaa576344e06daaf91f62e6671733c.svg',
  'chevron-right-top': '9db1af267adb43b1839804ca532fddc5.svg',
  'chevron-down': '2901061f12234863ba241ec5a3934161.svg',
  'rating-star': 'b88da32a312648e19465442b8187cf60.svg',
  'rating-star-provider': 'b2d9e757e5e0cb809658e7859be8b486c883d0de.svg',
  'rating-star-selected': '31f9394eb9f14f14b22eb81377e65075.svg',
  'bike-delivery': '1bc903fbf59945b791fa1aef041a4d4c.svg',
  'bike-delivery-outline': 'ff16af5a16c543b28dd56cd8db118bb1.svg',
  timer: '59d5ed0197514d2d86b5c58844d79dcb.svg',
  'timer-outline': '3784193f2e214d909a2c99a0220d3665.svg',
  walk: '662acdfc2ef8402fb26cabf338c1b8ac.svg',
  'calendar-outline': 'f19388e2531e4f73a7cf6b204ed9d31b.svg',
  'calendar-filled': '15e901c7f3b94cf99f9000503d88f21b.svg',
  'offer-outline': 'f653b4db388b4d31b0fc252a00ffa5f0.svg',
  'bolt-plus-outline': '320c5b624862421780113cf267cd5a6.svg',
  'route-outline': '96a6c759f80c4184808ccf7c0334c87.svg',
  'reorder-vert': 'fe4b89da01494171b2c4a364af3ba54e.svg',
  'history-outline': '81bcfde644c843a69e819bee95558925.svg',
  'location-pin': '732743e7311b402c94812a4fba212b6a.svg',
  'user-alt-outline': '6ab084277e6b4f8aaec46b75b34c4781.svg',
  plus: '3008f1543b9d479488f96fe5af1a168c.svg',
  minus: '32af85e6998a47f8a6f1dfd22a5f009f.svg',
  basket: '502b0b9ec7774b82bf32d3091cdb907c.svg',
  'basket-wide': '8790d5fa52c14adc82982dba36f50a19.svg',
  bin: '0033caa53ad446fab285f22dd1ee71a2.svg',
  surge: '0fd25b5cde9aaa4654192a000ff9ccf46d4f446c.svg',
  'join-arrow': '31626d35a5c74848b4ed2e477663a27d.svg',
  burger: '797e557face7bb86bb24296c09c86b781bcbd662.svg',
  'list-square-outline': '3357b3f7b465c674b69dd4af9ab2cf1792e1d80d.svg',
  'tag-spicy': '147386f6ac174a6ca592c023dfb6b1de.svg',
  'nav-add': 'e48f54df6d1b44f79a467aea0fbcab68.svg',
  'nav-edit': '73544b0e2da44129ab0b33a7c1f6446.svg',
  'nav-edit-small': '0aef5aab283a4e2ccc8b71db776fe83235bacae1.svg',
  'all-chevron': '746fcef064fcab5c57266f85a1d3ea4e216e6355.svg',
  'basket-expanded': '8e90a2751b5944bd92fe997b0417743e.svg',
  'tab-home': 'ebdbbcb3ecdd4d52b269c60ebfc80ad7.svg',
  'tab-home-selected': '7629068781.svg',
  'tab-store': '26b72e3899b14e24bfe7380dcded8db5.svg',
  'tab-store-selected': '1d9cb7d6927c4759969f3c0ce62d31f4.svg',
  'tab-dineout': '50993720489642e59620d352887a5c3e.svg',
  'tab-dineout-selected': '5eb7ad963fab4e3e9e49351cff8c268a.svg',
  'tab-search': 'baa3b78a6cc04bd49e06df4dcaf11263.svg',
  'tab-search-selected': 'a66c7b9a90b9400781470d566e27185d.svg',
  'tab-categories': '7490623732c0a3bb9e0f4bcc9705190759789821.svg',
  'tab-categories-selected': '74906237b0917f1540674bd2b09a09cecfd5f497.svg',
  'tab-more': '74906223191fdd2543acc1484db01091a9eec7d4.svg',
  'tab-list': '749112349bc74dcc23c243108680fa99e6996a37.svg',
  'tab-list-selected': '74911234eb6983fb5dc04d3eafd7d19d412ee941.svg',
  'tab-venue': 'feee67782c1b458fbca39f0abca7c4ba.svg',
  'tab-venue-selected': '489dcdf80e3d484082e2961e3796d613.svg',
  'tab-isles': 'd0d29941e95542c78824262fffa9dda.svg',
  'tab-isles-selected': '8ae5a2d6f0774612a8f02f9ec6277174.svg',
  'tab-merchant-list': 'b5a2b0ef79e34bcdb2181f24fb4dd968.svg',
  'tab-merchant-list-selected': 'e42806b8434d4ff28379e6bc00810c6d.svg',
  'tab-merchant-search': '91d28e75e71f4238b5e231b7c4718380.svg',
}

await mkdir(vendorDir, { recursive: true })

let copied = 0
for (const [stem, file] of Object.entries(GLYPH_MAP)) {
  const src = path.join(figmaDir, file)
  const dest = path.join(vendorDir, `${stem}.svg`)
  try {
    await copyFile(src, dest)
    copied++
  } catch {
    console.warn(`SKIP ${stem} — missing ${file}`)
  }
}

const exports = Object.keys(GLYPH_MAP).reduce((acc, stem) => {
  acc[`./${stem}.svg`] = `./${stem}.svg`
  return acc
}, {})

await writeFile(
  path.join(vendorDir, 'package.json'),
  `${JSON.stringify(
    {
      name: '@bolteu/kalep-icons-svg',
      version: '0.0.0-vendor',
      private: true,
      description: 'Local shim — replace with GitHub Packages install when authenticated',
      type: 'module',
      exports,
    },
    null,
    2,
  )}\n`,
)

console.log(`bootstrap-kalep-icons-vendor: ${copied} icons → vendor/kalep-icons-svg`)
