import { kalepIcons as ki } from './kalepIcons'

/**
 * Raster / decorative assets under `public/figma/` (hash filenames from Figma MCP).
 * UI glyphs use `@bolteu/kalep-icons-svg` via `./kalepIcons`.
 *
 * After adding raster entries here, also update:
 * - `scripts/download-figma-assets.mjs` (`files` array)
 * - `scripts/seed-figma-placeholders.mjs` (`files` array)
 * - `scripts/figma-mcp-assets.json` (filename → MCP asset URL from `get_design_context`)
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
    basket: ki.basket,
    /** Figma 77550:93488 — loading spinner (24×24 in collapsed FAB). */
    loader: figma('0a3cfa588c704454ab19e242b992b7f9.svg'),
  },
  /** Wide merchant basket FAB — Figma 77550:93514 (basket), 77718:108978 (spinner). */
  wideBasketFab: {
    basket: ki.basketWide,
    loader: figma('674b5047b79043a78585ff8d8106fe75.svg'),
  },
  /** Node 70408:1768062 — Consumer ProviderHeader (Figma) */
  providerHeader: {
    hero: figma('cdd5ae3658573fd29d8e72fcdd6c09cc383da495.png'),
    logo: figma('53b5c8dbf70c0b098d69e8552903cf885dfbc9a7.png'),
    arrowLeft: ki.arrowLeft,
    heartOutline: ki.heartOutline,
    shareIos: ki.shareIos,
    search: ki.search,
    chevronRight: ki.chevronRight,
    ratingStar: ki.ratingStarProvider,
    divider: figma('7b71392494cec1622b1bd0796589f815638191de.svg'),
    dividerAlt: figma('5411a02fe588351f4fd27269e5629d22c51b8353.svg'),
    bikeDelivery: ki.bikeDelivery,
    timer: ki.timer,
  },
  /** CardDivider — Figma 77857:92979. Refresh via `npm run figma:assets`. */
  cardDivider: {
    leftCap: figma('7141b9d1a8f340223fc6796ab0319a0127f687c2.svg'),
    rightCap: figma('3611b87fe23b8a63aa1ee11492fac91d197e5b4e.svg'),
  },
  /** Node 70416:856462 — QuickNav */
  quickNav: {
    search: ki.search,
    burger: ki.burger,
    listSquareOutline: ki.listSquareOutline,
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
    home: ki.floatingTabBar.home,
    store: ki.floatingTabBar.store,
    dineout: ki.floatingTabBar.dineout,
    search: ki.floatingTabBar.search,
    categories: ki.floatingTabBar.categories,
    more: ki.floatingTabBar.more,
    list: ki.floatingTabBar.list,
    /** iOS home indicator — 76281:68564 */
    homeIndicator: figma('f32a6ab0be790c7e3a3e2581374d651130d2bced.svg'),
  },
  /** Figma 76315:68795 — floating tab action (search); icon 76290:68769. */
  tabAction: {
    search: ki.tabSearch,
  },
  /**
   * Merchant floating tab bar — Figma 77900:93000–93014 (stores / isles / list).
   * Refresh via `npm run figma:sync`.
   */
  merchantFloatingTabBar: {
    venue: ki.merchantFloatingTabBar.venue,
    isles: ki.merchantFloatingTabBar.isles,
    list: ki.merchantFloatingTabBar.list,
    search: ki.merchantFloatingTabBar.search,
    basketExpanded: ki.merchantFloatingTabBar.basketExpanded,
    homeIndicator: figma('f32a6ab0be790c7e3a3e2581374d651130d2bced.svg'),
  },
  /**
   * BannerCarousel slides — Figma 77842:552848 / 77842:552851.
   * Refresh via `npm run figma:sync`.
   */
  bannerCarousel: {
    slideA: figma('c330424f7c1c84c9765587f0221b9093abbeaade.png'),
    slideB: figma('c7a3f4fdcce2c176e2aa7d0b620d3276fdf97edc.png'),
  },
  /**
   * Store merchant GroceryHome — Figma 77237:150610 / 151500.
   * Refresh via `npm run figma:sync`.
   */
  storeMerchant: {
    hero: figma('5823075e34d24ce5bfcd39e48e93f08f.png'),
    logo: figma('09efda5741964126a57455f135e5f3aa.png'),
    arrowLeft: ki.arrowLeftStore,
    shareIos: ki.shareIosStore,
    heartOutline: ki.heartOutlineStore,
    divider: figma('4db12b061c83433bb94ddec4796955cf.svg'),
    dividerAlt: figma('aa99708eaaad4cef6e1b842bb1b0102d.svg'),
    ratingStar: ki.ratingStarProvider,
    bikeDelivery: ki.bikeDelivery,
    timer: ki.timer,
    bannerDiscount: figma('f658dba0f8344ad4abd6bb4ecf4e6ba0.png'),
    bannerDelivery: figma('29b9a9e8dcf04652baeafddcde11d582.png'),
    promoBanner: figma('1feba0c5a85a41bdb722255935d99d3b.png'),
  },
  /**
   * Store TopSection — Figma 77303:218308. Refresh via `npm run figma:sync`.
   */
  topSectionStore: {
    hero: figma('d11d9b710dce44df98d9b50def822d8e.png'),
    logo: figma('bb5d2762434a49fcb1e1d82442f2af84.png'),
    /** Figma 79432:178992 — Bolt Market brand mark (Toompuiestee merchant logo). */
    boltMarketToompuiesteeLogo: figma('dc6a51f32f2a42609e4e4d2eb9bbe541.png'),
    arrowLeft: ki.arrowLeftTop,
    shareIos: ki.shareIosTop,
    heartOutline: ki.heartOutlineTop,
    chevronRight: ki.chevronRightTop,
    divider: figma('adb5c008ed134052aec2c6f7c6a81e8e.svg'),
    dividerAlt: figma('9f42788368dd45ae887eba79a6282cbb.svg'),
    ratingStar: ki.ratingStarProvider,
    bikeDelivery: ki.bikeDelivery,
    timer: ki.timer,
  },
  /**
   * Restaurant TopSection — Figma 77303:218235. Refresh via `npm run figma:sync`.
   */
  topSectionRestaurant: {
    hero: figma('0badf44655b34842bbd189000200e987.png'),
    arrowLeft: ki.arrowLeftRestaurant,
    shareIos: ki.shareIosRestaurant,
    heartOutline: ki.heartOutlineRestaurant,
    chevronRight: ki.chevronRightTop,
    divider: figma('faaa8d12959b45fb8a2b2d523d68b677.svg'),
    dividerAlt: figma('3b0667e530e24a00b29c451d54b6213a.svg'),
    ratingStar: ki.ratingStarProvider,
    bikeDelivery: ki.bikeDelivery,
    timer: ki.timer,
  },
  /** Restaurant menu row assets — Figma 77237:157049 et al. */
  restaurantMerchant: {
    menuItemImage: figma('979e666ffe0a4719aa7c059d207bb994.png'),
    menuItemImageAlt: figma('18fac8e4a92140b2a288214b79599ecd.png'),
    tagSpicy: ki.tagSpicy,
  },
  /**
   * [Eater] Home — Figma 74916:23389 (hero, search, thumbnails M/XS/L, shortcuts).
   * Assets from Figma MCP; refresh with `npm run figma:assets` when hashes change.
   */
  /** Figma 76281:33163 — Hero banner (illustration + join CTA arrow). */
  heroBanner: {
    illustration: figma('768a268423a94f5da23949750be3f8c1.png'),
    joinNowArrow: ki.joinArrow,
  },
  /** Figma 77937:93121 — DineOut top navigation (search, avatar, filter chips). */
  dineOutTopNav: {
    searchIcon: ki.searchDineout,
    filtersIcon: ki.filtersAlt,
    avatarRing: figma('a25219c7ea554b1b8ee769089652b3bf.svg'),
    userAltOutline: ki.userAltOutline,
    offerOutline: ki.offerOutline,
    ratingSelected: ki.ratingStar,
    chevronDown: ki.chevronDown,
    bikeDeliveryOutline: ki.bikeDeliveryOutline,
    timerOutline: ki.timerOutline,
    walk: ki.walk,
    calendarOutline: ki.calendarOutline,
    boltPlusOutline: ki.boltPlusOutline,
  },
  /** Figma 76330:70427 / 76330:70414 — SearchInput-default (+ filter indicator). */
  searchField: {
    searchIcon: ki.search,
    filtersIcon: ki.filters,
  },
  /** Figma 78810:114696 — Home search results (history, filters). */
  homeSearchScreen: {
    historyOutline: ki.historyOutline,
    reorderVert: ki.reorderVert,
    routeOutline: ki.routeOutline,
  },
  /** Figma 76281:33224 — Address selector (location pin + avatar ring). */
  addressSelector: {
    locationPin: ki.locationPin,
    avatarRing: figma('2bd0d87972314526aed0dbe8322fc381.svg'),
  },
  /** Figma 76281:32783 — [Eater] Home top section (hero, promo, search). */
  topSection: {
    heroIllustration: figma('113b2838bc37438abe35e08b2e29fe7f.png'),
    joinNowArrow: ki.joinArrow,
    searchIcon: ki.search,
    filtersIcon: ki.filters,
  },
  /** Figma 79589:184146 — [Eater] save-btn (ThumbnailM/L favorite). */
  eaterSaveBtn: {
    heartFill: figma('6fbbf349da6847caa6781c4e438b3e64.svg'),
    heartOutline: figma('ba5b7847629b4dbd86a8a6417d0ef20.svg'),
  },
  /** Figma 76330:71602 — ThumbnailM meta + overlay icons. */
  thumbnailM: {
    bikeDelivery: ki.bikeDelivery,
    timer: ki.timer,
    ratingStar: ki.ratingStar,
    heart: ki.heartFilled,
  },
  /** Figma 74916:29102 — ThumbnailL (same icon set, 16px meta row). */
  thumbnailL: {
    bikeDelivery: ki.bikeDelivery,
    timer: ki.timer,
    ratingStar: ki.ratingStar,
    heart: ki.heartFilled,
  },
  eaterHome: {
    heroIllustration: figma('113b2838bc37438abe35e08b2e29fe7f.png'),
    eaterAvatarRing: figma('6354b7536d69452f8b258778a68d2105.svg'),
    statusBarIcons: figma('9236160fd36c48a2a470836cd78f0709.svg'),
    thumbnailM: figma('3ad56361f20a4bd0a375a92e5f5a7015.jpg'),
    thumbnailXs: figma('c97df108bc8548908acc70cc541ea6ef.jpg'),
    thumbnailL: figma('871890380e8f4c40bd36a8f6ab2672c9.png'),
    thumbHeartFilled: ki.thumbHeartFilled,
    thumbHeartOutline: ki.thumbHeartOutline,
    thumbRatingStar: ki.ratingStar,
  },
  /** MiniBannerCarousel — Figma 77303:218074. Refresh via `npm run figma:sync`. */
  miniBanner: [
    figma('be403afb1aa34ada8e139905bdea1a2f.png'),
    figma('5d56149d5e32450cabed45a1c4e8449e.png'),
    figma('d443fe450db24624b0d48b0714adc7e3.png'),
    figma('e802454da68a415a8eedfad189f9bf98.png'),
  ],
  /** Node 70394:111155 — Banner */
  banner: figma('e536f47bf8b1c8722e8a364d6d18f0c5848d8ba0.png'),
  /** Snippet header [77237:148102] — calendar + metadata icons (store photo from `boltFoodAssets`). */
  retailSnippetProvider: {
    calendarFilled: ki.calendarFilled,
    bikeDelivery: ki.bikeDelivery,
    timer: ki.timer,
    ratingStar: ki.ratingStar,
  },
  carousel: {
    product: figma('10f7ad72d225a1d40999e27d0c871bd53b393f69.png'),
    surge: ki.surge,
    plus: ki.plus,
    minus: ki.minus,
    allChevron: ki.allChevron,
  },
  /**
   * Merchant List tab — Figma 77943:161673.
   */
  merchantList: {
    /** 77943:161947 — add item */
    navAdd: ki.navAdd,
    navEdit: ki.navEdit,
    rowThumb: [
      figma('c551a8c4905e4a17b9d3b1d021716142.png'),
      figma('e9d74a98e7404d6cb797c8fcd1c7a106.png'),
      figma('87d450bbdb4742eeb1d173deadc22d00.png'),
      figma('3763a269b5e1476aa928898181561e08.png'),
      figma('25f57dc5a30a444aa1844c18a1b91e9d.png'),
      figma('35bb4d44a4834b0bb8f525ead16b6b53.png'),
      figma('46aad957c93d47e6b2dd925aeab607b5.png'),
    ],
  },
  /**
   * Merchant Aisles tab — Figma 77940:95171.
   * `moreToExplore` + `categoryTiles` order matches the design grid.
   */
  aisles: {
    moreToExplore: [
      figma('831e285a66b34e0f922b2b9bdc89aee9.png'),
      figma('9029c974016947c2ae179e8231d7683a.png'),
      figma('cd480ab363f54618b271c6fb989fc627.png'),
    ],
    categoryTiles: [
      figma('bf4d0c25ba9147efb15fa337c12fce40.png'),
      figma('19307420930947689ffa58b8e8a30c02.png'),
      figma('dfd7405853664fdd818eb7ea36872571.png'),
      figma('6bc75f3e4b1744548d22ac25e5ac9458.png'),
      figma('9e2228d9ac45485890c339248b3a864f.png'),
      figma('bd372cc546754f19964472a0c2bb188a.png'),
      figma('ff80efc0b067495f8acf736678dd80e4.png'),
      figma('6128a8a7f548493fafbc77d203b46499.png'),
      figma('8d229dbbdd8e4869890eed08088ef11a.png'),
      figma('9eb52bf136a54ba3b4d47ce4f8cc5ca4.png'),
      figma('f3cf9ffe42944a33915d37f807e6bf4a.png'),
      figma('23884ef5223c4cf38aff1254313248a4.png'),
      figma('e5033ffb1be74b8e97488263f35ec055.png'),
      figma('2896b62341e3403c9b39f8e4d42cd227.png'),
      figma('154e86ab2e3b4a68a86184bdc9b6291c.png'),
      figma('66c14b75d7564c8ab786212812784fe1.png'),
      figma('1ac2e3d0a90b4b1890f288a2ece383e6.png'),
      figma('6141133ec2d44d02b059e39f79d20834.png'),
      figma('2250661e689a4ae4beafafb11410825f.png'),
      figma('e5134c4a86064652aa3be99461c640b8.png'),
      figma('a415796a14884514bba97c055bb63e56.png'),
      figma('647811d2d46d4f02a09a540cc32837a.png'),
      figma('2df25441a9344673bafdb909968d17bb.png'),
      figma('b0702d0a6c9f4d33a54a83cd6a5df593.png'),
      figma('2f18e7d7f0af42c4837aae3d1a39c544.png'),
      figma('1267ab22494345f3b8aa8c006c80c05d.png'),
      figma('c7d221dbd82e414cab4f04f7ee5b4da3.png'),
      figma('de2aed5db63e4b589c4d017c26b59a32.png'),
      figma('aa6a9b8edec54b649c9313f2cded13ba.png'),
      figma('f06160bd67d146568a9f31d3f15755f1.png'),
    ],
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
    navEditLarge: ki.navEdit,
    navEditSmall: ki.navEditSmall,
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
