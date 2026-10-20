import NProgress from 'nprogress'
import type { UserModule } from '~/types'

/** 路由切换用的默认配置，阅读进度会临时改掉它，离开前必须还原 */
export const routeNProgressOptions = {
  minimum: 0.08,
  easing: 'ease',
  speed: 200,
  trickle: true,
  trickleSpeed: 800,
  showSpinner: true,
}

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach((to, from) => {
      if (to.path !== from.path) {
        NProgress.configure(routeNProgressOptions)
        NProgress.start()
      }
    })
    router.afterEach((to, from) => {
      if (to.path !== from.path)
        NProgress.done()
    })
  }
}
