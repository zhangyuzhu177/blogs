import type { ICreatedAt } from './_timestamp.interface'
import type { IAgentConversation } from './agent-conversation.interface'

/** 前台 Agent 可调用的只读工具 */
export type AgentToolName =
  | 'getCurrentArticle'
  | 'searchArticles'
  | 'searchKnowledge'
  | 'searchGallery'
  | 'getArchiveStats'

/** Agent 工具调用状态 */
export type AgentToolLogStatus = 'success' | 'error'

/** Agent 工具调用日志实体 */
export interface IAgentToolLog extends ICreatedAt {
  /** 工具调用日志唯一标识 */
  id: string
  /** 所属会话 Id */
  conversationId: string
  /** 工具调用 Id */
  toolCallId: string
  /** 工具名称 */
  toolName: AgentToolName
  /** 调用参数 */
  input?: Record<string, any>
  /** 调用结果摘要 */
  output?: Record<string, any>
  /** 调用状态 */
  status: AgentToolLogStatus
  /** 错误信息 */
  errorMessage?: string
  /** 工具耗时 */
  durationMs: number
  /** 所属会话 */
  conversation?: IAgentConversation
}
