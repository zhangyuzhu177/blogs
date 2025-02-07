import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { UpsertRoleBodyDto } from './dto/upsert-role.body.dto';
import { responseError } from 'src/utils/response';
import { PermissionService } from '../permission/permission.service';
import { RoleIdDto } from 'src/dto/id/role.dto';
import { DEFAULT_ADMIN_ROLES, ErrorCode } from 'types';
import { randomId } from 'utils';

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

  /** 创建/更新角色 */
  public async upsertRole(role: UpsertRoleBodyDto) {
    // 检测角色名是否重复
    if (!role.id && await this._roleRepo.findOne({ where: { name: role.name } }))
      responseError(ErrorCode.ROLE_NAME_IS_EXIST)

    // 检测是否更新root角色
    if (role.id && DEFAULT_ADMIN_ROLES.some(r => r.id === role.id))
      responseError(ErrorCode.ROLE_UPDATE_ROOT)

    const permission = await this._permissionSrv.repo().find()
    const saveInfo = {
      ...role,
      id: role.id || randomId(),
      permissions:permission.filter(p=>role.permissions.includes(p.name))
    }

    await this._roleRepo.save(saveInfo)

    return saveInfo
  }

  /** 删除角色 */
  public async deleteRole(param: RoleIdDto) {
    if (DEFAULT_ADMIN_ROLES.some(r => r.id === param.roleId))
      responseError(ErrorCode.ROLE_DELETE_ROOT)

    const res = await this._roleRepo.delete({id:param.roleId})
    return res.affected
  }

  public repo() {
    return this._roleRepo
  }
}
