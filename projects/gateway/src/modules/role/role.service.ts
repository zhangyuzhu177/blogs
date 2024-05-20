import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { defaultRoles } from 'src/types/enum/role.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly _roleRepo: Repository<Role>,
    private readonly _userSrv: UserService,
  ) { }

  /**
   * 初始化默认角色
   */
  public async initDefaultRoles() {
    // 初始化所有的默认角色
    await this._roleRepo.save(defaultRoles)
    // 将所有超级管理员的角色设置为 root
    await this._userSrv.repo().update(
      { isSysAdmin: true },
      { roleId: defaultRoles[0].id },
    )
  }

  public repo() {
    return this._roleRepo
  }

}
