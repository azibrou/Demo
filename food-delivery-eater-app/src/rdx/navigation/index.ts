import { getType } from 'typesafe-actions';

import { NavigationTab } from '@/api/types';
import { AnyRouteName } from '@/navigation/navigationTypes';
import { GlobalAppActions } from '@/rdx/actions';
import { RequestState } from '@/types';
import { isSameAppUrl } from '@/utils/appUrl';

import {
  addRouteToRouteNamesHistoryAction,
  clearInitialUrlAction,
  getNavigationBarAsyncAction,
  setInitialUrlActionInternal,
  setLastRouteNameAction,
} from './actions';

export interface NavigationState {
  routeNamesHistory: string[];
  lastRouteName: AnyRouteName | null;
  lastRouteParams: Record<string, any>;
  navigationTabs: NavigationTab[];
  navigationBarRequestState: RequestState;
  navigationBarError: Error | null;
  initialUrl: string | undefined;
  initialReferrer: string | undefined;
}

const initialState: NavigationState = {
  routeNamesHistory: [],
  lastRouteName: null,
  lastRouteParams: {},
  navigationTabs: [],
  navigationBarRequestState: RequestState.unset,
  navigationBarError: null,
  initialUrl: undefined,
  initialReferrer: undefined,
};

export default function navigationReducer(
  state = initialState,
  action: GlobalAppActions,
): NavigationState {
  switch (action.type) {
    case getType(setLastRouteNameAction):
      return {
        ...state,
        lastRouteName: action.payload.routeName,
        lastRouteParams: action.payload.params,
      };

    case getType(getNavigationBarAsyncAction.request):
      return {
        ...state,
        navigationBarRequestState: RequestState.waiting,
        navigationBarError: null,
      };

    case getType(getNavigationBarAsyncAction.success):
      return {
        ...state,
        navigationBarRequestState: RequestState.success,
        navigationTabs: action.payload.navigationTabs,
      };
    case getType(getNavigationBarAsyncAction.failure):
      return {
        ...state,
        navigationBarRequestState: RequestState.failure,
        navigationBarError: action.payload.error,
        navigationTabs: [],
      };

    case getType(setInitialUrlActionInternal): {
      // We can skip updating the initial URL if it's a delayed URL (which means we've set it before)
      // and the URL is the same as the current initial URL.
      const canSkipUpdating =
        action.payload.isDelayedUrl &&
        state.initialUrl &&
        isSameAppUrl(state.initialUrl, action.payload.url);

      if (canSkipUpdating) {
        return state;
      }

      return {
        ...state,
        initialUrl: action.payload.url || undefined,
        initialReferrer: action.payload.referrer || undefined,
      };
    }
    case getType(clearInitialUrlAction):
      return {
        ...state,
        initialUrl: undefined,
        initialReferrer: undefined,
      };
    case getType(addRouteToRouteNamesHistoryAction):
      return {
        ...state,
        routeNamesHistory: [...state.routeNamesHistory.slice(-1), action.payload],
      };

    default:
      break;
  }

  return state;
}
