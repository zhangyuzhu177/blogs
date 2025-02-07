import type { ArticleStatus } from '../enum/article-status.enum'
import type { INameDto } from '../dto/name.interface'
import type { IArticleTypeIdDto } from '../dto/id/article-type.interface'
import type { IArticleType } from './article-type.interface'
import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'

export interface IArticle
  extends
  INameDto,
  ICreatedAt,
  IUpdatedAt,
  IArticleTypeIdDto {
  /** 文章唯一标识 */
  id: string
  /** 文章分类 */
  articleType: IArticleType
  /** 文章内容 */
  content: string
  /** 文章标签 */
  tags: string[]
  /** 文章封面 */
  cover: string
  /** 文章访问量 */
  pageView?: number
  /** 文章状态 */
  status: ArticleStatus
}
