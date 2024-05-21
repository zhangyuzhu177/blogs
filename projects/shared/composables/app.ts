import { useFavicon, useTitle, useWindowSize } from '@vueuse/core'
import { useHead } from '@vueuse/head'
import { computed, ref } from 'vue'
import { APP_ICON, APP_MIN_WIDTH, APP_NAME, APP_NAME_EN } from '../constants/app'
import { getConfigApi } from '../api/config'
import { SysConfig } from '../types/enum/config.enum'
import { IConfigDto } from '../types/dto/config.interface'

const { width } = useWindowSize()

/** 首页导航栏配置 */
const nav = ref()
/** App配置 */
const app = ref<IConfigDto[SysConfig.APP]>()
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
    const res = await getConfigApi(SysConfig.APP) || {}
    console.log(res);

    app.value = {
      name: res.name || APP_NAME,
      icon: res.icon || APP_ICON,
      nameEn: res.nameEn || APP_NAME_EN,
    }
  }

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
