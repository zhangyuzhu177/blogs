import type {
  IArticleType,
  IIdsDto,
  IQueryDto,
  IQueryPaginatedResData,
  IUpsertArticleTypeBodyDto,
} from 'types'
import { useRequest } from '../composables/request'

const { $get, $post, $patch, $delete } = useRequest()

/**
 * 获取文章分类列表
 */
export function getArticleTypeListApi() {
  return $get<IArticleType[]>('/article/type/list')
}

/**
 * 查询文章类别列表
 */
export function queryArticleTypeListApi(body: IQueryDto<IArticleType>) {
  return $post<IQueryPaginatedResData<IArticleType>>('/article/type/query', body)
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
