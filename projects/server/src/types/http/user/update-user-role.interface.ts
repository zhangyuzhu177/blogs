import type { IUserIdDto } from '../../dto/id/user.interface'
import type { IRoleIdOptionalDto } from '../../dto/id/role.interface'

/**
 * 批量更新用户管理角色
 * 请求参数
 */
export interface IBatchUpdateUserRoleBodyDto extends IRoleIdOptionalDto {
  id: IUserIdDto['userId'][]
}
