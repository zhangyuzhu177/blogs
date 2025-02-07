import { IsString } from 'src/decorators'
import { ApiProperty } from '@nestjs/swagger'

import { GenerateParamsDecorator } from './params'

/**
 * 生成字符串类型参数装饰器
 */
export function GenerateStringDecorator(description: string, example?: string, optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({
      description,
      type: String,
      example,
    }),
    IsString(),
  ], optional)
}
