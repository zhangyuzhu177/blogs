import { validateLength } from 'utils'

/**
 * 校验名称
 */
export function validateName(name?: string) {
  return validateLength('名称', name, 2, 10)
}

/**
 * 校验数据描述
 */
export function validateDesc(desc?: string) {
  return validateLength('描述', desc, 0, 200)
}
