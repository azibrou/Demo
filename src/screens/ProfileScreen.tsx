import { useEffect, useLayoutEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { KalepIcon } from '../components/KalepIcon'
import { ListItem } from '../components/ListItem'
import { NavBar } from '../components/NavBar'
import { useProfileBack } from '../hooks/useProfileBack'
import { PROFILE_EDIT_PHONE_PATH } from '../lib/profileNavigation'
import { design } from '../lib/figmaDesignAssets'
import { formatProfilePhoneDisplay, type ProfilePhone } from '../lib/profilePhone'
import { getProfilePhone, subscribeProfilePhone } from '../lib/profilePhoneStore'

/** Figma 80613:193586 — Profile */
const p = design.profile

type ThemeId = 'system' | 'light' | 'dark'

const THEMES: { id: ThemeId; label: string; image: string }[] = [
  { id: 'system', label: 'System', image: p.themeSystem },
  { id: 'light', label: 'Light', image: p.themeLight },
  { id: 'dark', label: 'Dark', image: p.themeDark },
]

function SectionHeader({
  title,
  actionLabel,
  onActionClick,
}: {
  title: string
  actionLabel?: string
  onActionClick?: () => void
}) {
  return (
    <div className="flex items-start gap-3 pt-3">
      <p className="bolt-font-heading-xs-accent min-w-0 flex-1 text-[var(--color-content-primary)]">{title}</p>
      {actionLabel ? (
        <button
          type="button"
          onClick={onActionClick}
          className="flex shrink-0 items-center gap-1 rounded outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
        >
          <span className="bolt-font-body-s-accent text-[var(--color-content-primary)]">{actionLabel}</span>
          <KalepIcon name="chevron-right" size={20} />
        </button>
      ) : null}
    </div>
  )
}

function QuickTile({ label, illustration }: { label: string; illustration: string }) {
  return (
    <button
      type="button"
      className="flex min-w-0 flex-1 flex-col items-center rounded-lg border-2 border-transparent bg-[var(--color-bg-neutral-secondary)] outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
    >
      <div className="relative h-[54px] w-[108px] shrink-0 overflow-hidden">
        <img alt="" src={illustration} className="pointer-events-none absolute inset-0 m-auto max-h-[78%] max-w-[50%] object-contain" />
      </div>
      <p className="bolt-font-body-s-accent w-full truncate px-1 pb-2.5 pt-1.5 text-center text-[var(--color-content-primary)]">
        {label}
      </p>
    </button>
  )
}

function MastercardBadge() {
  return (
    <div className="flex size-6 shrink-0 items-center justify-center rounded bg-[#1a1f71] text-[8px] font-bold text-white">
      MC
    </div>
  )
}

function KalepLeading({ name }: { name: Parameters<typeof KalepIcon>[0]['name'] }) {
  return <KalepIcon name={name} size={24} />
}

export function ProfileScreen() {
  const onBack = useProfileBack()
  const navigate = useNavigate()
  const location = useLocation()
  const [phone, setPhone] = useState<ProfilePhone>(getProfilePhone)
  const [theme, setTheme] = useState<ThemeId>('system')

  useEffect(() => subscribeProfilePhone(() => setPhone(getProfilePhone())), [])

  useLayoutEffect(() => {
    if (location.pathname === '/profile') {
      setPhone(getProfilePhone())
    }
  }, [location.pathname, location.key])

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div
      className="bolt-font-base relative min-h-svh w-full bg-[var(--color-layer-floor-1,#fff)] pb-[calc(24px+env(safe-area-inset-bottom,0px))] text-[var(--color-content-primary)]"
      data-node-id="80613:193586"
    >
      <NavBar title="Hello, friend!" onBack={onBack} collapseMode="onScroll" />

      <div className="flex flex-col gap-6 px-6 pb-6 pt-4">
        <div className="flex gap-3">
          <QuickTile label="Orders" illustration={p.ordersIllustration} />
          <QuickTile label="Favourites" illustration={p.favouritesIllustration} />
        </div>

        <section className="flex flex-col gap-3.5">
          <SectionHeader title="Payment" actionLabel="All" />
          <div>
            <ListItem
              variant="profileDetail"
              title="•••• 1692"
              subtitle="Change"
              leadingSlot={<MastercardBadge />}
            />
            <ListItem
              variant="profileDetail"
              title="Bolt Balance"
              subtitle="Add money"
              trailingValue="6,50 €"
              showInfoIcon
              infoIconSrc={p.info}
              leadingSlot={<KalepLeading name="basket-wide" />}
              showDivider={false}
            />
          </div>
        </section>

        <section className="flex flex-col">
          <SectionHeader title="Profile" />
          <ListItem
            variant="profile"
            title="Vieno Rauni"
            trailingAction="Edit"
            leadingSlot={<KalepLeading name="user-alt-outline" />}
          />
          <ListItem
            variant="profile"
            title={formatProfilePhoneDisplay(phone)}
            trailingAction="Edit"
            leadingSlot={<KalepLeading name="tab-merchant-search" />}
            onTrailingActionClick={() =>
              navigate(PROFILE_EDIT_PHONE_PATH, { state: { phone: getProfilePhone() } })
            }
          />
          <ListItem
            variant="profile"
            title="pavel.zubarev@bolt.eu"
            trailingAction="Edit"
            leadingSlot={<KalepLeading name="share-ios" />}
            showDivider={false}
          />
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeader title="Theme" />
          <div className="flex gap-6">
            {THEMES.map((item) => {
              const selected = theme === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id)}
                  className="flex flex-col items-center gap-2 outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
                >
                  <span
                    className={[
                      'relative flex size-14 items-center justify-center rounded-full',
                      selected ? 'ring-2 ring-[#2b8659] ring-offset-2' : 'ring-1 ring-[var(--color-border-separator)]',
                    ].join(' ')}
                  >
                    <img alt="" src={item.image} className="size-14 rounded-full" />
                  </span>
                  <span className="bolt-font-body-xs-regular text-[var(--color-content-primary)]">{item.label}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="flex flex-col">
          <SectionHeader title="Other" />
          <ListItem variant="profileMenu" title="Join Bolt Plus" leadingIconSrc={p.boltPlus} />
          <ListItem variant="profileMenu" title="Promo codes" leadingSlot={<KalepLeading name="offer-outline" />} />
          <ListItem variant="profileMenu" title="Account settings" leadingSlot={<KalepLeading name="filters" />} />
          <ListItem variant="profileMenu" title="Privacy" leadingSlot={<KalepLeading name="stop-hand" />} />
          <ListItem variant="profileMenu" title="About" leadingIconSrc={p.info} />
          <ListItem
            variant="profileMenu"
            title="Support"
            leadingSlot={<KalepLeading name="offer-outline" />}
            showDivider={false}
          />
        </section>

        <button
          type="button"
          className="w-full overflow-hidden rounded-2xl text-white outline-none ring-[var(--color-special-brand-alt)]/20 focus-visible:ring-2"
          aria-label="Become a courier — earn money on your schedule"
        >
          <img
            alt="Become a courier — earn money on your schedule"
            src={p.courierBanner}
            className="pointer-events-none block w-full object-cover"
          />
        </button>
      </div>
    </div>
  )
}
