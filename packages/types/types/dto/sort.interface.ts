/** 排序信息 */
export interface ISortDto<T extends object = any> {
  /** 排序信息 */
  sort: Partial<Record<
    keyof T,
    {
      order: 'ASC' | 'DESC' | 'asc' | 'desc'
    }
  >>[]
}

/** 排序信息（可选） */
export interface ISortOptionalDto<T extends object = any>
  extends Partial<ISortDto<T>> {}
