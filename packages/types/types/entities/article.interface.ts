import type { INameDto } from '../dto/name.interface'
import type { IArticleTypeIdDto } from '../dto/id/article-type.interface'
import type { IStatusDto } from '../dto/status.interface'
import type { IArticleType } from './article-type.interface'
import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'
import type { IArticleTag } from './article-tag.interface'

export interface IArticle
  extends
  INameDto,
  ICreatedAt,
  IUpdatedAt,
  IStatusDto,
  IArticleTypeIdDto {
  /** 文章唯一标识 */
  id: string
  /** 文章分类 */
  articleType: IArticleType
  /** 文章内容 */
  content: string
  /** 文章标签 */
  tags?: IArticleTag[]
  /** 文章封面 */
  cover?: string
  /** 文章访问量 */
  pageView?: number
}
