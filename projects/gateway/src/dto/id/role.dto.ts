import { decorate } from 'ts-mixer'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import type { Role } from 'src/entities/role'
import { IRoleIdDto, IRoleIdOptionalDto } from 'src/types/dto/id/role.interface'
import { GenerateParamsDecorator } from 'src/utils/validators/params-decorator-gen'

function Decorator(optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({
      description: '管理角色的唯一标识',
      type: () => String,
      example: 'root',
    }),
    IsString(),
  ], optional)
}

export class RoleIdDto implements IRoleIdDto {
  @decorate(Decorator())
  roleId: Role['id']
}

export class RoleIdOptionalDto implements IRoleIdOptionalDto {
  @decorate(Decorator(true))
  roleId?: RoleIdDto['roleId']
}
