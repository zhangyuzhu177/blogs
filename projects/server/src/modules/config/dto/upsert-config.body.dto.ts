import { ApiPropertyOptional } from '@nestjs/swagger'
import type { IConfigDto, IUpsertConfigBodyDto, SysConfig } from 'types'

import { VersionDto } from 'src/dto/version.dto'

export class UpsertConfigBodyDto
  extends VersionDto
  implements IUpsertConfigBodyDto {
  @ApiPropertyOptional({
    description: '页面配置',
    example: {
      title: '',
      label: '',
      url: '',
    },
  })
  home?: IConfigDto[SysConfig.HOME]

  @ApiPropertyOptional({
    description: '关于页配置',
    example: {
      avatar: '',
      name: '',
      job: '',
      location: '',
      skills: [],
      desc: '',
      email: '',
      github: '',
    },
  })
  about?: IConfigDto[SysConfig.ABOUT]
}
