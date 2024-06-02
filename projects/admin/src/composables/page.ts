import { SysConfig } from "shared/types/enum/config.enum";

interface Nav{
  id: SysConfig;
  label: string;
}

const PAGE_NAV:Nav[] = [
  {
    id: SysConfig.APP,
    label: "APP设置"
  },
  {
    id: SysConfig.HOME,
    label: "首页设置"
  },
  {
    id: SysConfig.ARTICLE,
    label: "文章页设置"
  },
  {
    id: SysConfig.ABOUT,
    label: "关于页设置"
  },
]

const active=ref<SysConfig>(SysConfig.APP)

export function usePageAdmin() {

  return {
    PAGE_NAV,
    active
  }
}
