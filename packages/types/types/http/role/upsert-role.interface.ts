import type { IRole } from '../../entities/role.interface'
import type { PermissionType } from '../../enum/permission.enum'

/**
 * 创建/更新 业务角色
 * 请求参数
 */
export interface IUpsertRoleBodyDto
  extends Pick<IRole, 'name' | 'desc'> {
  /** 权限列表 */
  permissions?: PermissionType[]
}
