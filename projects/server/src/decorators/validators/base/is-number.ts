import { isNumber, registerDecorator } from 'class-validator'
import type { IsNumberOptions, ValidationArguments, ValidationOptions } from 'class-validator'

export function IsNumber(options: IsNumberOptions = {}, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNumber',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [options],
      validator: {
        validate: (value: any, args) => isNumber(value, args && args.constraints[0]),
        defaultMessage(args: ValidationArguments) {
          if (validationOptions?.each)
            return `${args.property} 中的每一项都必须是数字类型`
          else
            return `${args.property} 必须是数字类型`
        },
      },
    })
  }
}
