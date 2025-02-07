import type { PermissionType } from '../enum/permission.enum'
import type { IDescOptionalDto } from '../dto/desc.interface'

import type { IRole } from './role.interface'

/**
 * 权限列表
 * 在项目启动时自动生成
 */
export interface IPermission
  extends
  IDescOptionalDto {
  /** 权限的名称，作为权限的唯一标识 */
  name: PermissionType

  /** 使用了当前权限的管理员角色列表 */
  userRoles?: IRole[]
}
