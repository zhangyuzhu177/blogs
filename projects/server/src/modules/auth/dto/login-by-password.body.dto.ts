import { Mixin } from 'ts-mixer'
import type { ILoginByPasswordBodyDto } from 'types'

import { PasswordDto } from 'src/dto/password.dto'
import { EmailOptionalDto } from 'src/dto/email.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'
import { AccountOptionalDto } from 'src/dto/account.dto'

export class LoginByPasswordBodyDto
  extends Mixin(
    AccountOptionalDto,
    EmailOptionalDto,
    PasswordDto,
    CodeVerifyDto,
  )
  implements ILoginByPasswordBodyDto { }
