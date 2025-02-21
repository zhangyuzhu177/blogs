import { CodeAction, ErrorCode } from 'types'
import { In, Not, Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, OnModuleInit } from '@nestjs/common'

import { User } from 'src/entities/user'
import { encryptPassword } from 'src/utils'
import { SysAdmin } from 'src/config/_sa.config'
import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import { responseError, responseParamsError } from 'src/utils/response'

import { CodeService } from '../code/code.service'
import { ChangeStatusBodyDto } from 'src/dto/common'
import { AssignRoleBodyDto } from './dto/assign-role.body'
import { UpdateUserBodyDto } from './dto/update-user.body.dto'
import { CreateUserBodyDto } from './dto/create-user.body.dto'
import { UpdatePasswordByEmailCodeBodyDto } from './dto/update-pswd-by-email-code.body.dto'

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly _userRepo: Repository<User>,

    private readonly _codeSrv: CodeService,
    private readonly _cfgSrv: ConfigService,
  ) { }

  onModuleInit() {
    this.initSysAdmin()
  }

  /**
   * 初始化系统管理员
   */
  public async initSysAdmin() {
    const superAdminList = this._cfgSrv.get<SysAdmin[]>('sa.list')
    // 删除无效的超级管理员
    await this._userRepo.delete({
      sysAdmin: true,
      account: Not(In(superAdminList.map(sa => sa.account))),
    })

    // 添加新的超级管理员
    for (const { account, password } of superAdminList) {
      try {
        await this._userRepo.save({
          account,
          email:'',
          password: await encryptPassword(password),
          sysAdmin: true,
          status: true,
        })
      }
      catch (e) {
        await this._userRepo.update(
          { account },
          {
            password: await encryptPassword(password),
            sysAdmin: true,
          },
        )
      }
    }
  }

  /**
   * 创建用户
   */
  public async createUser(body: CreateUserBodyDto) {
    const {
      account, phone, email, password
    } = body

    try {
      const insertRes = await this._userRepo.insert(
        this._userRepo.create({
          ...body,
          password: await encryptPassword(password),
        }),
      )
      return insertRes.identifiers[0].id
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.DUPLICATE_ENTRY) {
        const value = e.message.match(/Duplicate entry\s+'(.*?)'/)?.[1]
        if (value === account)
          responseError(ErrorCode.USER_ACCOUNT_REGISTERED)
        else if (value === phone)
          responseError(ErrorCode.USER_PHONE_NUMBER_REGISTERED)
        else if (value === email)
          responseError(ErrorCode.USER_EMAIL_REGISTERED)
      }
      throw e
    }
  }

  /**
   * 更新指定用户
   */
  public async updateUser(id:string,body:UpdateUserBodyDto) {
    const {
      email,
      phone = null,
      password,
    } = body

    try {
      const updateRes = await this._userRepo.update(
        { id },
        {
          ...body,
          password: password ? await encryptPassword(password) : undefined,
        },
      )
      if (!updateRes.affected)
        responseError(ErrorCode.USER_NOT_FOUND)

      return id
    } catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.DUPLICATE_ENTRY) {
        const value = e.message.match(/Duplicate entry\s+'(.*?)'/)?.[1]
        if (value === email)
          responseError(ErrorCode.USER_EMAIL_REGISTERED)
        else if (value === phone)
          responseError(ErrorCode.USER_PHONE_NUMBER_REGISTERED)
      }
      throw e
    }
  }

  /**
   * 获取当前登录用户的信息
   */
  public async getOwnProfile(id: string, relations?: any) {
    try {
      return await this._userRepo.findOne({
        where: { id },
        relations,
      })
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.ENTITY_PROPERTY_NOT_FOUND) {
        responseParamsError([{
          property: 'relation',
          constraints: {
            relation: '关联信息有误',
          },
        }])
      }
      throw e
    }
  }

  /**
   * 通过 邮箱 + 验证码 修改个人用户密码
   */
  public async changeOwnPasswordByCode(body: UpdatePasswordByEmailCodeBodyDto) {
    const { email, bizId, code, password } = body
    // 校验个人用户及密码
    const user = await this._userRepo.findOneBy({ email })
    if (!user)
      responseError(ErrorCode.USER_EMAIL_NOT_REGISTERED)

    // 校验验证码
    await this._codeSrv.verifyCode(
      bizId,
      [email, CodeAction.CHANGE_PASSWORD, code]
    )

    const updateRes = await this._userRepo.update(
      { id: user.id },
      { password: await encryptPassword(password) },
    )

    return updateRes.affected > 0
  }

  /**
   * 批量修改用户状态
   */
  public async changeUserStatus(body: ChangeStatusBodyDto) {
    const { ids, status } = body

    if (
      ids.length === 1
      && !(await this._userRepo.existsBy({ id: ids[0] }))
    )
      responseError(ErrorCode.USER_NOT_FOUND)

    const updateRes = await this._userRepo.update(
      { id: In(ids) },
      { status },
    )
    return updateRes.affected
  }

  /**
   * 批量分配管理员角色
   */
  public async assignRole(body:AssignRoleBodyDto) {
    const { ids, roleId } = body
    if (ids.length === 1) {
      const user = await this._userRepo.findOneBy({ id: ids[0] })
      if (!user)
        responseError(ErrorCode.USER_NOT_FOUND)
      if (user.sysAdmin)
        responseError(ErrorCode.USER_UPDATE_DISABLE)
    }
    try {
      const updateRes = await this._userRepo.update(
        {
          id: In(ids),
          sysAdmin: false,
        },
        { roleId: roleId || null },
      )

      return updateRes.affected
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.ROLE_NOT_EXISTS)
      throw e
    }
  }

  public qb(alias = 'u') {
    return this._userRepo.createQueryBuilder(alias)
  }

  public repo() {
    return this._userRepo
  }
}
