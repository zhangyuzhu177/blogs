import type { IArticleTag } from 'types'
import { ID_EXAMPLE } from 'types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Article } from './article'
import { BaseTimeStamp } from './_timestamp'

@Entity()
export class ArticleTag extends BaseTimeStamp implements IArticleTag {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '文章标签唯一标识',
    example: ID_EXAMPLE,
  })
  id: string

  @ApiProperty({
    description: '文章标签名称',
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
    description: '关联的文章列表',
  })
  @ManyToMany(
    () => Article,
    article => article.tags,
  )
  articles?: Article[]
}
