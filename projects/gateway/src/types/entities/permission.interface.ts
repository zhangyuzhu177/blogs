import type { PermissionType } from '../enum/permission.enum'
import type { IRole } from './role.interface'

/**
 * 权限列表
 * 权限不可自由创建
 */
export interface IPermission {
  /** 权限的名称，作为权限的唯一标识 */
  name: PermissionType
  /** 权限的描述信息 */
  description?: string
  /** 使用了当前权限的角色列表 */
  roles?: IRole[]
}
