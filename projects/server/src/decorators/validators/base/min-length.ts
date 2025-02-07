import { minLength, registerDecorator } from 'class-validator'
import type { ValidationArguments, ValidationOptions } from 'class-validator'

export function MinLength(min: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'minLength',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [min],
      validator: {
        validate: (value: any, args) => minLength(value, args && args.constraints[0]),
        defaultMessage(args: ValidationArguments) {
          return `${args.property} 必须大于或等于 ${args.constraints[0]} 个字符`
        },
      },
    })
  }
}
