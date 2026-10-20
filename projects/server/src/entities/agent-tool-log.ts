import {
  AgentToolLogStatus,
  AgentToolName,
} from 'types'
import type {
  IAgentToolLog,
} from 'types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { AgentConversation } from './agent-conversation'

const AGENT_TOOL_NAMES: AgentToolName[] = [
  'getCurrentArticle',
  'searchArticles',
  'searchKnowledge',
  'searchGallery',
  'getArchiveStats',
]

const AGENT_TOOL_LOG_STATUSES: AgentToolLogStatus[] = ['success', 'error']

@Entity()
@Index('idx_agent_tool_log_conversation_created', ['conversationId', 'createdAt'])
@Index('idx_agent_tool_log_tool_created', ['toolName', 'createdAt'])
export class AgentToolLog implements IAgentToolLog {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Agent 工具调用日志唯一标识',
  })
  id: string

  @ApiProperty({
    description: '所属会话 Id',
  })
  @Column()
  conversationId: string

  @ApiProperty({
    description: '工具调用 Id',
  })
  @Column({
    length: 128,
  })
  toolCallId: string

  @ApiProperty({
    description: '工具名称',
  })
  @Column({
    type: 'enum',
    enum: AGENT_TOOL_NAMES,
  })
  toolName: AgentToolName

  @ApiPropertyOptional({
    description: '调用参数',
  })
  @Column({
    type: 'json',
    nullable: true,
  })
  input?: Record<string, any>

  @ApiPropertyOptional({
    description: '调用结果摘要',
  })
  @Column({
    type: 'json',
    nullable: true,
  })
  output?: Record<string, any>

  @ApiProperty({
    description: '调用状态',
  })
  @Column({
    type: 'enum',
    enum: AGENT_TOOL_LOG_STATUSES,
  })
  status: AgentToolLogStatus

  @ApiPropertyOptional({
    description: '错误信息',
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  errorMessage?: string

  @ApiProperty({
    description: '工具耗时',
  })
  @Column()
  durationMs: number

  @ApiProperty({
    description: '创建时间',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @ManyToOne(() => AgentConversation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'conversationId',
  })
  conversation?: AgentConversation
}
