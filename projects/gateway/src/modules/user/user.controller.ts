import { Controller, Get, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation } from '@nestjs/swagger';
import { HasPermission } from 'src/guards/permission.guard';
import { PermissionType } from 'src/types/enum/permission.enum';
import { IsLogin } from 'src/guards/login.guard';
import { ApiSuccessResponse } from 'src/utils/response';
import { UserProfileResponseDto } from './dto/user.res.dto';
import { GetProfileOwnQueryDto } from './dto/get-profile-own.query.dto';
import { User } from 'src/entities/user';
import { objectOmit } from '@catsjuice/utils';
import { parseSqlError } from 'src/utils/response/sql-error/parse-sql-error';
import { responseParamsError } from 'src/utils/response/validate-exception-factory';

@Controller('user')
export class UserController {
  constructor(
    private readonly _userSrv: UserService
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
}
