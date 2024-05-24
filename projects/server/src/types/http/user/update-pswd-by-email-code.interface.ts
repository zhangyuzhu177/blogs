import type { IEmailDto } from '../../dto/email.interface'
import type { IPasswordDto } from '../../dto/password.interface'
import type { ICodeVerifyDto } from '../../dto/code-verify.interface'

/**
 * 根据邮箱验证码修改密码
 * 请求参数
 */
export interface IUpdatePasswordByEmailCodeBodyDto extends IPasswordDto, IEmailDto, ICodeVerifyDto {}
