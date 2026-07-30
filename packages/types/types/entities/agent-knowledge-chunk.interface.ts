import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'
import type { AgentSourceType } from './agent-conversation.interface'

/** Agent 知识块状态 */
export type AgentKnowledgeChunkStatus = 'active' | 'deleted'

/** Agent 知识块元信息 */
export interface IAgentKnowledgeChunkMetadata {
  /** 原始内容 hash，用于判断文章内容是否变化 */
  contentHash?: string
  /** 文章分类 Id */
  articleTypeId?: string
  /** 文章分类名称 */
  articleTypeName?: string
  /** 标签名称列表 */
  tags?: string[]
  /** 当前知识块大致字数 */
  wordCount?: number
}

/** Agent 知识块实体 */
export interface IAgentKnowledgeChunk extends ICreatedAt, IUpdatedAt {
  /** 知识块唯一标识 */
  id: string
  /** 来源类型 */
  sourceType: AgentSourceType
  /** 来源 Id，例如文章 Id */
  sourceId: string
  /** 同一来源下的分块序号 */
  chunkIndex: number
  /** 来源标题 */
  title: string
  /** 分块正文 */
  content: string
  /** 前端跳转链接 */
  url?: string
  /** 原始内容 hash */
  contentHash: string
  /** 状态 */
  status: AgentKnowledgeChunkStatus
  /** 附加元信息 */
  metadata?: IAgentKnowledgeChunkMetadata
}
