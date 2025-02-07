import { validateIp } from 'utils'
import { registerDecorator } from 'class-validator'
import type { ValidationOptions } from 'class-validator'

export function IsValidIp(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidIp',
      target: object.constructor,
      propertyName,
      options: {
        message: ({ value }) => validateIp(value),
        ...validationOptions,
      },
      validator: {
        validate: (value: any) => !validateIp(value),
      },
    })
  }
}
