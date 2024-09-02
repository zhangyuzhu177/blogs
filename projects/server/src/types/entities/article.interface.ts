import { ArticleStatus } from "../enum/article-status.enum"

export interface IArticle {
  /** 文章唯一标识 */
  id: string
  /** 文章标题 */
  title: string
  /** 文章内容 */
  content: string
  /** 文章摘要 */
  abstract: string
  /** 文章分类 */
  category: string
  /** 文章标签 */
  tags: string
  /** 文章封面 */
  articleCover: string
  /** 文章访问量 */
  pageView?: number
  /** 文章状态 */
  status: ArticleStatus
}
