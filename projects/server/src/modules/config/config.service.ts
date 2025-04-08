import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { VersionDto } from 'src/dto/version.dto';
import { Config } from 'src/entities/config';
import { responseError } from 'src/utils/response';
import { Repository } from 'typeorm';
import { ErrorCode, IConfigDto, IUser, PermissionType, SysConfig } from 'types';

@Injectable()
export class SysConfigService {
  /** 应用名称 */
  private static _appName: string
  /** 应用服务网址 */
  private static _appUrl: string

  constructor(
    @InjectRepository(Config)
    private readonly _sysCfgRepo: Repository<Config>,
  ) { }

    /**
   * 判断用户是否具有修改该配置的权限
   */
    public hasPermission(version: SysConfig, user: Partial<IUser>) {
      const permissions = user.role?.permissions.map(v => v.name)
      if (
        ((version === SysConfig.HOME|| version === SysConfig.ABOUT)
          && !permissions.includes(PermissionType.CONFIG_UPSERT_APP))
      )
        responseError(ErrorCode.PERMISSION_DENIED)
    }

  public async getConfig<T extends SysConfig>(param: VersionDto<T>) {
    return (await this._sysCfgRepo.findOne({
      where: { version: param.version },
    }))?.config as IConfigDto[T]
  }

  repo() {
    return this._sysCfgRepo
  }
}
