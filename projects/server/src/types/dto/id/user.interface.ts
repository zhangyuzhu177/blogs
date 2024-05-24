export interface IUserIdDto {
  /** 用户的唯一标识 */
  userId: string
}

export interface IUserIdOptionalDto extends Partial<IUserIdDto> {}
