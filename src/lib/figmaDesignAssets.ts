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
    /** Figma 77550:93488 — loading spinner (24×24 in collapsed FAB). */
    loader: figma('0a3cfa588c704454ab19e242b992b7f9.svg'),
  },
  /** Wide merchant basket FAB — Figma 77550:93514 (basket), 77718:108978 (spinner). */
  wideBasketFab: {
    basket: figma('8790d5fa52c14adc82982dba36f50a19.svg'),
    loader: figma('674b5047b79043a78585ff8d8106fe75.svg'),
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
  /** CardDivider — Figma 77857:92979. Refresh via `npm run figma:assets`. */
  cardDivider: {
    leftCap: figma('7141b9d1a8f340223fc6796ab0319a0127f687c2.svg'),
    rightCap: figma('3611b87fe23b8a63aa1ee11492fac91d197e5b4e.svg'),
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
   * Merchant floating tab bar — Figma 77900:93000–93014 (stores / isles / list).
   * Refresh via `npm run figma:sync`.
   */
  merchantFloatingTabBar: {
    venue: {
      /** 77900:93006 — stores-default */
      default: figma('feee67782c1b458fbca39f0abca7c4ba.svg'),
      /** 77900:93000 — stores-select */
      selected: figma('489dcdf80e3d484082e2961e3796d613.svg'),
    },
    isles: {
      /** 77900:93010 — isles-default */
      default: figma('d0d29941e95542c78824262fffa9dda.svg'),
      /** 77900:93008 — isles-select */
      selected: figma('8ae5a2d6f0774612a8f02f9ec6277174.svg'),
    },
    list: {
      /** 77900:93012 — list-default */
      default: figma('b5a2b0ef79e34bcdb2181f24fb4dd968.svg'),
      /** 77900:93014 — list-select */
      selected: figma('e42806b8434d4ff28379e6bc00810c6d.svg'),
    },
    search: figma('91d28e75e71f4238b5e231b7c4718380.svg'),
    basketExpanded: figma('8e90a2751b5944bd92fe997b0417743e.svg'),
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
    arrowLeft: figma('511560e2cd954e7cbc56b7d47b6363d19.svg'),
    shareIos: figma('8814ba82c78345bcb7335442adc42a07.svg'),
    heartOutline: figma('86823908271643a8933486085d217db1.svg'),
    divider: figma('4db12b061c83433bb94ddec4796955cf.svg'),
    dividerAlt: figma('aa99708eaaad4cef6e1b842bb1b0102d.svg'),
    ratingStar: figma('5e7060d2d31249a7a5e3f8fd85612057e.svg'),
    bikeDelivery: figma('226fcf7c7aac456589bda2670331dbeb.svg'),
    timer: figma('e77e98931cb8472581e48dc2fdf066ff.svg'),
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
    arrowLeft: figma('7937d90c2c3644338c1a5ec88aa1d66f.svg'),
    shareIos: figma('cd3e0e21c0234614b0758d430408afcb.svg'),
    heartOutline: figma('df5e7ae0cc8c4cd1bc1d15341264a87c.svg'),
    chevronRight: figma('9db1af267adb43b1839804ca532fddc5.svg'),
    divider: figma('adb5c008ed134052aec2c6f7c6a81e8e.svg'),
    dividerAlt: figma('9f42788368dd45ae887eba79a6282cbb.svg'),
    ratingStar: figma('e95da0397a1e4208bf4ba7c616c7deda.svg'),
    bikeDelivery: figma('9ddee1d7627c4c49bf78d5110af08194.svg'),
    timer: figma('6472e44360444f998a84e91c3e979d0f.svg'),
  },
  /**
   * Restaurant TopSection — Figma 77303:218235. Refresh via `npm run figma:sync`.
   */
  topSectionRestaurant: {
    hero: figma('0badf44655b34842bbd189000200e987.png'),
    arrowLeft: figma('f3af9a0d77ae49d3bc880499ec3aacda.svg'),
    shareIos: figma('8cc8dc4ecdaa465898608dd2ac2d753f.svg'),
    heartOutline: figma('38192fa0ac9a465a841ddfa5ad6ca2b4.svg'),
    chevronRight: figma('9db1af267adb43b1839804ca532fddc5.svg'),
    divider: figma('faaa8d12959b45fb8a2b2d523d68b677.svg'),
    dividerAlt: figma('3b0667e530e24a00b29c451d54b6213a.svg'),
    ratingStar: figma('952e7608b96d4e2ba8c2c0886e9a0ebe.svg'),
    bikeDelivery: figma('bc216cb19e904077b8ee23bff7a4a982.svg'),
    timer: figma('27e42070e94a49c6bcb7033096f39ae9.svg'),
  },
  /** Restaurant menu row assets — Figma 77237:157049 et al. */
  restaurantMerchant: {
    menuItemImage: figma('979e666ffe0a4719aa7c059d207bb994.png'),
    menuItemImageAlt: figma('18fac8e4a92140b2a288214b79599ecd.png'),
    tagSpicy: figma('147386f6ac174a6ca592c023dfb6b1de.svg'),
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
  /** Figma 77937:93121 — DineOut top navigation (search, avatar, filter chips). */
  dineOutTopNav: {
    searchIcon: figma('f8d280a83b694e7abe0b4d007a8eb7b9.svg'),
    filtersIcon: figma('5ca7ed033b634c9091512caef6d7ae45.svg'),
    avatarRing: figma('a25219c7ea554b1b8ee769089652b3bf.svg'),
    userAltOutline: figma('6ab084277e6b4f8aaec46b75b34c4781.svg'),
    offerOutline: figma('f653b4db388b4d31b0fc252a00ffa5f0.svg'),
    ratingSelected: figma('31f9394eb9f14f14b22eb81377e65075.svg'),
    chevronDown: figma('2901061f12234863ba241ec5a3934161.svg'),
    bikeDeliveryOutline: figma('ff16af5a16c543b28dd56cd8db118bb1.svg'),
    timerOutline: figma('3784193f2e214d909a2c99a0220d3665.svg'),
    walk: figma('662acdfc2ef8402fb26cabf338c1b8ac.svg'),
    calendarOutline: figma('f19388e2531e4f73a7cf6b204ed9d31b.svg'),
    boltPlusOutline: figma('320c5b624862421780113cf267cd5a6.svg'),
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
  /** Figma 77857:525189 — [Eater] save-btn heart (ThumbnailM/L favorite). */
  eaterSaveBtn: {
    heart: figma('2c2fe8c2adab3abdcf334211f793273699a9b669.svg'),
  },
  /** Figma 76330:71602 — ThumbnailM meta + overlay icons. */
  thumbnailM: {
    bikeDelivery: figma('1bc903fbf59945b791fa1aef041a4d4c.svg'),
    timer: figma('59d5ed0197514d2d86b5c58844d79dcb.svg'),
    ratingStar: figma('b88da32a312648e19465442b8187cf60.svg'),
    heart: figma('2c2fe8c2adab3abdcf334211f793273699a9b669.svg'),
  },
  /** Figma 74916:29102 — ThumbnailL (same icon set, 16px meta row). */
  thumbnailL: {
    bikeDelivery: figma('1bc903fbf59945b791fa1aef041a4d4c.svg'),
    timer: figma('59d5ed0197514d2d86b5c58844d79dcb.svg'),
    ratingStar: figma('b88da32a312648e19465442b8187cf60.svg'),
    heart: figma('2c2fe8c2adab3abdcf334211f793273699a9b669.svg'),
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
    calendarFilled: figma('15e901c7f3b94cf99f9000503d88f21b.svg'),
    bikeDelivery: figma('6b8a0517101648f38473528f4179856c.svg'),
    timer: figma('9b1149b5209d430b813b1f9d75ef1446.svg'),
    ratingStar: figma('4dc319bcec20447a8a7325522122037a.svg'),
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
