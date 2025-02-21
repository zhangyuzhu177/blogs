import { IdsDto, RoleIdOptionalDto } from 'src/dto';
import { Mixin } from 'ts-mixer'
import { IAssignRoleBodyDto } from 'types';


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
