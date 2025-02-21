/** 用户邮箱 */
export interface IEmailDto {
  /** 用户邮箱 */
  email: string
}

/** 用户邮箱（可选） */
export interface IEmailOptionalDto extends Partial<IEmailDto> {}
