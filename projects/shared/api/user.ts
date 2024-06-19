import type { ICreateUserBodyDto } from 'types/http/user/create-user.interface'
import type { IUser } from '../types/entities/user.interface'
import { useRequest } from '../utils/common/request'
import type { IUserIdDto } from '../types/dto/id/user.interface'
import type { IGetProfileOwnQueryDto } from '../types/http/user/get-profile-own.interface'
import type { IUpdateUserBodyDto } from '../types/http/user/update-user.interface'
import type { IUpdatePasswordByEmailCodeBodyDto } from '../types/http/user/update-pswd-by-email-code.interface'
import type { IRoleIdDto } from '../types/dto/id/role.interface'

const { $patch, $get, $delete, $put } = useRequest()

/** 获取用户列表 */
export function getUserListApi() {
  return $get<IUser[]>('/user/list')
}

/**
 *  创建一个新用户
 * @param body
 * @returns
 */
export function createUserApi(body: ICreateUserBodyDto) {
  return $put<IUser>('/user', body)
}

/**
 * 修改指定用户信息
 * @param userId
 * @param body
 * @returns
 */
export function updateUserApi(userId: IUserIdDto['userId'], body: IUpdateUserBodyDto) {
  return $patch<boolean>(`/user/${userId}`, body)
}

/**
 * 批量停用用户
 * @param body
 * @returns
 */
export function deleteUserApi(body: IUserIdDto['userId'][]) {
  return $delete<number>('/user', body)
}

/**
 * 批量恢复用户
 * @param body
 * @returns
 */
export function recoverUserApi(body: IUserIdDto['userId'][]) {
  return $patch<number>('/user', body)
}

/**
 * 通过邮箱验证码修改密码（不需要登录）
 * @param body
 * @returns
 */
export function updateOwnPasswordByEmailCodeApi(body: IUpdatePasswordByEmailCodeBodyDto) {
  return $patch<boolean>('/user/own/password/email', body)
}

/**
 * 获取当前登录用户的信息
 * @param body
 * @returns
 */
export function getOwnProfileApi(body: IGetProfileOwnQueryDto) {
  return $get<IUser>('/user/profile/own', body)
}

/**
 * 更新指定用户角色
 * @param userId
 * @param roleId
 * @returns
 */
export function updateUserRoleApi(userId: IUserIdDto['userId'], roleId: IRoleIdDto['roleId']) {
  return $patch<number>(`/user/${userId}/role/${roleId}`)
}

export function clearUserPasswordApi(body: IUserIdDto['userId'][]) {
  return $delete<number>('/user/delete/password', body)
}
