import { Mixin } from 'ts-mixer'
import { EmailDto } from 'src/dto/email.dto'
import { PasswordDto } from 'src/dto/password.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'
import { IUpdatePasswordByEmailCodeBodyDto } from 'types'

export class UpdatePasswordByEmailCodeBodyDto
  extends Mixin(
    PasswordDto,
    EmailDto,
    CodeVerifyDto
  )
  implements IUpdatePasswordByEmailCodeBodyDto {}
