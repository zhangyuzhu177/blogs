import type { IRole } from 'types'
import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Permission } from './permission'
import { User } from './user'
import { BaseTimeStamp } from './_timestamp'

@Entity()
export class Role extends BaseTimeStamp implements IRole {
  @ApiProperty({ description: '管理角色的唯一标识' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '角色名称' })
  @Column({ unique: true })
  name: string

  @ApiProperty({ description: '角色的描述信息' })
  @Column({ nullable: true })
  desc?: string

  @ManyToMany(
    () => Permission,
    permission => permission.roles,
    { onDelete: 'CASCADE' },
  )
  @JoinTable()
  permissions?: Permission[]

  @OneToMany(() => User, user => user.role)
  users?: User[]
}
