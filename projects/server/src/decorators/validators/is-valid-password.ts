import { registerDecorator } from 'class-validator'
import type { ValidationOptions } from 'class-validator'
import { PASSWORD_REQUIREMENTS_DESC, validatePassword } from 'src/utils/validators/password.validator'

export function isValidPassword(value: any) {
  return !validatePassword(value)
}

export function IsValidPassword(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName,
      options: {
        message: `密码不符合要求，${PASSWORD_REQUIREMENTS_DESC}`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isValidPassword(value)
        },
      },
    })
  }
}
