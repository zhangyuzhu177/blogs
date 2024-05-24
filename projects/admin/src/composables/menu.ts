import { PermissionType } from "shared/types/enum/permission.enum"

interface MenuItem {
  id: string
  label: string
  flag?: boolean
}

const { adminRole } = useUser()

/** 当前激活菜单 */
const active = ref<string>()

export function useMenu() {
  const $route = useRoute()

  /** 菜单 */
  const menu = computed<MenuItem[] | undefined>(() => {
    const role = adminRole.value
    const menu: Record<string, MenuItem[]> = {
      page: [
        {
          id: 'page',
          label: '页面管理',
          flag: role?.includes(PermissionType.CONFIG_QUERY_APP),
        }
      ],
      user: [
        {
          id: 'userInfo',
          label: '用户信息管理',
          flag: role?.includes(PermissionType.USER_QUERY),
        },
      ],
      admin: [
        {
          id: 'adminRole',
          label: '设置管理角色',
          flag: role?.includes(PermissionType.ROLE_QUERY),
        },
        {
          id: 'adminAssign',
          label: '分配管理角色',
          flag: role?.includes(PermissionType.ROLE_ASSIGN_QUERY),
        },
      ],
    }
    return menu[$route.path.substring(1)]
  })

  return {
    active,
    menu,
  }
}
