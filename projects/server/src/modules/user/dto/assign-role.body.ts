import { Mixin } from 'ts-mixer'
import type { IAssignRoleBodyDto } from 'types'
import { IdsDto, RoleIdOptionalDto } from 'src/dto'

/**
 * 分配管理员角色
 * 请求参数
 */
export class AssignRoleBodyDto
  extends Mixin(
    IdsDto,
    RoleIdOptionalDto,
  )
  implements IAssignRoleBodyDto {}
