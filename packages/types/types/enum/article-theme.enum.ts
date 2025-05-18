/**
 * 文章主题
 */
export enum ArticleTheme {
  /** default */
  DEFAULT = 'default',
  /** github */
  GITHUB = 'github',
  /** vuepress */
  VUEPRESS = 'vuepress',
  /** mk-cute */
  MK_CUTE = 'mk-cute',
  /** smart-blue */
  SMART_BLUE = 'smart-blue',
  /** cyanosis */
  CYANOSIS = 'cyanosis',
  /** arknights */
  ARKNIGHTS = 'arknights',
}

/**
 * 文章主题描述
 */
export const articleThemeDescriptions: Record<ArticleTheme, string> = {
  [ArticleTheme.DEFAULT]: '默认',
  [ArticleTheme.GITHUB]: 'Github',
  [ArticleTheme.VUEPRESS]: 'VuePress',
  [ArticleTheme.MK_CUTE]: 'MkCute',
  [ArticleTheme.SMART_BLUE]: 'SmartBlue',
  [ArticleTheme.CYANOSIS]: 'Cyanosis',
  [ArticleTheme.ARKNIGHTS]: 'Arknights',
}
