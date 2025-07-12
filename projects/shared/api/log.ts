import { useRequest } from '../composables/request'

const { $get } = useRequest()

/**
 * 获取访问量
 */
export function getVisitCountApi() {
  return $get('/log/visit-count')
}
