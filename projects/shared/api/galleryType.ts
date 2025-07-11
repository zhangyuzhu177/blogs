import type {
  IGalleryType,
  IIdsDto,
  IQueryDto,
  IQueryPaginatedResData,
  IUpsertGalleryTypeBodyDto,
} from 'types'
import { useRequest } from '../composables/request'

const { $post, $patch, $delete } = useRequest()

/**
 * 查询图库分类列表
 */
export function queryGalleryTypeListApi(body: IQueryDto<IGalleryType>) {
  return $post<IQueryPaginatedResData<IGalleryType>>('/gallery/type/query', body)
}

/**
 * 创建图库分类
 */
export function createGalleryTypeApi(body: IUpsertGalleryTypeBodyDto) {
  return $post<string>('/gallery/type/create', body)
}

/**
 * 修改图库分类
 */
export function updateGalleryTypeApi(body: IUpsertGalleryTypeBodyDto, galleryId: string) {
  return $patch<string>(`/gallery/type/update/${galleryId}`, body)
}

/**
 * 删除指定图库分类
 */
export function deleteGalleryTypeApi(galleryId: string) {
  return $delete<boolean>(`/gallery/type/delete/${galleryId}`)
}

/**
 * 批量删除图库分类
 */
export function batchDeleteGalleryTypeApi(body: IIdsDto) {
  return $delete<number>('/gallery/type/delete', body)
}
