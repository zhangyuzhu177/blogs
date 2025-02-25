import { Mixin } from 'ts-mixer'
import { ID_EXAMPLE, IUpsertArticleBodyDto } from 'types'
import { IsArray,IsString } from 'src/decorators'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ArticleTypeIdDto, NameDto, StatusDto } from 'src/dto'

export class UpsertArticleBodyDto
  extends Mixin(
    NameDto,
    StatusDto,
    ArticleTypeIdDto
  )
  implements IUpsertArticleBodyDto {
  @ApiPropertyOptional({
    description: '文章内容'
  })
  @IsString()
  content: string

  @ApiPropertyOptional({
    description: '文章封面'
  })
  @IsString()
  cover: string

  @ApiPropertyOptional({
    description: '文章标签',
    type: [String],
    example: [ID_EXAMPLE],
  })
  @IsArray()
  @IsString({ each: true })
  tagIds: string[]
}
