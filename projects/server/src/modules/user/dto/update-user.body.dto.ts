import { Mixin } from 'ts-mixer'
import type { IUpdateUserBodyDto } from 'types'

import { StatusOptionalDto } from 'src/dto'
import { EmailDto } from 'src/dto/email.dto'
import { AccountDto } from 'src/dto/account.dto'
import { PhoneOptionalDto } from 'src/dto/phone.dto'
import { PasswordOptionalDto } from 'src/dto/password.dto'

export class UpdateUserBodyDto
  extends Mixin(
    AccountDto,
    EmailDto,
    PasswordOptionalDto,
    PhoneOptionalDto,
    StatusOptionalDto,
  ) implements IUpdateUserBodyDto { }
