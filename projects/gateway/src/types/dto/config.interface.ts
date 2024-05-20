import { SysConfig } from "../enum/config.enum"

export interface IConfigDto {
  /**APP配置 */
  [SysConfig.APP]?: {
    /** 应用名称 */
    name?: string
    /** 应用图标 */
    icon?: string
    /** 应用英文名称 */
    nameEn?: string
  }

  /**页面配置 */
  [SysConfig.PAGE]?: {
    /**页面标题 */
    title?: string
    /**页面描述 */
    label?: string
    /**页面图片 */
    url?:string
  }[]
}
