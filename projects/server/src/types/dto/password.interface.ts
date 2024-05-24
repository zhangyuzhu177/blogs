export interface IPasswordDto {
  /** 用户密码 */
  password: string
}

export interface IPasswordOptionalDto extends Partial<IPasswordDto> {}
