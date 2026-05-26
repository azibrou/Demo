/** Merchant detail routes inside the eater hub scroll shell. */
export function isMerchantHubPath(pathname: string): boolean {
  const last = pathname.split('/').filter(Boolean).pop()
  return last === 'restaurant' || last === 'store-merchant'
}
