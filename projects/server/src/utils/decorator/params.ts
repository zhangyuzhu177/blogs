import { IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'

/**
 * 生成参数装饰器
 */
export function GenerateParamsDecorator(decorators?: any[], optional = false) {
  return applyDecorators(
    ...decorators,
    ...optional
      ? [
          ApiProperty({ required: false }),
          IsOptional(),
        ]
      : [],
  )
}
