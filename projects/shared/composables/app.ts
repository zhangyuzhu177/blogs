import { useFavicon, useTitle, useWindowSize } from '@vueuse/core'
import { useHead } from '@vueuse/head'
import { computed, ref } from 'vue'

/** 应用名称 */
export const APP_NAME = '南方科技大学'

export const APP_ICON = '/logo.svg'

/** 应用英文名称 */
export const APP_NAME_EN = ''

/**
 * 应用的最小宽度
 */
export const APP_MIN_WIDTH = 600


const { width } = useWindowSize()

/** 首页导航栏配置 */
const nav = ref()
/** App配置 */
const app = ref()
/** 是否在管理后台 */
const isAdmin = ref(false)
export function useApp() {
  /**
   * 修改 APP Head
   */
  function updateAppHead(title?: string, icon?: string, description?: string) {
    useTitle(title)
    useHead({
      meta: [
        {
          name: 'description',
          content: description,
        },
      ],
    })
    useFavicon(icon)
  }

  return {
    updateAppHead,
  }
}

export function useSysConfig() {
  /**
   * 获取App配置
   */
  async function getAppConfig(useCache = true) {
    if (useCache && app.value)
      return
    app.value = {
      name: APP_NAME,
      icon: APP_ICON,
      nameEn: APP_NAME_EN,
    }
  }

  /**
   * 获取首页导航栏
   */
  // async function getNavConfig(useCache = true) {
  //   if (useCache && nav.value)
  //     return
  //   nav.value = {
  //     screenData: SCREEN_DATA_ADMIN,
  //   }
  // }

  /**
   * 窗口缩放比例
   */
  const zoomRatio = computed(() => width.value >= APP_MIN_WIDTH ? 1 : width.value / APP_MIN_WIDTH)
  return {
    app,
    nav,
    getAppConfig,
    isAdmin,
    zoomRatio,
  }
}
