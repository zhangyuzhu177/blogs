import type { ISystemMonitorReturnInfo } from 'types'

import { useRequest } from '../composables/request'

const { $get } = useRequest()

/**
 * 获取服务器监控信息
 */
export function getServerMonitorInfoApi() {
  return $get<ISystemMonitorReturnInfo>('/system-monitor/server-info')
}
