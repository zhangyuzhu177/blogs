/**
 * 文章状态
 */
export enum ArticleStatus {
  /** 公开 */
  PUBLIC = 'public',
  /** 草稿 */
  DRAFT = 'draft',
}

/**
 * 文章状态的描述
 */
export const articleStatusDescriptions: Record<ArticleStatus, string> = {
  [ArticleStatus.PUBLIC]: '公开',
  [ArticleStatus.DRAFT]: '草稿',
}
