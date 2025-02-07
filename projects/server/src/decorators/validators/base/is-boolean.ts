import { isBoolean, registerDecorator } from 'class-validator'
import type { ValidationArguments, ValidationOptions } from 'class-validator'

export function IsBoolean(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBoolean',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any) => isBoolean(value),
        defaultMessage(args: ValidationArguments) {
          if (validationOptions?.each)
            return `${args.property} 中的每一项都必须是布尔类型`
          else
            return `${args.property} 必须是布尔类型`
        },
      },
    })
  }
}
