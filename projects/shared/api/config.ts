import type { IUpsertConfigBodyDto } from 'types/http/config/upsert-config.interface'
import type { IConfigDto } from 'types/dto/config.interface'
import type { SysConfig } from 'types/enum/config.enum'
import { useRequest } from '../utils/common/request'

const { $get, $post } = useRequest()

/**
 * 创建或更新全局配置
 */
export function upsertConfigApi(body: IUpsertConfigBodyDto) {
  return $post<IConfigDto[SysConfig]>('/config', body)
}

/**
 * 获取指定全局配置
 */
export function getConfigApi<T extends SysConfig>(version: T) {
  return $get<IConfigDto[T]>(`/config/${version}`)
}
