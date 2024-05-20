export interface IPhoneDto {
  /** 用户手机号 */
  phone: string
}

export interface IPhoneOptionalDto extends Partial<IPhoneDto> {}
