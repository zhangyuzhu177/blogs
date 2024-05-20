import { ApiProperty } from '@nestjs/swagger'
import { IConfigDto } from 'src/types/dto/config.interface'
import { SuccessDto } from 'src/types/dto/success.dto'
import { SysConfig } from 'src/types/enum/config.enum'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'

export class ConfigResDto extends SuccessDto {
  @ApiProperty({
    description: sharedVariableMarkdown('IConfigDto', 'zjf-types', '配置对象类型定义'),
  })
  data: IConfigDto[SysConfig]
}
