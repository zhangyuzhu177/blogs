import { RoleIdOptionalDto } from 'src/dto/id/role.dto'
import { UserIdDto } from 'src/dto/id/user.dto'
import { Mixin } from 'ts-mixer'

export class UpdateUserRoleParamDto extends Mixin(
  UserIdDto,
  RoleIdOptionalDto,
) {}
