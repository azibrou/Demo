/**
 * Local copies of design assets under `public/figma/` (hash filenames from Figma MCP).
 *
 * After adding entries here, also update:
 * - `scripts/download-figma-assets.mjs` (`files` array)
 * - `scripts/seed-figma-placeholders.mjs` (`files` array)
 * - `scripts/figma-mcp-assets.json` (filename → MCP asset URL from `get_design_context`)
 *
 * Refresh binaries:
 * - `npm run figma:assets` — Figma desktop MCP + MCP manifest
 * - `npm run figma:sync` — MCP manifest only (no desktop required)
 * - `npm run figma:seed` — minimal placeholders for offline dev
 *
 * Never use `figma.com/api/mcp/asset` or `localhost:3845` URLs in components; use `figma()` only.
 */
function figma(file: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}figma/${file}`
}

export const design = {
  /** Figma 76330:68863 — basket FAB icon (white on green FAB). */
  basketFab: {
    basket: figma('502b0b9ec7774b82bf32d3091cdb907c.svg'),
  },
  /** Node 70408:1768062 — Consumer ProviderHeader (Figma) */
  providerHeader: {
    hero: figma('cdd5ae3658573fd29d8e72fcdd6c09cc383da495.png'),
    logo: figma('53b5c8dbf70c0b098d69e8552903cf885dfbc9a7.png'),
    arrowLeft: figma('830623b6cb9f2b5dfe67faca0a2fdd1caf8a6668.svg'),
    heartOutline: figma('ded5bd5938034f893d8bfde49b9334be68e12aa2.svg'),
    shareIos: figma('dc97c89954f5afee1cee9f7cd4e8bd787c09b3bf.svg'),
    search: figma('d85d41c3e7f64475779480bcbae9f755c4cea1a7.svg'),
    chevronRight: figma('51e82b049bbaa576344e06daaf91f62e6671733c.svg'),
    ratingStar: figma('b2d9e757e5e0cb809658e7859be8b486c883d0de.svg'),
    divider: figma('7b71392494cec1622b1bd0796589f815638191de.svg'),
    dividerAlt: figma('5411a02fe588351f4fd27269e5629d22c51b8353.svg'),
    bikeDelivery: figma('fdd557a01ca2b4ce6995a5fac02a2dd3137e6baa.svg'),
    timer: figma('4152dd9e851645f0022ebf46f55ce17bb7936198.svg'),
  },
  /** Node 70416:856494 — Card divider (caps + stretch bar) */
  cardDivider: {
    leftCap: figma('2668217b522abe9c4d0a63078ceab5dd62e5b348.svg'),
    rightCap: figma('12b36c288c8bfa8a53cc7cfed806ac28bf6b20b8.svg'),
  },
  /** Node 70416:856462 — QuickNav */
  quickNav: {
    search: figma('c4d5b42846eaa08e2a35a7aae358c92b141f371d.svg'),
    burger: figma('797e557face7bb86bb24296c09c86b781bcbd662.svg'),
    listSquareOutline: figma('3357b3f7b465c674b69dd4af9ab2cf1792e1d80d.svg'),
  },
  /** Figma 76281:68503 — home shortcuts row icons (L→R). */
  shortcuts: {
    allStores: figma('c3dcbfb2c3854d29b81d9b44814016e9c.png'),
    groceries: figma('0e3bcadd64924e0da3f6aac5f92f5c52.png'),
    alcoholicBeverages: figma('4287ee5fbc604f8680e43f05c03cb58f.png'),
    iceCream: figma('64017f2a57b04ee8b63d30e0d3188980.png'),
    flowers: figma('2b80b0b6c4cf4d179567fd1b1bc85b60.png'),
  },
  /**
   * Floating bottom tab bar — Figma 76281:68555 shell; icons 76290 (24×24).
   * Refresh via `npm run figma:sync`.
   */
  floatingTabBar: {
    home: {
      /** 76290:68764 — home-default (24×24). */
      default: figma('ebdbbcb3ecdd4d52b269c60ebfc80ad7.svg'),
      /** 76290:68781 — home-select; Subtract inset 3px/2px in 24×24 frame. */
      selected: figma('7629068781.svg'),
    },
    store: {
      default: figma('26b72e3899b14e24bfe7380dcded8db5.svg'),
      selected: figma('1d9cb7d6927c4759969f3c0ce62d31f4.svg'),
    },
    dineout: {
      default: figma('50993720489642e59620d352887a5c3e.svg'),
      selected: figma('5eb7ad963fab4e3e9e49351cff8c268a.svg'),
    },
    search: {
      default: figma('baa3b78a6cc04bd49e06df4dcaf11263.svg'),
      selected: figma('a66c7b9a90b9400781470d566e27185d.svg'),
    },
    /** Stores screen / overflow — 74906 */
    categories: {
      default: figma('7490623732c0a3bb9e0f4bcc9705190759789821.svg'),
      selected: figma('74906237b0917f1540674bd2b09a09cecfd5f497.svg'),
    },
    more: {
      default: figma('74906223191fdd2543acc1484db01091a9eec7d4.svg'),
      selected: figma('74906223191fdd2543acc1484db01091a9eec7d4.svg'),
    },
    /** Figma 74911:23495 / 74911:23497 — list (_list-default_, _list-select_) */
    list: {
      default: figma('749112349bc74dcc23c243108680fa99e6996a37.svg'),
      selected: figma('74911234eb6983fb5dc04d3eafd7d19d412ee941.svg'),
    },
    /** iOS home indicator — 76281:68564 */
    homeIndicator: figma('f32a6ab0be790c7e3a3e2581374d651130d2bced.svg'),
  },
  /** Figma 76315:68795 — floating tab action (search); icon 76290:68769. */
  tabAction: {
    search: figma('baa3b78a6cc04bd49e06df4dcaf11263.svg'),
  },
  /**
   * [Eater] Home — Figma 74916:23389 (hero, search, thumbnails M/XS/L, shortcuts).
   * Assets from Figma MCP; refresh with `npm run figma:assets` when hashes change.
   */
  /** Figma 76281:33163 — Hero banner (illustration + join CTA arrow). */
  heroBanner: {
    illustration: figma('768a268423a94f5da23949750be3f8c1.png'),
    joinNowArrow: figma('31626d35a5c74848b4ed2e477663a27d.svg'),
  },
  /** Figma 76330:70427 / 76330:70414 — SearchInput-default (+ filter indicator). */
  searchField: {
    searchIcon: figma('31d60d10b64243788407fd18875dd0ef.svg'),
    filtersIcon: figma('b06015295684f55bb4a57f798dd810.svg'),
  },
  /** Figma 76281:33224 — Address selector (location pin + avatar ring). */
  addressSelector: {
    locationPin: figma('732743e7311b402c94812a4fba212b6a.svg'),
    avatarRing: figma('2bd0d87972314526aed0dbe8322fc381.svg'),
  },
  /** Figma 76281:32783 — [Eater] Home top section (hero, promo, search). */
  topSection: {
    heroIllustration: figma('113b2838bc37438abe35e08b2e29fe7f.png'),
    joinNowArrow: figma('31626d35a5c74848b4ed2e477663a27d.svg'),
    searchIcon: figma('16d1cc0e672140a0bb44d24db377d068.svg'),
    filtersIcon: figma('7a881368c0cc4d979f9a0564865ba57b.svg'),
  },
  /** Figma 76330:71602 — ThumbnailM meta + overlay icons. */
  thumbnailM: {
    bikeDelivery: figma('1bc903fbf59945b791fa1aef041a4d4c.svg'),
    timer: figma('59d5ed0197514d2d86b5c58844d79dcb.svg'),
    ratingStar: figma('b88da32a312648e19465442b8187cf60.svg'),
    heart: figma('05b798f7b7b54b0ba7c381acd6b9a505.svg'),
  },
  /** Figma 74916:29102 — ThumbnailL (same icon set, 16px meta row). */
  thumbnailL: {
    bikeDelivery: figma('1bc903fbf59945b791fa1aef041a4d4c.svg'),
    timer: figma('59d5ed0197514d2d86b5c58844d79dcb.svg'),
    ratingStar: figma('b88da32a312648e19465442b8187cf60.svg'),
    heart: figma('05b798f7b7b54b0ba7c381acd6b9a505.svg'),
  },
  eaterHome: {
    heroIllustration: figma('113b2838bc37438abe35e08b2e29fe7f.png'),
    eaterAvatarRing: figma('6354b7536d69452f8b258778a68d2105.svg'),
    statusBarIcons: figma('9236160fd36c48a2a470836cd78f0709.svg'),
    thumbnailM: figma('3ad56361f20a4bd0a375a92e5f5a7015.jpg'),
    thumbnailXs: figma('c97df108bc8548908acc70cc541ea6ef.jpg'),
    thumbnailL: figma('871890380e8f4c40bd36a8f6ab2672c9.png'),
    thumbHeartFilled: figma('71463b871ee540648e5089aa345f56fe.svg'),
    thumbHeartOutline: figma('2ba6fd546e8449e3986d3c2f6b626f35.svg'),
    thumbRatingStar: figma('1a87a96bc27f41cda303e33949e5cc3a.svg'),
  },
  /** Node 70394:111124 — MiniBannerCarousel */
  miniBanner: [
    figma('bd08000c9d7ea2f0562ef1f96cda595327cd6ed8.png'),
    figma('92bce29ddf3efc3d9f5897dc318ea24c069cacbb.png'),
    figma('b4718510e855c9b9e19d0c341898cadcc962a821.png'),
  ],
  /** Node 70394:111155 — Banner */
  banner: figma('e536f47bf8b1c8722e8a364d6d18f0c5848d8ba0.png'),
  /** Retail snippet provider row icons (store photo comes from `boltFoodAssets`). */
  retailSnippetProvider: {
    bikeDelivery: figma('fdd557a01ca2b4ce6995a5fac02a2dd3137e6baa.svg'),
    timer: figma('4152dd9e851645f0022ebf46f55ce17bb7936198.svg'),
    ratingStar: figma('1a87a96bc27f41cda303e33949e5cc3a.svg'),
  },
  carousel: {
    product: figma('10f7ad72d225a1d40999e27d0c871bd53b393f69.png'),
    surge: figma('0fd25b5cde9aaa4654192a000ff9ccf46d4f446c.svg'),
    /** Quick add — Figma 76328:68848 (plus) / 76328:68850 (minus) */
    plus: figma('3008f1543b9d479488f96fe5af1a168c.svg'),
    minus: figma('32af85e6998a47f8a6f1dfd22a5f009f.svg'),
    /** Node 70394:111157 — ItemCarousel header “All” chevron */
    allChevron: figma('746fcef064fcab5c57266f85a1d3ea4e216e6355.svg'),
  },
  /** Node 70394:111443 — MoreToExplore (tile art) */
  moreToExplore: [
    figma('959c48ec516c3588a4a60f24a651dd29b62b99b5.png'),
    figma('979450db5dcbacfd9253e7403e17d85e8b9abfe4.png'),
    figma('18e3e1581f58a37c2e36d35499650d33b2912323.png'),
  ],
  /** Category grid tile images, same order as Figma node 70394:111492 */
  categoryTiles: [
    figma('c1b68a06e457ad3e67479ea48e8a2980cebc8ecd.png'),
    figma('df6d1a4d02cb7499d497b8d1ca07676ba24a68ad.png'),
    figma('47cf0825bb06af3d00b07c0862defb6129da6565.png'),
    figma('cc7d3eb73569a1770f90258e697053a1b2eca35e.png'),
    figma('ca49e98f202e70ff6680d827566ba0006c40d702.png'),
    figma('cd509f1b9cf2f0b6fb1c66ff63825be7ac4522f4.png'),
    figma('26116e0ef10ec29d06ef59ac8f092c882f4aa1ad.png'),
    figma('13f45943bef46d83fb49edbc9ab89e66cb3ff5d4.png'),
    figma('4d2b0a5f4d80b3993d439c9423a6911d30f87261.png'),
    figma('37ad079a7befa7e47f838ba1348905b595298060.png'),
    figma('d2658d83c0126161253ca82b3c1e15177b797e54.png'),
    figma('bd7e8c8751899f6a9a9102e819e0abea33953ac4.png'),
    figma('92dd53c26bc94116f33c931fe871bf83fe110542.png'),
    figma('b8ac86acfebfc28fbd5287f48786e678698a7066.png'),
    figma('3355e1f01eb1cf9601e1d53004ed0532ae6886f8.png'),
    figma('c7df232ec35681ff1a7aec07199976b2cec678ca.png'),
    figma('689281d69685681064466436a3466257716dba65.png'),
    figma('ade7592505036954059babc75cbe7df1914ce6b9.png'),
    figma('7cc412350e9b9968f61fef4f6356d5902fb0b5b8.png'),
    figma('9554bc6bcd3c0ca3f0be58faf16ac58484afa63a.png'),
    figma('522a9aad3125045615c5e930493ea590e4141fe0.png'),
    figma('f1c50d6ee511e95671f2d2a6aca2522ca343210e.png'),
    figma('8f80d134d9f2bb9381a942b38688a93cf84128bd.png'),
    figma('d364122f2e0e4818b5ee415e32b829df0f2d8731.png'),
    figma('b4ee69b3b8705cd7d23f6dbfcccf6b08ea6fa4a6.png'),
    figma('3614e6600f2a715cbe1130bc7301170271dc41f3.png'),
    figma('3bae51ed4f5022dc994507dc02cba5047cbff025.png'),
    figma('b6e10b38c97309404725481d69f84326a599a863.png'),
    figma('226fb35e048a440bd61b4d6048618065c03bf09e.png'),
    figma('4742da79a65d5d4ccee5e0a4ef548ab15f671581.png'),
  ],
  /**
   * Shopping list — nodes 70440:1499296 / 70440:1499475 / 70442 list rows / NavBar 70440:1499872–1499893.
   * Run `npm run figma:assets` with Figma open to pull binaries.
   */
  shoppingList: {
    navEditLarge: figma('d1234c231381c1fec7bbdab696a29b6cde8a761e.svg'),
    navEditSmall: figma('0aef5aab283a4e2ccc8b71db776fe83235bacae1.svg'),
    cardDivider: figma('220e7f2bb9323aef338a632f254b58a28a0d37ca.svg'),
    homeIndicator: figma('f32a6ab0be790c7e3a3e2581374d651130d2bced.svg'),
    emptyChicken: figma('196b13d552edd4165f49d4d29d3753337bb78734.png'),
    emptySalmon: figma('3d591e97a19599e38b9466999e045523e308573f.png'),
    emptyBro: figma('3e04b2b369971c58be4875e3328380c10ac40184.png'),
    emptyBananas: figma('f986bec26da0ddacad87a55269901f1f55fa6ffb.png'),
    rowThumb: [
      figma('0fdbf53258d4b355746ff99c0c3e315f72c63d70.png'),
      figma('90a5ef4e63f66c536e414d3076df1810469094ac.png'),
      figma('657e9045df61cf6631f9f588c41577bcf980b8f6.png'),
      figma('4e13bb53432cb97b6ddd07220416346059167b67.png'),
      figma('d5e9aa348ccabb239615fb94d4f9c4f29cf80e2f.png'),
      figma('65f382a04071a158d64fb875f11ec9788d1a5ac6.png'),
      figma('a3b86748b45bfd9823a0a0484ae18d3409f1aff1.png'),
      figma('05f48ef2d266810593797c8c58f9e37e5b46d13f.png'),
      figma('e9a8b494c42f894fe234409ad3174dd0efacac16.png'),
      figma('c5c77251806897a32f67af671cdc70b47b96956e.png'),
      figma('1fbafef5c8b4065619f37a022cd89497036789a7.png'),
      figma('1ed45a2379c2787611fdf222d984d26dc1d6f04e.png'),
    ],
  },
} as const
