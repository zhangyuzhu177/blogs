import type { IRole } from '../../entities/role.interface'
import type { ICreateRoleBodyDto } from './create-role.interface'

/**
 * 更新管理角色
 * 请求参数
 */
export interface IUpdateRoleBodyDto
  extends ICreateRoleBodyDto,
  Pick<IRole, 'id'> {}
