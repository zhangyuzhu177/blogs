import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/entities/user'
import { SuccessDto } from 'src/dto/success.dto'
import { ICreateUserResDto } from 'src/types/http/user/create-user.interface'

export class CreateUserResDto extends SuccessDto<ICreateUserResDto> {
  @ApiProperty({ description: '创建的用户信息', type: () => User })
  user: User
}
