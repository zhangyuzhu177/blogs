import { Mixin } from 'ts-mixer'
import { IUpsertArticleBodyDto } from 'types'
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
    description: '文章标签'
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[]

  @ApiPropertyOptional({
    description: '文章封面'
  })
  @IsString()
  cover: string
}
