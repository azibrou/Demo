import { useMemo, useState } from 'react'

const SAMPLE_ITEMS = [
  { id: '1', title: 'Getting started', description: 'Project layout and routing overview.' },
  { id: '2', title: 'Deployment', description: 'GitHub Pages and base URL configuration.' },
  { id: '3', title: 'Styling', description: 'Tailwind utilities and responsive breakpoints.' },
]

export function SearchScreen() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return SAMPLE_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Search</h1>
        <p className="text-slate-400">
          Type to filter sample topics. This screen is wired at{' '}
          <code className="text-sky-300">/search</code> like the other routes.
        </p>
      </div>

      <label className="block space-y-2">
        <span className="sr-only">Search</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics…"
          autoComplete="off"
          className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none ring-sky-500/40 focus:border-sky-600 focus:ring-2"
        />
      </label>

      {query.trim() === '' ? (
        <p className="text-sm text-slate-500">Enter a term to see matching results.</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-slate-500">No matches for &ldquo;{query.trim()}&rdquo;.</p>
      ) : (
        <ul className="space-y-3">
          {results.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3"
            >
              <p className="font-medium text-white">{item.title}</p>
              <p className="mt-1 text-sm text-slate-400">{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
