import type {
  IIdsDto,
  IQueryDto,
  IQueryPaginatedResData,
  IRole,
  IUpsertRoleBodyDto,
} from 'types'
import { useRequest } from '../utils/common/request'

const { $post, $delete } = useRequest()

/**
 * 获取管理角色列表
 */
export function getRolesApi(body: IQueryDto<IRole>) {
  return $post<IQueryPaginatedResData<IRole>>('/role/query', body)
}

/**
 * 创建管理角色
 */
export function createRoleApi(body: IUpsertRoleBodyDto) {
  return $post<string>('/role/create', body)
}

/**
 * 更新管理角色
 */
export function updateRoleApi(body: IUpsertRoleBodyDto, roleId: string) {
  return $post<string>(`/role/update/${roleId}`, body)
}

/**
 * 批量删除管理角色
 */
export function deleteRoleApi(body: IIdsDto) {
  return $delete<number>('/role/delete', body)
}

/**
 * 删除指定管理角色
 */
export function deleteRoleByIdApi(roleId: string) {
  return $delete<number>(`/role/delete/${roleId}`)
}
