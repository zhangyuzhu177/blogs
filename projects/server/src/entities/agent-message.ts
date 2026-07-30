import type { AgentMessageRole, IAgentMessage, IAgentMessageMetadata } from 'types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseTimeStamp } from './_timestamp'
import { AgentConversation } from './agent-conversation'

const AGENT_MESSAGE_ROLES: AgentMessageRole[] = ['system', 'user', 'assistant', 'tool']

@Entity()
export class AgentMessage extends BaseTimeStamp implements IAgentMessage {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Agent 消息唯一标识',
  })
  id: string

  @ApiProperty({
    description: '所属会话 Id',
  })
  @Column()
  conversationId: string

  @ApiProperty({
    description: '消息角色',
  })
  @Column({
    type: 'enum',
    enum: AGENT_MESSAGE_ROLES,
  })
  role: AgentMessageRole

  @ApiProperty({
    description: '消息内容',
  })
  @Column({
    type: 'mediumtext',
  })
  content: string

  @ApiPropertyOptional({
    description: '工具名称，MVP 阶段通常为空',
  })
  @Column({
    length: 80,
    nullable: true,
  })
  toolName?: string

  @ApiPropertyOptional({
    description: '工具调用 Id，预留给后续 tool calling 使用',
  })
  @Column({
    length: 128,
    nullable: true,
  })
  toolCallId?: string

  @ApiPropertyOptional({
    description: '消息元信息，如引用来源、模型、耗时等',
  })
  @Column({
    type: 'json',
    nullable: true,
  })
  metadata?: IAgentMessageMetadata

  /**
   * 消息所属会话。
   * 会话删除时同步删除消息，避免留下无归属聊天记录。
   */
  @ManyToOne(() => AgentConversation, conversation => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'conversationId',
  })
  conversation?: AgentConversation
}
