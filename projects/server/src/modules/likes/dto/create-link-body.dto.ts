import { IsString } from 'class-validator'
import type { ICreateLikeBodyDto } from 'types'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class CreateLikeBodyDto implements ICreateLikeBodyDto {
  @ApiPropertyOptional({
    description: '浏览器指纹',
  })
  @IsString()
  visitorId: string

  @ApiPropertyOptional({
    description: '内容id',
  })
  @IsString()
  contentId: string
}
