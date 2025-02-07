import type { IIdsDto } from '../../dto/id/ids.interface'
import type { IRoleIdOptionalDto } from '../../dto/id/role.interface'

/**
 * 分配企研管理员角色
 * 请求参数
 */
export interface IAssignRoleBodyDto
  extends
  IIdsDto,
  IRoleIdOptionalDto {}
