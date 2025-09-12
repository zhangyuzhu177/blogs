import { Mixin } from 'ts-mixer'
import type { ILoginByPasswordBodyDto } from 'types'

import { PasswordDto } from 'src/dto/password.dto'
import { EmailOptionalDto } from 'src/dto/email.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'
import { AccountOptionalDto } from 'src/dto/account.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class LoginByPasswordBodyDto
  extends Mixin(
    AccountOptionalDto,
    EmailOptionalDto,
    PasswordDto,
    CodeVerifyDto,
  )
  implements ILoginByPasswordBodyDto {
  @ApiPropertyOptional({
    description: '过期时间 (秒)',
    example: 3600,
  })
  @IsNumber()
  @IsOptional()
  expiresIn?: number
}
