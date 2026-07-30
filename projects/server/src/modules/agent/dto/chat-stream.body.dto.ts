import type { AgentAction, AgentSourceType, IAgentChatStreamBodyDto } from 'types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator'

const AGENT_SOURCE_TYPES: AgentSourceType[] = ['article', 'gallery', 'site']
const AGENT_ACTIONS: AgentAction[] = ['chat', 'summarize', 'related', 'explain-code', 'learning-path']

export class AgentChatStreamBodyDto implements IAgentChatStreamBodyDto {
  @ApiPropertyOptional({
    description: '已有会话 Id，不传则自动创建新会话',
  })
  @IsOptional()
  @IsString()
  conversationId?: string

  @ApiProperty({
    description: '访客指纹，用于匿名用户保存和找回会话',
  })
  @IsString()
  @MaxLength(128)
  visitorId: string

  @ApiProperty({
    description: '用户输入的问题',
  })
  @IsString()
  @MaxLength(2000)
  message: string

  @ApiPropertyOptional({
    description: '当前上下文类型',
    enum: AGENT_SOURCE_TYPES,
  })
  @IsOptional()
  @IsIn(AGENT_SOURCE_TYPES)
  sourceType?: AgentSourceType

  @ApiPropertyOptional({
    description: '当前上下文 Id，如文章 Id',
  })
  @IsOptional()
  @IsString()
  sourceId?: string

  @ApiPropertyOptional({
    description: '快捷动作',
    enum: AGENT_ACTIONS,
  })
  @IsOptional()
  @IsIn(AGENT_ACTIONS)
  action?: AgentAction
}
