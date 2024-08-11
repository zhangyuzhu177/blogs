import { ApiProperty } from '@nestjs/swagger'
import type { IArticle } from 'src/types/entities/article.interface'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Article implements IArticle {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '文章唯一标识',
    example: '00000000-0000-0000-0000-000000000000',
  })
  id: string

  @ApiProperty({
    description: '文章作者',
  })
  @Column()
  author: string

  @ApiProperty({
    description: '文章标题',
  })
  @Column()
  title: string

  @ApiProperty({
    description: '文章分类',
  })
  @Column()
  category: string

  @ApiProperty({
    description: '文章标签',
  })
  @Column()
  tags: string

  @ApiProperty({
    description: '文章摘要',
  })
  @Column({type:'text'})
  abstract: string

  @ApiProperty({
    description: '文章内容',
  })
  @Column('longtext')
  content: string

  @ApiProperty({
    description: '文章封面',
  })
  @Column()
  articleCover: string

  @ApiProperty({
    description: '文章状态 0:公开 | 1:私有 | 2:草稿',
    example: 0,
  })
  @Column()
  status: string

  @ApiProperty({
    description: '文章类型 0:原创 | 1:转载',
    example: 0,
  })
  @Column()
  type: string

  @ApiProperty({
    description: '原文链接 当文章类型为转载时为必填',
    example: 0,
  })
  @Column({nullable: true})
  originalUrl?: string

  @ApiProperty({
    description: '发布时间',
  })
  @Column()
  createTime: Date

  @ApiProperty({
    description: '访问量',
  })
  @Column()
  pageView?: number
}
