import { Reflector } from '@nestjs/core'
import { Injectable, SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'
import type { CanActivate, ExecutionContext } from '@nestjs/common'

import { RoleService } from 'src/modules/role/role.service'
import { getReflectorValue } from 'src/utils/reflector-value'
import { ApiErrorResponse, responseError } from 'src/utils/response'
import { IsLoginApis, LoginGuard } from './login.guard'
import { ErrorCode } from 'src/types/enum/error-code.enum'
import { PermissionType } from 'src/types/enum/permission.enum'

type PermissionRelation = 'OR' | 'AND'

@Injectable()
export class PermissionGuard extends LoginGuard implements CanActivate {
  constructor(
    public readonly reflector: Reflector,
    public readonly roleSrv: RoleService,
  ) {
    super(reflector)
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = context.switchToHttp().getRequest()
    const loginRequired = getReflectorValue<boolean>(
      this.reflector,
      context,
      'loginRequired',
      true,
    )

    const login = await super.canActivate(context)

    if (!login && loginRequired)
      responseError(ErrorCode.AUTH_LOGIN_REQUIRED)

    const requiredPermissions = getReflectorValue<PermissionType[]>(
      this.reflector,
      context,
      'permissions',
      [],
    )
    const permissionsRelation = getReflectorValue<PermissionRelation>(
      this.reflector,
      context,
      'relation',
      'OR',
    )

    return await this.validatePermission(req, requiredPermissions, permissionsRelation)
  }

  async validatePermission(
    req: FastifyRequest,
    requiredPermissions: PermissionType[],
    permissionsRelation: PermissionRelation,
  ) {
    const user = req.raw.user

    const role = user?.roleId
      ? await this.roleSrv.repo().findOne({
        where: { id: user.roleId },
        relations: { permissions: true },
      })
      : null

    // save roles
    req.raw.user && (req.raw.user.role = role)

    if (!requiredPermissions.length)
      return true

    // check
    const hasPermission = role?.permissions?.length
      ? requiredPermissions[permissionsRelation === 'OR' ? 'some' : 'every'](
        permission => role.permissions.some(p => p.name === permission),
      )
      : false

    if (!hasPermission)
      responseError(ErrorCode.PERMISSION_DENIED)

    return true
  }
}

/**
 * 对用户权限进行校验的守卫
 * @param permissions 如果为空数组，则表示不需要权限，但是需要登录，会在用户信息上添加 `role` 字段
 */
export function HasPermission(
  permissions: PermissionType[] | PermissionType = [],
  relation: PermissionRelation = 'OR',
  loginRequired = true,
) {
  if (!Array.isArray(permissions))
    permissions = [permissions]
  return applyDecorators(
    IsLoginApis(),
    UseGuards(PermissionGuard),
    SetMetadata('permissions', permissions),
    SetMetadata('relation', relation),
    SetMetadata('loginRequired', loginRequired),
    ApiErrorResponse(ErrorCode.PERMISSION_DENIED),
  )
}
