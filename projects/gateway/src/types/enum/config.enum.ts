/**
 * 系统全局配置
 */
export enum SysConfig {
  /** App配置 */
  APP = 'app',
  /**页面配置 */
  PAGE = 'page',
}

/**
 * 系统全局配置的描述
 */
export const sysConfigDescriptions: Record<SysConfig, string> = {
  [SysConfig.APP]: 'App配置',
  [SysConfig.PAGE]: '页面配置',
}
