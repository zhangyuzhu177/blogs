import type { IBasicResponse } from '../basic.interface'
import type { IUser } from '../../entities/user.interface'

/**
 * 查询当前登录用户的信息
 * 响应数据
 */
export interface IUserProfileResDto extends IBasicResponse<IUser> {}
