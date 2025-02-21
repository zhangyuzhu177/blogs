/** 名称 */
export interface INameDto {
  /** 名称 */
  name: string
}

/** 名称（可选） */
export interface INameOptionalDto extends Partial<INameDto> { }
