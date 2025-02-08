import type { IArticleType } from '../entities/article-type.interface'

/**
 * 默认文章分类
 */
export const DEFAULT_ARTICLE_TYPE: Omit<IArticleType, 'createdAt' | 'updatedAt'> = {
  id: 'default',
  name: '综合',
  desc: '默认分类',
}
