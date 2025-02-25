import type { IDescOptionalDto } from '../dto/desc.interface'
import type { INameDto } from '../dto/name.interface'
import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'
import type { IArticle } from './article.interface'

export interface IArticleTag
  extends
  INameDto,
  ICreatedAt,
  IUpdatedAt,
  IDescOptionalDto {
  /** 文章标签的唯一标识 */
  id: string
  /** 文章标签关联的文章列表 */
  articles?: IArticle[]
}
