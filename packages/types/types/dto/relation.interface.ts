/** 需要查询的关联信息 */
export interface IRelationRawDto {
  /** 需要查询的关联信息, 按 `adminRole;adminRole.permissions` 的格式将多个要关联的字段用 `;` 拼接 */
  relation?: string
}
