import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { defaultRoles } from 'src/types/enum/role.enum';
import { UpsertRoleBodyDto } from './dto/upsert-role.body.dto';
import { responseError } from 'src/utils/response';
import { ErrorCode } from 'src/types/enum/error-code.enum';
import { PermissionService } from '../permission/permission.service';
import { RoleIdDto } from 'src/dto/id/role.dto';

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
    await this._roleRepo.save(defaultRoles)
    // 将所有超级管理员的角色设置为 root
    await this._userSrv.repo().update(
      { isSysAdmin: true },
      { roleId: defaultRoles[0].id },
    )
  }

  /** 创建/更新角色 */
  public async upsertRole(role: UpsertRoleBodyDto) {
    // 检测角色名是否重复
    if (!role.id && await this._roleRepo.findOne({ where: { name: role.name } }))
      responseError(ErrorCode.ROLE_NAME_IS_EXIST)

    // 检测是否更新root角色
    if (role.id && defaultRoles.some(r => r.id === role.id))
      responseError(ErrorCode.ROLE_UPDATE_ROOT)

    const permission = await this._permissionSrv.repo().find()
    const saveInfo: Role = {
      ...role,
      id: role.id,
      permissions:permission.filter(p=>role.permissions.includes(p.name))
    }

    await this._roleRepo.save(saveInfo)

    return saveInfo
  }

  /** 删除角色 */
  public async deleteRole(param: RoleIdDto) {
    if (defaultRoles.some(r => r.id === param.roleId))
      responseError(ErrorCode.ROLE_DELETE_ROOT)

    const res = await this._roleRepo.delete({id:param.roleId})
    return res.affected
  }

  public repo() {
    return this._roleRepo
  }
}
