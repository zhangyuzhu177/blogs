import { randomId } from 'utils';
import { Repository } from 'typeorm';
import { Role } from 'src/entities/role';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { responseError } from 'src/utils/response';
import { ALL_PERMISSIONS, DEFAULT_ADMIN_ROLES, ErrorCode } from 'types';

import { UserService } from '../user/user.service';
import { UpsertRoleBodyDto } from './dto/upsert-role.body.dto';
import { PermissionService } from '../permission/permission.service';
import { parseSqlError } from 'src/utils';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly _roleRepo: Repository<Role>,
    private readonly _userSrv: UserService,
    private readonly _permissionSrv:PermissionService
  ) { }

  /** 初始化默认角色 */
  public async initDefaultRoles() {
    // 初始化所有的默认角色
    await this._roleRepo.save(DEFAULT_ADMIN_ROLES)
    // 将所有超级管理员的角色设置为 root
    await this._userSrv.repo().update(
      { sysAdmin: true },
      { roleId: DEFAULT_ADMIN_ROLES[0].id },
    )
  }

  /**
   * 创建角色
   */
  public async createRole(body: UpsertRoleBodyDto) {
    const { permissions } = body

    try {
      const role = await this._roleRepo.save({
        ...body,
        permissions: ALL_PERMISSIONS.filter(v => permissions?.includes(v.name)),
      })
      return role.id
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.DUPLICATE_ENTRY)
        responseError(ErrorCode.ROLE_NAME_IS_EXIST)
      throw e
    }
  }

  /**
   * 编辑角色
   */
  public async updateRole(body: UpsertRoleBodyDto, id: string) {
    const { permissions } = body

    if (DEFAULT_ADMIN_ROLES.some(v => v.id === id))
      responseError(ErrorCode.ROLE_UPDATE_ROOT)
    if (!(await this._roleRepo.existsBy({ id })))
      responseError(ErrorCode.ROLE_NOT_EXISTS)

    try {
      await this._roleRepo.save({
        ...body,
        id,
        permissions: ALL_PERMISSIONS.filter(v => permissions?.includes(v.name)),
      })
      return id
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.DUPLICATE_ENTRY)
        responseError(ErrorCode.ROLE_NAME_IS_EXIST)
      throw e
    }
  }

  /** 删除角色 */
  public async deleteRole(id: string) {
    if (DEFAULT_ADMIN_ROLES.some(r => r.id === id))
      responseError(ErrorCode.ROLE_DELETE_ROOT)
    try {
      const res = await this._roleRepo.delete({id})
      return res.affected
    } catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.ROLE_IN_USAGE)
      throw e
    }
  }

  public repo() {
    return this._roleRepo
  }
}
