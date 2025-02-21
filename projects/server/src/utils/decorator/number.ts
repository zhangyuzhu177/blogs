import { IsNumber } from 'src/decorators'
import { ApiProperty } from '@nestjs/swagger'

import { GenerateParamsDecorator } from './params'

/**
 * 生成数字类型参数装饰器
 */
export function GenerateNumberDecorator(description: string, example?: number, optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({
      description,
      type: Number,
      example,
    }),
    IsNumber(),
  ], optional)
}
