import type { IArticleType } from '../../entities/article-type.interface'

export interface IUpsertArticleTypeBodyDto
  extends Pick<
    IArticleType,
    'name' | 'desc' | 'order'
  > {}
