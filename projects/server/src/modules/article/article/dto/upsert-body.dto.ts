import { Mixin } from 'ts-mixer'
import { Type } from 'class-transformer'
import type { IUpsertArticleBodyDto } from 'types'
import { ArticleTheme, ID_EXAMPLE } from 'types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'

import { IsArray, IsString } from 'src/decorators'
import { ArticleTypeIdDto, NameDto, StatusDto } from 'src/dto'

export class UpsertArticleBodyDto
  extends Mixin(
    NameDto,
    StatusDto,
    ArticleTypeIdDto,
  )
  implements IUpsertArticleBodyDto {
  @ApiPropertyOptional({
    description: '文章内容',
  })
  @IsString()
  content: string

  @ApiPropertyOptional({
    description: '文章封面',
  })
  @IsString()
  @IsOptional()
  cover?: string

  @ApiPropertyOptional({
    description: '文章主题',
  })
  @IsEnum(
    ArticleTheme,
    {
      each: true,
      message: 'theme 的值必须是 ArticleTheme 枚举值',
    },
  )
  @Type(() => String)
  @IsOptional()
  theme?: ArticleTheme

  @ApiPropertyOptional({
    description: '文章标签',
    type: [String],
    example: [ID_EXAMPLE],
  })
  @IsArray()
  @IsString({ each: true })
  tagIds: string[]
}
