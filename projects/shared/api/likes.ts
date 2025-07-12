import type { IGetLinkBodyDto, ILikes } from 'types'
import { useRequest } from '../composables/request'

const { $post } = useRequest()

/**
 * 获取指定内容的点赞记录
 */
export function getLinkApi(body: IGetLinkBodyDto) {
  return $post<ILikes[]>('/likes/get-link', body)
}
