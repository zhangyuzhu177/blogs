import OpenAI from 'openai'
import { createHash } from 'node:crypto'
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

  private readonly _openaiClient: OpenAI

  private readonly _apiKey?: string

  private readonly _embeddingModel: string

  private readonly _localModel = 'local-hash-v1'

  private readonly _localDimension = 384

  private _remoteEmbeddingDisabled = false

  constructor(
    private readonly _cfgSrv: ConfigService,
  ) {
    const openaiConfig = this._cfgSrv.get<OpenAIConfig>('openai')

    this._apiKey = openaiConfig?.apiKey
    this._embeddingModel = openaiConfig?.embeddingModel || this._localModel
    this._openaiClient = new OpenAI({
      apiKey: openaiConfig?.apiKey,
      baseURL: openaiConfig?.baseURL,
    })
  }

  /**
   * 当前实际用于索引和检索的模型名。
   * 如果远端 embedding 不可用，会降级为本地哈希模型，检索链路仍可运行。
   */
  public get activeModel() {
    return this._remoteEmbeddingDisabled ? this._localModel : this._embeddingModel
  }

  /**
   * 生成单段文本的向量。
   * 优先调用 OpenAI-compatible embedding 接口；如果当前供应商不支持 embedding，
   * 会自动降级为本地哈希向量，避免文章发布/检索流程被模型能力卡死。
   */
  public async embedText(text: string): Promise<AgentEmbeddingResult> {
    const normalized = this.normalizeText(text)

    if (this._shouldUseRemoteEmbedding()) {
      try {
        const result = await this._openaiClient.embeddings.create({
          model: this._embeddingModel,
          input: normalized || 'empty',
        })
        const vector = result.data[0]?.embedding || []

        if (vector.length) {
          return {
            provider: 'openai-compatible',
            model: this._embeddingModel,
            dimension: vector.length,
            vector: this.normalizeVector(vector),
          }
        }
      }
      catch (error) {
        this._remoteEmbeddingDisabled = true
        this._logger.warn(`Embedding 接口不可用，已降级为本地哈希向量：${(error as Error).message}`)
      }
    }

    const vector = this._createLocalHashVector(normalized)
    return {
      provider: 'local-hash',
      model: this._localModel,
      dimension: vector.length,
      vector,
    }
  }

  /**
   * 归一化文本，既用于 hash 判断，也用于本地哈希向量。
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

  private _shouldUseRemoteEmbedding() {
    return Boolean(
      this._apiKey
      && this._embeddingModel
      && this._embeddingModel !== this._localModel
      && !this._remoteEmbeddingDisabled,
    )
  }

  /**
   * 本地哈希向量不是语义 embedding，但能提供稳定的关键词/短语相似度。
   * 它主要用作兜底：当 DeepSeek 等供应商只提供聊天模型时，RAG 流程仍能工作。
   */
  private _createLocalHashVector(text: string) {
    const vector = new Array(this._localDimension).fill(0)
    const tokens = this._tokenize(text)

    for (const token of tokens) {
      const hash = createHash('sha256').update(token).digest()
      const index = hash.readUInt32BE(0) % this._localDimension
      const sign = hash[4] % 2 === 0 ? 1 : -1
      const weight = token.length > 1 ? 1.2 : 1
      vector[index] += sign * weight
    }

    return this.normalizeVector(vector)
  }

  private _tokenize(text: string) {
    const normalized = text.toLowerCase()
    const words = normalized.match(/[a-z0-9_]+/g) || []
    const chars = Array.from(normalized).filter(char => /[\u4E00-\u9FFF]/.test(char))
    const cjkBigrams = chars
      .slice(0, -1)
      .map((char, index) => `${char}${chars[index + 1]}`)

    return [
      ...words,
      ...chars,
      ...cjkBigrams,
    ].filter(Boolean)
  }
}
