import { ApiProperty } from '@nestjs/swagger'
import { IArticle, ID_EXAMPLE } from 'types'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { BaseTimeStamp } from './_timestamp'
import { ArticleType } from './article-type'

@Entity()
export class Article extends BaseTimeStamp implements IArticle {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '文章唯一标识',
    example: ID_EXAMPLE,
  })
  id: string

  @ApiProperty({
    description: '文章标题',
  })
  @Column()
  name: string

  @ApiProperty({
    description: '所属的文章分类 Id',
  })
  @Column()
  articleTypeId: string

  @ApiProperty({
    description: '文章标签',
  })
  @Column({
    type: 'simple-array',
  })
  tags: string[]

  @ApiProperty({
    description: '文章内容',
  })
  @Column('longtext')
  content: string

  @ApiProperty({
    description: '文章封面',
  })
  @Column()
  cover: string

  @ApiProperty({
    description: '访问量',
  })
  @Column({
    default: 0,
  })
  pageView?: number

  @ApiProperty({
    description: '文章状态',
  })
  @Column()
  status: boolean

  @ApiProperty({
    description: '文章分类',
  })
  @ManyToOne(
    () => ArticleType,
    articleType => articleType.articles,
  )
  @JoinColumn()
  articleType: ArticleType
}
