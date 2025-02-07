import { validatePhone } from 'utils'
import { registerDecorator } from 'class-validator'
import type { ValidationOptions } from 'class-validator'

export function IsValidPhone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidPhone',
      target: object.constructor,
      propertyName,
      options: {
        message: ({ value }) => validatePhone(value),
        ...validationOptions,
      },
      validator: {
        validate: (value: any) => !validatePhone(value),
      },
    })
  }
}
