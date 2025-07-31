import { decorate } from 'ts-mixer'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FilePathDto {
  @decorate(ApiProperty({
    description: '上传的文件完整路径（需要带上文件名、后缀）',
    example: 'path',
    type: () => 'string',
  }))
  @decorate(IsString())
  path: string
}
