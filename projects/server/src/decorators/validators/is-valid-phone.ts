import { registerDecorator } from 'class-validator'

import type { ValidationOptions } from 'class-validator'
import { PHONE_NUMBER_REQUIREMENTS_DESC, validatePhone } from './phone.validator'

export function isValidPhone(value: any) {
  return !validatePhone(value)
}

export function IsValidPhone(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isValidPhone',
      target: object.constructor,
      propertyName,
      options: {
        message: `手机号不符合要求，${PHONE_NUMBER_REQUIREMENTS_DESC}`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isValidPhone(value)
        },
      },
    })
  }
}
