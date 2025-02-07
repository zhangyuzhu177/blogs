import { max, registerDecorator } from 'class-validator'
import type { ValidationArguments, ValidationOptions } from 'class-validator'

export function Max(maxValue: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'max',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [maxValue],
      validator: {
        validate: (value: any, args) => max(value, args && args.constraints[0]),
        defaultMessage(args: ValidationArguments) {
          return `${args.property} 不能大于 ${args.constraints[0]}`
        },
      },
    })
  }
}
