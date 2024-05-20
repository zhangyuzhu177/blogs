import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Login } from 'src/entities/login';
import { Repository } from 'typeorm';
import { LoginByPasswordBodyDto } from './dto/login-by-password.body.dto';
import { CodeService } from '../code/code.service';
import { responseError } from 'src/utils/response';
import { ErrorCode } from 'src/types/enum/error-code.enum';
import { UserService } from '../user/user.service';
import { comparePassword } from 'src/utils/encrypt/encrypt-password';
import { User } from 'src/entities/user';
import { JwtAuthService } from '../jwt-auth/jwt-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _codeSrv:CodeService,

    @InjectRepository(Login)
    private readonly _loginRepo: Repository<Login>,
    @Inject(forwardRef(() => UserService))
    private readonly _userSrv: UserService,
    @Inject(forwardRef(() => JwtAuthService))
    private readonly _jwtAuthSrv: JwtAuthService,
  ) { }

  public async loginByPassword(body: LoginByPasswordBodyDto, ip: string) {
    const {account,email,code,bizId,password}=body

    if (!account && !email) {
      throw new Error('账号或邮箱至少需要填写一个');
    }
    if (!(await this._codeSrv.verifyCaptcha(bizId, [ip, code]))) {
      responseError(ErrorCode.AUTH_CODE_NOT_MATCHED)
    }

    const qb = this._userSrv.qb().addSelect('u.password')
    if (account)
      qb.where('u.account = :account', { account })
    else
      qb.where('u.email = :email', { email })

    const user = await qb.getOne()

    if (!user)
      responseError(ErrorCode.USER_ACCOUNT_NOT_REGISTERED)

    // 用户是否被禁用
    if (user.isDeleted)
      responseError(ErrorCode.USER_ACCOUNT_IS_DELETED)

    if (!user.password)
      responseError(ErrorCode.AUTH_PASSWORD_IS_NULL)

    // 校验密码
    const correct = await comparePassword(password, user.password)
    if (!correct)
      responseError(ErrorCode.AUTH_PASSWORD_NOT_MATCHED)

    return await this.signLoginTicket(user)
  }

  /**签发登录token */
  public async signLoginTicket(user: Partial<User>) {
    const sign = await this._jwtAuthSrv.signLoginAuthToken(user)
    return {
      sign,
      user: {
        ...user,
        password: !!user.password,
      },
    }
  }

  public repo() {
    return this._loginRepo;
  }
}
