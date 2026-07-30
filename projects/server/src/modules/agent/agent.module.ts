import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Article } from 'src/entities/article'
import { Gallery } from 'src/entities/gallery'
import { DailyCount } from 'src/entities/daily-count'
import { AgentEmbedding } from 'src/entities/agent-embedding'
import { AgentMessage } from 'src/entities/agent-message'
import { AgentToolLog } from 'src/entities/agent-tool-log'
import { AgentConversation } from 'src/entities/agent-conversation'
import { AgentKnowledgeChunk } from 'src/entities/agent-knowledge-chunk'

import { AgentService } from './agent.service'
import { AgentController } from './agent.controller'
import { EmbeddingService } from './embedding.service'
import { RetrievalService } from './retrieval.service'
import { ToolRegistryService } from './tool-registry.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      Gallery,
      DailyCount,
      AgentEmbedding,
      AgentMessage,
      AgentToolLog,
      AgentConversation,
      AgentKnowledgeChunk,
    ]),
  ],
  controllers: [
    AgentController,
  ],
  providers: [
    AgentService,
    EmbeddingService,
    RetrievalService,
    ToolRegistryService,
  ],
  exports: [
    RetrievalService,
  ],
})
export class AgentModule {}
