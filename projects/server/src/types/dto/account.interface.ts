export interface IAccountDto {
  /** 用于登录的账户名称 */
  account: string
}

export interface IAccountOptionalDto extends Partial<IAccountDto> {}
