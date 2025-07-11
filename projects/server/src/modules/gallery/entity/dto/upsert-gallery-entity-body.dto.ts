import { Mixin } from 'ts-mixer'
import { IsString } from 'class-validator'
import type { IUpsertGalleryBodyDto } from 'types'
import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsArray } from 'src/decorators'
import { DescOptionalDto, NameDto, StatusDto } from 'src/dto'
import { GalleryTypeIdDto } from 'src/dto/id/gallery-type.dto'

export class UpsertGalleryBodyDto
  extends Mixin(
    NameDto,
    StatusDto,
    DescOptionalDto,
    GalleryTypeIdDto,
  )
  implements IUpsertGalleryBodyDto {
  @ApiPropertyOptional({
    description: '图库图片',
  })
  @IsArray()
  @IsString({ each: true })
  picture: string[]
}
