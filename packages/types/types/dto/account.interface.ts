/** 账号 */
export interface IAccountDto {
  /** 账号 */
  account: string
}

/** 账号（可选） */
export interface IAccountOptionalDto extends Partial<IAccountDto> { }
