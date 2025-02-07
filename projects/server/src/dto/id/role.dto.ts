import { decorate } from 'ts-mixer'
import type { Role } from 'src/entities/role'
import { GenerateStringDecorator } from 'src/utils'
import { ID_EXAMPLE, IRoleIdDto, IRoleIdOptionalDto } from 'types'

const DESC='管理角色的唯一标识'

export class RoleIdDto implements IRoleIdDto {
  @decorate(GenerateStringDecorator(DESC, ID_EXAMPLE))
  roleId: Role['id']
}

export class RoleIdOptionalDto implements IRoleIdOptionalDto {
  @decorate(GenerateStringDecorator(DESC, ID_EXAMPLE, true))
  roleId?: RoleIdDto['roleId']
}
