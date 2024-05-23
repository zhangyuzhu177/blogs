import type { IPasswordDto } from '../../dto/password.interface'

/**
 * 根据旧密码修改密码
 * 请求参数
 */
export interface IUpdatePasswordByOldBodyDto {
  newPassword: IPasswordDto['password']
  oldPassword?: IPasswordDto['password']
}
