import { IsBoolean } from 'src/decorators'
import { ApiProperty } from '@nestjs/swagger'

import { GenerateParamsDecorator } from './params'

/**
 * 生成布尔类型参数装饰器
 */
export function GenerateBooleanDecorator(description: string, example?: boolean, optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({
      description,
      type: Boolean,
      example,
    }),
    IsBoolean(),
  ], optional)
}
