/** 管理员角色的唯一标识 */
export interface IRoleIdDto {
  roleId: string
}

/** 管理员角色的唯一标识（可选） */
export interface IRoleIdOptionalDto extends Partial<IRoleIdDto> { }
