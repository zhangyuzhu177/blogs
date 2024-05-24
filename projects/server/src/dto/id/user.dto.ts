import { decorate } from 'ts-mixer'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { GenerateParamsDecorator } from 'src/utils/validators/params-decorator-gen'
import { IUserIdDto, IUserIdOptionalDto } from 'src/types/dto/id/user.interface'


function Decorator(optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({
      description: '用户的唯一标识',
      type: () => String,
      example: '00000000-0000-0000-0000-000000000000',
    }),
    IsString(),
  ], optional)
}

export class UserIdDto implements IUserIdDto {
  @decorate(Decorator(false))
  userId: string
}

export class UserIdOptionalDto implements IUserIdOptionalDto {
  @decorate(Decorator(true))
  userId?: UserIdDto['userId']
}
