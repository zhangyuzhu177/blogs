import { ApiProperty } from '@nestjs/swagger'
import type { IArticle } from 'src/types/entities/article.interface'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseTimeStamp } from './_timestamp'
import { ArticleStatus } from 'src/types/enum/article-status.enum'

@Entity()
export class Article extends BaseTimeStamp implements IArticle {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '文章唯一标识',
    example: '00000000-0000-0000-0000-000000000000',
  })
  id: string

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
    description: '文章状态 public:公开 | draft:草稿',
    example: ArticleStatus.PUBLIC,
  })
  @Column()
  status: ArticleStatus

  @ApiProperty({
    description: '访问量',
  })
  @Column()
  pageView?: number
}
