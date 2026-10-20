import { createHash } from 'node:crypto'
import { OpenAIEmbeddings } from '@langchain/openai'
import { ConfigService } from '@nestjs/config'
import { Injectable, Logger } from '@nestjs/common'

import type {
  AgentEmbeddingProvider,
} from 'types'
import type { OpenAIConfig } from 'src/config/_openai.config'

export interface AgentEmbeddingResult {
  provider: AgentEmbeddingProvider
  model: string
  dimension: number
  vector: number[]
}

@Injectable()
export class EmbeddingService {
  private readonly _logger = new Logger(EmbeddingService.name)

  /** 只负责向量接口，不复用聊天模型的 key 和地址 */
  private readonly _embeddings?: OpenAIEmbeddings

  private readonly _model: string

  /** 显式配置时才传给兼容接口；否则使用模型默认维度 */
  private readonly _dimensions?: number

  /** DashScope 兼容接口单次最多 20 条，这里留出余量 */
  private readonly _batchSize = 10

  /** 避免超长查询把 embedding 请求打爆 */
  private readonly _maxInputChars = 8000

  constructor(
    private readonly _cfgSrv: ConfigService,
  ) {
    const openaiConfig = this._cfgSrv.get<OpenAIConfig>('openai')

    this._model = openaiConfig?.embeddingModel || ''
    this._dimensions = openaiConfig?.embeddingDimensions

    if (openaiConfig?.embeddingApiKey && this._model) {
      this._embeddings = new OpenAIEmbeddings({
        model: this._model,
        apiKey: openaiConfig.embeddingApiKey,
        batchSize: this._batchSize,
        ...(this._dimensions ? { dimensions: this._dimensions } : {}),
        configuration: {
          apiKey: openaiConfig.embeddingApiKey,
          baseURL: openaiConfig.embeddingBaseURL,
        },
      })
      this._logger.log(`Embedding 使用远端模型 ${this._model}`)
    }
  }

  /**
   * 当前用于索引和检索的 Embedding 模型名。
   */
  public get activeModel() {
    return this._model
  }

  /**
   * 生成单段文本的向量。
   * 调用真实 Embedding 模型，失败时直接抛错。
   */
  public async embedText(text: string) {
    const [result] = await this.embedTexts([text])
    return result
  }

  /**
   * 批量生成向量，顺序与入参一致。
   * 索引重建时按批请求，减少逐段调用带来的延迟。
   */
  public async embedTexts(texts: string[]) {
    const inputs = texts.map(text => this._clipInput(this.normalizeText(text) || 'empty'))

    if (!inputs.length)
      return []

    if (!this._embeddings)
      throw new Error('未配置 Embedding 模型，请检查 EMBEDDING_API_KEY、EMBEDDING_BASE_URL 和 EMBEDDING_MODEL')

    const vectors = await this._embeddings.embedDocuments(inputs)
    if (vectors.length !== inputs.length)
      throw new Error(`Embedding 返回数量不匹配：期望 ${inputs.length}，实际 ${vectors.length}`)

    return vectors.map((vector) => {
      if (!vector.length)
        throw new Error('Embedding 接口返回了空向量')

      return {
        provider: 'openai-compatible' as const,
        model: this._model,
        dimension: vector.length,
        vector: this.normalizeVector(vector),
      }
    })
  }

  /**
   * 归一化文本，既用于 hash 判断，也用于送进 embedding 模型前的清洗。
   */
  public normalizeText(text = '') {
    return text
      .replace(/```[\s\S]*?```/g, block => block.replace(/\s+/g, ' '))
      .replace(/<[^>]+>/g, ' ')
      .replace(/[^\w\s\u4E00-\u9FFF]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  /**
   * 计算内容 hash。
   * 文章内容不变时 hash 稳定，便于后续做增量索引优化。
   */
  public hashText(text: string) {
    return createHash('sha256')
      .update(this.normalizeText(text))
      .digest('hex')
  }

  /**
   * L2 归一化，方便检索阶段直接用点积近似余弦相似度。
   */
  public normalizeVector(vector: number[]) {
    const length = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0))

    if (!length)
      return vector

    return vector.map(value => value / length)
  }

  /**
   * 截断超长文本，避免超过 Embedding 模型的输入限制。
   */
  private _clipInput(text: string) {
    return text.length > this._maxInputChars
      ? text.slice(0, this._maxInputChars)
      : text
  }
}
