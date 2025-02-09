import type {
  IAssignRoleBodyDto,
  IChangeStatusBodyDto,
  ICreateUserBodyDto,
  IQueryDto,
  IQueryPaginatedResData,
  IRelationRawDto,
  IUpdatePasswordByEmailCodeBodyDto,
  IUpdateUserBodyDto,
  IUser,
} from 'types'
import { useRequest } from '../composables/request'

const { $post, $patch, $get } = useRequest()

/**
 * 获取用户列表
 */
export function queryUserListApi(body: IQueryDto<IUser>) {
  return $post<IQueryPaginatedResData<IUser>>('/user/query', body)
}

/**
 *  创建一个新用户
 */
export function createUserApi(body: ICreateUserBodyDto) {
  return $post<string>('/user/create', body)
}

/**
 * 修改指定用户信息
 */
export function updateUserApi(userId: string, body: IUpdateUserBodyDto) {
  return $patch<string>(`/user/update/${userId}`, body)
}

/**
 * 批量修改用户状态
 */
export function changeUserStatusApi(body: IChangeStatusBodyDto) {
  return $post<number>('/user', body)
}

/**
 * 通过 邮箱 + 验证码 修改密码（不需要登录）
 */
export function updateOwnPasswordByEmailCodeApi(body: IUpdatePasswordByEmailCodeBodyDto) {
  return $patch<boolean>('/user/own/password/email', body)
}

/**
 * 获取当前登录用户的信息
 */
export function getOwnProfileApi(query?: IRelationRawDto) {
  return $get<IUser>('/user/own', query)
}

/**
 * 更新指定用户角色
 */
export function updateUserRoleApi(body: IAssignRoleBodyDto) {
  return $patch<number>('/user/assign', body)
}
