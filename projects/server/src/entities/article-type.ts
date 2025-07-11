import type { IArticleType } from 'types'
import { ID_EXAMPLE } from 'types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Article } from './article'
import { BaseTimeStamp } from './_timestamp'

@Entity()
export class ArticleType extends BaseTimeStamp implements IArticleType {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '文章类别唯一标识',
    example: ID_EXAMPLE,
  })
  id: string

  @ApiProperty({
    description: '文章类别名称',
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

  @OneToMany(() => Article, article => article.articleType)
  articles: Article[]
}
