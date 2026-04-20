export function AboutScreen() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">About</h1>
      <p className="text-slate-400">
        This page is a separate screen under <code className="text-sky-300">src/screens</code>.
        Routing uses React Router with <code className="text-sky-300">basename</code> set from{' '}
        <code className="text-sky-300">import.meta.env.BASE_URL</code> so links work on GitHub
        Pages project URLs.
      </p>
      <ul className="list-inside list-disc space-y-2 text-slate-400">
        <li>Public source: push this project to a public GitHub repository.</li>
        <li>
          Enable <strong className="text-slate-200">Pages</strong> with the included GitHub
          Actions workflow.
        </li>
        <li>Open the site at https://&lt;user&gt;.github.io/Demo/ (adjust for your username).</li>
      </ul>
    </div>
  )
}
