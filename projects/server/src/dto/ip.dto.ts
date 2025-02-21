import { decorate } from 'ts-mixer'
import { IsValidIp } from 'src/decorators'
import { ApiProperty } from '@nestjs/swagger'
import { GenerateParamsDecorator } from 'src/utils'
import type { IIpDto, IIpOptionalDto } from 'types'

export function IpDecorator(optional = false, description = 'ip 地址') {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description,
        type: String,
        example: '127.0.0.1',
      }),
      IsValidIp(),
    ],
    optional,
  )
}

export class IpDto implements IIpDto {
  @decorate(IpDecorator())
  ip: string
}

export class IpOptionalDto implements IIpOptionalDto {
  @decorate(IpDecorator(true))
  ip?: IpDto['ip']
}
