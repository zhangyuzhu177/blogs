import { registerAs } from '@nestjs/config'
import { parseBoolRaw, parseIntRaw } from 'utils'

export interface EmailConfig {
  /** 邮件服务传输协议 */
  smtp: {
    /** 邮件服务地址 */
    host: string
    /** 邮件服务端口 */
    port: number
    /** 邮件服务是否使用安全模式连接 */
    secure: boolean
    /** 邮件服务认证信息 */
    auth: {
      /** 邮件服务用户名 */
      user?: string
      /** 邮件服务密码 */
      pass: string
    }
  }
  /** 邮件服务用户名 */
  users: string[]
  /** 邮件发送频率限制 */
  hzLimit: number
}

export default registerAs('email', (): EmailConfig => {
  const {
    EMAIL_SMTP_HOST, EMAIL_SMTP_PORT,
    EMAIL_SMTP_USER, EMAIL_SMTP_PSWD,
    EMAIL_SMTP_SECURE, EMAIL_SEND_HZ_LIMIT,
  } = process.env

  const users = EMAIL_SMTP_USER.replace(/\s+/g, '').split(',').map(v => v.trim())
  return {
    smtp: {
      host: EMAIL_SMTP_HOST,
      port: parseIntRaw(EMAIL_SMTP_PORT),
      secure: parseBoolRaw(EMAIL_SMTP_SECURE, true),
      auth: {
        pass: EMAIL_SMTP_PSWD,
      },
    },
    users,
    hzLimit: parseIntRaw(EMAIL_SEND_HZ_LIMIT, 2) * users.length,
  }
})
