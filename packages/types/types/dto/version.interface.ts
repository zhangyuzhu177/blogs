import type { SysConfig } from '../enum/config.enum'

export interface IVersionDto<T = SysConfig> {
  /** 配置版本 */
  version: T
}
