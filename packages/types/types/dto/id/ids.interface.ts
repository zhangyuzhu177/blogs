/** 实体唯一标识的数组 */
export interface IIdsDto {
  /** 实体唯一标识的数组 */
  ids: string[]
}

/** 实体唯一标识的数组（可选） */
export interface IIdsOptionalDto extends Partial<IIdsDto> {}
