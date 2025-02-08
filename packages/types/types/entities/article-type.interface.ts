import type { IDescOptionalDto } from '../dto/desc.interface'
import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'
import type { IArticle } from './article.interface'

export interface IArticleType extends ICreatedAt, IUpdatedAt, IDescOptionalDto {
  /** 文章类型的唯一标识 */
  id: string
  /** 文章类型的名称 */
  name: string
  /** 文章类型的文章列表 */
  articles?: IArticle[]
}
