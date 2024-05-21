import type { IRole } from '../../entities/role.interface'
import type { PermissionType } from '../../enum/permission.enum'

/**
 * 创建管理角色
 * 请求参数
 */
export interface ICreateRoleBodyDto extends Pick<IRole, 'name' | 'description'> {
  /** 权限列表 */
  permissions?: PermissionType[]
}
