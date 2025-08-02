import { registerAs } from '@nestjs/config'
import { parseIntRaw } from 'utils'

export interface SystemConfig {
  /**
   * 服务器配置
   */
  server: {
    /**
     * 服务器地址
     */
    host: string
    /**
     * 服务器端口
     */
    port?: number
    /**
     * 登录用户名
     */
    username: string
    /**
     * 登录密码
     */
    password?: string
    /**
     * 私钥
     */
    privateKey?: string
  }
}

export default registerAs('system', (): SystemConfig => {
  const {
    REMOTE_SERVER_HOST,
    REMOTE_SERVER_PORT,
    REMOTE_SERVER_USERNAME,
    REMOTE_SERVER_PASSWORD,
    REMOTE_SERVER_PRIVATE_KEY,
  } = process.env

  return {
    server: {
      host: REMOTE_SERVER_HOST,
      port: parseIntRaw(REMOTE_SERVER_PORT, 22),
      username: REMOTE_SERVER_USERNAME,
      password: REMOTE_SERVER_PASSWORD,
      privateKey: REMOTE_SERVER_PRIVATE_KEY,
    },
  }
})
