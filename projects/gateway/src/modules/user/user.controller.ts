import { Body, Controller, Delete, Get, Param, Patch, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HasPermission } from 'src/guards/permission.guard';
import { PermissionType } from 'src/types/enum/permission.enum';
import { IsLogin } from 'src/guards/login.guard';
import { ApiSuccessResponse, responseError } from 'src/utils/response';
import { UserProfileResponseDto } from './dto/user.res.dto';
import { GetProfileOwnQueryDto } from './dto/get-profile-own.query.dto';
import { User } from 'src/entities/user';
import { objectOmit } from '@catsjuice/utils';
import { parseSqlError } from 'src/utils/response/sql-error/parse-sql-error';
import { responseParamsError } from 'src/utils/response/validate-exception-factory';
import { CodeAction } from 'src/types/enum/code-action.enum';
import { EmailCodeVerify } from 'src/guards/email-code-verify.guard';
import { ErrorCode } from 'src/types/enum/error-code.enum';
import { UniversalOperationResDto } from 'src/dto/universal-operation.dto';
import { UpdatePasswordByEmailCodeBodyDto } from './dto/update-pswd-by-email-code.body.dto';
import { UpdateUserRoleParamDto } from './dto/role/update-user-role.param.dto';
import { ConfigService } from '@nestjs/config';
import { In } from 'typeorm';
import { UserIdDto } from 'src/dto/id/user.dto';
import { encryptPassword } from 'src/utils/encrypt/encrypt-password';
import { UpdateUserBodyDto } from './dto/update-user.body.dto';

@Controller('user')
@ApiTags('User | 用户')
export class UserController {
  constructor(
    private readonly _userSrv: UserService,
    private readonly _cfgSrv: ConfigService,
  ) { }

  @ApiOperation({ summary: '获取用户列表' })
  @HasPermission([
    PermissionType.USER_QUERY,
    PermissionType.ROLE_ASSIGN_QUERY,
  ])
  @Get('list')
  public async getUserList() {
    return await this._userSrv.repo().find()
  }

  @ApiOperation({ summary: '获取当前登录的用户' })
  @ApiSuccessResponse(UserProfileResponseDto)
  @IsLogin()
  @Get('profile/own')
  public async getOwnProfile(
    @Query() query: GetProfileOwnQueryDto,
    @Req() req:FastifyRequest
  ) {
    const omitFields: Array<keyof User> = ['isDeleted', 'isSysAdmin']
    const relation = query.relation as any
    if (!relation) {
      const user = objectOmit((req.raw?.user || {}) as User, omitFields)
      return {
        ...user,
        password: !!req.raw?.user.password,
      }
    }
    try {
      const user = await this._userSrv.findById(req.raw?.user?.id, { relations: relation })
      return {
        ...objectOmit(user, omitFields),
        password: !!req.raw?.user.password,
      }
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.ENTITY_PROPERTY_NOT_FOUND) {
        responseParamsError([{
          property: 'relation',
          constraints: { relation: '关联信息有误' },
        }])
      }
      throw e
    }
  }

  @ApiOperation({ summary: '通过邮箱验证码修改密码（不需要登录）' })
  @ApiSuccessResponse(UniversalOperationResDto)
  @EmailCodeVerify(CodeAction.CHANGE_PASSWORD)
  @Patch('own/password/email')
  public async updateOwnPasswordByEmailCode(@Body() body: UpdatePasswordByEmailCodeBodyDto) {
    const { email, password } = body
    const user = await this._userSrv.repo().findOne({ where: { email } })
    if (!user)
      responseError(ErrorCode.USER_EMAIL_NOT_REGISTERED)
    return (await this._userSrv.updateUserPassword({ id: user.id }, password)) > 0
  }

  @ApiOperation({ summary: '更新指定用户的角色' })
  @HasPermission(PermissionType.USER_UPDATE_ROLE)
  @Patch(':userId/role/:roleId')
  public async updateUserRole(@Param() param: UpdateUserRoleParamDto) {
    const { userId } = param
    const roleId = param.roleId || null
    // const { list } = await this._cfgSrv.get<{ list: SysAdmin[] }>('sa')
    const user = await this._userSrv.repo().findOne({ where: { id: userId } })
    if (!user.account)
      responseError(ErrorCode.USER_NOT_FOUND)
    // if (list.some(v => v.account === user.account))
    //   responseError(ErrorCode.ROLE_UPDATE_ROOT)

    try {
      const res = await this._userSrv.repo().update({ id: userId }, { roleId })
      return res.affected
    }
    catch (e) {
      if (e.message.match(/FOREIGN KEY/)) {
        responseParamsError([{
          property: 'roleId',
          constraints: {
            roleName: '角色名不存在',
          },
        }])
      }
    }
  }

  @ApiOperation({ summary: '修改指定用户的信息' })
  @HasPermission(PermissionType.USER_UPDATE)
  @Patch(':userId')
  public async updateUser(
    @Param() param: UserIdDto,
    @Body() body: UpdateUserBodyDto,
  ) {
    const {
      email,
      phone = null,
      password,
      isDeleted,
      sendEmail,
    } = body
    const { userId } = param

    const user = await this._userSrv.repo().findOne({ where: { id: userId } })
    if (!user)
      responseError(ErrorCode.USER_NOT_FOUND)
    try {
      await this._userSrv.repo().update(
        { id: userId },
        {
          email,
          phone,
          password: password ? await encryptPassword(password) : undefined,
          isDeleted,
        },
      )
    }
    catch (err) {
      const error = parseSqlError(err)
      if (error === SqlError.DUPLICATE_ENTRY) {
        const value = err.message.match(/Duplicate entry\s+'(.*?)'/)?.[1]
        if (value === email)
          responseError(ErrorCode.USER_EMAIL_REGISTERED)
        else if (value === phone)
          responseError(ErrorCode.USER_PHONE_NUMBER_REGISTERED)
      }
      throw err
    }
    // if (sendEmail) {
    //   const arr: string[][] = []
    //   if (user.email !== email)
    //     arr.push(['邮箱', email])
    //   if (user.phone !== phone)
    //     arr.push(['手机号', phone])
    //   if (password)
    //     arr.push(['密码', password])
    //   if (user.isDeleted !== isDeleted)
    //     arr.push(['账号状态', isDeleted ? '禁用' : '启用'])

    //   if (arr.length) {
    //     setTimeout(async () => {
    //       const newUser = await this._userSrv.repo().findOne({ where: { id: userId } })
    //       this._notifySrv.notifyUserUpdate(newUser, arr)
    //     })
    //   }
    // }
    return true
  }

  @ApiOperation({ summary: '批量停用用户' })
  @HasPermission(PermissionType.USER_DELETE)
  @Delete()
  public async deleteUser(@Body() body: UserIdDto['userId'][]) {
    const updateRes = await this._userSrv.qb()
      .update({ isDeleted: true })
      .where({ id: In(body) })
      .execute()
    return updateRes.affected
  }

  @ApiOperation({ summary: '批量恢复用户' })
  @HasPermission(PermissionType.USER_RECOVER)
  @Patch()
  public async recoverUser(@Body() body: UserIdDto['userId'][]) {
    const updateRes = await this._userSrv.qb()
      .update({ isDeleted: false })
      .where({ id: In(body) })
      .execute()
    return updateRes.affected
  }
}
