import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HasPermission } from 'src/guards/permission.guard';
import { PermissionType } from 'src/types/enum/permission.enum';
import { UpsertRoleBodyDto } from './dto/upsert-role.body.dto';
import { RoleIdDto } from 'src/dto/id/role.dto';
import { parseSqlError } from 'src/utils/response/sql-error/parse-sql-error';
import { ErrorCode } from 'src/types/enum/error-code.enum';
import { responseError } from 'src/utils/response';

@Controller('role')
@ApiTags('Role | 角色')
export class RoleController {
  constructor(
    private readonly _roleSrv: RoleService
  ) { }

  @ApiOperation({ summary: '获取角色列表' })
  @HasPermission([
    PermissionType.ROLE_QUERY,
    PermissionType.ROLE_ASSIGN_QUERY,
  ])
  @Get('list')
  async getRoles() {
    return await this._roleSrv.repo().find({relations:{permissions:true}})
  }

  @ApiOperation({
    summary: '创建/更新角色',
    description: 'id为角色的唯一标识，如果id存在，则会更新角色信息',
  })
  @Post('upsert')
  async upsertRole(@Body() body:UpsertRoleBodyDto) {
    return await this._roleSrv.upsertRole(body)
  }

  @ApiOperation({
    summary: '删除角色',
    description: '删除角色，如果角色下有用户，则不允许删除',
  })
  @Post(':roleId')
  async deleteRole(@Param() param: RoleIdDto) {
    try {
      return await this._roleSrv.deleteRole(param)
    } catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.ROLE_IN_USAGE)
      throw e
    }
  }
}
