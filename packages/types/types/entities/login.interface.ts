import type { IUserIdDto } from '../dto/id/user.interface'
import type { IUser } from './user.interface'
import type { ICreatedAt } from './_timestamp.interface'

/**
 * 登录
 */
export interface ILogin
  extends
  ICreatedAt,
  IUserIdDto {
  /** 登录记录唯一标识 */
  id: string
  /** 登录凭证 */
  token: string
  /** 过期时间 */
  expireAt: Date
  /** 用户信息 */
  user: IUser
  /** 登录的 ip */
  ip?: string
  /** 最后活动时间 */
  lastActiveAt?: Date
}
