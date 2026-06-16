const STORAGE_KEY = 'bolt_session_password'

export function getSavedPassword(): string {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

export function savePassword(password: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, password)
  } catch {
    // sessionStorage unavailable (private browsing edge case)
  }
}

export function clearSavedPassword(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function hasSavedPassword(): boolean {
  return getSavedPassword().length > 0
}
