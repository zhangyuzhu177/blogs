import type { PermissionType } from '../../enum/permission.enum'

/**
 * 创建/更新 业务角色
 * 请求参数
 */
export interface IUpsertRoleBodyDto {
  /** 业务角色的唯一标识 */
  id?: string
  /** 业务角色名称 */
  name: string
  /** 业务角色描述 */
  description?: string
  /** 权限列表 */
  permissions?: PermissionType[]
}
