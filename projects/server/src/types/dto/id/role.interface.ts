export interface IRoleIdDto {
  /** 管理角色的唯一标识 */
  roleId: string
}

export interface IRoleIdOptionalDto extends Partial<IRoleIdDto> {}
