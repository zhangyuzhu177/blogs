import type { IUserIdDto } from '../dto/id/user.interface'
import type { IAccountDto } from '../dto/account.interface'
import type { IPasswordOptionalDto } from '../dto/password.interface'
import type { IEmailOptionalDto } from '../dto/email.interface'
import type { IPhoneOptionalDto } from '../dto/phone.interface'
import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'
import type { IRole } from './role.interface'
import type { ILogin } from './login.interface'

/**
 * 用户
 */
export interface IUser extends
  ICreatedAt,
  IUpdatedAt,
  IAccountDto,
  IEmailOptionalDto,
  IPhoneOptionalDto,
  IPasswordOptionalDto {
  /** 用户唯一标识 */
  id: IUserIdDto['userId']

  /** 账号是否被删除 */
  isDeleted?: boolean
  /** 是否为系统管理员 */
  isSysAdmin?: boolean

  /** 用户的管理角色信息 */
  role?: IRole
  /** 管理角色Id */
  roleId?: IRole['id']

  /** 用户的登录记录 */
  logins?: ILogin[]
}
