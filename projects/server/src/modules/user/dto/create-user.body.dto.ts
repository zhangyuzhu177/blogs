
import { Mixin } from 'ts-mixer'
import { PasswordDto } from 'src/dto'
import { ICreateUserBodyDto } from 'types'
import { UpdateUserBodyDto } from './update-user.body.dto'

export class CreateUserBodyDto
  extends Mixin(
    UpdateUserBodyDto,
    PasswordDto,
  )
  implements ICreateUserBodyDto {
}
