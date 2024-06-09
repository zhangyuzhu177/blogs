import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpsertBodyDto {
  @ApiPropertyOptional({ description: '文章id' })
  id?: string

  @ApiPropertyOptional({ description: '文章作者' })
  title: string

  @ApiPropertyOptional({ description: '文章内容' })
  content: string

  @ApiPropertyOptional({ description: '文章分类' })
  category: string

  @ApiPropertyOptional({ description: '文章标签' })
  tags: string

  @ApiPropertyOptional({ description: '文章封面' })
  articleCover: string

  @ApiPropertyOptional({ description: '文章类型' })
  type: string

  @ApiPropertyOptional({ description: '文章状态' })
  status: string
}
