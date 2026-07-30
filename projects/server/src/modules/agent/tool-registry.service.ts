import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, Logger } from '@nestjs/common'

import type {
  AgentAction,
  AgentToolName,
  IAgentReference,
  IAgentToolResult,
} from 'types'
import { Article } from 'src/entities/article'
import { Gallery } from 'src/entities/gallery'
import { DailyCount } from 'src/entities/daily-count'
import { AgentToolLog } from 'src/entities/agent-tool-log'

import { RetrievalService } from './retrieval.service'

interface ToolPlanInput {
  action: AgentAction
  userMessage: string
  sourceType?: string
  sourceId?: string
  currentArticle?: Article
}

export interface AgentToolRunResult {
  /** 工具调用事件，供 SSE 展示状态 */
  event: IAgentToolResult
  /** 模型可读上下文 */
  contextText: string
  /** 前端可展示引用 */
  references: IAgentReference[]
}

interface ToolExecutionContext {
  conversationId: string
  toolCallId: string
  userMessage: string
  sourceId?: string
  currentArticle?: Article
}

type ToolRunner = (context: ToolExecutionContext) => Promise<{
  contextText: string
  displayText: string
  resultCount: number
  references?: IAgentReference[]
  output?: Record<string, any>
}>

@Injectable()
export class ToolRegistryService {
  private readonly _logger = new Logger(ToolRegistryService.name)

  constructor(
    private readonly _retrievalSrv: RetrievalService,
    @InjectRepository(Article)
    private readonly _articleRepo: Repository<Article>,
    @InjectRepository(Gallery)
    private readonly _galleryRepo: Repository<Gallery>,
    @InjectRepository(DailyCount)
    private readonly _dailyCountRepo: Repository<DailyCount>,
    @InjectRepository(AgentToolLog)
    private readonly _toolLogRepo: Repository<AgentToolLog>,
  ) {}

  /**
   * 根据当前问题选择前台只读工具。
   * 这里先用规则路由，保证阶段三可控上线；后续可平滑替换为模型 function calling。
   */
  public planTools(input: ToolPlanInput): AgentToolName[] {
    const message = input.userMessage.toLowerCase()
    const tools: AgentToolName[] = []

    if (input.sourceType === 'article' && input.sourceId && /当前|这篇|本文|总结|解释|代码|概念/.test(message))
      tools.push('getCurrentArticle')

    if (input.action === 'related' || input.action === 'learning-path' || /相关|推荐|继续阅读|学习路线|先看|文章|教程|站内/.test(message))
      tools.push('searchArticles')

    if (/图库|图片|照片|相册|画廊|gallery/.test(message))
      tools.push('searchGallery')

    if (/统计|归档|数量|多少篇|访问量|总数|概览/.test(message))
      tools.push('getArchiveStats')

    if (/知识库|rag|检索|资料|上下文/.test(message))
      tools.push('searchKnowledge')

    return Array.from(new Set(tools)).slice(0, 3)
  }

  public async runTool(
    conversationId: string,
    toolName: AgentToolName,
    toolCallId: string,
    context: Omit<ToolExecutionContext, 'conversationId' | 'toolCallId'>,
  ): Promise<AgentToolRunResult> {
    const startedAt = Date.now()
    const input = this._buildToolInput(toolName, context)

    try {
      const runner = this._getToolRunner(toolName)
      const result = await runner({
        ...context,
        conversationId,
        toolCallId,
      })

      const event: IAgentToolResult = {
        toolCallId,
        toolName,
        displayText: result.displayText,
        resultCount: result.resultCount,
      }

      await this._toolLogRepo.save(this._toolLogRepo.create({
        conversationId,
        toolCallId,
        toolName,
        input,
        output: result.output || {
          resultCount: result.resultCount,
        },
        status: 'success',
        durationMs: Date.now() - startedAt,
      }))

      return {
        event,
        contextText: result.contextText,
        references: result.references || [],
      }
    }
    catch (error) {
      const message = (error as Error).message

      this._logger.warn(`Agent 工具调用失败：${toolName}，${message}`)
      await this._toolLogRepo.save(this._toolLogRepo.create({
        conversationId,
        toolCallId,
        toolName,
        input,
        status: 'error',
        errorMessage: message,
        durationMs: Date.now() - startedAt,
      }))

      return {
        event: {
          toolCallId,
          toolName,
          displayText: `${this.getToolDisplayName(toolName)}调用失败`,
          resultCount: 0,
        },
        contextText: '',
        references: [],
      }
    }
  }

  public getToolStartText(toolName: AgentToolName) {
    const map: Record<AgentToolName, string> = {
      getCurrentArticle: '正在读取当前文章',
      searchArticles: '正在检索站内文章',
      searchKnowledge: '正在检索知识库',
      searchGallery: '正在检索图库',
      getArchiveStats: '正在读取归档统计',
    }

    return map[toolName]
  }

