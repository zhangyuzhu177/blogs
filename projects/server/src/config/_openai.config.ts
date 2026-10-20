import { registerAs } from '@nestjs/config'

export interface OpenAIConfig {
  /** 聊天模型密钥 */
  apiKey?: string
  /** 聊天模型兼容接口地址 */
  baseURL?: string
  /** 聊天模型名称，支持 OpenAI-compatible 厂商通过环境变量切换 */
  chatModel: string
  /** Embedding 专用密钥 */
  embeddingApiKey?: string
  /** Embedding 专用兼容接口地址，不和聊天模型共用 */
  embeddingBaseURL?: string
  /** Embedding 模型名称 */
  embeddingModel: string
  /** 可选向量维度；仅在模型支持 dimensions 参数时配置 */
  embeddingDimensions?: number
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
    EMBEDDING_API_KEY,
    EMBEDDING_BASE_URL,
    EMBEDDING_MODEL,
    EMBEDDING_DIMENSIONS,
  } = process.env

  const dimensions = Number(EMBEDDING_DIMENSIONS)

  return {
    apiKey: LLM_API_KEY || OPENAI_API_KEY,
    baseURL: LLM_BASE_URL || OPENAI_BASE_URL,
    chatModel: LLM_CHAT_MODEL || OPENAI_CHAT_MODEL || 'deepseek-ai/DeepSeek-V3.1-Terminus',
    embeddingApiKey: EMBEDDING_API_KEY,
    embeddingBaseURL: EMBEDDING_BASE_URL,
    embeddingModel: EMBEDDING_MODEL || LLM_EMBEDDING_MODEL || OPENAI_EMBEDDING_MODEL || '',
    embeddingDimensions: Number.isInteger(dimensions) && dimensions > 0 ? dimensions : undefined,
  }
})
