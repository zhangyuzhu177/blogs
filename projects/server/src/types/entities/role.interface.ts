import type { IRoleIdDto } from '../dto/id/role.interface'
import type { IPermission } from './permission.interface'

/**
 * 管理角色
 */
export interface IRole {
  /** 管理角色的唯一标识 */
  id: IRoleIdDto['roleId']
  /** 角色名称 */
  name: string
  /** 角色的描述信息 */
  description?: string
  /** 权限列表 */
  permissions?: IPermission[]
}
