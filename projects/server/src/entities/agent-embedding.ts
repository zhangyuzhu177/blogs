import { AgentEmbeddingProvider } from 'types'
import type {
  IAgentEmbedding,
} from 'types'
import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseTimeStamp } from './_timestamp'
import { AgentKnowledgeChunk } from './agent-knowledge-chunk'

const AGENT_EMBEDDING_PROVIDERS: AgentEmbeddingProvider[] = ['openai-compatible']

@Entity()
@Index('idx_agent_embedding_chunk_model', ['chunkId', 'model'], {
  unique: true,
})
@Index('idx_agent_embedding_model', ['model'])
export class AgentEmbedding extends BaseTimeStamp implements IAgentEmbedding {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Agent 向量记录唯一标识',
  })
  id: string

  @ApiProperty({
    description: '关联知识块 Id',
  })
  @Column()
  chunkId: string

  @ApiProperty({
    description: '向量生成方',
  })
  @Column({
    type: 'enum',
    enum: AGENT_EMBEDDING_PROVIDERS,
  })
  provider: AgentEmbeddingProvider

  @ApiProperty({
    description: '向量模型名称',
  })
  @Column({
    length: 120,
  })
  model: string

  @ApiProperty({
    description: '向量维度',
  })
  @Column()
  dimension: number

  @ApiProperty({
    description: '向量数组',
  })
  @Column({
    type: 'json',
  })
  vector: number[]

  /**
   * 向量所属知识块。
   * 删除或重建知识块时，旧向量必须同步清理，避免检索命中过期内容。
   */
  @ManyToOne(() => AgentKnowledgeChunk, chunk => chunk.embeddings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'chunkId',
  })
  chunk?: AgentKnowledgeChunk
}