  public getToolDisplayName(toolName: AgentToolName) {
    const map: Record<AgentToolName, string> = {
      getCurrentArticle: '当前文章',
      searchArticles: '站内文章',
      searchKnowledge: '知识库',
      searchGallery: '图库',
      getArchiveStats: '归档统计',
    }

    return map[toolName]
  }

  private _getToolRunner(toolName: AgentToolName): ToolRunner {
    const runners: Record<AgentToolName, ToolRunner> = {
      getCurrentArticle: this._getCurrentArticle.bind(this),
      searchArticles: this._searchArticles.bind(this),
      searchKnowledge: this._searchKnowledge.bind(this),
      searchGallery: this._searchGallery.bind(this),
      getArchiveStats: this._getArchiveStats.bind(this),
    }

    return runners[toolName]
  }

  private async _getCurrentArticle(context: ToolExecutionContext) {
    if (!context.sourceId) {
      return {
        contextText: '',
        displayText: '未找到当前文章',
        resultCount: 0,
      }
    }

    const article = context.currentArticle || await this._articleRepo.findOne({
      where: {
        id: context.sourceId,
        status: true,
      },
      relations: {
        tags: true,
        articleType: true,
      },
    })

    if (!article) {
      return {
        contextText: '',
        displayText: '未找到当前文章',
        resultCount: 0,
      }
    }

    const contextText = [
      '【工具结果：当前文章】',
      `标题：${article.name}`,
      article.articleType?.name ? `分类：${article.articleType.name}` : '',
      article.tags?.length ? `标签：${article.tags.map(tag => tag.name).join('、')}` : '',
      article.abstract ? `摘要：${article.abstract}` : '',
      `正文：${this._truncate(article.content || '', 1800)}`,
    ].filter(Boolean).join('\n')

    return {
      contextText,
      displayText: '已读取当前文章',
      resultCount: 1,
      references: [this._articleReference(article, 1)],
      output: {
        articleId: article.id,
        title: article.name,
      },
    }
  }

  private async _searchArticles(context: ToolExecutionContext) {
    const keyword = this._normalizeKeyword(context.userMessage, context.currentArticle?.name)
    const query = this._articleRepo
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.tags', 'tag')
      .leftJoinAndSelect('article.articleType', 'articleType')
      .where('article.status = :status', { status: true })
      .orderBy('article.updatedAt', 'DESC')
      .take(6)

    if (context.sourceId)
      query.andWhere('article.id != :sourceId', { sourceId: context.sourceId })

    if (keyword) {
      query.andWhere(
        '(article.name LIKE :keyword OR article.abstract LIKE :keyword OR article.content LIKE :keyword OR tag.name LIKE :keyword OR articleType.name LIKE :keyword)',
        { keyword: `%${keyword}%` },
      )
    }

    let articles = await query.getMany()

    if (!articles.length && keyword) {
      articles = await this._articleRepo
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.tags', 'tag')
        .leftJoinAndSelect('article.articleType', 'articleType')
        .where('article.status = :status', { status: true })
        .andWhere(context.sourceId ? 'article.id != :sourceId' : '1 = 1', { sourceId: context.sourceId })
        .orderBy('article.updatedAt', 'DESC')
        .take(6)
        .getMany()
    }
    const contextText = [
      '【工具结果：站内文章检索】',
      articles.length
        ? articles.map((article, index) => [
            `${index + 1}. ${article.name}`,
            article.articleType?.name ? `分类：${article.articleType.name}` : '',
            article.tags?.length ? `标签：${article.tags.map(tag => tag.name).join('、')}` : '',
            `链接：/archives/article?articleId=${article.id}`,
            `摘要：${this._truncate(article.abstract || article.content || '', 220)}`,
          ].filter(Boolean).join('\n')).join('\n\n')
        : '未找到匹配文章。',
    ].join('\n')

    return {
      contextText,
      displayText: `已找到 ${articles.length} 篇相关文章`,
      resultCount: articles.length,
      references: articles.map(article => this._articleReference(article)),
      output: {
        keyword,
        articleIds: articles.map(article => article.id),
      },
    }
  }

  private async _searchKnowledge(context: ToolExecutionContext) {
    const matches = await this._retrievalSrv.searchKnowledge(context.userMessage, {
      limit: 5,
      sourceTypes: ['article'],
      sourceId: context.sourceId,
    })

    return {
      contextText: this._retrievalSrv.buildKnowledgeContext(matches),
      displayText: `已命中 ${matches.length} 个知识片段`,
      resultCount: matches.length,
      references: this._retrievalSrv.buildReferences(matches),
      output: {
        chunkIds: matches.map(match => match.chunk.id),
      },
    }
  }

