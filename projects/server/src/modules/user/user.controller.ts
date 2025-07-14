import { PermissionType } from 'types'
import { Throttle } from '@nestjs/throttler'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common'

import { getQuery } from 'src/utils'
import type { User } from 'src/entities/user'
import { UserIdDto } from 'src/dto/id/user.dto'
import { IsLogin } from 'src/guards/login.guard'
import { ChangeStatusBodyDto } from 'src/dto/common'
import { ApiSuccessResponse } from 'src/utils/response'
import { HasPermission } from 'src/guards/permission.guard'
import {
  QueryDto,
  QueryResDto,
  RelationRawDto,
  SuccessBooleanDto,
  SuccessNumberDto,
  SuccessStringDto,
} from 'src/dto'

import { UserService } from './user.service'
import { AssignRoleBodyDto } from './dto/assign-role.body'
import { UpdateUserBodyDto } from './dto/update-user.body.dto'
import { CreateUserBodyDto } from './dto/create-user.body.dto'
import { UpdatePasswordByEmailCodeBodyDto } from './dto/update-pswd-by-email-code.body.dto'

@Controller('user')
@ApiTags('User | 用户')
export class UserController {
  constructor(
    private readonly _userSrv: UserService,
  ) { }

  @ApiOperation({ summary: '创建用户' })
  @ApiSuccessResponse(SuccessStringDto)
  @Throttle(10000, 60)
  @HasPermission(PermissionType.USER_CREATE)
  @Post('create')
  public createUser(
    @Body() body: CreateUserBodyDto,
  ) {
    return this._userSrv.createUser(body)
  }

  @ApiOperation({
    summary: '查询个人用户列表',
  })
  @ApiSuccessResponse(QueryResDto<User>)
  @HasPermission([
    PermissionType.USER_QUERY,
  ])
  @Post('query')
  public queryUserList(
    @Body() body: QueryDto<User>,
  ) {
    return getQuery(
      this._userSrv.repo(),
      body,
    )
  }

  @ApiOperation({ summary: '获取当前登录的用户' })
  @IsLogin()
  @Get('own')
  public getOwnProfile(
    @Query() { relation }: RelationRawDto,
    @Req() req: FastifyRequest,
  ) {
    const { id } = req.raw.user
    return this._userSrv.getOwnProfile(id, relation)
  }

  @ApiOperation({ summary: '通过 邮箱 + 验证码 修改密码（不需要登录）' })
  @ApiSuccessResponse(SuccessBooleanDto)
  @Patch('own/password/email')
  public changePasswordByEmailCode(
    @Body() body: UpdatePasswordByEmailCodeBodyDto,
  ) {
    return this._userSrv.changeOwnPasswordByCode(body)
  }

  @ApiOperation({
    summary: '修改指定用户的信息',
  })
  @ApiSuccessResponse(SuccessStringDto)
  @HasPermission(PermissionType.USER_UPDATE)
  @Patch('update/:userId')
  public updateUser(
    @Param() { userId }: UserIdDto,
    @Body() body: UpdateUserBodyDto,
  ) {
    return this._userSrv.updateUser(userId, body)
  }

  @ApiOperation({
    summary: '批量修改用户状态',
  })
  @ApiSuccessResponse(SuccessNumberDto)
  @HasPermission(PermissionType.USER_CHANGE_STATUS)
  @Post('status')
  public changeUserStatus(
    @Body() body: ChangeStatusBodyDto,
  ) {
    return this._userSrv.changeUserStatus(body)
  }

  @ApiOperation({
    summary: '批量分配管理员角色',
  })
  @ApiSuccessResponse(SuccessNumberDto)
  @HasPermission(PermissionType.USER_UPDATE_ROLE)
  @Patch('assign')
  public updateUserRole(
    @Body() body: AssignRoleBodyDto,
  ) {
    return this._userSrv.assignRole(body)
  }
}
