import type { SysConfig } from '../enum/config.enum'

export interface IConfigDto {
  /** APP配置 */
  [SysConfig.APP]?: {
    /** 应用名称 */
    name?: string
    /** 应用图标 */
    icon?: string
    /** 应用英文名称 */
    nameEn?: string
  }

  /** 首页配置 */
  [SysConfig.HOME]?: {
    /** 页面标题 */
    title?: string
    /** 页面描述 */
    label?: string
    /** 页面图片 */
    url?: string
  }

  /** 关于页配置 */
  [SysConfig.ABOUT]?: {
    /** 页面标题 */
    title?: string
    /** 页面描述 */
    label?: string
    /** 页面背景图片 */
    url?: string
    /** 头像 */
    avatar?: string
    /** 姓名 */
    name?: string
    /** 手机号 */
    phone?: string
    /** 邮箱 */
    email?: string
    /** github地址 */
    github?: string
    /** 座右铭 */
    motto?: string
    /** 内容 */
    content?: string
  }
}
