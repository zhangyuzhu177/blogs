import type { IGallery } from 'types'
import { ID_EXAMPLE } from 'types'
import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Likes } from './likes'
import { BaseTimeStamp } from './_timestamp'
import { GalleryType } from './gallery-type'

@Entity()
export class Gallery extends BaseTimeStamp implements IGallery {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '图库唯一标识',
    example: ID_EXAMPLE,
  })
  id: string

  @ApiProperty({
    description: '图库名称',
  })
  @Column()
  name: string

  @ApiProperty({
    description: '图库图片',
  })
  @Column({
    type: 'text',
    transformer: {
      to: (value: string[]) => JSON.stringify(value), // 存入数据库时转换
      from: (value: string) => JSON.parse(value), // 读取时转换
    },
  })
  picture: string[]

  @ApiProperty({
    description: '图库状态',
  })
  @Column()
  status: boolean

  @ApiProperty({
    description: '图库描述',
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  desc?: string

  @ApiProperty({
    description: '访问量',
  })
  @Column({
    default: 0,
  })
  pageView?: number

  @ApiProperty({
    description: '所属的图库分类 Id',
  })
  @Column()
  galleryTypeId: string

  @ApiProperty({
    description: '图库分类',
  })
  @ManyToOne(() => GalleryType, galleryType => galleryType.galleries)
  @JoinColumn()
  galleryType: GalleryType

  // 虚拟关联 (非外键)
  @ApiProperty({
    description: '点赞列表',
  })
  @OneToMany(() => Likes, likes => likes.contentId)
  likes?: Likes[]
}
