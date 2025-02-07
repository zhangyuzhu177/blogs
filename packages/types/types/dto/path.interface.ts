/** 路径 */
export interface IPathDto {
  /** 路径 */
  path: string
}

/** 路径（可选） */
export interface IPathDtoOptionalDto extends Partial<IPathDto> {}
