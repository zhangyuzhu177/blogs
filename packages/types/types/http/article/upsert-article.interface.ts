import type { IArticle } from '../../entities/article.interface'

export interface IUpsertArticleBodyDto
  extends Pick<
    IArticle,
    'name' | 'articleTypeId' | 'content' | 'cover' | 'status'
  > {
  /** 文章标签的id */
  tagIds?: string[]
}
