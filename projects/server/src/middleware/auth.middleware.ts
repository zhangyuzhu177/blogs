import { ModuleRef } from '@nestjs/core'
import { Injectable, Logger } from '@nestjs/common'
import type { NestMiddleware } from '@nestjs/common'

import type { User } from 'src/entities/user'
import { md5 } from 'src/utils/encrypt/md5'
import { UserService } from 'src/modules/user/user.service'
import { AuthService } from 'src/modules/auth/auth.service'
import { JwtAuthService } from 'src/modules/jwt-auth/jwt-auth.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name)

  constructor(
    private readonly _modRef: ModuleRef,
  ) {}

  private _readTokenFromBearAuthHeader(authHeader: string): string {
    return authHeader && authHeader.replace(/^Bearer\s(\S*)$/, '$1')
  }

  async use(req: FastifyRequest, _res: any, next: () => void) {
    let query
    try {
      query = req.url
        .split('?')
        .pop()
        .split('&')
        .reduce((dict, curr) => {
          const [key, value] = curr.split('=')
          dict[key] = value
          return dict
        }, {})
    }
    catch (_) {}

    const authHeader = (req?.headers as any)?.authorization
    const access_token = this._readTokenFromBearAuthHeader(authHeader) || query.token

    if (!access_token) {
      next()
      return
    }

    req.token = access_token
    const _jwtAuthSrv = this._modRef.get(JwtAuthService, { strict: false })
    const _userSrv = this._modRef.get(UserService, { strict: false })
    const _authSrv = this._modRef.get(AuthService, { strict: false })
    let info, user: User

    try {
      info = await _jwtAuthSrv.validateLoginAuthToken(access_token)
    }
    catch (e) {
      req.tokenExpired = true
      this.logger.error('解析 access_token 时出现错误', e)
    }
    try {
      const userId = info?.id
      user = await _userSrv.qb()
        .where('u.id = :id', { id: userId })
        .addSelect('u.password')
        .getOne()
    }
    catch (e) {
      this.logger.error('获取用户信息时出现错误', e)
    }
    if (!user)
      return next()

    if (user.status) {
      this.logger.error(`用户 ${user.account}, ${user.id} 已被删除，无法登录`)
      return next()
    }
    // 比较数据库内的用户账号与 access_token 解析的账号是否一致
    if (info?.account && info?.account === user.account) {
      req.user = user

      // 更新用户的最后活跃时间
      _authSrv.repo().update({ id: md5(access_token) }, { lastActiveAt: new Date() })
    }
    else {
      // 如果账号不一致，判定用户已更新了账号，旧的登录授权 token 全部销毁
      req.tokenExpired = true
      this.logger.warn(
        `User[${info?.id}]'s account in db[${user.account}] not match account in token[${info.account}]`,
      )
      // 直接销毁 token
      try {
        _jwtAuthSrv.destroyLoginAuthToken(access_token)
      }
      catch (e) {
        this.logger.error('Error destroying access_token', e)
      }
    }
    next()
  }
}
