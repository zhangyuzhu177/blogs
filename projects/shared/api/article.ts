import type { UpsertArticleBodyDto } from '../types/http/article/upsert-body.dto'
import type { IArticle } from '../types/entities/article.interface'
import { useRequest } from '../utils/common/request'

const { $post, $get, $delete } = useRequest()

/** 获取文章列表 */
export function getArticleListApi() {
  return $get<IArticle[]>('/article/list')
}

/** 获取文章详情  */
export function gerArticleInfoApi(id: IArticle['id']) {
  return $get<IArticle>(`/article/detail${id}`)
}

/** 添加/编辑文章 */
export function upsertArticleApi(body: UpsertArticleBodyDto) {
  return $post<IArticle>('/article/upsert', body)
}

/** 删除文章  */
export function deleteArticleApi(id: IArticle['id']) {
  return $delete(`/article/delete${id}`)
}
