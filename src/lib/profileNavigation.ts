import type { NavigateFunction } from 'react-router-dom'
import { isEaterHubPath } from './eaterNavigation'

export const PROFILE_PATH = '/profile'
export const PROFILE_EDIT_PHONE_PATH = '/profile/edit-phone'

let profileOriginHubPath = '/'

/** Hub tab the user was on when Profile was opened (`/`, `/stores`, `/dineout`). */
export function getProfileOriginHubPath(): string {
  return profileOriginHubPath
}

export function setProfileOriginHubPath(pathname: string): void {
  profileOriginHubPath = isEaterHubPath(pathname) ? pathname : '/'
}

export function openProfile(navigate: NavigateFunction, fromPathname: string): void {
  setProfileOriginHubPath(fromPathname)
  navigate(PROFILE_PATH)
}
