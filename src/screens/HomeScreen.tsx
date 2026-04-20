export function HomeScreen() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          Responsive React starter
        </h1>
        <p className="max-w-2xl text-lg text-slate-400">
          Screens live in <code className="text-sky-300">src/screens</code>, reusable UI in{' '}
          <code className="text-sky-300">src/components</code>. Resize the window to see the
          layout adapt.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="text-lg font-medium text-white">Mobile-first</h2>
          <p className="mt-2 text-sm text-slate-400">
            This grid stacks on small viewports and becomes two columns from the{' '}
            <code className="text-sky-300">sm</code> breakpoint up.
          </p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="text-lg font-medium text-white">GitHub Pages</h2>
          <p className="mt-2 text-sm text-slate-400">
            Production builds use <code className="text-sky-300">base: &apos;/Demo/&apos;</code>.
            Rename the repo? Update <code className="text-sky-300">vite.config.ts</code> to match.
          </p>
        </article>
      </section>
    </div>
  )
}
