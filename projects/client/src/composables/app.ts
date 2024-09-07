import type { QScrollArea } from 'quasar'
import { getConfigApi } from 'shared/api/config'
import type { IConfigDto } from 'shared/types/dto/config.interface'
import type { SysConfig } from 'shared/types/enum/config.enum'

const scrollEl = ref<QScrollArea>()
const page = ref<IConfigDto[SysConfig.ABOUT] | null>(null)

export function useClientApp() {
  async function getPageConfig(path: string) {
    if (path === '')
      path = 'home'
    page.value = null
    const data = await getConfigApi(path) || {}
    if (data)
      page.value = data
  }

  return {
    scrollEl,
    page,
    getPageConfig,
  }
}
