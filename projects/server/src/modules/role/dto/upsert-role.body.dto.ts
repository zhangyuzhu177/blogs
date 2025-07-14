import { PermissionType } from 'types'
import { Type } from 'class-transformer'
import type { IUpsertRoleBodyDto } from 'types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator'

export class UpsertRoleBodyDto implements IUpsertRoleBodyDto {
  @ApiPropertyOptional({ description: '角色的唯一标识' })
  @IsString()
  @IsOptional()
  id?: string

  @ApiProperty({ description: '角色名称', example: '测试角色' })
  @IsString({ message: '角色名称必须是字符串' })
  name: string

  @ApiPropertyOptional({ description: '角色描述', example: '测试角色的描述信息' })
  @IsString({ message: '角色描述必须是字符串' })
  @IsOptional()
  description?: string

  @ApiPropertyOptional({
    description: '权限列表',
    example: [PermissionType.USER_CREATE],
  })
  @IsArray()
  @IsEnum(
    PermissionType,
    {
      each: true,
      message: 'permissions 中的每个值必须是 PermissionType 枚举值',
    },
  )
  @Type(() => String)
  @IsOptional()
  permissions?: PermissionType[]
}
