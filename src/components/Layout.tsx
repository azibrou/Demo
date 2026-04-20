import { Outlet } from 'react-router-dom'
import { AppNav } from './AppNav'

export function Layout() {
  return (
    <div className="flex min-h-svh flex-col bg-slate-950 text-slate-100">
      <AppNav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <Outlet />
      </main>
      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        Built with Vite, React, and Tailwind — deploy to GitHub Pages.
      </footer>
    </div>
  )
}
