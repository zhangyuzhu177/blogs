import type OpenAI from 'openai'
import { registerAs } from '@nestjs/config'

export interface OpenAIConfig extends Pick<OpenAI, 'baseURL' | 'apiKey'> {
  /** 聊天模型名称，支持 OpenAI-compatible 厂商通过环境变量切换 */
  chatModel: string
  /** Embedding 模型名称，不配置时使用本地哈希向量兜底 */
  embeddingModel: string
}

export default registerAs('openai', (): OpenAIConfig => {
  const {
    LLM_API_KEY,
    LLM_BASE_URL,
    LLM_CHAT_MODEL,
    LLM_EMBEDDING_MODEL,
    OPENAI_API_KEY,
    OPENAI_BASE_URL,
    OPENAI_CHAT_MODEL,
    OPENAI_EMBEDDING_MODEL,
  } = process.env

  return {
    apiKey: LLM_API_KEY || OPENAI_API_KEY,
    baseURL: LLM_BASE_URL || OPENAI_BASE_URL,
    chatModel: LLM_CHAT_MODEL || OPENAI_CHAT_MODEL || 'deepseek-ai/DeepSeek-V3.1-Terminus',
    embeddingModel: LLM_EMBEDDING_MODEL || OPENAI_EMBEDDING_MODEL || 'local-hash-v1',
  }
})
