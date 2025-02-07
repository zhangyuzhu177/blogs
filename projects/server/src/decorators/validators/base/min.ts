import { min, registerDecorator } from 'class-validator'
import type { ValidationArguments, ValidationOptions } from 'class-validator'

export function Min(minValue: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'min',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [minValue],
      validator: {
        validate: (value: any, args) => min(value, args && args.constraints[0]),
        defaultMessage(args: ValidationArguments) {
          return `${args.property} 不能小于 ${args.constraints[0]}`
        },
      },
    })
  }
}
