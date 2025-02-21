import { isArray, registerDecorator } from 'class-validator'
import type { ValidationArguments, ValidationOptions } from 'class-validator'

export function IsArray(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isArray',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any) => isArray(value),
        defaultMessage(args: ValidationArguments) {
          return `${args.property} 必须是数组类型`
        },
      },
    })
  }
}
