import { validateEmail } from 'utils'
import { registerDecorator } from 'class-validator'
import type { ValidationOptions } from 'class-validator'

export function IsValidEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidEmail',
      target: object.constructor,
      propertyName,
      options: {
        message: ({ value }) => validateEmail(value),
        ...validationOptions,
      },
      validator: {
        validate: (value: any) => !validateEmail(value),
      },
    })
  }
}
