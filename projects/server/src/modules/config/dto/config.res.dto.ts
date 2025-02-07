import { ApiProperty } from '@nestjs/swagger'
import { SuccessDto } from 'src/dto'

import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'
import { IConfigDto, SysConfig } from 'types'

export class ConfigResDto extends SuccessDto {
  @ApiProperty({
    description: sharedVariableMarkdown('IConfigDto', 'zjf-types', '配置对象类型定义'),
  })
  data: IConfigDto[SysConfig]
}
