import type { PermissionType } from 'types'
import { arrayDistinct, arrayHasIntersection, objectOmit } from 'utils'
import type { PermissionItem } from '~/constants/admin'

export function useRole() {
  /**
   * 管理后台用户菜单
   */
  const adminMenu = computed(() => {
    const { adminRole } = useUser()
    return getMenu(adminRole.value).filter(({ to }) => Boolean(to))
  })

  /**
   * 获取当前权限对应的菜单
   */
  function getMenu(permission?: PermissionType[]) {
    return ADMIN_MENU_LIST.filter(({ value, flag }) => (
      arrayHasIntersection(value ?? [], permission ?? [])
      && flag !== false
    ))
      .map(v => objectOmit(v, 'children'))
  }

  /**
   * 获取当前权限下的所有粒子化权限
   * @param flag 是否包含前置权限
   */
  function getPermission(data: PermissionItem | Partial<PermissionItem>[], flag = false): PermissionType[] {
    const arr: PermissionType[] = []
    if (!Array.isArray(data))
      data = [{ children: [data] }]

    data.forEach((item) => {
      const { premise, value, children } = item
      if (flag && premise?.length)
        arr.push(...premise)
      if (value?.length)
        arr.push(...value)
      if (children?.length)
        arr.push(...getPermission(children, flag))
    })
    return arrayDistinct(arr)
  }
  return {
    adminMenu,
    getMenu,
    getPermission,
  }
}
