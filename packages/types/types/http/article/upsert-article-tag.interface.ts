import type { IArticleTag } from '../../entities/article-tag.interface'

export interface IUpsertArticleTagBodyDto
  extends Pick<
    IArticleTag,
    'name' | 'desc'
  > {}
