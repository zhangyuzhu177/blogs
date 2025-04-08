/**
 * 系统全局配置
 */
export enum SysConfig {
  /** 首页配置 */
  HOME = 'home',
  /** 关于页面配置 */
  ABOUT = 'about',
}

/**
 * 系统全局配置的描述
 */
export const sysConfigDescriptions: Record<SysConfig, string> = {
  [SysConfig.HOME]: '首页配置',
  [SysConfig.ABOUT]: '关于页配置',
}
