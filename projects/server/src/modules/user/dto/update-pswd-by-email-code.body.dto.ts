import { Mixin } from 'ts-mixer'
import { EmailDto } from 'src/dto/email.dto'
import { PasswordDto } from 'src/dto/password.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'
import { IUpdatePasswordByEmailCodeBodyDto } from 'src/types/http/user/update-pswd-by-email-code.interface'

export class UpdatePasswordByEmailCodeBodyDto
  extends Mixin(PasswordDto, EmailDto, CodeVerifyDto)
  implements IUpdatePasswordByEmailCodeBodyDto {}
