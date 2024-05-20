import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export function GenerateParamsDecorator(decorators?: any[], isOptional = false) {
  return applyDecorators(
    ...decorators,
    ...isOptional
      ? [
          ApiProperty({ required: false }),
          IsOptional(),
        ]
      : [],
  )
}
