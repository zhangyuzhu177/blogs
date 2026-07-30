import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'
import type { IAgentMessage } from './agent-message.interface'

/** Agent 会话来源类型 */
export type AgentSourceType = 'article' | 'gallery' | 'site'

/** Agent 会话状态 */
export type AgentConversationStatus = 'active' | 'archived'

/** Agent 会话实体 */
export interface IAgentConversation extends ICreatedAt, IUpdatedAt {
  /** 会话唯一标识 */
  id: string
  /** 访客指纹 */
  visitorId: string
  /** 登录用户 Id，匿名访客为空 */
  userId?: string
  /** 会话标题 */
  title?: string
  /** 会话来源类型 */
  sourceType?: AgentSourceType
  /** 当前上下文来源 Id，如文章 Id */
  sourceId?: string
  /** 本次会话使用的模型 */
  model: string
  /** 会话状态 */
  status: AgentConversationStatus
  /** 会话消息列表 */
  messages?: IAgentMessage[]
}
