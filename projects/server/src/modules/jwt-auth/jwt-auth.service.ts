import { ErrorCode } from 'types'
import { JwtService } from '@nestjs/jwt'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { objectOmit, objectPick } from 'utils'

import { User } from 'src/entities/user'
import { md5 } from 'src/utils/encrypt/md5'
import { responseError } from 'src/utils/response'

import { RedisService } from '../redis/redis.service'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly _jwtSrv: JwtService,
    @Inject(forwardRef(() => AuthService))
    private readonly _authSrv: AuthService,
    private readonly _cfgSrv: ConfigService,
    private readonly _redisSrv: RedisService,
  ) { }

  /**
   * 根据用户签发登录成功的授权token
   */
  public async signLoginAuthToken(user: Partial<User>, ip?: string) {
    const expiresIn = this._cfgSrv.get<number>('jwt.loginAuthExpireInSeconds')
    const secret = this._cfgSrv.get<string>('jwt.loginAuthSecret')
    const signObj = {
      ...objectPick(user, 'id', 'account', 'email'),
      ip,
      timestamp: Date.now(),
    }
    const access_token = this._jwtSrv.sign(signObj, { secret, expiresIn })
    const client = this._redisSrv.getClient(RedisType.AUTH_JWT)
    client.setEx(access_token, expiresIn, `${expiresIn}`)

    // 存储token
    this._authSrv.repo().insert({
      id: md5(access_token),
      token: access_token,
      userId: user.id,
      expireAt: new Date(Date.now() + expiresIn * 1000),
      ip,
      lastActiveAt: new Date(),
    })
    return {
      sign: {
        access_token,
        expireAt: Date.now() + expiresIn
      },
      user: objectOmit(user, 'password')
    }
  }

  /**
   * 校验签发的用户授权 token
   */
  public async validateLoginAuthToken(token: string) {
    // 1. 检查 redis
    try {
      const client = this._redisSrv.getClient(RedisType.AUTH_JWT)
      const exists = await client.exists(token)
      if (!exists)
        return
    }
    catch (e) {
      return
    }

    // 2. 检查 token 是否有效
    return this._jwtSrv.verifyAsync(token, {
      secret: this._cfgSrv.get<string>('jwt.loginAuthSecret'),
    })
  }

  /**
   * 删除指定的token
   */
  public async destroyLoginAuthToken(token: string) {
    const client = this._redisSrv.getClient(RedisType.AUTH_JWT)
    try {
      const exists = await client.exists(token)
      if (!exists)
        throw new Error('AccessToken not exists in cache')

      // 删除数据库中存储的 token
      this._authSrv.repo().delete({ id: md5(token) })
    }
    catch (e) {
      responseError(ErrorCode.AUTH_LOGIN_EXPIRED)
    }
    client.del(token)
    return true
  }
}
