export interface IEmailDto {
  /** 用户邮箱 */
  email: string
}

export interface IEmailOptionalDto extends Partial<IEmailDto> {}
