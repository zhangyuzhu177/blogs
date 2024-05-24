import { ApiProperty } from '@nestjs/swagger'
import { SuccessDto } from './success.dto'

export class UniversalOperationResDto extends SuccessDto {
  @ApiProperty({
    description: '通用的操作类结果，返回数据为 `true` 或 非 `0` 数字代表操作成功（这一类响应通常不需要类型定义，直接判断返回值是否为真即可，操作失败时请求会报错）',
    example: true,
  })
  data: boolean | number
}
