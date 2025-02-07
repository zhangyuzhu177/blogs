import { ApiProperty } from '@nestjs/swagger'
import type { IBasicResponse } from 'types'

export class SuccessDto<T = any> implements IBasicResponse<T> {
  @ApiProperty({
    description: '状态码，当不为 0 时，表示请求出错',
    example: 0,
    type: 'number',
  })
  status: number

  @ApiProperty({
    description: '"请求成功" 或 请求失败时的错误信息',
    example: '请求成功',
    type: 'string',
  })
  message: string

  @ApiProperty({
    description: '详细数据',
    example: 'See \'Schema\' tab',
  })
  data: T
}

export class SuccessStringDto extends SuccessDto<string> implements IBasicResponse<string> {
  @ApiProperty({
    description: '文本信息',
    example: 'string',
  })
  data: string
}

export class SuccessBooleanDto extends SuccessDto<boolean> implements IBasicResponse<boolean> {
  @ApiProperty({
    description: '布尔信息',
    example: true,
  })
  data: boolean
}

export class SuccessNumberDto extends SuccessDto<number> implements IBasicResponse<number> {
  @ApiProperty({
    description: '数字信息',
    example: 0,
  })
  data: number
}
