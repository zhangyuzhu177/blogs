import { IsString } from 'class-validator'
import type { ICreateAbstractBodyDto } from 'types'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class CreateAbstractBodyDto implements ICreateAbstractBodyDto {
  @ApiPropertyOptional({
    description: '文章内容',
  })
  @IsString()
    content: string
}
