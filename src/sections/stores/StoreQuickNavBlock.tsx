import { useNavigate } from 'react-router-dom'
import { STORE_MORE_TO_EXPLORE_BLOCK_ID } from './StoreMoreToExploreBlock'
import { design } from '../../lib/figmaDesignAssets'

const q = design.quickNav

const actions = [
  {
    id: 'search',
    label: 'Search',
    icon: q.search,
    paddingClass: 'p-2.5',
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: q.burger,
    paddingClass: 'p-3',
  },
  {
    id: 'my-list',
    label: 'My list',
    icon: q.listSquareOutline,
    paddingClass: 'p-2.5',
  },
] as const

/** Node 70416:856462 — Search / Categories / My list quick actions */
export function StoreQuickNavBlock() {
  const navigate = useNavigate()

  return (
    <nav
      className="font-sans flex w-full flex-col items-center gap-3 px-6 pb-3"
      aria-label="Quick navigation"
    >
      <div className="flex w-full items-start gap-3">
        {actions.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (item.id === 'my-list') navigate('shopping-list')
              if (item.id === 'categories') {
                document.getElementById(STORE_MORE_TO_EXPLORE_BLOCK_ID)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }
            }}
            className={[
              'flex min-h-0 min-w-0 flex-[1_0_0] flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-[rgba(0,45,30,0.07)] text-[#191f1c]',
              'h-[68px] text-center text-xs font-semibold leading-[15px]',
              item.paddingClass,
            ].join(' ')}
          >
            <span className="relative size-6 shrink-0" aria-hidden>
              <img
                alt=""
                src={item.icon}
                className="pointer-events-none absolute inset-0 block size-full max-w-none"
              />
            </span>
            <span className="w-full min-w-0 shrink-0 text-center">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
