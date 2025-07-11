import type {
  IChangeStatusBodyDto,
  ICreateLikeBodyDto,
  IGallery,
  IIdsDto,
  IQueryDto,
  IQueryPaginatedResData,
  IUpsertGalleryBodyDto,
} from 'types'
import { useRequest } from '../composables/request'

const { $get, $post, $patch, $delete } = useRequest()

/**
 * 获取图库详情
 */
export function getGalleryDetailByIdApi(galleryId: string) {
  return $get<IGallery>(`/gallery/entities/detail/${galleryId}`)
}

/**
 * 查询图库列表
 */
export function queryGalleryListApi(body: IQueryDto<IGallery>) {
  return $post<IQueryPaginatedResData<IGallery>>('/gallery/entities/query', body)
}

/**
 * 创建图库
 */
export function createGalleryApi(body: IUpsertGalleryBodyDto) {
  return $post<string>('/gallery/entities/create', body)
}

/**
 * 修改图库
 */
export function updateGalleryApi(body: IUpsertGalleryBodyDto, galleryId: string) {
  return $patch<string>(`/gallery/entities/update/${galleryId}`, body)
}

/**
 * 删除指定图库
 */
export function deleteGalleryApi(galleryId: string) {
  return $delete<boolean>(`/gallery/entities/delete/${galleryId}`)
}

/**
 * 批量删除图库
 */
export function batchDeleteGalleryApi(body: IIdsDto) {
  return $delete<number>('/gallery/entities/delete', body)
}

/**
 * 批量修改图库状态
 */
export function changeGalleryStatusApi(body: IChangeStatusBodyDto) {
  return $post<number>('/gallery/entities/status', body)
}

/**
 * 点赞
 */
export function likeGalleryApi(body: ICreateLikeBodyDto) {
  return $post<string>('/gallery/entities/like', body)
}
