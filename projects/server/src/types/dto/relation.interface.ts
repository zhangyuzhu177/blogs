export interface IRelation {
  [key: string]: IRelation | boolean
}

export interface IRelationDto {
  /** 需要查询的关联 */
  relation?: IRelation
}

export interface IRelationRawDto {
  /** 需要查询的关联, 需要按 `role;role.permissions` 的格式将多个要关联的字段用 `;` 拼接 */
  relation?: string
}
