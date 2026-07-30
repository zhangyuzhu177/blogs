import type { AgentConversationStatus, AgentSourceType, IAgentConversation } from 'types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseTimeStamp } from './_timestamp'
import { AgentMessage } from './agent-message'

const AGENT_SOURCE_TYPES: AgentSourceType[] = ['article', 'gallery', 'site']
const AGENT_CONVERSATION_STATUSES: AgentConversationStatus[] = ['active', 'archived']

@Entity()
export class AgentConversation extends BaseTimeStamp implements IAgentConversation {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Agent 会话唯一标识',
  })
  id: string

  @ApiProperty({
    description: '访客指纹，用于匿名用户找回自己的会话',
  })
  @Column({
    length: 128,
  })
  visitorId: string

  @ApiPropertyOptional({
    description: '登录用户 Id，前台匿名访问时为空',
  })
  @Column({
    nullable: true,
  })
  userId?: string

  @ApiPropertyOptional({
    description: '会话标题，默认取首条问题的前若干个字符',
  })
  @Column({
    length: 128,
    nullable: true,
  })
  title?: string

  @ApiPropertyOptional({
    description: '会话来源类型，如文章页、图库页或全站入口',
  })
  @Column({
    type: 'enum',
    enum: AGENT_SOURCE_TYPES,
    nullable: true,
  })
  sourceType?: AgentSourceType

  @ApiPropertyOptional({
    description: '当前上下文来源 Id，例如文章 Id',
  })
  @Column({
    nullable: true,
  })
  sourceId?: string

  @ApiProperty({
    description: '本次会话使用的模型名称',
  })
  @Column({
    length: 80,
  })
  model: string

  @ApiProperty({
    description: '会话状态',
  })
  @Column({
    type: 'enum',
    enum: AGENT_CONVERSATION_STATUSES,
    default: 'active',
  })
  status: AgentConversationStatus

  /**
   * 会话下的所有消息。
   * 这里不主动级联保存，避免流式输出中途失败时产生隐式写入。
   */
  @OneToMany(() => AgentMessage, message => message.conversation)
  messages?: AgentMessage[]
}
