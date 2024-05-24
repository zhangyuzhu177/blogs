import { ApiProperty } from '@nestjs/swagger'
import { IBasicResponse } from './basic.interface'


export class SuccessDto<T = any> implements IBasicResponse<T> {
  @ApiProperty({
    description: '状态码，成功时始终为 0',
    example: 0,
    type: 'number',
  })
  status: number

  @ApiProperty({
    description: '请求成功的说明',
    example: '请求成功',
    type: 'string',
  })
  message: string

  @ApiProperty({
    description: '请求返回的数据',
    example: 'See \'Schema\' tab',
  })
  data: T
}

export class SuccessStringDto extends SuccessDto<string> implements IBasicResponse<string> {
  @ApiProperty({
    description: '纯文本信息',
    example: '纯文本信息',
  })
  data: string
}
