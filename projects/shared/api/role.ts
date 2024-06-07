import { useRequest } from '../utils/common/request'
import { IRole } from '../types/entities/role.interface'
import { IRoleIdDto } from '../types/dto/id/role.interface'
import { IUpsertRoleBodyDto } from '../types/http/role/upsert-role.interface'


const {$get,$post,$delete}=useRequest()

/**获取角色列表 */
export function getRolesApi() {
  return $get<IRole[]>('/role/list')
}

/**
 * 创建/更新角色
 */
export function upsertRoleApi(body: IUpsertRoleBodyDto) {
  return $post<IRole[]>('/role/upsert', body)
}

/**
 * 批量删除角色
 */
export function batchDeleteRoleApi(body: IRoleIdDto['roleId'][]) {
  return $delete<number>('/role/batch', body)
}
