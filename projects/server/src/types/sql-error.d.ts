/** Sql 错误类型 */
const enum SqlError {
  /** 未知错误 */
  UNEXPECTED = 'UnExpected',
  /** 重复的数据 */
  DUPLICATE_ENTRY = 'DuplicateEntry',
  /** 外键约束失败 */
  FOREIGN_KEY_CONSTRAINT_FAILS = 'ForeignKeyConstraintFails',
  /** 实体属性未找到 */
  ENTITY_PROPERTY_NOT_FOUND = 'EntityPropertyNotFoundError'
}
