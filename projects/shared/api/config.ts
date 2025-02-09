import type { IConfigDto, IUpsertConfigBodyDto, SysConfig } from 'types'
import { useRequest } from '../composables/request'

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
