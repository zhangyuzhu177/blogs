import type { IArticle } from '../../entities/article.interface'

export interface ICreateAbstractBodyDto extends Pick<IArticle, 'content'> {}
