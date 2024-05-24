import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { MaxLength, MinLength } from 'class-validator'

import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'
import { GenerateParamsDecorator } from 'src/utils/validators/params-decorator-gen'
import { PHONE_NUMBER_MAX_LENGTH, PHONE_NUMBER_MIN_LENGTH, PHONE_NUMBER_REQUIREMENTS_DESC } from 'src/decorators/validators/phone.validator'
import { IPhoneDto, IPhoneOptionalDto } from 'src/types/dto/phone.interface'
import { IsValidPhone } from 'src/decorators/validators/is-valid-phone'



function Decorator(optional = false) {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: `手机号码, ${PHONE_NUMBER_REQUIREMENTS_DESC}` + `\n${sharedVariableMarkdown('PHONE_NUMBER_REQUIREMENTS_DESC')}`,
        maxLength: PHONE_NUMBER_MAX_LENGTH,
        minLength: PHONE_NUMBER_MIN_LENGTH,
        type: () => String,
        example: '18888888888',
      }),
      MinLength(PHONE_NUMBER_MIN_LENGTH, { message: `手机号码长度不能小于${PHONE_NUMBER_MIN_LENGTH}` }),
      MaxLength(PHONE_NUMBER_MAX_LENGTH, { message: `手机号码长度不能大于${PHONE_NUMBER_MAX_LENGTH}` }),
      IsValidPhone(),
      Transform(({ value }) => value.toString()),
    ],
    optional,
  )
}

export class PhoneDto implements IPhoneDto {
  @decorate(Decorator())
  phone: string
}

export class PhoneOptionalDto implements IPhoneOptionalDto {
  @decorate(Decorator(true))
  declare phone?: string
}
