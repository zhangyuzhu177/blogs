import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { ErrorCode } from 'src/types/enum/error-code.enum';
import { encryptPassword } from 'src/utils/encrypt/encrypt-password';
import { responseError } from 'src/utils/response';
import { parseSqlError } from 'src/utils/response/sql-error/parse-sql-error';
import { mergeDeep } from 'src/utils/validators/mergeDeep';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepo: Repository<User>
  ) { }

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

  public qb(alias = 'u') {
    return this._userRepo.createQueryBuilder(alias)
  }

  public repo() {
    return this._userRepo
  }
}
