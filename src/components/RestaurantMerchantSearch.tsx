import { KalepIcon } from './KalepIcon'

export type RestaurantMerchantSearchProps = {
  onSearchClick?: () => void
  className?: string
}

/**
 * Figma Restaurant search [79562:242428](https://www.figma.com/design/hTmBFTYdlynOcGtxFnHIbM/Consumer---in-progress?node-id=79562-242428)
 * — centered floating pill at the bottom of the restaurant merchant screen.
 */
export function RestaurantMerchantSearch({ onSearchClick, className = '' }: RestaurantMerchantSearchProps) {
  return (
    <div
      className={['restaurant-merchant-search-chrome', className].filter(Boolean).join(' ')}
      data-name="Restaurant search"
      data-node-id="79562:242428"
    >
      <button
        type="button"
        onClick={onSearchClick}
        className="restaurant-merchant-search"
        data-name="Search"
        data-node-id="79562:242429"
        aria-label="Search menu"
      >
        <KalepIcon name="search" size={24} />
        <span className="restaurant-merchant-search__label bolt-font-body-l-regular">Search</span>
      </button>
    </div>
  )
}
