import { ApiPropertyOptional } from '@nestjs/swagger'
import { ArticleStatus } from 'src/types/enum/article-status.enum'

export class UpsertBodyDto {
  @ApiPropertyOptional({ description: '文章id' })
  id?: string

  @ApiPropertyOptional({ description: '文章标题' })
  title: string

  @ApiPropertyOptional({ description: '文章内容' })
  content: string

  @ApiPropertyOptional({ description: '文章摘要' })
  abstract: string

  @ApiPropertyOptional({ description: '文章分类' })
  category: string

  @ApiPropertyOptional({ description: '文章标签' })
  tags: string

  @ApiPropertyOptional({ description: '文章封面' })
  articleCover: string

  @ApiPropertyOptional({ description: '文章状态' })
  status: ArticleStatus
}
