import type { INameDto } from '../dto/name.interface'
import type { IRoleIdDto } from '../dto/id/role.interface'
import type { IDescOptionalDto } from '../dto/desc.interface'

import type { IUser } from './user.interface'
import type { IPermission } from './permission.interface'
import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'

/**
 * 管理员角色
 */
export interface IRole
  extends
  ICreatedAt,
  IUpdatedAt,
  INameDto,
  IDescOptionalDto {
  /** 管理员角色的唯一标识 */
  id: IRoleIdDto['roleId']
  /** 权限列表 */
  permissions?: IPermission[]
  /** 分配了该角色的管理员 */
  user?: IUser[]
}
