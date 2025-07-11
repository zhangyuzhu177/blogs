import { ApiProperty } from '@nestjs/swagger'
import type { IArticle } from 'types'
import { ArticleTheme, ID_EXAMPLE } from 'types'
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseTimeStamp } from './_timestamp'
import { ArticleType } from './article-type'
import { ArticleTag } from './article-tag'
import { Likes } from './likes'

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
    description: '文章内容',
  })
  @Column({
    type: 'mediumtext',
  })
  content: string

  @ApiProperty({
    description: '文章封面',
  })
  @Column({
    nullable: true,
  })
  cover?: string

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
    description: '文章主题',
  })
  @Column({
    type: 'enum',
    enum: ArticleTheme,
    default: ArticleTheme.DEFAULT,
  })
  theme?: ArticleTheme

  @ApiProperty({
    description: '文章分类',
  })
  @ManyToOne(
    () => ArticleType,
    articleType => articleType.articles,
  )
  @JoinColumn()
  articleType: ArticleType

  @ApiProperty({
    description: '文章标签',
  })
  @ManyToMany(
    () => ArticleTag,
    articleTag => articleTag.articles,
  )
  @JoinTable({
    name: 'article_tags',
  })
  tags?: ArticleTag[]

  // 虚拟关联 (非外键)
  @ApiProperty({
    description: '点赞列表',
  })
  @OneToMany(() => Likes, likes => likes.contentId)
  likes?: Likes[]
}
