/**
 * 系统全局配置
 */
export enum SysConfig {
  /** App配置 */
  APP = 'app',
  /**首页配置 */
  HOME = 'home',
  /**文章页面配置 */
  ARTICLE = 'article',
  /**关于页面配置 */
  ABOUT = 'about',
}

/**
 * 系统全局配置的描述
 */
export const sysConfigDescriptions: Record<SysConfig, string> = {
  [SysConfig.APP]: 'App配置',
  [SysConfig.HOME]: '首页配置',
  [SysConfig.ARTICLE]: '文章页配置',
  [SysConfig.ABOUT]: '关于页配置',
}
