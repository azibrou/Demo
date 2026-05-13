import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-slate-800 text-white'
      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100',
  ].join(' ')

export function AppNav() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <NavLink
          to="/"
          end
          className="text-lg font-semibold tracking-tight text-white hover:text-sky-300"
        >
          Demo
        </NavLink>
        <nav className="flex flex-wrap gap-1 sm:justify-end" aria-label="Main">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/store-merchant" className={linkClass}>
            Store merchant
          </NavLink>
          <NavLink to="/restaurant-merchant" className={linkClass}>
            Restaurant merchant
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            Profile
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
