import type { AgentSourceType } from '../../entities/agent-conversation.interface'
import type { AgentToolName } from '../../entities/agent-tool-log.interface'

/** Agent 快捷动作 */
export type AgentAction = 'chat' | 'summarize' | 'related' | 'explain-code' | 'learning-path'

/** Agent 流式聊天请求体 */
export interface IAgentChatStreamBodyDto {
  /** 已存在的会话 Id，不传则创建新会话 */
  conversationId?: string
  /** 访客指纹 */
  visitorId: string
  /** 用户输入 */
  message: string
  /** 当前上下文类型 */
  sourceType?: AgentSourceType
  /** 当前上下文 Id */
  sourceId?: string
  /** 快捷动作 */
  action?: AgentAction
}

/** Agent 回答引用来源 */
export interface IAgentReference {
  /** 命中的知识块 Id */
  chunkId?: string
  /** 命中的知识块序号 */
  chunkIndex?: number
  /** 来源类型 */
  sourceType: AgentSourceType
  /** 来源 Id */
  sourceId: string
  /** 来源标题 */
  title: string
  /** 前端跳转链接 */
  url: string
  /** 引用片段 */
  snippet: string
  /** 检索得分 */
  score?: number
}

/** Agent 工具调用结果摘要 */
export interface IAgentToolResult {
  /** 工具调用 Id */
  toolCallId: string
  /** 工具名称 */
  toolName: AgentToolName
  /** 前端展示文案 */
  displayText: string
  /** 命中的结果数量 */
  resultCount: number
}

/** Agent SSE 事件 */
export type AgentStreamEvent =
  | { type: 'conversation'; conversationId: string }
  | { type: 'tool_start'; toolCallId: string; toolName: AgentToolName; displayText: string }
  | { type: 'tool_result'; result: IAgentToolResult }
  | { type: 'delta'; content: string }
  | { type: 'references'; references: IAgentReference[] }
  | { type: 'done' }
  | { type: 'error'; message: string }
