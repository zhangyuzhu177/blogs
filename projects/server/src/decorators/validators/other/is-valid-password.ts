import { validatePassword } from 'utils'
import { registerDecorator } from 'class-validator'
import type { ValidationOptions } from 'class-validator'

export function IsValidPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName,
      options: {
        message: ({ value }) => validatePassword(value),
        ...validationOptions,
      },
      validator: {
        validate: (value: any) => !validatePassword(value),
      },
    })
  }
}
