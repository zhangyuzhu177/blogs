import type { UserModule } from '~/types'

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach(async (to, _, next) => {
      next()
      // const toPath = to.path.toLowerCase()
      // if (toPath !== to.path)
      //   return next(toPath)

      // const { path } = to
      // const isLogin = !!authToken.value
      // const { userInfo, logout, getOwnProfile } = useUser()
      // const { adminMenu } = useRole()

      // // 前往登录页面
      // if (isLoginPage(path)) {
      //   localStorage.removeItem(LEADING_PAGE_KEY)
      //   // 登录用户 重定向到 首页
      //   if (isLogin)
      //     return next('/')
      // }
      // // 前往 非登录/注册页
      // else {
      //   // 未登录用户 重定向到 非登录/注册页
      //   if (!isLogin) {
      //     return next('/auth')
      //   }
      //   // 登录用户
      //   else {
      //     if (!userInfo.value) {
      //       try {
      //         await getOwnProfile()
      //       }
      //       catch (_) {
      //         const { isAdmin } = useSysConfig()
      //         isAdmin.value = true
      //         logout()
      //       }
      //     }

      //     // 前往 非denied页面，判断权限
      //     if (path !== '/denied') {
      //       // 没有权限 重定向到 denied页面
      //       if (!adminMenu.value.length)
      //         return next('/denied')
      //       // 前往的页面没有权限 重定向到 有权限的第一个页面
      //       else if (!adminMenu.value.some(({ to }) => to === path))
      //         return next(adminMenu.value[0].to!)
      //     }
      //     // 前往denied页面，有权限 重定向到 有权限的第一个页面
      //     else if (adminMenu.value.length) {
      //       return next(adminMenu.value[0].to!)
      //     }
      //   }
      // }

      // next()
    })
  }
}

/**
 * 判断前往的是否为 登录/注册页
 */
function isLoginPage(path: string) {
  return path === '/auth' || path.startsWith('/auth/')
}
