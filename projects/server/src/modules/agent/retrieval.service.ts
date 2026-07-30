import { In, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, Logger } from '@nestjs/common'

import type {
  AgentSourceType,
  IAgentReference,
} from 'types'
import { Article } from 'src/entities/article'
import { AgentEmbedding } from 'src/entities/agent-embedding'
import { AgentKnowledgeChunk } from 'src/entities/agent-knowledge-chunk'

import { EmbeddingService } from './embedding.service'

interface SearchKnowledgeOptions {
  /** 返回的最大知识块数量 */
  limit?: number
  /** 限定来源类型 */
  sourceTypes?: AgentSourceType[]
  /** 只检索某个来源 Id */
  sourceId?: string
  /** 排除某个来源 Id，常用于“找相关文章”时排除当前文章 */
  excludeSourceId?: string
  /** 最低分，低于该分数的结果会被丢弃 */
  minScore?: number
}

export interface AgentKnowledgeMatch {
  chunk: AgentKnowledgeChunk
  score: number
}

@Injectable()
export class RetrievalService {
  private readonly _logger = new Logger(RetrievalService.name)

  private readonly _chunkSize = 1100

  private readonly _chunkOverlap = 160

  constructor(
    private readonly _embeddingSrv: EmbeddingService,
    @InjectRepository(Article)
    private readonly _articleRepo: Repository<Article>,
    @InjectRepository(AgentKnowledgeChunk)
    private readonly _chunkRepo: Repository<AgentKnowledgeChunk>,
    @InjectRepository(AgentEmbedding)
    private readonly _embeddingRepo: Repository<AgentEmbedding>,
  ) {}

  /**
   * 重建单篇文章索引。
   * 先删除旧知识块，再写入新知识块和向量，保证检索不会命中过期内容。
   */
  public async indexArticle(articleId: string) {
    const article = await this._articleRepo.findOne({
      where: {
        id: articleId,
        status: true,
      },
      relations: {
        tags: true,
        articleType: true,
      },
    })

    if (!article) {
      await this.removeArticleIndex(articleId)
      return {
        articleId,
        chunkCount: 0,
      }
    }

    const sourceText = this._buildArticleKnowledgeText(article)
    const contentHash = this._embeddingSrv.hashText(sourceText)
    const chunks = this._splitText(sourceText)

    await this.removeArticleIndex(article.id)

    const savedChunks = await this._chunkRepo.save(chunks.map((content, index) => this._chunkRepo.create({
      sourceType: 'article',
      sourceId: article.id,
      chunkIndex: index,
      title: article.name,
      content,
      url: `/archives/article?articleId=${article.id}`,
      contentHash,
      status: 'active',
      metadata: {
        contentHash,
        articleTypeId: article.articleTypeId,
        articleTypeName: article.articleType?.name,
        tags: article.tags?.map(tag => tag.name) || [],
        wordCount: content.length,
      },
    })))

    for (const chunk of savedChunks) {
      const embedding = await this._embeddingSrv.embedText(`${chunk.title}\n${chunk.content}`)
      await this._embeddingRepo.save(this._embeddingRepo.create({
        chunkId: chunk.id,
        provider: embedding.provider,
        model: embedding.model,
        dimension: embedding.dimension,
        vector: embedding.vector,
      }))
    }

    return {
      articleId: article.id,
      chunkCount: savedChunks.length,
    }
  }

  /**
   * 重建所有已发布文章索引。
   * 适合首次上线 RAG 表后，在后台或 Swagger 中手动触发一次。
   */
  public async indexAllArticles() {
    const articles = await this._articleRepo.find({
      where: {
        status: true,
      },
      select: {
        id: true,
      },
      order: {
        updatedAt: 'DESC',
      },
    })

    let chunkCount = 0

    for (const article of articles) {
      const result = await this.indexArticle(article.id)
      chunkCount += result.chunkCount
    }

    return {
      articleCount: articles.length,
      chunkCount,
    }
  }

