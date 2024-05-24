import { Mixin } from 'ts-mixer'
import { EmailDto } from 'src/dto/email.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'
import { ILoginByEmailCodeBodyDto } from 'src/types/http/auth/login-by-email-code.interface'

export class LoginByEmailCodeBodyDto
  extends Mixin(EmailDto, CodeVerifyDto)
  implements ILoginByEmailCodeBodyDto {}
