import type { INameDto } from '../dto/name.interface'
import type { IDescOptionalDto } from '../dto/desc.interface'

import type { IArticle } from './article.interface'
import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'

export interface IArticleType
  extends
  INameDto,
  ICreatedAt,
  IUpdatedAt,
  IDescOptionalDto {
  /** 文章类型的唯一标识 */
  id: string
  /** 排序 */
  order?: number
  /** 文章类型关联的文章列表 */
  articles?: IArticle[]
}
