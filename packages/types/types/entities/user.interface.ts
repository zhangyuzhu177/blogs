import type { IEmailDto } from '../dto/email.interface'
import type { IStatusDto } from '../dto/status.interface'
import type { IAccountDto } from '../dto/account.interface'
import type { IPasswordDto } from '../dto/password.interface'
import type { IPhoneOptionalDto } from '../dto/phone.interface'
import type { IRoleIdOptionalDto } from '../dto/id/role.interface'
import type { IUserIdDto } from './../dto/id/user.interface'

import type { IRole } from './role.interface'
import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'
import type { ILogin } from './login.interface'

export interface IUser
  extends
  ICreatedAt,
  IUpdatedAt,
  IAccountDto,
  IPasswordDto,
  IStatusDto,
  IEmailDto,
  IPhoneOptionalDto,
  IRoleIdOptionalDto {
  /** 用户的唯一标识 */
  id: IUserIdDto['userId']

  /** 是否是系统管理员 */
  sysAdmin: boolean

  /** 分配的管理员角色 */
  role?: IRole
  /** 管理角色Id */
  roleId?: IRole['id']

  /** 用户的登录记录 */
  logins?: ILogin[]
}
