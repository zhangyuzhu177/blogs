import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'
import { GenerateParamsDecorator } from 'src/utils/validators/params-decorator-gen'
import { ICodeVerifyDto, ICodeVerifyOptionalDto } from 'src/types/dto/code-verify.interface'

function BizIdDecorator(optional = false) {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: '获取验证码时获取到的唯一标识',
        type: () => String,
      }),
      IsString(),
    ],
    optional,
  )
}

function CodeDecorator(optional = false) {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: '发送到邮箱的验证码/图片验证码',
        maxLength: 6,
        minLength: 6,
        type: () => String,
      }),
      MaxLength(6),
      MinLength(6),
      IsString(),
    ],
    optional,
  )
}

export class CodeVerifyDto implements ICodeVerifyDto {
  @decorate(BizIdDecorator())
  bizId: string

  @decorate(CodeDecorator())
  code: string
}

export class CodeVerifyOptionalDto implements ICodeVerifyOptionalDto {
  @decorate(BizIdDecorator(true))
  bizId?: string

  @decorate(CodeDecorator(true))
  code?: string
}
