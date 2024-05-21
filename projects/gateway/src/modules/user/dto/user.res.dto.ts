import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/entities/user'
import { SuccessDto } from 'src/types/dto/success.dto'
import { IUserProfileResDto } from 'src/types/http/user/user-profile.interface'

export class UserProfileResponseDto
  extends SuccessDto<User>
  implements IUserProfileResDto {
  @ApiProperty({ type: () => User })
  data: User
}
