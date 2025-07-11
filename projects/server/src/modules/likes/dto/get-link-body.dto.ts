import { IsEnum } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { type IGetLinkBodyDto, LikesType } from 'types'

import { IsString } from 'src/decorators'

export class GetLinkBodyDto implements IGetLinkBodyDto {
  @ApiPropertyOptional({
    description: '内容id',
  })
  @IsString()
  contentId: string

  @ApiPropertyOptional({
    description: '类型',
  })
  @IsEnum(LikesType)
  type: LikesType
}