  private async _searchGallery(context: ToolExecutionContext) {
    const keyword = this._normalizeKeyword(context.userMessage)
    const query = this._galleryRepo
      .createQueryBuilder('gallery')
      .leftJoinAndSelect('gallery.galleryType', 'galleryType')
      .where('gallery.status = :status', { status: true })
      .orderBy('gallery.updatedAt', 'DESC')
      .take(6)

    if (keyword) {
      query.andWhere(
        '(gallery.name LIKE :keyword OR gallery.desc LIKE :keyword OR galleryType.name LIKE :keyword)',
        { keyword: `%${keyword}%` },
      )
    }

    let galleries = await query.getMany()

    if (!galleries.length && keyword) {
      galleries = await this._galleryRepo
        .createQueryBuilder('gallery')
        .leftJoinAndSelect('gallery.galleryType', 'galleryType')
        .where('gallery.status = :status', { status: true })
        .orderBy('gallery.updatedAt', 'DESC')
        .take(6)
        .getMany()
    }
    const contextText = [
      '【工具结果：图库检索】',
      galleries.length
        ? galleries.map((gallery, index) => [
            `${index + 1}. ${gallery.name}`,
            gallery.galleryType?.name ? `分类：${gallery.galleryType.name}` : '',
            `链接：/gallery/detail?galleryId=${gallery.id}`,
            gallery.desc ? `描述：${this._truncate(gallery.desc, 220)}` : '',
          ].filter(Boolean).join('\n')).join('\n\n')
        : '未找到匹配图库。',
    ].join('\n')

    return {
      contextText,
      displayText: `已找到 ${galleries.length} 个图库结果`,
      resultCount: galleries.length,
      references: galleries.map(gallery => this._galleryReference(gallery)),
      output: {
        keyword,
        galleryIds: galleries.map(gallery => gallery.id),
      },
    }
  }

  private async _getArchiveStats() {
    const [articleCount, galleryCount, totalAccess] = await Promise.all([
      this._articleRepo.count({ where: { status: true } }),
      this._galleryRepo.count({ where: { status: true } }),
      this._dailyCountRepo
        .createQueryBuilder('dailyCount')
        .select('COALESCE(SUM(dailyCount.access), 0)', 'count')
        .getRawOne<{ count: string }>(),
    ])

    const accessCount = Number(totalAccess?.count || 0)
    const contextText = [
      '【工具结果：归档统计】',
      `已发布文章数：${articleCount}`,
      `已发布图库数：${galleryCount}`,
      `累计访问数：${accessCount}`,
    ].join('\n')

    return {
      contextText,
      displayText: '已读取归档统计',
      resultCount: articleCount + galleryCount,
      output: {
        articleCount,
        galleryCount,
        accessCount,
      },
    }
  }

  private _buildToolInput(
    toolName: AgentToolName,
    context: Omit<ToolExecutionContext, 'conversationId' | 'toolCallId'>,
  ) {
    const base = {
      message: this._truncate(context.userMessage, 240),
    }

    if (toolName === 'getCurrentArticle') {
      return {
        ...base,
        articleId: context.sourceId,
      }
    }

    if (toolName === 'searchArticles' || toolName === 'searchGallery') {
      return {
        ...base,
        keyword: this._normalizeKeyword(context.userMessage, context.currentArticle?.name),
      }
    }

    return base
  }

  private _articleReference(article: Article, score?: number): IAgentReference {
    return {
      sourceType: 'article',
      sourceId: article.id,
      title: article.name,
      url: `/archives/article?articleId=${article.id}`,
      snippet: this._truncate(article.abstract || article.content || '', 140),
      score,
    }
  }

  private _galleryReference(gallery: Gallery): IAgentReference {
    return {
      sourceType: 'gallery',
      sourceId: gallery.id,
      title: gallery.name,
      url: `/gallery/detail?galleryId=${gallery.id}`,
      snippet: this._truncate(gallery.desc || gallery.galleryType?.name || '', 140),
    }
  }

  private _normalizeKeyword(message: string, fallback = '') {
    const cleaned = message
      .replace(/有没有|有哪些|推荐|相关|文章|教程|图库|图片|照片|相册|画廊|站内|继续阅读|学习路线|帮我|请|找|搜索|检索|吗|呢|的|和|或|，|。|？|\?/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (cleaned)
      return cleaned.slice(0, 40)

    return fallback.slice(0, 40)
  }

  private _truncate(text = '', maxLength: number) {
    const normalized = text.replace(/\s+/g, ' ').trim()

    if (normalized.length <= maxLength)
      return normalized

    return `${normalized.slice(0, maxLength)}...`
  }
}
