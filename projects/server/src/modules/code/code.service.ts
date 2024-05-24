import { Injectable } from '@nestjs/common'
import { randomString } from '@catsjuice/utils'

import { responseError } from 'src/utils/response'
import { RedisService } from '../redis/redis.service'
import { CodeAction } from 'src/types/enum/code-action.enum'
import { ErrorCode } from 'src/types/enum/error-code.enum'

@Injectable()
export class CodeService {
  constructor(
    private readonly _redisSrv: RedisService,
  ) { }

  /**
   * 创建一个验证码并存入 redis
   * @param platformId
   * @param action
   * @param expireInMinutes
   * @returns
   */
  public async createCode(
    platformId: string,
    action: CodeAction,
    expireInMinutes = 5,
  ) {
    let code: string
    while (!code || code.startsWith('0'))
      code = Math.random().toString().slice(-6)
    const bizId = randomString(24, 24, '') + Date.now().toString(36)
    // save code to redis
    const client = await this._redisSrv.getClient(RedisType.CODE)

    await client.setEx(bizId, expireInMinutes * 60, JSON.stringify([
      platformId,
      action,
      code,
    ]))
    return { code, bizId }
  }

  /**
   * 将验证码存入 redis
   * @param ip
   * @param code
   * @param expireInMinutes
   * @returns
   */
  public async createCaptcha(
    ip: string,
    code: string,
      expireInMinutes = 5,
  ) {
    const bizId = randomString(24, 24, '') + Date.now().toString(36)
    // save code to redis
    const client = await this._redisSrv.getClient(RedisType.CODE)

    await client.setEx(bizId, expireInMinutes * 60, JSON.stringify([
      ip,
      code,
    ]))
    return { bizId }
  }

  /**
   * 校验一个验证码是否正确
   * @param bizId
   * @param compareInfo
   * @param deleteAfterVerify
   */
  public async verifyCode(
    bizId: string,
    compareInfo: [string, CodeAction, string],
    deleteAfterVerify = true,
  ) {
    const client = await this._redisSrv.getClient(RedisType.CODE)
    const codeInfo = await client.get(bizId)
    if (!codeInfo)
      return false
    const codeInfoArr = JSON.parse(codeInfo) as [string, CodeAction, string]
    if (codeInfoArr.some((v, i) => v !== compareInfo[i]))
      return false
    if (deleteAfterVerify)
      client.del(bizId)
    return true
  }

  /**
   * 校验一个验证码是否正确
   * @param bizId
   * @param compareInfo
   * @param deleteAfterVerify
   */
  public async verifyCaptcha(
    bizId: string,
    compareInfo: [string, string],
    deleteAfterVerify = true,
  ) {
    const client = await this._redisSrv.getClient(RedisType.CODE)
    const codeInfo = await client.get(bizId)
    if (!codeInfo)
      return false
    const codeInfoArr = JSON.parse(codeInfo) as [string, string]
    if (codeInfoArr.some((v, i) => v.toLowerCase() !== compareInfo[i].toLowerCase()))
      return false
    if (deleteAfterVerify)
      client.del(bizId)
    return true
  }

  public async verifyWithError(...args: Parameters<typeof this.verifyCode>) {
    const res = await this.verifyCode(...args)
    if (!res)
      responseError(ErrorCode.AUTH_CODE_NOT_MATCHED)
    return res
  }
}
