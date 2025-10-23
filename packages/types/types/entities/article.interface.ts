import type { INameDto } from '../dto/name.interface'
import type { IStatusDto } from '../dto/status.interface'
import type { ArticleTheme } from '../enum/article-theme.enum'
import type { IArticleTypeIdDto } from '../dto/id/article-type.interface'

import type { ILikes } from './likes.interface'
import type { IArticleTag } from './article-tag.interface'
import type { IArticleType } from './article-type.interface'
import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'

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
  /** 摘要 */
  abstract: string
  /** 文章内容 */
  content: string
  /** 文章标签 */
  tags?: IArticleTag[]
  /** 文章封面 */
  cover?: string
  /** 文章访问量 */
  pageView?: number
  /** 文章主题 */
  theme?: ArticleTheme
  /** 点赞列表 */
  likes?: ILikes[]
}
