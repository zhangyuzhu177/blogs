import type { IUser } from '../../entities/user.interface'
import type { IStatusOptionalDto } from '../../dto/status.interface'

/**
 * 创建用户
 * 请求参数
 */
export interface ICreateUserBodyDto
  extends
  Pick<
    IUser,
    'account' | 'email' | 'password' | 'phone'
  >,
  IStatusOptionalDto {}
