import type { ArticleStatus } from 'types/enum/article-status.enum'

export interface UpsertArticleBodyDto {
  id?: string

  title: string

  content: string

  category: string

  abstract: string

  tags: string

  articleCover: string

  status: ArticleStatus
}
