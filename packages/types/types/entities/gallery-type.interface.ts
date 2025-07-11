import type { INameDto } from '../dto/name.interface'
import type { IDescOptionalDto } from '../dto/desc.interface'
import type { IOrderOptionalDto } from '../dto/order.interface'
import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'

import type { IGallery } from './gallery.interface'

/** 图库类型 */
export interface IGalleryType
  extends
  INameDto,
  ICreatedAt,
  IUpdatedAt,
  IOrderOptionalDto,
  IDescOptionalDto {
  /** 图库类型唯一标识 */
  id: string
  /** 图库列表 */
  galleries?: IGallery[]
}
