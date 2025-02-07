import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm'
import { Role } from './role'
import { IPermission, PermissionType } from 'types'


@Entity()
export class Permission implements IPermission {
  @ApiProperty({ description: '权限名称，作为权限的唯一标识' })
  @PrimaryColumn()
  name: PermissionType

  @ApiProperty({ description: '权限的描述信息' })
  @Column()
  description?: string

  @ManyToMany(
    () => Role,
    role => role.permissions,
    { onDelete: 'CASCADE' },
  )
  roles?: Role[]
}
