import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { SysAdmin } from 'src/config/_sa.config';
import { User } from 'src/entities/user';
import { ErrorCode } from 'src/types/enum/error-code.enum';
import { encryptPassword } from 'src/utils/encrypt/encrypt-password';
import { responseError } from 'src/utils/response';
import { parseSqlError } from 'src/utils/response/sql-error/parse-sql-error';
import { mergeDeep } from 'src/utils/validators/mergeDeep';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, In, Not, Repository } from 'typeorm';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly _userRepo: Repository<User>,
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
      isSysAdmin: true,
      account: Not(In(superAdminList.map(sa => sa.account))),
    })

    // 添加新的超级管理员
    for (const sa of superAdminList) {
      try {
        await this._userRepo.save({
          account: sa.account,
          password: await encryptPassword(sa.password),
          isSysAdmin: true,
        })
      }
      catch (e) {
        await this._userRepo.update(
          { account: sa.account },
          {
            password: await encryptPassword(sa.password),
            isSysAdmin: true,
          },
        )
      }
    }
  }

  /** 创建用户 */
  public async createUser(user: Partial<User>) {
    const qr = this._userRepo.manager.connection.createQueryRunner()
    await qr.connect()
    await qr.startTransaction()
    try {
      const newUser = await qr.manager.save(
        this._userRepo.create({
          ...user,
          password:user.password? await encryptPassword(user.password):null
        })
      )
      await qr.commitTransaction()
      return newUser
    } catch (error) {
      await qr.rollbackTransaction()
      const err = parseSqlError(error)
      if (err === SqlError.DUPLICATE_ENTRY) {
        const value = error.message.match(/Duplicate entry\s+'(.*?)'/)?.[1]
        if (value === user.account)
          responseError(ErrorCode.USER_ACCOUNT_REGISTERED)
        else if (value === user.email)
          responseError(ErrorCode.USER_EMAIL_REGISTERED)
        else if (value === user.phone)
          responseError(ErrorCode.USER_PHONE_NUMBER_REGISTERED)
      }
      throw error
    }
  }

  /**获取当前登录用户的信息 */
  public async findById(id: string, options?: FindManyOptions<User>) {
    const defaultOptions: FindOneOptions<User> = {}
    const requiredOptions: FindOneOptions<User> = {
      where: { id },
    }
    return this._userRepo.findOne(
      mergeDeep(defaultOptions, options, requiredOptions),
    )
  }

  /**
 * 更新某个用户的密码
 * @param where
 * @param newPassword
 * @returns
 */
  public async updateUserPassword(
    where: FindOptionsWhere<User>,
    newPassword: string,
  ) {
    const users = await this._userRepo.find({ where })
    let success = 0
    for (const user of users) {
      try {
        const updateRes = await this._userRepo.update(
          { id: user.id },
          { password: await encryptPassword(newPassword) },
        )
        success += updateRes.affected
      }
      catch (error) {}
    }
    return success
  }

  public qb(alias = 'u') {
    return this._userRepo.createQueryBuilder(alias)
  }

  public repo() {
    return this._userRepo
  }
}
