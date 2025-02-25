import type {
  IArticleTag,
  IIdsDto,
  IQueryDto,
  IQueryPaginatedResData,
  IUpsertArticleTypeBodyDto,
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
export function createArticleTypeApi(body: IUpsertArticleTypeBodyDto) {
  return $post<string>('/article/type/create', body)
}

/**
 * 编辑文章类别
 */
export function updateArticleTypeApi(body: IUpsertArticleTypeBodyDto, articleTypeId: string) {
  return $patch<string>(`/article/type/update/${articleTypeId}`, body)
}

/**
 * 删除文章类别
 */
export function deleteArticleTypeApi(body: IIdsDto) {
  return $delete<number>('/article/type/delete', body)
}

/**
 * 删除指定文章类别
 */
export function deleteArticleTypeByIdApi(articleTypeId: string) {
  return $delete<number>(`/article/type/delete/${articleTypeId}`)
}
