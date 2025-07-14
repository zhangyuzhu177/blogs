import { Mixin } from 'ts-mixer'
import type { ILoginByEmailCodeBodyDto } from 'types'

import { EmailDto } from 'src/dto/email.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'

export class LoginByEmailCodeBodyDto
  extends Mixin(EmailDto, CodeVerifyDto)
  implements ILoginByEmailCodeBodyDto {}
