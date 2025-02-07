import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { IsValidEmail } from 'src/decorators'
import { GenerateParamsDecorator } from 'src/utils'
import { EMAIL_MAX_LENGTH, EMAIL_MIN_LENGTH } from 'utils'
import type { IEmailDto, IEmailOptionalDto } from 'types'

export function EmailDecorator(optional = false, description = '邮箱') {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description,
        maxLength: EMAIL_MAX_LENGTH,
        minLength: EMAIL_MIN_LENGTH,
        type: String,
        example: 'noreplay@qiyandata.com',
      }),
      IsValidEmail(),
    ],
    optional,
  )
}

export class EmailDto implements IEmailDto {
  @decorate(EmailDecorator())
  email: string
}

export class EmailOptionalDto implements IEmailOptionalDto {
  @decorate(EmailDecorator(true))
  email?: EmailDto['email']
}
