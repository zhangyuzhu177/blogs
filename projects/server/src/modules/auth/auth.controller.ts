import * as svgCaptcha from 'svg-captcha'
import { Throttle } from '@nestjs/throttler'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Post, Req } from '@nestjs/common'

import { ApiSuccessResponse } from 'src/utils/response'

import { CodeService } from '../code/code.service'
import { AuthService } from './auth.service'
import { RegisterBodyDto } from './dto/register.body.dto'
import { LoginSuccessResDto } from './dto/login-success.res.dto'
import { LoginByPasswordBodyDto } from './dto/login-by-password.body.dto'
import { LoginByEmailCodeBodyDto } from './dto/login-by-email-code.body.dto'

@Controller('auth')
@ApiTags('Auth | 身份验证')
export class AuthController {
  constructor(
    private readonly _authSrv: AuthService,
    private readonly _codeSrv: CodeService,
  ) { }

  @ApiOperation({ summary: '注册（邮箱+验证码）' })
  @Post('register')
  public async register(
    @Body() body: RegisterBodyDto,
  ) {
    return this._authSrv.register(body)
  }

  @ApiOperation({ summary: '账号/邮箱 + 密码登录' })
  @ApiSuccessResponse(LoginSuccessResDto)
  @Post('login/password')
  public async loginByPassword(
    @Body() body: LoginByPasswordBodyDto,
    @Req() req: FastifyRequest,
  ) {
    return this._authSrv.loginByPassword(body, req.raw.ip)
  }

  @ApiOperation({ summary: '邮箱 + 验证码 登录' })
  @ApiSuccessResponse(LoginSuccessResDto)
  @Post('login/email/code')
  public async loginByEmailCode(
    @Body() body: LoginByEmailCodeBodyDto,
    @Req() req: FastifyRequest,
  ) {
    return await this._authSrv.loginByEmailCode(body, req.raw.ip)
  }

  @ApiOperation({ summary: '获取图形验证码' })
  @Throttle(1, 1)
  @Get('captcha')
  public async getCaptcha(@Req() req: FastifyRequest) {
    const ip = req.raw.ip

    const captcha = svgCaptcha.create({
      size: 6,
      width: 144,
      height: 48,
      noise: 3,
      fontSize: 48,
      ignoreChars: 'lI',
    })

    const { bizId } = await this._codeSrv.createCaptcha(ip, captcha.text)
    return {
      bizId,
      text: captcha.text,
      img: captcha.data,
    }
  }

  @ApiOperation({ summary: '退出登录（删除token）' })
  @Post('logout')
  public async logout(@Req() req: FastifyRequest) {
    return this._authSrv.logout(req.raw.token)
  }
}
