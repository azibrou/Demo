import { DEFAULT_PROFILE_PHONE, type ProfilePhone } from './profilePhone'

let storedPhone: ProfilePhone = { ...DEFAULT_PROFILE_PHONE }

const listeners = new Set<() => void>()

export function getProfilePhone(): ProfilePhone {
  return storedPhone
}

export function setProfilePhone(phone: ProfilePhone): void {
  storedPhone = {
    countryCode: phone.countryCode,
    digits: phone.digits.replace(/\D/g, ''),
  }
  listeners.forEach((fn) => fn())
}

export function subscribeProfilePhone(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
