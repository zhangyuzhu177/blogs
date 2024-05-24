import { registerDecorator } from 'class-validator'
import type { ValidationOptions } from 'class-validator'
import { EMAIL_REQUIREMENTS_DESC, validateEmail } from 'src/utils/validators/email.validator'

export function isValidEmail(value: any) {
  return !validateEmail(value)
}

export function IsValidEmail(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isValidEmail',
      target: object.constructor,
      propertyName,
      options: {
        message: `邮箱不符合要求，${EMAIL_REQUIREMENTS_DESC}`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isValidEmail(value)
        },
      },
    })
  }
}
