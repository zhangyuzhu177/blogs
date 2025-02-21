/** 状态（true：正常、false：禁用） */
export interface IStatusDto {
  /** 状态（true：正常、false：禁用） */
  status: boolean
}

/** 状态（可选，true：正常、false：禁用） */
export interface IStatusOptionalDto extends Partial<IStatusDto> { }
