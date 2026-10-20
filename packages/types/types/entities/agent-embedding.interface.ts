import type { ICreatedAt, IUpdatedAt } from './_timestamp.interface'
import type { IAgentKnowledgeChunk } from './agent-knowledge-chunk.interface'

/** Agent 向量生成方 */
export type AgentEmbeddingProvider = 'openai-compatible'

/** Agent 向量实体 */
export interface IAgentEmbedding extends ICreatedAt, IUpdatedAt {
  /** 向量记录唯一标识 */
  id: string
  /** 关联知识块 Id */
  chunkId: string
  /** 向量生成方 */
  provider: AgentEmbeddingProvider
  /** 向量模型名称 */
  model: string
  /** 向量维度 */
  dimension: number
  /** 向量数组 */
  vector: number[]
  /** 关联知识块 */
  chunk?: IAgentKnowledgeChunk
}
