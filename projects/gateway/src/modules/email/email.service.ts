import * as nodemailer from 'nodemailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SendEmailCodeBodyDto } from './dto/send-email-code.body.dto'
import { CodeService } from '../code/code.service'
import { CodeAction } from 'src/types/enum/code-action.enum'

@Injectable()
export class EmailService {
  readonly transporter: nodemailer.Transporter
  private readonly _mailCfg: any

  constructor(
    private readonly _cfgSrv: ConfigService,
    private readonly _codeSrv: CodeService,
  ) {
    this._mailCfg = this._cfgSrv.get('email')

    this.transporter = nodemailer.createTransport(this._mailCfg)
  }

  /** 发送邮件 */
  public async send(mailOptions: nodemailer.SendMailOptions) {
    try {
      this.transporter.sendMail({
        ...mailOptions,
        from: `系统通知 <${this._mailCfg?.auth?.user}>`,
      })
    }
    catch (e) {
      console.error(e)
    }
  }

  /** 发送验证码 */
  public async sendCode(body: SendEmailCodeBodyDto) {
    const expInMin = 5
    const { action, email } = body
    const {bizId,code}=await this._codeSrv.createCode(
      email,
      action,
      expInMin,
    )
    let html, subject
    if (action === CodeAction.REGISTER) {
      subject = `【验证码】用户注册`
      html = `<p>我们已收到您邮箱验证的请求。您的注册验证码为：<strong>${code}</strong>`
    }else if (action === CodeAction.LOGIN) {
      subject = `【验证码】用户登陆`
      html = `<p>我们已收到您邮箱验证的请求。您的登录验证码为：<strong>${code}</strong>`
    }else if (action === CodeAction.CHANGE_PASSWORD) {
      subject = `【验证码】用户修改密码`
      html = `<p>我们已收到您邮箱验证的请求。您的修改密码验证码为：<strong>${code}</strong>`
    }else {
      subject = `BLOGS ${action}`
      html = `<p>Your code for ${action} is: <strong>${code}</strong>, expire in ${expInMin} minutes</p>`
    }
    this.send({
      to: email,
      html,
      subject
    })
    return { bizId }
  }
}
