import NProgress from 'nprogress'
import type { Ref } from 'vue'
import { routeNProgressOptions } from '~/modules/nprogress'

const readingNProgressOptions = {
  minimum: 0,
  easing: 'linear',
  speed: 0,
  trickle: false,
  showSpinner: false,
}

interface ScrollAreaExpose {
  getScrollTarget?: () => Element | undefined
  $el?: Element
}

const originalTrickle = NProgress.trickle

/**
 * 用 NProgress 的顶栏显示文章阅读进度。
 * 只跟随滚动位置前进或回退，不使用 NProgress 自带的自动递增。
 */
export function useArticleProgress(articleRef: Ref<HTMLElement | undefined>) {
  const { scrollEl } = useClientApp()

  let pageAlive = false
  let reading = false
  let frame = 0
  let waitFrame = 0

  const scrollTarget = computed(() => {
    const area = scrollEl.value as ScrollAreaExpose | undefined
    const target = area?.getScrollTarget?.()
      ?? area?.$el?.querySelector('.q-scrollarea__container')
      ?? (typeof document === 'undefined'
        ? undefined
        : document.querySelector('.q-scrollarea__container'))
    return target instanceof HTMLElement ? target : undefined
  })

  function headerOffset(container: HTMLElement) {
    const header = document.querySelector('header.fixed')
    if (!header)
      return 0
    return Math.max(0, header.getBoundingClientRect().bottom - container.getBoundingClientRect().top)
  }

  function readProgress() {
    const container = scrollTarget.value
    const article = articleRef.value
    if (!container || !article || !article.offsetHeight)
      return 0

    const containerRect = container.getBoundingClientRect()
    const articleRect = article.getBoundingClientRect()
    const articleTop = articleRect.top - containerRect.top + container.scrollTop
    const offset = headerOffset(container)
    const start = articleTop - offset
    const end = articleTop + article.offsetHeight - container.clientHeight

    if (end <= start)
      return 0

    return Math.min(1, Math.max(0, (container.scrollTop - start) / (end - start)))
  }

  function articleBar() {
    const root = document.getElementById('nprogress')
    if (!root?.classList.contains('nprogress-article'))
      return undefined
    return root
  }

  function paint(progress: number) {
    if (!reading)
      return

    if (progress <= 0) {
      if (articleBar()) {
        NProgress.remove()
        NProgress.status = null
      }
      return
    }

    // 不走 NProgress.set：set 会写入 status，路由切换留下的 trickle 定时器会据此继续自动往前走。
    NProgress.status = null
    const root = articleBar() ?? NProgress.render(true)
    root.classList.add('nprogress-article')
    const bar = root.querySelector<HTMLElement>('.bar')
    if (!bar)
      return

    bar.style.transition = 'none'
    bar.style.transform = `translate3d(${(progress - 1) * 100}%,0,0)`
  }

  function schedule() {
    if (!reading)
      return
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      if (!reading)
        return
      paint(readProgress())
    })
  }

  function beginReading() {
    if (!pageAlive || reading)
      return
    reading = true
    NProgress.configure(readingNProgressOptions)
    NProgress.trickle = () => NProgress
    NProgress.status = null
    schedule()
  }

  function waitForRouteProgress(startedAt = performance.now()) {
    if (!pageAlive)
      return

    const routeBarPending = NProgress.isStarted() || !!document.getElementById('nprogress')
    if (routeBarPending && performance.now() - startedAt < 800) {
      waitFrame = requestAnimationFrame(() => waitForRouteProgress(startedAt))
      return
    }

    beginReading()
  }

  function stopReading() {
    reading = false
    cancelAnimationFrame(frame)
    cancelAnimationFrame(waitFrame)
    if (articleBar()) {
      NProgress.remove()
      NProgress.status = null
    }
    NProgress.trickle = originalTrickle
    NProgress.configure(routeNProgressOptions)
  }

  useEventListener(scrollTarget, 'scroll', schedule, { passive: true })
  useResizeObserver(articleRef, schedule)
  useResizeObserver(scrollTarget, schedule)
  watch(scrollTarget, () => {
    if (reading)
      schedule()
  })

  onMounted(() => {
    pageAlive = true
    waitForRouteProgress()
  })

  onBeforeRouteLeave(() => {
    stopReading()
  })

  onBeforeUnmount(() => {
    pageAlive = false
    stopReading()
  })
}
