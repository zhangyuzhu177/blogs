import type { IArticle } from '../../entities/article.interface'

export interface IUpsertArticleBodyDto
  extends Pick<
    IArticle,
    'name' | 'articleTypeId' | 'content' | 'tags' | 'cover' | 'status'
  > {}
