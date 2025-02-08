import type { ISendEmailCodeBodyDto, ISendEmailCodeResData } from 'types'
import { useRequest } from '../utils/common/request'

const { $post } = useRequest()

/**
 * 发送验证码
 */
export function sendEmailCodeApi(body: ISendEmailCodeBodyDto) {
  return $post<ISendEmailCodeResData>('/email', body)
}