  /**
   * 删除指定文章的所有知识块和向量。
   * 下架、删除文章时调用，避免前台 Agent 推荐不可见内容。
   */
  public async removeArticleIndex(articleId: string) {
    const chunks = await this._chunkRepo.find({
      where: {
        sourceType: 'article',
        sourceId: articleId,
      },
      select: {
        id: true,
      },
    })

    const chunkIds = chunks.map(chunk => chunk.id)
    if (!chunkIds.length)
      return 0

    await this._embeddingRepo.delete({
      chunkId: In(chunkIds),
    })
    const deleteRes = await this._chunkRepo.delete({
      id: In(chunkIds),
    })

    return deleteRes.affected || 0
  }

  /**
   * 检索知识库。
   * 优先使用当前 embedding 模型对应的向量；如果还没有索引或模型刚切换，
   * 会退回关键词检索，保证 Agent 至少能基于站内知识块回答。
   */
  public async searchKnowledge(query: string, options: SearchKnowledgeOptions = {}) {
    const limit = options.limit || 5
    const embedding = await this._embeddingSrv.embedText(query)
    const rows = await this._createEmbeddingQuery(embedding.model, options).getMany()

    if (!rows.length)
      return this._searchByKeyword(query, options)

    const matches = rows
      .filter(row => row.chunk)
      .map<AgentKnowledgeMatch>(row => {
        const semanticScore = this._cosineSimilarity(embedding.vector, this._normalizeStoredVector(row.vector))
        const keywordScore = this._keywordScore(query, `${row.chunk!.title}\n${row.chunk!.content}`)
        return {
          chunk: row.chunk!,
          score: Number((semanticScore * 0.78 + keywordScore * 0.22).toFixed(6)),
        }
      })
      .filter(match => match.score >= (options.minScore ?? 0.05))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    if (matches.length)
      return matches

    return this._searchByKeyword(query, options)
  }

  /**
   * 将检索结果整理为模型可读上下文。
   */
  public buildKnowledgeContext(matches: AgentKnowledgeMatch[]) {
    if (!matches.length)
      return ''

    const lines = matches.map((match, index) => [
      `【检索片段 ${index + 1}】`,
      `标题：${match.chunk.title}`,
      `来源：${match.chunk.url || `${match.chunk.sourceType}:${match.chunk.sourceId}`}`,
      `相关度：${match.score.toFixed(3)}`,
      `内容：${this._truncate(match.chunk.content, 900)}`,
    ].join('\n'))

    return `【站内知识库检索结果】\n${lines.join('\n\n')}`
  }

  /**
   * 将检索结果整理为前端可展示的引用来源。
   * 同一篇文章命中多个 chunk 时，只展示分数最高的一条，避免引用列表刷屏。
   */
  public buildReferences(matches: AgentKnowledgeMatch[]): IAgentReference[] {
    const references = new Map<string, IAgentReference>()

    for (const match of matches) {
      const chunk = match.chunk
      const key = `${chunk.sourceType}:${chunk.sourceId}`

      if (references.has(key))
        continue

      references.set(key, {
        chunkId: chunk.id,
        chunkIndex: chunk.chunkIndex,
        sourceType: chunk.sourceType,
        sourceId: chunk.sourceId,
        title: chunk.title,
        url: chunk.url || '',
        snippet: this._truncate(chunk.content, 140),
        score: Number(match.score.toFixed(4)),
      })
    }

    return Array.from(references.values())
  }

  private _createEmbeddingQuery(model: string, options: SearchKnowledgeOptions) {
    const query = this._embeddingRepo
      .createQueryBuilder('embedding')
      .leftJoinAndSelect('embedding.chunk', 'chunk')
      .where('embedding.model = :model', { model })
      .andWhere('chunk.status = :status', { status: 'active' })

    this._applyChunkFilters(query, options)

    return query
  }

  private _createChunkQuery(options: SearchKnowledgeOptions) {
    const query = this._chunkRepo
      .createQueryBuilder('chunk')
      .where('chunk.status = :status', { status: 'active' })

    this._applyChunkFilters(query, options)

    return query
  }

  private _applyChunkFilters(query: any, options: SearchKnowledgeOptions) {
    if (options.sourceTypes?.length)
      query.andWhere('chunk.sourceType IN (:...sourceTypes)', { sourceTypes: options.sourceTypes })

    if (options.sourceId)
      query.andWhere('chunk.sourceId = :sourceId', { sourceId: options.sourceId })

    if (options.excludeSourceId)
      query.andWhere('chunk.sourceId != :excludeSourceId', { excludeSourceId: options.excludeSourceId })
  }

