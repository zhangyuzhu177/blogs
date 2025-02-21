/** 用户密码 */
export interface IPasswordDto {
  /** 用户密码 */
  password: string
}

/** 用户密码（可选） */
export interface IPasswordOptionalDto extends Partial<IPasswordDto> {}
