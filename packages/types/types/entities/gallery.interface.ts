import type { INameDto } from '../dto/name.interface'
import type { IStatusDto } from '../dto/status.interface'
import type { IDescOptionalDto } from '../dto/desc.interface'
import type { IGalleryTypeIdDto } from '../dto/id/gallery-type.interface'

import type { IGalleryType } from './gallery-type.interface'
import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'

export interface IGallery
  extends
  INameDto,
  ICreatedAt,
  IUpdatedAt,
  IStatusDto,
  IGalleryTypeIdDto,
  IDescOptionalDto {
  /** 图库唯一标识 */
  id: string
  /** 图片列表 */
  picture: string[]
  /** 图库分类 */
  galleryType: IGalleryType
  /** 图片访问量 */
  pageView?: number
}
