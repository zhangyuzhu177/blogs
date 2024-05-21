import type { QScrollArea } from 'quasar'
import { getConfigApi } from 'shared/api/config'
import { IConfigDto } from 'shared/types/dto/config.interface'
import { SysConfig } from 'shared/types/enum/config.enum'


const scrollEl = ref<QScrollArea>()
const page=ref<IConfigDto[SysConfig.HOME]>()

export function useClientApp() {

  async function getPageConfig(path:string) {
    const data = await getConfigApi(path.slice(1))
    if(data)
      page.value=data
  }

  return {
    scrollEl,
    page,
    getPageConfig
  }
}
