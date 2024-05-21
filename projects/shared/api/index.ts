import axios from 'axios'
import { Notify } from 'quasar'
import { useSysConfig } from '../composables/app'
import { authToken, useUser } from '../composables/user'
import { pubRouter } from 'utils/pubRouter'

const $http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
})

/**
 * 请求拦截器
 */
$http.interceptors.request.use(
  (config) => {
    const { headers, url = '' } = config
    if (authToken.value && !headers.Authorization)
      headers.Authorization = `Bearer ${authToken.value.trim()}`

    const baseURLWhiteList = ['http', '//']
    if (baseURLWhiteList.some(prefix => url.startsWith(prefix)))
      config.baseURL = ''

    if (url.startsWith('_/') || url.startsWith('/_/')) {
      config.url = url.slice(2)
      config.baseURL = ''
    }

    return config
  },
)

/**
 * 响应拦截器
 */
$http.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const { config, response } = error

    if (!response)
      return

    const { detail, message } = response.data
    const notify = config.headers.notify !== false

    // 判断登录是否有效（未登录/登录过期）
    if (response.status === 401) {
      const { logout } = useUser()
      logout(true)
    }

    const { isAdmin } = useSysConfig()
    // 管理后台，跳转路由
    if (isAdmin.value) {
      // 判断登录是否有效
      if (response.status === 401)
        pubRouter.value?.replace({ path: '/auth/login' })
    }

    if (notify) {
      if (Array.isArray(detail)) {
        detail.forEach(item =>
          showNotify(item.message),
        )
      }
      else if (detail) {
        showNotify(detail)
      }
      else {
        showNotify(message)
      }
    }

    return Promise.reject(error)
  },
)

/**
 * 展示错误通知
 * @param message
 */
function showNotify(message: string) {
  Notify.create({
    type: 'danger',
    message,
  })
}

export { $http }
