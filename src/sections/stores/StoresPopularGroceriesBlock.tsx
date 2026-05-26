import { RetailSnippet } from '../../components/RetailSnippet'
import { storesRetailSnippetProducts, storesRetailSnippetStore } from '../../lib/boltFoodTallinnStoresContent'

/** Popular groceries — Figma 77303:218316 (retail snippet only, no section title). */
export function StoresPopularGroceriesBlock() {
  return (
    <section className="stores-popular-groceries w-full" data-node-id="77303:218316">
      <RetailSnippet store={storesRetailSnippetStore} products={storesRetailSnippetProducts} />
    </section>
  )
}
