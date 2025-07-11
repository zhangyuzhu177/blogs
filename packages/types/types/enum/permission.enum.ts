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
  /** 更新用户 */
  USER_UPDATE = 'user:update',
  /** 查询用户 */
  USER_QUERY = 'user:query',
  /** 清空用户密码 */
  USER_CLEAR_PASSWORD = 'user:clear-password',
  /** 更新用户的管理角色 */
  USER_UPDATE_ROLE = 'user:update-role',
  /** 修改用户状态 */
  USER_CHANGE_STATUS = 'user:change-status',

  // ------------------ 管理角色 ---------------------
  /** 创建管理角色 */
  ROLE_CREATE = 'role:create',
  /** 删除管理角色 */
  ROLE_DELETE = 'role:delete',
  /** 更新管理角色 */
  ROLE_UPDATE = 'role:update',
  /** 查询管理角色 */
  ROLE_QUERY = 'role:query',

  // ------------------ 全局配置 ---------------------
  /** 查询应用全局配置 */
  CONFIG_QUERY_APP = 'config:query-app',
  /** 创建/更新应用全局配置 */
  CONFIG_UPSERT_APP = 'config:upsert-app',

  // ------------------ 文章管理 ---------------------
  /** 发布文章 */
  ARTICLE_PUBLISH = 'article:publish',
  /** 删除文章 */
  ARTICLE_DELETE = 'article:delete',
  /** 更新文章 */
  ARTICLE_UPDATE = 'article:update',
  /** 查询文章 */
  ARTICLE_QUERY = 'article:query',
  /* 修改文章状态 */
  ARTICLE_UPDATE_STATUS = 'article:update-status',

  /** 查询文章分类 */
  ARTICLE_TYPE_QUERY = 'article-type:query',
  /** 创建文章分类 */
  ARTICLE_TYPE_CREATE = 'article-type:create',
  /** 更新文章分类 */
  ARTICLE_TYPE_UPDATE = 'article-type:update',
  /** 删除文章分类 */
  ARTICLE_TYPE_DELETE = 'article-type:delete',

  /** 查询文章标签 */
  ARTICLE_TAG_QUERY = 'article-tag:query',
  /** 创建文章标签 */
  ARTICLE_TAG_CREATE = 'article-tag:create',
  /** 更新文章标签 */
  ARTICLE_TAG_UPDATE = 'article-tag:update',
  /** 删除文章标签 */
  ARTICLE_TAG_DELETE = 'article-tag:delete',

  // ------------------ 图库管理 ---------------------
  /** 查询图库 */
  GALLERY_QUERY = 'gallery:query',
  /** 创建图库 */
  GALLERY_CREATE = 'gallery:create',
  /** 更新图库 */
  GALLERY_UPDATE = 'gallery:update',
  /** 删除图库 */
  GALLERY_DELETE = 'gallery:delete',
  /** 修改图库状态 */
  GALLERY_CHANGE_STATUS = 'gallery:change-status',

  /** 查询图库类型 */
  GALLERY_TYPE_QUERY = 'gallery-type:query',
  /** 创建图库类型 */
  GALLERY_TYPE_CREATE = 'gallery-type:create',
  /** 更新图库类型 */
  GALLERY_TYPE_UPDATE = 'gallery-type:update',
  /** 删除图库类型 */
  GALLERY_TYPE_DELETE = 'gallery-type:delete',
}

/**
 * 粒子化权限类型的描述
 */
export const permissionDescriptions: Record<PermissionType, string> = {
  [PermissionType.USER_CREATE]: '创建用户',
  [PermissionType.USER_UPDATE]: '更新用户',
  [PermissionType.USER_QUERY]: '查询用户',
  [PermissionType.USER_CLEAR_PASSWORD]: '清空用户密码',
  [PermissionType.USER_UPDATE_ROLE]: '更新用户的管理角色',
  [PermissionType.USER_CHANGE_STATUS]: '修改用户状态',

  [PermissionType.ROLE_CREATE]: '创建角色权限',
  [PermissionType.ROLE_DELETE]: '删除角色权限',
  [PermissionType.ROLE_UPDATE]: '更新角色权限',
  [PermissionType.ROLE_QUERY]: '查询角色权限',

  [PermissionType.CONFIG_QUERY_APP]: '查询应用全局配置',
  [PermissionType.CONFIG_UPSERT_APP]: '创建/更新应用全局配置',

  [PermissionType.ARTICLE_PUBLISH]: '发布文章',
  [PermissionType.ARTICLE_DELETE]: '删除文章',
  [PermissionType.ARTICLE_UPDATE]: '更新文章',
  [PermissionType.ARTICLE_QUERY]: '查询文章',
  [PermissionType.ARTICLE_UPDATE_STATUS]: '修改文章状态',

  [PermissionType.ARTICLE_TYPE_QUERY]: '查询文章分类',
  [PermissionType.ARTICLE_TYPE_CREATE]: '创建文章分类',
  [PermissionType.ARTICLE_TYPE_UPDATE]: '更新文章分类',
  [PermissionType.ARTICLE_TYPE_DELETE]: '删除文章分类',

  [PermissionType.ARTICLE_TAG_QUERY]: '查询文标签',
  [PermissionType.ARTICLE_TAG_CREATE]: '创建文标签',
  [PermissionType.ARTICLE_TAG_UPDATE]: '更新文标签',
  [PermissionType.ARTICLE_TAG_DELETE]: '删除文标签',

  [PermissionType.GALLERY_QUERY]: '查询图库',
  [PermissionType.GALLERY_CREATE]: '创建图库',
  [PermissionType.GALLERY_UPDATE]: '更新图库',
  [PermissionType.GALLERY_DELETE]: '删除图库',
  [PermissionType.GALLERY_CHANGE_STATUS]: '修改图库状态',

  [PermissionType.GALLERY_TYPE_QUERY]: '查询图库类型',
  [PermissionType.GALLERY_TYPE_CREATE]: '创建图库类型',
  [PermissionType.GALLERY_TYPE_UPDATE]: '更新图库类型',
  [PermissionType.GALLERY_TYPE_DELETE]: '删除图库类型',
}
