import { decorate } from 'ts-mixer'
import { ID_EXAMPLE } from 'types'
import { GenerateStringDecorator } from 'src/utils'
import type { IUserIdDto, IUserIdOptionalDto } from 'types'

const DESC = '个人用户的唯一标识'

export class UserIdDto implements IUserIdDto {
  @decorate(GenerateStringDecorator(DESC, ID_EXAMPLE))
  userId: string
}

export class UserIdOptionalDto implements IUserIdOptionalDto {
  @decorate(GenerateStringDecorator(DESC, ID_EXAMPLE, true))
  userId?: UserIdDto['userId']
}
