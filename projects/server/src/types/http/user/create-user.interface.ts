import type { IUser } from '../../entities/user.interface'
import type { IAccountDto } from '../../dto/account.interface'
import type { IUpdateUserBodyDto } from './update-user.interface'

/**
 * 创建用户
 * 请求参数
 */
export interface ICreateUserBodyDto extends
  IAccountDto,
  IUpdateUserBodyDto {
}

/**
 * 创建用户
 * 响应数据
 */
export interface ICreateUserResDto extends IUser {}
