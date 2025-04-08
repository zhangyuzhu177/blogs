import { useFavicon, useTitle, useWindowSize } from '@vueuse/core'
import { useHead } from '@vueuse/head'
import { computed, ref } from 'vue'
import { APP_MIN_WIDTH } from '../constants/app'

const { width } = useWindowSize()

/** 首页导航栏配置 */
const nav = ref()
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
   * 窗口缩放比例
   */
  const zoomRatio = computed(() => width.value >= APP_MIN_WIDTH ? 1 : width.value / APP_MIN_WIDTH)
  return {
    nav,
    isAdmin,
    zoomRatio,
  }
}
