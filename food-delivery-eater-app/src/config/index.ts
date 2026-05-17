import { Platform } from 'react-native';
import { KeyboardControllerEvents } from 'react-native-keyboard-controller';

import { toString } from 'lodash';

import { baseUrl } from '@/config/api';
import Config from '@/config/native';
import { getAppVersion } from '@/utils/appVersion';

const appStoreId = 1451492388;
const appGalleryId = Config.IS_HUAWEI_DISTRIBUTION ? 'C103397051' : undefined;
export const platformName = Platform.select<'iOS' | 'Android'>({
  ios: 'iOS',
  android: 'Android',
});

const config = {
  // Can be used in various places as a prefix for storage key, etc
  appName: 'BoltDeliveryClient',
  appDisplayName: 'Bolt Food',
  appSchemePrefix: 'boltfood://',
  version: getAppVersion(Config.PACKAGE_VERSION_PREFIX),
  defaultLocale: 'en-US',
  defaultCountryCode: 'ee',
  appStage: Config.REACT_APP_STAGE,

  appDetails: {
    appStoreId,
    playStoreId: 'com.bolt.deliveryclient',
    appGalleryId,
  },

  isHuaweiDistribution: Config.IS_HUAWEI_DISTRIBUTION,

  boltPCIUrls: {
    live: 'https://pci.bolt.eu',
    prelive: 'https://pci.prelive.bolt.eu',
  },

  serviceDeskUrl: 'https://taxify.atlassian.net/rest/servicedeskapi',
  serviceDeskId: 2, // Project name: "Tech Support", Project key: "TECH"
  bugReportRequestTypeId: '771', // Request type: "Eater App"
  bugReportTitles: {
    live: `Internal bug report - Eater ${platformName}`,
    prelive: `Internal bug report - Eater ${platformName} (Prelive)`,
  },
  bugReportUserUrl: 'https://admin-panel.prelive.bolt.eu/identity/consumers/rider',

  userType: 'eater', // Used in session reducer to generate session ID
  userIdKey: 'user_id', // Used to extract user ID from session token (alternatively courier_id or provider_id)

  baseUrl,
  apiUrlSuffix: Config.API_URL_SUFFIX,

  nativePayments: {
    applePayMerchantId: Config.APPLE_PAY_MERCHANT_ID,
  },

  chat: {
    chatBrokerMqttServerHost: Config.CHAT_BROKER_MQTT_SERVER_HOST,
    chatHostName: Config.CHAT_API_HOST_NAME,
  },

  appsFlyer: {
    ...Platform.select({
      ios: {
        appId: toString(appStoreId),
      },
    }),
    devKey: Config.APPSFLYER_API_KEY,
  },

  singular: {
    apiKey: Config.SINGULAR_API_KEY,
    secret: Config.SINGULAR_API_SECRET,
  },

  accessTokenUpdateInterval: 5 * 60 * 1000,
  appVersionStateCheckInterval: 4 * 60 * 60 * 1000,
  fakeModeTimeout: 100,

  // For E2E testing, we need to increase the polling interval to avoid Busy UI activity
  pollingInterval: Config.IS_E2E ? 10 * 1000 : 2 * 1000,
  loyaltyCardsPollingInterval: 10 * 1000,
  finalOrderExpiry: 10 * 60 * 1000,

  numberOfDaysToStoreFailedAndClosedRatingOrderIds: 14,

  errorCodes: {
    UPDATE_DELIVERY_USER_PROFILE: {
      INVALID_EMAIL: 13,
      DUPLICATED_EMAIL: 728,
    },
    ADD_VAT_CODE_TO_USER_PROFILE: {
      INVALID_VAT_FORMAT: 6100,
    },
    GET_HOME_CATEGORIES: {
      CITY_NOT_FOUND: 5812, // gps coordinates don’t match any city from our system or city does not support food delivery or not active for delivery (it can be in testing - in case the city is in the testing phase)
      DELIVERY_NOT_AVAILABLE: 5816, // delivery is not allowed in the area defined by the gps coordinates
    },
    GET_DYNAMIC_SCREEN_CONTENT: {
      INVALID_SCREEN_CONTENT: 33792,
    },
  },

  // Android doesn't have event keyboardWillShow/keyboardWillHide but it looks better so we still want to use it for iOS
  keyboardShowEventName: Platform.select({
    ios: 'keyboardWillShow',
    android: 'keyboardDidShow',
  }) as KeyboardControllerEvents,
  keyboardCloseEventName: Platform.select({
    ios: 'keyboardWillHide',
    android: 'keyboardDidHide',
  }) as KeyboardControllerEvents,

  // To prevent dead system exceptions on Android,
  // we're limiting regular input fields lengths
  defaultTextInputMaxLength: 3000,

  smsHashString: Platform.select({
    default: undefined,
    android: Config.SMS_HASH_STRING,
  }),
  mixpanel: {
    token: Config.MIXPANEL_TOKEN,
  },
  eaterWebBaseUrl: {
    live: 'https://food.bolt.eu',
    prelive: 'https://food.prelive.bolt.eu',
  },

  defaultHomeCategoryKey: 'default_key',

  groceriesTagIdForBottomTab: 58,
  storesTagIdForBottomTab: 59,

  orderAgainCategoryKey: 'recently_ordered_from',

  // Any negative number used as screen id will result in legacy home screen content being returned.
  defaultDynamicHomeScreenId: -1,

  // Setup the file logger early in the app lifecycle to catch logs before FFs are set.
  isFileLoggerEnabledByDefault: __DEV__ || Config.REACT_APP_STAGE === 'prelive',

  // Makes it possible to "inspect" the WebView
  // https://github.com/react-native-webview/react-native-webview/blob/master/docs/Debugging.md
  webviewDebuggingEnabled: __DEV__ || Config.REACT_APP_STAGE === 'prelive',

  isPushNotificationsAvailable: Platform.OS !== 'web',

  defaultNotificationChannel: Platform.select({
    default: undefined,
    android: Config.DEFAULT_NOTIFICATION_CHANNEL,
  }),
} as const;

export type ConfigType = typeof config;
export default config as ConfigType;
