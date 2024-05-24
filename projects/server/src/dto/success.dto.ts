import { ApiProperty } from '@nestjs/swagger'
import { IBasicResponse } from 'src/types/http/basic.interface'

export class SuccessDto<T = any> implements IBasicResponse<T> {
  @ApiProperty({
    description: '状态码，当不为 0 时，表示请求出错',
    example: 0,
    type: 'number',
  })
  status: number

  @ApiProperty({
    description: '请求错误时的错误信息',
    example: 'success',
    type: 'string',
  })
  message?: string

  @ApiProperty({
    description: '请求返回的数据',
    example: '参见 \'Schema\' 选项卡',
  })
  data: T
}
