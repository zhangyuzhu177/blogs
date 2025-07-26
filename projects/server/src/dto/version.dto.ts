import { decorate } from 'ts-mixer'
import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { objectEntries } from '@catsjuice/utils'
import { SysConfig, sysConfigDescriptions } from 'types'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'

import type { IVersionDto } from 'types'

export class VersionDto<T = SysConfig> implements IVersionDto<T> {
  @decorate(ApiProperty({
    description: `配置版本
    \n${objectEntries(sysConfigDescriptions).map(([key, value]) => `- \`${key}\`: ${value}`).join('\n')}
    ${sharedVariableMarkdown('SysConfig', 'types', 'version枚举值')}`,
    enum: SysConfig,
    example: SysConfig.HOME,
  }))
  @decorate(IsEnum(SysConfig, { message: 'version必须是 SysConfig 枚举值' }))
  version: T
}
