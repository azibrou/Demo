import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css'
import App from './App.tsx'

// #region agent log
const __dbgEndpoint = 'http://127.0.0.1:7925/ingest/45be67dd-d12d-4fef-ace7-ba1f69e232a9'
const __dbg = (message: string, data: Record<string, unknown>, hypothesisId: string) => {
  fetch(__dbgEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '6d9541' },
    body: JSON.stringify({
      sessionId: '6d9541',
      location: 'main.tsx',
      message,
      data,
      hypothesisId,
      timestamp: Date.now(),
      runId: 'app-boot',
    }),
  }).catch(() => {})
}
// #endregion

// #region agent log
__dbg(
  'boot',
  {
    href: typeof location !== 'undefined' ? location.href : '',
    baseUrl: import.meta.env.BASE_URL,
    mode: import.meta.env.MODE,
    hasRoot: !!document.getElementById('root'),
  },
  'H-C',
)
window.addEventListener('error', (e) => {
  __dbg('window.error', { message: e.message, filename: e.filename }, 'H-C')
})
window.addEventListener('unhandledrejection', (e) => {
  __dbg('unhandledrejection', { reason: String(e.reason) }, 'H-C')
})
// #endregion

const rootEl = document.getElementById('root')
if (!rootEl) {
  // #region agent log
  __dbg('missing #root', {}, 'H-E')
  // #endregion
  throw new Error('Missing #root element')
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// #region agent log
__dbg('react.render.called', { baseUrl: import.meta.env.BASE_URL }, 'H-C')
// #endregion
