import type {
  AgentKnowledgeChunkStatus,
  AgentSourceType,
  IAgentKnowledgeChunk,
  IAgentKnowledgeChunkMetadata,
} from 'types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseTimeStamp } from './_timestamp'
import { AgentEmbedding } from './agent-embedding'

const AGENT_SOURCE_TYPES: AgentSourceType[] = ['article', 'gallery', 'site']
const AGENT_KNOWLEDGE_CHUNK_STATUSES: AgentKnowledgeChunkStatus[] = ['active', 'deleted']

@Entity()
@Index('idx_agent_knowledge_chunk_source', ['sourceType', 'sourceId'])
@Index('idx_agent_knowledge_chunk_status', ['status'])
export class AgentKnowledgeChunk extends BaseTimeStamp implements IAgentKnowledgeChunk {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Agent 知识块唯一标识',
  })
  id: string

  @ApiProperty({
    description: '来源类型，如文章、图库或全站资料',
  })
  @Column({
    type: 'enum',
    enum: AGENT_SOURCE_TYPES,
  })
  sourceType: AgentSourceType

  @ApiProperty({
    description: '来源 Id，例如文章 Id',
  })
  @Column()
  sourceId: string

  @ApiProperty({
    description: '同一来源下的分块序号',
  })
  @Column()
  chunkIndex: number

  @ApiProperty({
    description: '来源标题',
  })
  @Column({
    length: 255,
  })
  title: string

  @ApiProperty({
    description: '分块正文',
  })
  @Column({
    type: 'mediumtext',
  })
  content: string

  @ApiPropertyOptional({
    description: '前端跳转链接',
  })
  @Column({
    length: 512,
    nullable: true,
  })
  url?: string

  @ApiProperty({
    description: '原始内容 hash，用于判断索引是否需要重建',
  })
  @Column({
    length: 64,
  })
  contentHash: string

  @ApiProperty({
    description: '知识块状态',
  })
  @Column({
    type: 'enum',
    enum: AGENT_KNOWLEDGE_CHUNK_STATUSES,
    default: 'active',
  })
  status: AgentKnowledgeChunkStatus

  @ApiPropertyOptional({
    description: '知识块元信息，如文章分类、标签和字数',
  })
  @Column({
    type: 'json',
    nullable: true,
  })
  metadata?: IAgentKnowledgeChunkMetadata

  /**
   * 一个知识块可能存在不同模型生成的向量。
   * 这样以后切换 embedding 模型时，可以保留历史记录或逐步重建。
   */
  @OneToMany(() => AgentEmbedding, embedding => embedding.chunk)
  embeddings?: AgentEmbedding[]
}
