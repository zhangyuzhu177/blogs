
import { ICreateUserBodyDto } from 'src/types/http/user/create-user.interface';
import { UpdateUserBodyDto } from './update-user.body.dto'

export class CreateUserBodyDto
  extends UpdateUserBodyDto
  implements ICreateUserBodyDto {
}
