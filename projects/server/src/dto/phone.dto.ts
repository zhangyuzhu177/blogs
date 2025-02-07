import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsValidPhone } from 'src/decorators'
import { GenerateParamsDecorator } from 'src/utils'
import type { IPhoneDto, IPhoneOptionalDto } from 'types'
import { PHONE_NUMBER_MAX_LENGTH, PHONE_NUMBER_MIN_LENGTH } from 'utils'

export function PhoneDecorator(optional = false, description = '手机号码') {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description,
        maxLength: PHONE_NUMBER_MAX_LENGTH,
        minLength: PHONE_NUMBER_MIN_LENGTH,
        type: String,
        example: '18888888888',
      }),
      IsValidPhone(),
      Transform(({ value }) => value.toString()),
    ],
    optional,
  )
}

export class PhoneDto implements IPhoneDto {
  @decorate(PhoneDecorator())
  phone: string
}

export class PhoneOptionalDto implements IPhoneOptionalDto {
  @decorate(PhoneDecorator(true))
  phone?: PhoneDto['phone']
}
