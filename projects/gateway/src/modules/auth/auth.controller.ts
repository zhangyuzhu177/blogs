import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation } from '@nestjs/swagger';
import * as svgCaptcha from 'svg-captcha'
import { CodeService } from '../code/code.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly _codeSrv: CodeService
  ) { }

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
