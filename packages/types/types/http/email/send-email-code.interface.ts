import type { IBasicResponse } from '../basic.interface'
import type { IEmailDto } from '../../dto/email.interface'
import type { ICodeActionDto } from '../../dto/code-action.interface'

/**
 * 发送邮箱验证码
 * 请求参数
 */
export interface ISendEmailCodeBodyDto extends IEmailDto, ICodeActionDto {}

/**
 * 发送邮箱验证码
 * 响应数据
 */
export interface ISendEmailCodeResData {
  /** 发送到邮箱的验证码的唯一标识 */
  bizId: string
}

/**
 * 发送邮箱验证码的响应
 */
export interface ISendEmailCodeResDto extends IBasicResponse<ISendEmailCodeResData> {}
