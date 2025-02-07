import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'
import { AccountDto } from 'src/dto/account.dto'
import { EmailDto } from 'src/dto/email.dto'
import { PasswordOptionalDto } from 'src/dto/password.dto'
import { Mixin } from 'ts-mixer'
import { PhoneOptionalDto } from 'src/dto/phone.dto'
import { IUpdateUserBodyDto } from 'types'
import { StatusOptionalDto } from 'src/dto'
import { SendEmailOptionalDto } from 'src/dto/send-email.dto'

export class UpdateUserBodyDto
  extends Mixin(
    AccountDto,
    EmailDto,
    PasswordOptionalDto,
    PhoneOptionalDto,
    StatusOptionalDto,
  ) implements IUpdateUserBodyDto { }
