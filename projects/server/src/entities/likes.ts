import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { ID_EXAMPLE, type ILikes, LikesType } from 'types'
import { ApiProperty } from '@nestjs/swagger'
import { CreatedAt } from './_timestamp'

@Entity()
@Index('IDX_CONTENT_VISITOR_UNIQUE', ['type', 'contentId', 'visitorId'], {
  unique: true,
})
export class Likes extends CreatedAt implements ILikes {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: '点赞记录唯一标识',
    example: ID_EXAMPLE,
  })
  id: string

  @ApiProperty({
    description: '点赞的浏览器指纹',
  })
  @Column({
    unique: true,
  })
  visitorId: string

  @ApiProperty({
    description: '点赞的内容id 文章id / 图库id',
  })
  @Column()
  contentId: string

  @ApiProperty({
    description: '点赞的ip地址',
  })
  @Column()
  ip: string

  @ApiProperty({
    description: '点赞的类型',
    enum: LikesType,
  })
  @Column({
    type: 'enum',
    enum: LikesType,
  })
  type: LikesType
}
