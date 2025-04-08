import { SysConfig } from 'types'

interface Nav {
  id: SysConfig
  label: string
}

const PAGE_NAV: Nav[] = [
  {
    id: SysConfig.HOME,
    label: '首页设置',
  },
  {
    id: SysConfig.ABOUT,
    label: '关于设置',
  },
]

const active = ref<SysConfig>(SysConfig.HOME)

export function usePageAdmin() {
  return {
    PAGE_NAV,
    active,
  }
}
