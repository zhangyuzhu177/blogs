import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import type { IUser } from 'types'
import { ID_EXAMPLE } from 'types'
import { EMAIL_MAX_LENGTH } from 'utils'
import { Role } from './role'
import { Login } from './login'
import { BaseTimeStamp } from './_timestamp'

@Entity()
export class User extends BaseTimeStamp implements IUser {
  @ApiProperty({
    description: '用户唯一标识',
    example: ID_EXAMPLE,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({
    description: '账号',
    uniqueItems: true,
  })
  @Column({ unique: true })
  account: string

  @ApiProperty({ description: '密码' })
  @Column({ select: false })
  password: string

  @ApiPropertyOptional({
    description: '邮箱',
    example: '1580006194@qq.com',
  })
  @Column({
    unique: true,
    length: EMAIL_MAX_LENGTH,
  })
  email: string

  @ApiPropertyOptional({
    description: '手机号码',
    example: '18888888888',
  })
  @Column({
    nullable: true,
    unique: true,
  })
  phone?: string

  @Column({ default: false })
  status: boolean

  @Column({
    select: false,
    default: false,
  })
  sysAdmin: boolean

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn()
  role?: Role

  @Column({ nullable: true })
  roleId?: Role['id']

  @OneToMany(
    () => Login,
    login => login.user,
    { cascade: true },
  )
  logins?: Login[]
}
