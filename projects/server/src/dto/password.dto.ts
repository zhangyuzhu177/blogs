import { decorate } from 'ts-mixer'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsValidPassword } from 'src/decorators'
import type { IPasswordDto, IPasswordOptionalDto } from 'types'
import { GenerateParamsDecorator, rsaDecrypt, sharedVariableMarkdown } from 'src/utils'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_REQUIREMENTS_DESC } from 'utils'

export function PasswordDecorator(optional = false, description = '密码') {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: `${description}，需要加密，${PASSWORD_REQUIREMENTS_DESC}
        ${sharedVariableMarkdown('PASSWORD_REQUIREMENTS_DESC')}`,
        maxLength: PASSWORD_MAX_LENGTH,
        minLength: PASSWORD_MIN_LENGTH,
        type: String,
        example: 'QiyanData@#!',
      }),
      IsValidPassword(),
      Transform(({ value }) => rsaDecrypt(value)),
    ],
    optional,
  )
}

export class PasswordDto implements IPasswordDto {
  @decorate(PasswordDecorator())
  password: string
}

export class PasswordOptionalDto implements IPasswordOptionalDto {
  @decorate(PasswordDecorator(true))
  password?: PasswordDto['password']
}
