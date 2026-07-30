import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'
import type { IAgentConversation } from './agent-conversation.interface'
import type { AgentToolName } from './agent-tool-log.interface'

/** Agent 消息角色 */
export type AgentMessageRole = 'system' | 'user' | 'assistant' | 'tool'

/** Agent 消息元信息 */
export interface IAgentMessageMetadata {
  /** 引用来源 */
  references?: unknown[]
  /** 工具调用结果 */
  toolEvents?: Array<{
    toolCallId: string
    toolName: AgentToolName
    displayText: string
    resultCount: number
  }>
  /** 消息所属快捷动作 */
  action?: string
  /** 模型名称 */
  model?: string
  /** 生成耗时 */
  durationMs?: number
}

/** Agent 消息实体 */
export interface IAgentMessage extends ICreatedAt, IUpdatedAt {
  /** 消息唯一标识 */
  id: string
  /** 所属会话 Id */
  conversationId: string
  /** 消息角色 */
  role: AgentMessageRole
  /** 消息内容 */
  content: string
  /** 工具名称 */
  toolName?: string
  /** 工具调用 Id */
  toolCallId?: string
  /** 附加元信息 */
  metadata?: IAgentMessageMetadata
  /** 所属会话 */
  conversation?: IAgentConversation
}
