import { INameDto } from "../dto/name.interface"
import { IDescOptionalDto } from "../dto/desc.interface"
import { ICreatedAt, IUpdatedAt } from "./_timestamp.interface"
import { IGalleryTypeIdDto } from "../dto/id/gallery-type.interface"

export interface IGallery
  extends
  INameDto,
  ICreatedAt,
  IUpdatedAt,
  IGalleryTypeIdDto,
  IDescOptionalDto {
  /** 图库唯一标识 */
  id: string
  /** 图片列表 */
  picture: string[]
  /** 图片访问量 */
  pageView?: number
}
