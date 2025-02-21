import { Mixin } from 'ts-mixer'
import { EmailDto } from 'src/dto/email.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'
import { ILoginByEmailCodeBodyDto } from 'types'

export class LoginByEmailCodeBodyDto
  extends Mixin(EmailDto, CodeVerifyDto)
  implements ILoginByEmailCodeBodyDto {}
