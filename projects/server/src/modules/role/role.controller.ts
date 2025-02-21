import { getQuery } from 'src/utils'
import { PermissionType } from 'types'
import { Role } from 'src/entities/role'
import { RoleIdDto } from 'src/dto/id/role.dto'
import { IdsDto, QueryDto, QueryResDto, SuccessStringDto } from 'src/dto'
import { ApiSuccessResponse } from 'src/utils/response'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { HasPermission } from 'src/guards/permission.guard'
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common'

import { RoleService } from './role.service'
import { UpsertRoleBodyDto } from './dto/upsert-role.body.dto'

@Controller('role')
@ApiTags('Role | 角色')
export class RoleController {
  constructor(
    private readonly _roleSrv: RoleService
  ) { }

  @ApiOperation({ summary: '查询管理员角色列表' })
  @ApiSuccessResponse(QueryResDto<Role>)
  @HasPermission([
    PermissionType.ROLE_QUERY,
  ])
  @Post('query')
  public queryRoles(
    @Body() body: QueryDto<Role>,
  ) {
    return getQuery(
      this._roleSrv.repo(),
      body,
    )
  }

  @ApiOperation({
    summary: '创建角色',
  })
  @ApiSuccessResponse(SuccessStringDto)
  @HasPermission(PermissionType.ROLE_CREATE)
  @Post('create')
  public createRole(
    @Body() body: UpsertRoleBodyDto
  ) {
    return this._roleSrv.createRole(body)
  }

  @ApiOperation({
    summary: '更新角色',
  })
  @ApiSuccessResponse(SuccessStringDto)
  @Patch('update/:roleId')
  @HasPermission(PermissionType.ROLE_UPDATE)
  public upsertRole(
    @Body() body: UpsertRoleBodyDto,
    @Param() {roleId}: RoleIdDto
  ) {
    return this._roleSrv.updateRole(body,roleId)
  }

  @ApiOperation({
    summary: '批量删除指定管理员角色',
    description: '删除管理员角色时，如果角色已关联用户，则会删除失败',
  })
  @Delete('delete')
  public async deleteRoles(
    @Body() { ids }: IdsDto
  ) {
    if (ids.length === 1) {
      return await this._roleSrv.deleteRole(ids[0])
        ? 1
        : 0
    }

    let success = 0
    for (const id of ids) {
      try {
        const deleteRes = await this._roleSrv.deleteRole(id)
        deleteRes && success++
      }
      catch (_) { }
    }
    return success
  }

  @ApiOperation({
    summary: '删除指定管理员角色',
    description: '删除管理员角色时，如果角色已关联用户，则会删除失败',
  })
  @Delete('delete/:roleId')
  public deleteRole(
    @Param() { roleId }: RoleIdDto
  ) {
    return this._roleSrv.deleteRole(roleId)
  }
}
