import type { ArticleStatus } from 'types/enum/article-status.enum'
import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'

export interface IArticle extends ICreatedAt, IUpdatedAt {
  /** 文章唯一标识 */
  id: string
  /** 文章标题 */
  title: string
  /** 文章分类 */
  category: string
  /** 文章内容 */
  content: string
  /** 文章摘要 */
  abstract: string
  /** 文章标签 */
  tags: string
  /** 文章封面 */
  articleCover: string
  /** 文章访问量 */
  pageView?: number
  /** 文章状态 */
  status: ArticleStatus
}
