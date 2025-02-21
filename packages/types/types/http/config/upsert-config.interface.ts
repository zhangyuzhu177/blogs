import type { IConfigDto } from '../../dto/config.interface'
import type { IVersionDto } from '../../dto/version.interface'

/**
 * 创建/更新 全局配置
 * 请求参数
 */
export type IUpsertConfigBodyDto = IVersionDto & IConfigDto
