import type {
  IArticle,
  IChangeStatusBodyDto,
  IIdsDto,
  IQueryDto,
  IQueryPaginatedResData,
  IUpsertArticleBodyDto,
} from 'types'
import { useRequest } from '../composables/request'

const { $post, $get, $patch, $delete } = useRequest()

/**
 * 获取文章列表
 */
export function queryArticleListApi(body: IQueryDto<IArticle>) {
  return $post<IQueryPaginatedResData<IArticle>>('/article/entities/query', body)
}

/**
 * 获取文章详情
 */
export function gerArticleInfoApi(id: IArticle['id']) {
  return $get<IArticle>(`/article/detail${id}`)
}

/**
 * 发布文章
 */
export function createArticleApi(body: IUpsertArticleBodyDto) {
  return $post<string>('/article/entities/create', body)
}

/**
 * 编辑文章
 */
export function updateArticleApi(body: IUpsertArticleBodyDto, articleId: string) {
  return $patch<string>(`/article/entities/update/${articleId}`, body)
}

/**
 * 修改文章状态
 */
export function changeArticleStatusApi(body: IChangeStatusBodyDto) {
  return $post<string>('/article/entities/status', body)
}

/**
 * 删除文章
 */
export function deleteArticleApi(body: IIdsDto) {
  return $delete<number>('/article/entities/delete', body)
}

/**
 * 删除指定文章
 */
export function deleteArticleByIdApi(articleId: string) {
  return $delete<number>(`/article/entities/delete/${articleId}`)
}
