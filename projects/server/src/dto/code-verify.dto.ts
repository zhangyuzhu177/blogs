import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'src/decorators'
import type { ICodeVerifyDto, ICodeVerifyOptionalDto } from 'types'
import { GenerateParamsDecorator, GenerateStringDecorator } from 'src/utils'

const DESC = '发送验证码后获取到的唯一标识'

function CodeDecorator(optional = false) {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: '收到的验证码',
        maxLength: 6,
        minLength: 6,
        type: String,
      }),
      IsString(),
      MaxLength(6),
      MinLength(6),
    ],
    optional,
  )
}

export class CodeVerifyDto implements ICodeVerifyDto {
  @decorate(GenerateStringDecorator(DESC))
  bizId: string

  @decorate(CodeDecorator())
  code: string
}

export class CodeVerifyOptionalDto implements ICodeVerifyOptionalDto {
  @decorate(GenerateStringDecorator(DESC, undefined, true))
  bizId?: CodeVerifyDto['bizId']

  @decorate(CodeDecorator(true))
  code?: CodeVerifyDto['code']
}
