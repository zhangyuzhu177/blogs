import { CodeAction, ErrorCode } from 'types'
import { Cron } from '@nestjs/schedule'
import { objectOmit } from '@catsjuice/utils'
import { LessThan, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, } from '@nestjs/common'

import { User } from 'src/entities/user'
import { Login } from 'src/entities/login'
import { responseError } from 'src/utils/response'
import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'

import { CodeService } from '../code/code.service'
import { UserService } from '../user/user.service'
import { JwtAuthService } from '../jwt-auth/jwt-auth.service'

import { RegisterBodyDto } from './dto/register.body.dto'
import { LoginByPasswordBodyDto } from './dto/login-by-password.body.dto'
import { LoginByEmailCodeBodyDto } from './dto/login-by-email-code.body.dto'
import { comparePassword, paramAtLeastOne } from 'src/utils'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Login)
    private readonly _loginRepo: Repository<Login>,

    private readonly _codeSrv:CodeService,
    private readonly _userSrv: UserService,
    private readonly _jwtAuthSrv: JwtAuthService,
  ) { }

  @Cron('*/30 * * * * *')
  public async clearExpiredLogin() {
    await this._loginRepo.delete({
      expireAt: LessThan(new Date()),
    })
  }

  /** 注册 */
  public async register(body: RegisterBodyDto, ip:string) {
    const user =await this._userSrv.qb().where('account=:account', { account: body.account }).getOne()

    if (user)
      responseError(ErrorCode.USER_ACCOUNT_REGISTERED)

    // 校验验证码
    const { code, bizId, ...userInfo } = body
    const { email } = userInfo
    await this._codeSrv.verifyWithError(bizId, [email, CodeAction.REGISTER, code])

    // 创建用户
    try {
      // const user = await this._userSrv.createUser(userInfo)
      const sign = await this._jwtAuthSrv.signLoginAuthToken(user)
      return {
        sign,
        user:objectOmit(user,['password'])
      }
    } catch (error) {
      const sqlError = parseSqlError(error)
      if (sqlError === SqlError.DUPLICATE_ENTRY)
        responseError(ErrorCode.USER_EXISTED, '账号已注册')
      throw error
    }
  }

  /**
   * 账号/邮箱 + 密码登录
   */
  public async loginByPassword(body: LoginByPasswordBodyDto, ip: string) {
    paramAtLeastOne(body, 'account', 'email')

    const {account, email, code, bizId, password}=body

    if (!(await this._codeSrv.verifyCaptcha(bizId, [ip, code]))) {
      responseError(ErrorCode.AUTH_CODE_NOT_MATCHED)
    }

    const qb = this._userSrv.qb().addSelect('u.password')
    if (account)
      qb.where('u.account = :account', { account })
    else
      qb.where('u.email = :email', { email })

    const user = await qb.getOne()

    if (!user) {
      responseError(
        account
          ? ErrorCode.USER_ACCOUNT_NOT_REGISTERED
          : ErrorCode.USER_EMAIL_NOT_REGISTERED
      )
    }


    // 用户是否被禁用
    if (!user.status)
      responseError(ErrorCode.USER_ACCOUNT_IS_DELETED)

    if (!user.password)
      responseError(ErrorCode.AUTH_PASSWORD_IS_NULL)

    // 校验密码
    const correct = await comparePassword(password, user.password)
    if (!correct)
      responseError(ErrorCode.AUTH_PASSWORD_NOT_MATCHED)

    return this._jwtAuthSrv.signLoginAuthToken(user, ip)
  }

  /**
   * 邮箱 + 验证码登录
   */
  public async loginByEmailCode(body: LoginByEmailCodeBodyDto,ip: string) {
    const { bizId, code, email } = body
    await this._codeSrv.verifyWithError(bizId, [email, CodeAction.LOGIN, code])

    const user = await this._userSrv.repo().findOneBy({ email })
    if (!user)
      responseError(ErrorCode.USER_EMAIL_NOT_REGISTERED)
    if (!user.status)
      responseError(ErrorCode.USER_ACCOUNT_IS_DELETED)

    return this._jwtAuthSrv.signLoginAuthToken(user, ip)
  }

  /**
   * 退出登录
  */
  public async logout(token:string) {
    await this._jwtAuthSrv.destroyLoginAuthToken(token)
    return true
  }

  public repo() {
    return this._loginRepo;
  }
}
