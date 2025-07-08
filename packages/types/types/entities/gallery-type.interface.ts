import { INameDto } from "../dto/name.interface"
import { IDescOptionalDto } from "../dto/desc.interface"
import { IOrderOptionalDto } from "../dto/order.interface"
import { ICreatedAt, IUpdatedAt } from "./_timestamp.interface"

import { IGallery } from "./gallery.interface"

/** 图库类型 */
export interface IGalleryType
  extends
  INameDto,
  ICreatedAt,
  IUpdatedAt,
  IOrderOptionalDto,
  IDescOptionalDto {
  /** 图库类型唯一标识 */
  id: string;
  /** 图库列表 */
  gallery?: IGallery[];
}
