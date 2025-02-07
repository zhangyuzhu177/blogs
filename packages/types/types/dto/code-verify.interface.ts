export interface ICodeVerifyDto {
  /** 发送验证码后获取到的唯一标识 */
  bizId: string
  /** 收到的验证码 */
  code: string
}

export interface ICodeVerifyOptionalDto extends Partial<ICodeVerifyDto> { }
