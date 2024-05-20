import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as svgCaptcha from 'svg-captcha'
import { CodeService } from '../code/code.service';
import { ApiSuccessResponse } from 'src/utils/response';
import { LoginSuccessResDto } from './dto/login-success.res.dto';
import { LoginByPasswordBodyDto } from './dto/login-by-password.body.dto';

@Controller('auth')
@ApiTags('Auth | 身份验证')
export class AuthController {
  constructor(
    private readonly _authSrv: AuthService,
    private readonly _codeSrv: CodeService
  ) { }

  @ApiOperation({ summary: '账号/邮箱+密码登录' })
  @ApiSuccessResponse(LoginSuccessResDto)
  @Post('login/password')
  public async loginByPassword(
    @Body() body:LoginByPasswordBodyDto,
    @Req() req: FastifyRequest
  ) {
    return this._authSrv.loginByPassword(body, req.raw.ip)
  }

  @Throttle(1, 1)
  @ApiOperation({ summary: '获取图形验证码' })
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
      img: captcha.data,
    }
  }
}
