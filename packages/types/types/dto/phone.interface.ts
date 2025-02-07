/** 用户手机号 */
export interface IPhoneDto {
  /** 用户手机号 */
  phone: string
}

/** 用户手机号（可选） */
export interface IPhoneOptionalDto extends Partial<IPhoneDto> {}