  private async _searchByKeyword(queryText: string, options: SearchKnowledgeOptions) {
    const limit = options.limit || 5
    const chunks = await this._createChunkQuery(options).getMany()

    const matches = chunks
      .map<AgentKnowledgeMatch>(chunk => ({
        chunk,
        score: Number(this._keywordScore(queryText, `${chunk.title}\n${chunk.content}`).toFixed(6)),
      }))
      .filter(match => match.score >= (options.minScore ?? 0.02))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    if (!matches.length)
      this._logger.debug(`知识库未命中：${queryText.slice(0, 80)}`)

    return matches
  }

  private _buildArticleKnowledgeText(article: Article) {
    const tags = article.tags?.map(tag => tag.name).join('、')

    return [
      `标题：${article.name}`,
      article.articleType?.name ? `分类：${article.articleType.name}` : '',
      tags ? `标签：${tags}` : '',
      article.abstract ? `摘要：${article.abstract}` : '',
      `正文：${article.content || ''}`,
    ].filter(Boolean).join('\n')
  }

  private _splitText(text: string) {
    const normalized = text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    if (!normalized)
      return []

    const chunks: string[] = []
    const paragraphs = normalized.split(/\n{2,}/)
    let current = ''

    for (const paragraph of paragraphs) {
      if (paragraph.length > this._chunkSize) {
        this._pushChunk(chunks, current)
        current = ''

        for (let start = 0; start < paragraph.length; start += this._chunkSize - this._chunkOverlap)
          this._pushChunk(chunks, paragraph.slice(start, start + this._chunkSize))

        continue
      }

      const next = current ? `${current}\n\n${paragraph}` : paragraph

      if (next.length > this._chunkSize) {
        this._pushChunk(chunks, current)
        current = this._overlapTail(current, paragraph)
      }
      else {
        current = next
      }
    }

    this._pushChunk(chunks, current)

    return chunks
  }

  private _pushChunk(chunks: string[], content: string) {
    const normalized = content.replace(/\s+/g, ' ').trim()

    if (normalized)
      chunks.push(normalized)
  }

  private _overlapTail(previous: string, nextParagraph: string) {
    const tail = previous.slice(Math.max(previous.length - this._chunkOverlap, 0)).trim()
    return tail ? `${tail}\n\n${nextParagraph}` : nextParagraph
  }

  private _cosineSimilarity(left: number[], right: number[]) {
    const length = Math.min(left.length, right.length)
    if (!length)
      return 0

    let score = 0
    for (let index = 0; index < length; index++)
      score += left[index] * right[index]

    return score
  }

  private _normalizeStoredVector(vector: number[] | string | null) {
    if (Array.isArray(vector))
      return vector

    if (typeof vector !== 'string')
      return []

    try {
      const parsed = JSON.parse(vector)
      return Array.isArray(parsed) ? parsed.map(Number) : []
    }
    catch (_) {
      return []
    }
  }

  private _keywordScore(query: string, content: string) {
    const tokens = this._tokenize(query)
    if (!tokens.length)
      return 0

    const normalizedContent = content.toLowerCase()
    let hit = 0

    for (const token of tokens) {
      if (normalizedContent.includes(token))
        hit++
    }

    return hit / tokens.length
  }

  private _tokenize(text: string) {
    const normalized = text.toLowerCase()
    const words = normalized.match(/[a-z0-9_]{2,}/g) || []
    const chars = Array.from(normalized).filter(char => /[\u4E00-\u9FFF]/.test(char))
    const cjkBigrams = chars
      .slice(0, -1)
      .map((char, index) => `${char}${chars[index + 1]}`)

    return Array.from(new Set([
      ...words,
      ...cjkBigrams,
    ].filter(Boolean)))
  }

  private _truncate(text: string, maxLength: number) {
    const normalized = text.replace(/\s+/g, ' ').trim()

    if (normalized.length <= maxLength)
      return normalized

    return `${normalized.slice(0, maxLength)}...`
  }
}
