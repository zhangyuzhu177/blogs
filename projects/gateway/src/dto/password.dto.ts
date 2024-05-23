import { decorate } from 'ts-mixer'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'
import { IsValidPassword } from 'src/decorators/validators/is-valid-password'
import { GenerateParamsDecorator } from 'src/utils/validators/params-decorator-gen'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_REQUIREMENTS_DESC } from 'src/utils/validators/password.validator'
import { IPasswordDto, IPasswordOptionalDto } from 'src/types/dto/password.interface'
import { rsaDecrypt } from 'src/utils/rsa'

export function Decorator(optional = false) {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: `密码，需要加密，${PASSWORD_REQUIREMENTS_DESC}
        ${sharedVariableMarkdown('PASSWORD_REQUIREMENTS_DESC')}
        ${sharedVariableMarkdown('rsaEncrypt', 'shared', '加密函数')}`,
        maxLength: PASSWORD_MAX_LENGTH,
        minLength: PASSWORD_MIN_LENGTH,
        type: () => String,
        example: 'empmVXNPMTExMTExMTE=',
      }),
      IsValidPassword(),
      MinLength(PASSWORD_MIN_LENGTH, { message: `密码长度不能小于${PASSWORD_MIN_LENGTH}位` }),
      MaxLength(PASSWORD_MAX_LENGTH, { message: `密码长度不能大于${PASSWORD_MAX_LENGTH}位` }),
      IsString({ message: '密码必须是字符串' }),
      Transform(({ value }) =>rsaDecrypt(value)),
    ],
    optional,
  )
}

export class PasswordDto implements IPasswordDto {
  @decorate(Decorator())
  password: string
}

export class PasswordOptionalDto implements IPasswordOptionalDto {
  @decorate(Decorator(true))
  password?: string
}
