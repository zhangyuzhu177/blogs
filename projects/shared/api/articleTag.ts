import type {
  IArticleTag,
  IIdsDto,
  IQueryDto,
  IQueryPaginatedResData,
  IUpsertArticleTagBodyDto,
} from 'types'
import { useRequest } from '../composables/request'

const { $post, $patch, $delete } = useRequest()

/**
 * 查询文章标签列表
 */
export function queryArticleTagListApi(body: IQueryDto<IArticleTag>) {
  return $post<IQueryPaginatedResData<IArticleTag>>('/article/tag/query', body)
}

/**
 * 添加文章类别
 */
export function createArticleTagApi(body: IUpsertArticleTagBodyDto) {
  return $post<string>('/article/tag/create', body)
}

/**
 * 编辑文章类别
 */
export function updateArticleTagApi(body: IUpsertArticleTagBodyDto, articleTagId: string) {
  return $patch<string>(`/article/tag/update/${articleTagId}`, body)
}

/**
 * 删除文章类别
 */
export function deleteArticleTagApi(body: IIdsDto) {
  return $delete<number>('/article/tag/delete', body)
}

/**
 * 删除指定文章类别
 */
export function deleteArticleTagByIdApi(articleTagId: string) {
  return $delete<number>(`/article/tag/delete/${articleTagId}`)
}
