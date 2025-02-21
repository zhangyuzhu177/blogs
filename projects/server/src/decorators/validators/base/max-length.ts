import { maxLength, registerDecorator } from 'class-validator'
import type { ValidationArguments, ValidationOptions } from 'class-validator'

export function MaxLength(max: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'maxLength',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [max],
      validator: {
        validate: (value: any, args) => maxLength(value, args && args.constraints[0]),
        defaultMessage(args: ValidationArguments) {
          return `${args.property} 必须小于或等于 ${args.constraints[0]} 个字符`
        },
      },
    })
  }
}
