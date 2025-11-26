import type { SysConfig } from '../enum/config.enum'

export interface IConfigDto {
  /** 首页配置 */
  [SysConfig.HOME]?: {
    /** 页面标题 */
    title?: string
    /** 页面描述 */
    label?: string
    /** 页面图片 */
    url?: string
    /** 是否启用艺术背景 */
    isArtBg?: boolean
    /** 是否启用艺术鼠标 */
    isArtCursor?: boolean
  }

  /** 关于页配置 */
  [SysConfig.ABOUT]?: {
    /** 头像 */
    avatar?: string
    /** 姓名 */
    name?: string
    /** 职位 */
    job?: string
    /** 所在地 */
    location?: string

    /** 描述 */
    desc?: string
    /** 邮箱 */
    email?: string
    /** github地址 */
    github?: string
    /** 技能 */
    skills?: ISkillsConfigDto[]
    /** 作品 */
    works?: IWorksConfigDto[]
  }
}

export interface ISkillsConfigDto {
  id?: string
  /** 名称 */
  name?: string
  /** 描述 */
  desc?: string
  /** 等级 */
  level?: number
}

export interface IWorksConfigDto {
  id?: string
  /** 名称 */
  name?: string
  /** 图标 */
  icon?: string
  /** 描述 */
  desc?: string
  /** 链接 */
  url?: string
}
