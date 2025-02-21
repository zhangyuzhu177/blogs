/** 排序 */
export interface IOrderDto {
  /** 排序 */
  order: number
}

/** 排序（可选） */
export interface IOrderOptionalDto extends Partial<IOrderDto> {}
