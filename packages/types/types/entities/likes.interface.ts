import type { IIpDto } from '../dto/ip.interface'
import type { LikesType } from '../enum/likes-type.enum'
import type { ICreatedAt } from './_timestamp.interface'

export interface ILikes
  extends
  IIpDto,
  ICreatedAt {
  /** 唯一标识 */
  id: string
  /** 浏览器指纹 */
  visitorId: string
  /** 点赞的内容id */
  contentId: string
  /** 点赞的类型 */
  type: LikesType
}
