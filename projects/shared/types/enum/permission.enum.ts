/**
 * 粒子化权限类型
 */
export enum PermissionType {
  /**
   * ---------------- 超级管理员 -------------------
   * 管理后台全部功能的管理权限
   * @deprecated 只能使用最细粒度的权限
   */

  // ------------------- 用户 ---------------------
  /** 创建用户 */
  USER_CREATE = 'user:create',
  /** 删除用户 */
  USER_DELETE = 'user:delete',
  /** 更新用户 */
  USER_UPDATE = 'user:update',
  /** 查询用户 */
  USER_QUERY = 'user:query',
  /** 清空用户密码 */
  USER_CLEAR_PASSWORD = 'user:clear-password',
  /** 更新用户的管理角色 */
  USER_UPDATE_ROLE = 'user:update-role',
  /** 恢复用户 */
  USER_RECOVER = 'user:recover',

  // ------------------ 管理角色 ---------------------
  /** 创建管理角色 */
  ROLE_CREATE = 'role:create',
  /** 删除管理角色 */
  ROLE_DELETE = 'role:delete',
  /** 更新管理角色 */
  ROLE_UPDATE = 'role:update',
  /** 查询管理角色 */
  ROLE_QUERY = 'role:query',
  /** 查询管理角色分配列表 */
  ROLE_ASSIGN_QUERY = 'role:assign-query',

  // ------------------ 大屏数据管理 ---------------------
  /** 查询数据  */
  SCREEN_QUERY = 'screen:query',
  /** 更新数据 */
  SCREEN_UPLOAD = 'screen:upload',
  /** 下载（备份）数据 */
  SCREEN_DOWNLOAD = 'screen:download',
  /** 查看数据字典 */
  SCREEN_DICTIONARIES = 'screen:dictionaries',
}

/**
 * 粒子化权限类型的描述
 */
export const permissionDescriptions: Record<PermissionType, string> = {
  [PermissionType.USER_CREATE]: '创建用户',
  [PermissionType.USER_DELETE]: '删除用户',
  [PermissionType.USER_UPDATE]: '更新用户',
  [PermissionType.USER_QUERY]: '查询用户',
  [PermissionType.USER_CLEAR_PASSWORD]: '清空用户密码',
  [PermissionType.USER_UPDATE_ROLE]: '更新用户的管理角色',
  [PermissionType.USER_RECOVER]: '恢复用户',

  [PermissionType.ROLE_CREATE]: '创建角色权限',
  [PermissionType.ROLE_DELETE]: '删除角色权限',
  [PermissionType.ROLE_UPDATE]: '更新角色权限',
  [PermissionType.ROLE_QUERY]: '查询角色权限',
  [PermissionType.ROLE_ASSIGN_QUERY]: '查询角色权限分配列表',

  [PermissionType.SCREEN_QUERY]: '查询数据',
  [PermissionType.SCREEN_UPLOAD]: '更新数据',
  [PermissionType.SCREEN_DOWNLOAD]: '下载（备份）数据',
  [PermissionType.SCREEN_DICTIONARIES]: '查看数据字典',
}
