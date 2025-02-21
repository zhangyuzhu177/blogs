import { PermissionType } from 'types'

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
        name: '页面配置',
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
    name: '文章管理',
    to: '/article',
    value: [
      PermissionType.ARTICLE_QUERY,
      PermissionType.ARTICLE_TYPE_QUERY,
    ],
    children: [
      {
        name: '文章信息管理',
        children: [
          {
            name: '只读访问文章信息',
            value: [
              PermissionType.ARTICLE_QUERY,
            ],
          },
          {
            name: '添加/编辑文章',
            premise: [
              PermissionType.ARTICLE_QUERY,
            ],
            value: [
              PermissionType.ARTICLE_PUBLISH,
              PermissionType.ARTICLE_UPDATE,
            ],
          },
          {
            name: '删除文章',
            premise: [
              PermissionType.ARTICLE_QUERY,
            ],
            value: [
              PermissionType.ARTICLE_DELETE,
            ],
          },
        ],
      },
      {
        name: '文章分类管理',
        children: [
          {
            name: '只读访问文章分类',
            value: [
              PermissionType.ARTICLE_TYPE_QUERY,
            ],
          },
          {
            name: '添加/编辑文章',
            premise: [
              PermissionType.ARTICLE_TYPE_QUERY,
            ],
            value: [
              PermissionType.ARTICLE_TYPE_CREATE,
              PermissionType.ARTICLE_TYPE_UPDATE,
            ],
          },
          {
            name: '删除文章分类',
            premise: [
              PermissionType.ARTICLE_TYPE_QUERY,
            ],
            value: [
              PermissionType.ARTICLE_TYPE_DELETE,
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
      PermissionType.ROLE_QUERY,
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
            name: '修改用户状态',
            premise: [
              PermissionType.USER_QUERY,
            ],
            value: [
              PermissionType.USER_CHANGE_STATUS,
            ],
          },
        ],
      },
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
            name: '添加/编辑管理角色',
            premise: [
              PermissionType.ROLE_QUERY,
            ],
            value: [
              PermissionType.ROLE_CREATE,
              PermissionType.ROLE_UPDATE,
            ],
          },
          {
            name: '删除管理角色',
            premise: [
              PermissionType.ROLE_QUERY,
            ],
            value: [
              PermissionType.ROLE_DELETE,
            ],
          },
        ],
      },
    ],
  },
]
