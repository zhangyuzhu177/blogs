import type { IUser } from '../../entities/user.interface'
import type { IEmailDto } from '../../dto/email.interface'
import type { IPhoneOptionalDto } from '../../dto/phone.interface'
import type { IPasswordOptionalDto } from '../../dto/password.interface'

/**
 * 修改用户信息
 * 请求参数
 */
export interface IUpdateUserBodyDto extends
  IEmailDto,
  IPhoneOptionalDto,
  IPasswordOptionalDto {
  /** 账号是否被删除 */
  isDeleted?: IUser['isDeleted']

  /** 是否给用户发送邮件 */
  sendEmail?: boolean
}
