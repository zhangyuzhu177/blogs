import { PermissionType } from 'shared/types/enum/permission.enum'

export interface PermissionItem {
  name: string
  to?: string
  /** 说明 */
  desc?: string
  flag?: boolean
  premise?: PermissionType[]
  value?: PermissionType[]
  children?: PermissionItem[]
}

export const ADMIN_MENU_LIST: PermissionItem[] = [
  {
    name: '首页',
    to: '/home',
    value: [
      PermissionType.CONFIG_QUERY_APP,
    ],
    children: [
      {
        name: '首页',
      },
      {
        name: '页面管理',
        children: [
          {
            name: '只读访问页面配置',
            value: [
              PermissionType.CONFIG_QUERY_APP,
            ],
          },
          {
            name: '编辑页面配置',
            premise: [
              PermissionType.CONFIG_QUERY_APP,
            ],
            value: [
              PermissionType.CONFIG_UPSERT_APP,
            ],
          },
        ],
      },
    ],
  },
  {
    name: '用户管理',
    to: '/user',
    value: [
      PermissionType.USER_QUERY,
    ],
    children: [
      {
        name: '用户信息管理',
        children: [
          {
            name: '只读访问用户信息',
            value: [
              PermissionType.USER_QUERY,
            ],
          },
          {
            name: '创建用户信息',
            premise: [
              PermissionType.USER_QUERY,
            ],
            value: [
              PermissionType.USER_CREATE,
            ],
          },
          {
            name: '清空用户密码',
            premise: [
              PermissionType.USER_QUERY,
            ],
            value: [
              PermissionType.USER_CLEAR_PASSWORD,
            ],
          },
          {
            name: '停用和启用用户',
            premise: [
              PermissionType.USER_QUERY,
            ],
            value: [
              PermissionType.USER_DELETE,
              PermissionType.USER_UPDATE,
            ],
          },
        ],
      },
    ],
  },
  {
    name: '管理员配置',
    to: '/admin',
    value: [
      PermissionType.ROLE_QUERY,
      PermissionType.ROLE_ASSIGN_QUERY,
    ],
    children: [
      {
        name: '设置管理角色',
        children: [
          {
            name: '只读访问管理角色',
            value: [
              PermissionType.ROLE_QUERY,
            ],
          },
          {
            name: '设置管理角色',
            premise: [
              PermissionType.ROLE_QUERY,
            ],
            value: [
              PermissionType.ROLE_CREATE,
              PermissionType.ROLE_UPDATE,
              PermissionType.ROLE_DELETE,
            ],
          },
        ],
      },
      {
        name: '分配管理角色',
        children: [
          {
            name: '只读访问用户管理列表',
            value: [
              PermissionType.ROLE_ASSIGN_QUERY,
            ],
          },
          {
            name: '分配管理角色',
            premise: [
              PermissionType.ROLE_ASSIGN_QUERY,
            ],
            value: [
              PermissionType.USER_UPDATE_ROLE,
            ],
          },
        ],
      },
    ],
  },
]
