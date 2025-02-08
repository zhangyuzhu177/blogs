import { ApiProperty } from "@nestjs/swagger"
import { IArticleType, ID_EXAMPLE } from "types"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

import { Article } from "./article"
import { BaseTimeStamp } from "./_timestamp"

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

  @ApiProperty({
    description: '描述',
  })
  @Column()
  desc?: string

  @OneToMany(() => Article, (article) => article.articleType)
  articles: Article[]
}
