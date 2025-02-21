interface ExtendRequest extends Request {
  /** 中间件捕获的 IP 地址 */
  ip: string | null

  /** 当前登录的用户信息 */
  user?: import('../entities/user.js').User

  /** 当前用户的凭证 */
  token?: string
  /** 标记 token 是否已过期 */
  tokenExpired?: boolean
  /** 标记 token 是否被禁用 */
  tokenDisable?: boolean
  /** 标记 token 是否在其他设备登录 */
  tokenLoginOther?: boolean
}

declare interface FastifyRequest extends ExtendRequest {
  raw: ExtendRequest
}
