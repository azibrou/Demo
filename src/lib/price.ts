/** Parse a localized price string (e.g. `9,00 €` / `1 234,50 €`) to a number. */
export function parsePrice(price: string): number {
  const normalized = price
    .replace(/[^0-9,.\-\s]/g, '')
    .replace(/\s/g, '')
    .replace(/\.(?=\d{3})/g, '')
    .replace(',', '.')
  const value = Number.parseFloat(normalized)
  return Number.isNaN(value) ? 0 : value
}

/** Format a number as a localized euro string (e.g. `9,00 €`). */
export function formatEuro(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} €`
}
