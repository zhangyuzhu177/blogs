import type { IGalleryType } from 'types'
import { ID_EXAMPLE } from 'types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Gallery } from './gallery'
import { BaseTimeStamp } from './_timestamp'

@Entity()
export class GalleryType extends BaseTimeStamp implements IGalleryType {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '图库分类唯一标识',
    example: ID_EXAMPLE,
  })
  id: string

  @ApiProperty({
    description: '图库分类名称',
  })
  @Column({
    unique: true,
  })
  name: string

  @ApiPropertyOptional({
    description: '描述',
  })
  @Column({
    nullable: true,
  })
  desc?: string

  @ApiPropertyOptional({
    description: '排序',
  })
  @Column({
    default: 1,
  })
  order?: number

  @OneToMany(() => Gallery, gallery => gallery.galleryType)
  galleries: Gallery[]
}
