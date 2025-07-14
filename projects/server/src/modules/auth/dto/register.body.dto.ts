import { Mixin } from 'ts-mixer'
import type { IRegisterBodyDto } from 'types'

import { EmailDto } from 'src/dto/email.dto'
import { AccountDto } from 'src/dto/account.dto'
import { PasswordDto } from 'src/dto/password.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'

export class RegisterBodyDto extends Mixin(
  AccountDto,
  PasswordDto,
  EmailDto,
  CodeVerifyDto,
) implements IRegisterBodyDto {}
