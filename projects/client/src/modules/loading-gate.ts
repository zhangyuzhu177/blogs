import type { UserModule } from '../types'

export const install: UserModule = ({ router }) => {
  if (import.meta.env.SSR)
    return

  let resolved = false

  const finishInitialLoading = () => {
    if (resolved)
      return
    resolved = true

    const loader = document.getElementById('app-loading')
    if (!loader)
      return

    loader.classList.add('fade-out')
    loader.addEventListener('transitionend', () => loader.remove(), { once: true })
    window.setTimeout(() => loader.remove(), 480)
  }

  if (document.readyState === 'complete')
    finishInitialLoading()
  else
    window.addEventListener('load', finishInitialLoading, { once: true })

  router.isReady().then(finishInitialLoading)
}
