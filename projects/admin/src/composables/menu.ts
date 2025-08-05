import { PermissionType } from 'types'

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
      home: [
        {
          id: 'page',
          label: '页面配置',
          flag: role?.includes(PermissionType.CONFIG_QUERY_APP),
        },
      ],
      article: [
        {
          id: 'article',
          label: '文章信息',
          flag: role?.includes(PermissionType.ARTICLE_QUERY),
        },
        {
          id: 'articleType',
          label: '文章分类',
          flag: role?.includes(PermissionType.ARTICLE_TYPE_QUERY),
        },
        {
          id: 'articleTag',
          label: '文章标签',
          flag: role?.includes(PermissionType.ARTICLE_TAG_QUERY),
        },
      ],
      gallery: [
        {
          id: 'gallery',
          label: '图库信息',
          flag: role?.includes(PermissionType.GALLERY_QUERY),
        },
        {
          id: 'galleryType',
          label: '图库分类',
          flag: role?.includes(PermissionType.GALLERY_TYPE_QUERY),
        },
      ],
      user: [
        {
          id: 'user',
          label: '用户信息',
          flag: role?.includes(PermissionType.USER_QUERY),
        },
        {
          id: 'role',
          label: '管理角色',
          flag: role?.includes(PermissionType.ROLE_QUERY),
        },
      ],
      monitor: [
        {
          id: 'server-monitor',
          label: '服务器监控',
          flag: role?.includes(PermissionType.SYSTEM_MONITOR_QUERY),
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
