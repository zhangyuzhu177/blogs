/** 查询字段 */
export interface ISelectDto<T extends object = any> {
  /** 查询字段 */
  select: (keyof T)[]
}

/** 查询字段（可选） */
export interface ISelectOptionalDto<T extends object = any>
  extends Partial<ISelectDto<T>> {}
