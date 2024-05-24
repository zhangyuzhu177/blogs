interface ExtendRequest extends Request {
  /** 当前登录的用户信息 */
  user?: import('../entities/user.js').User
  /** 当前用户的凭证 */
  token?: string
  /** 标记 accessToken 是否已过期 */
  accessTokenExpired?: boolean
  /** 中间件捕获的 IP 地址 */
  ip: string
}

declare interface FastifyRequest extends ExtendRequest {
  raw: ExtendRequest
}
