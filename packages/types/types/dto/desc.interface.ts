/** 描述 */
export interface IDescDto {
  /** 描述 */
  desc: string
}

/** 描述（可选） */
export interface IDescOptionalDto extends Partial<IDescDto> { }
