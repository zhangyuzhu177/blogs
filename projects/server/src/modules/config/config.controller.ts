import { PermissionType } from 'types'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'

import { VersionDto } from 'src/dto/version.dto'
import type { Config } from 'src/entities/config'
import { ApiSuccessResponse } from 'src/utils/response'
import { HasPermission } from 'src/guards/permission.guard'

import { UpsertConfigBodyDto } from './dto/upsert-config.body.dto'
import { ConfigResDto } from './dto/config.res.dto'
import { SysConfigService } from './config.service'

@Controller('config')
@ApiTags('Config | 全局配置')
export class ConfigController {
  constructor(
    private readonly _sysCfgSrv: SysConfigService,
  ) { }

  @ApiOperation({ summary: '获取指定全局配置' })
  @ApiSuccessResponse(ConfigResDto)
  @Get(':version')
  public async getConfig(@Param() param: VersionDto) {
    return await this._sysCfgSrv.getConfig(param)
  }

  @ApiOperation({
    summary: '创建/更新 全局配置',
    description: '配置版本为唯一标识，如果存在，则会更新配置内容',
  })
  @ApiSuccessResponse(ConfigResDto)
  @HasPermission([PermissionType.CONFIG_UPSERT_APP])
  @Post()
  public async upsertConfig(
    @Body() body: UpsertConfigBodyDto,
    @Req() req: FastifyRequest,
  ) {
    const { version, ...config } = body
    this._sysCfgSrv.hasPermission(version, req.raw.user)
    const obj: Config = {
      version,
      config: config[version],
    }

    return (await this._sysCfgSrv.repo().save(obj)).config
  }
}
