/**
 * 校验角色名称
 */
export function validateRoleName(val?: string) {
  if (!val)
    return '请输入角色名称'
  if (val.length > 10)
    return '角色名称长度不得大于 10 位'
  return ''
}

/**
 * 校验数据角色描述
 */
export function validateRoleDesc(val?: string) {
  if (val && val.length > 200)
    return '角色描述长度不得大于 200 位'
  return ''
}
