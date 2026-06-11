export type ProfilePhone = {
  countryCode: string
  digits: string
}

export const DEFAULT_PROFILE_PHONE: ProfilePhone = {
  countryCode: '+372',
  digits: '12345678',
}

/** Display as `+372 1234 5678`. */
export function formatProfilePhoneDisplay({ countryCode, digits }: ProfilePhone): string {
  const grouped = digits.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  return `${countryCode} ${grouped}`
}

export function parseProfilePhoneDisplay(display: string): ProfilePhone {
  const match = display.match(/^(\+\d+)\s*(.*)$/)
  if (!match) return DEFAULT_PROFILE_PHONE
  return {
    countryCode: match[1]!,
    digits: match[2]!.replace(/\D/g, ''),
  }
}
