import { isString, registerDecorator } from 'class-validator'
import type { ValidationArguments, ValidationOptions } from 'class-validator'

export function IsString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any) => isString(value),
        defaultMessage(args: ValidationArguments) {
          if (validationOptions?.each)
            return `${args.property} 中的每一项都必须是字符串类型`
          else
            return `${args.property} 必须是字符串类型`
        },
      },
    })
  }
}
