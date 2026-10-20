import { z } from 'zod'
import { Repository } from 'typeorm'
import { tool } from 'langchain'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, Logger } from '@nestjs/common'

import type {
  AgentStreamEvent,
  AgentToolName,
  IAgentReference,
  IAgentToolResult,
} from 'types'
import { Article } from 'src/entities/article'
import { Gallery } from 'src/entities/gallery'
import { DailyCount } from 'src/entities/daily-count'
import { AgentToolLog } from 'src/entities/agent-tool-log'

import { RetrievalService } from './retrieval.service'

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
  input: Record<string, any>
  sourceId?: string
  currentArticle?: Article
}

interface CreateAgentToolsOptions {
  conversationId: string
  sourceId?: string
  currentArticle?: Article
  onEvent: (event: Extract<AgentStreamEvent, { type: 'tool_start' | 'tool_result' }>) => void
  onReferences: (references: IAgentReference[]) => void
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

  /** 注入文章、图库、访问统计、工具日志和知识库检索依赖。 */
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
   * 创建当前请求可用的 LangChain 工具。
   * 工具由模型决定是否调用，执行过程中通过回调向外抛出 SSE 事件。
   */
  public createTools(options: CreateAgentToolsOptions) {
    /** 执行指定工具，并在开始和结束时向外抛出 SSE 事件。 */
    const execute = async (
      toolName: AgentToolName,
      runtime: { toolCallId?: string; toolCall?: { id?: string } },
      input: Record<string, any> = {},
    ) => {
      const toolCallId = runtime?.toolCallId || runtime?.toolCall?.id || `${toolName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

      options.onEvent({
        type: 'tool_start',
        toolCallId,
        toolName,
        displayText: this.getToolStartText(toolName),
      })

      const result = await this.runTool(
        options.conversationId,
        toolName,
        toolCallId,
        input,
        {
          sourceId: options.sourceId,
          currentArticle: options.currentArticle,
        },
      )

      options.onReferences(result.references)
      options.onEvent({
        type: 'tool_result',
        result: result.event,
      })

      return result.contextText || result.event.displayText
    }

    return [
      /**
       * 读取当前文章。
       * 用户要总结本文、解释代码或追问文章细节时使用；不传文章 Id 则读取当前页面文章。
       */
      tool(
        (input, runtime) => execute('getCurrentArticle', runtime, input),
        {
          name: 'getCurrentArticle',
          description: '读取当前页面文章或指定文章的标题、分类、标签、摘要和正文。用户询问当前文章、总结、解释代码或文章细节时使用。',
          schema: z.object({
            articleId: z.string().nullish().describe('文章 Id。不传则读取当前页面文章'),
          }),
        },
      ),
      /**
       * 按关键词检索站内文章。
       * 用户要相关文章、教程、学习路线或站内推荐时使用，只返回已发布文章。
       */
      tool(
        (input, runtime) => execute('searchArticles', runtime, input),
        {
          name: 'searchArticles',
          description: '按关键词检索已发布的站内文章，返回标题、分类、标签、链接和摘要。用户要相关文章、教程、学习路线或站内推荐时使用。',
          schema: z.object({
            keyword: z.string().describe('检索关键词，尽量短，使用主题词而不是完整问句'),
          }),
        },
      ),
      /**
       * 检索博客知识库。
       * 按语义查找文章片段，用于依据站内资料回答，或在推荐时排除当前文章。
       */
      tool(
        (input, runtime) => execute('searchKnowledge', runtime, input),
        {
          name: 'searchKnowledge',
          description: '在博客知识库中检索与问题相关的文章片段。需要依据站内资料回答、补充背景或查找相关内容时使用。',
          schema: z.object({
            query: z.string().describe('用于检索的问题或主题'),
            onlyCurrentArticle: z.boolean().nullish().describe('为 true 时只检索当前文章'),
            excludeCurrentArticle: z.boolean().nullish().describe('推荐其他文章时设为 true，排除当前文章'),
          }),
        },
      ),
      /**
       * 按关键词检索图库。
       * 用户询问图片、照片、相册或图库时使用，只返回已发布图库。
       */
      tool(
        (input, runtime) => execute('searchGallery', runtime, input),
        {
          name: 'searchGallery',
          description: '按关键词检索已发布图库，返回名称、分类、链接和描述。用户询问图片、照片、相册或图库时使用。',
          schema: z.object({
            keyword: z.string().describe('图库检索关键词'),
          }),
        },
      ),
      /**
       * 读取站点归档统计。
       * 用户询问文章数、图库数、访问量或站点概览时使用。
       */
      tool(
        (_input, runtime) => execute('getArchiveStats', runtime, {}),
        {
          name: 'getArchiveStats',
          description: '读取博客归档统计，包括已发布文章数、图库数和累计访问数。用户询问数量、访问量或站点概览时使用。',
          schema: z.object({}),
        },
      ),
    ]
  }

  /** 执行工具查询，写入调用日志；失败时返回错误说明，不中断本轮对话。 */
  public async runTool(
    conversationId: string,
    toolName: AgentToolName,
    toolCallId: string,
    input: Record<string, any>,
    context: Pick<ToolExecutionContext, 'sourceId' | 'currentArticle'>,
  ): Promise<AgentToolRunResult> {
    const startedAt = Date.now()
    const safeInput = this._sanitizeInput(input)

    try {
      const runner = this._getToolRunner(toolName)
      const result = await runner({
        ...context,
        conversationId,
        toolCallId,
        input: input || {},
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
        input: safeInput,
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
        input: safeInput,
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
        contextText: `${this.getToolDisplayName(toolName)}调用失败：${message}`,
        references: [],
      }
    }
  }

  /** 返回工具开始执行时展示给前端的文案。 */
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

  /** 返回工具的中文名称，用于失败提示。 */
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

  /** 按工具名找到对应的查询实现。 */
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

  /** 读取当前或指定文章，把标题、分类、标签、摘要和正文交给模型。 */
  private async _getCurrentArticle(context: ToolExecutionContext) {
    const articleId = context.input.articleId || context.sourceId

    if (!articleId) {
      return {
        contextText: '未找到当前文章。',
        displayText: '未找到当前文章',
        resultCount: 0,
      }
    }

    const article = articleId === context.currentArticle?.id
      ? context.currentArticle
      : await this._articleRepo.findOne({
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
      return {
        contextText: '未找到当前文章。',
        displayText: '未找到当前文章',
        resultCount: 0,
      }
    }

    const contextText = [
      '【工具结果：当前文章】',
      `标题：${article.name}`,
      `链接：/archives/article?articleId=${article.id}`,
      article.articleType?.name ? `分类：${article.articleType.name}` : '',
      article.tags?.length ? `标签：${article.tags.map(tag => tag.name).join('、')}` : '',
      article.abstract ? `摘要：${article.abstract}` : '',
      `正文：${this._truncate(article.content || '', 6000)}`,
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

  /** 按关键词搜索已发布文章；没有命中时回退到最近更新，并标明不是精确匹配。 */
  private async _searchArticles(context: ToolExecutionContext) {
    const keyword = this._keyword(context.input.keyword)
    const articles = await this._queryArticles(keyword, context.sourceId)
    const usedFallback = Boolean(keyword) && articles.fallback
    const contextText = [
      '【工具结果：站内文章检索】',
      usedFallback ? '关键词未命中，以下为最近更新的文章，不要把它们说成精确匹配。' : '',
      articles.items.length
        ? articles.items.map((article, index) => [
          `${index + 1}. ${article.name}`,
          article.articleType?.name ? `分类：${article.articleType.name}` : '',
          article.tags?.length ? `标签：${article.tags.map(tag => tag.name).join('、')}` : '',
          `链接：/archives/article?articleId=${article.id}`,
          `摘要：${this._truncate(article.abstract || article.content || '', 220)}`,
        ].filter(Boolean).join('\n')).join('\n\n')
        : '未找到匹配文章。',
    ].filter(Boolean).join('\n')

    return {
      contextText,
      displayText: `已找到 ${articles.items.length} 篇相关文章`,
      resultCount: articles.items.length,
      references: articles.items.map(article => this._articleReference(article)),
      output: {
        keyword,
        fallback: usedFallback,
        articleIds: articles.items.map(article => article.id),
      },
    }
  }

  /** 查询已发布文章，并排除当前文章；关键词没有命中时返回最近更新。 */
  private async _queryArticles(keyword: string, sourceId?: string) {
    /** 组装文章查询；useKeyword 为 true 时按标题、摘要、正文、标签和分类匹配。 */
    const buildQuery = (useKeyword: boolean) => {
      const query = this._articleRepo
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.tags', 'tag')
        .leftJoinAndSelect('article.articleType', 'articleType')
        .where('article.status = :status', { status: true })
        .orderBy('article.updatedAt', 'DESC')
        .take(6)

      if (sourceId)
        query.andWhere('article.id != :sourceId', { sourceId })

      if (useKeyword && keyword) {
        query.andWhere(
          '(article.name LIKE :keyword OR article.abstract LIKE :keyword OR article.content LIKE :keyword OR tag.name LIKE :keyword OR articleType.name LIKE :keyword)',
          { keyword: `%${keyword}%` },
        )
      }

      return query
    }

    const matched = await buildQuery(true).getMany()
    if (matched.length || !keyword)
      return { items: matched, fallback: false }

    return {
      items: await buildQuery(false).getMany(),
      fallback: true,
    }
  }

  /** 在文章知识库中检索相关片段，可限定当前文章或排除当前文章。 */
  private async _searchKnowledge(context: ToolExecutionContext) {
    const query = this._keyword(context.input.query, 200)

    if (!query) {
      return {
        contextText: '【工具结果：知识库检索】\n未提供检索问题。',
        displayText: '未检索知识库',
        resultCount: 0,
      }
    }

    const onlyCurrentArticle = Boolean(context.input.onlyCurrentArticle)
    const excludeCurrentArticle = Boolean(context.input.excludeCurrentArticle) && !onlyCurrentArticle
    const matches = await this._retrievalSrv.searchKnowledge(query, {
      limit: 5,
      sourceTypes: ['article'],
      sourceId: onlyCurrentArticle ? context.sourceId : undefined,
      excludeSourceId: excludeCurrentArticle ? context.sourceId : undefined,
    })

    return {
      contextText: this._retrievalSrv.buildKnowledgeContext(matches) || '【工具结果：知识库检索】\n未命中相关知识片段。',
      displayText: `已命中 ${matches.length} 个知识片段`,
      resultCount: matches.length,
      references: this._retrievalSrv.buildReferences(matches),
      output: {
        query,
        chunkIds: matches.map(match => match.chunk.id),
      },
    }
  }

  /** 按关键词搜索已发布图库；没有命中时回退到最近更新，并标明不是精确匹配。 */
  private async _searchGallery(context: ToolExecutionContext) {
    const keyword = this._keyword(context.input.keyword)
    const galleries = await this._queryGalleries(keyword)
    const usedFallback = Boolean(keyword) && galleries.fallback
    const contextText = [
      '【工具结果：图库检索】',
      usedFallback ? '关键词未命中，以下为最近更新的图库，不要把它们说成精确匹配。' : '',
      galleries.items.length
        ? galleries.items.map((gallery, index) => [
          `${index + 1}. ${gallery.name}`,
          gallery.galleryType?.name ? `分类：${gallery.galleryType.name}` : '',
          `链接：/gallery/detail?galleryId=${gallery.id}`,
          gallery.desc ? `描述：${this._truncate(gallery.desc, 220)}` : '',
        ].filter(Boolean).join('\n')).join('\n\n')
        : '未找到匹配图库。',
    ].filter(Boolean).join('\n')

    return {
      contextText,
      displayText: `已找到 ${galleries.items.length} 个图库结果`,
      resultCount: galleries.items.length,
      references: galleries.items.map(gallery => this._galleryReference(gallery)),
      output: {
        keyword,
        fallback: usedFallback,
        galleryIds: galleries.items.map(gallery => gallery.id),
      },
    }
  }

  /** 查询已发布图库；关键词没有命中时返回最近更新。 */
  private async _queryGalleries(keyword: string) {
    /** 组装图库查询；useKeyword 为 true 时按名称、描述和分类匹配。 */
    const buildQuery = (useKeyword: boolean) => {
      const query = this._galleryRepo
        .createQueryBuilder('gallery')
        .leftJoinAndSelect('gallery.galleryType', 'galleryType')
        .where('gallery.status = :status', { status: true })
        .orderBy('gallery.updatedAt', 'DESC')
        .take(6)

      if (useKeyword && keyword) {
        query.andWhere(
          '(gallery.name LIKE :keyword OR gallery.desc LIKE :keyword OR galleryType.name LIKE :keyword)',
          { keyword: `%${keyword}%` },
        )
      }

      return query
    }

    const matched = await buildQuery(true).getMany()
    if (matched.length || !keyword)
      return { items: matched, fallback: false }

    return {
      items: await buildQuery(false).getMany(),
      fallback: true,
    }
  }

  /** 统计已发布文章数、图库数和累计访问数。 */
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

  /** 把文章整理成前端可展示的引用来源。 */
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

  /** 把图库整理成前端可展示的引用来源。 */
  private _galleryReference(gallery: Gallery): IAgentReference {
    return {
      sourceType: 'gallery',
      sourceId: gallery.id,
      title: gallery.name,
      url: `/gallery/detail?galleryId=${gallery.id}`,
      snippet: this._truncate(gallery.desc || gallery.galleryType?.name || '', 140),
    }
  }

  /** 截断工具入参，避免过长文本写入调用日志。 */
  private _sanitizeInput(input: Record<string, any> = {}) {
    return Object.fromEntries(Object.entries(input).map(([key, value]) => {
      if (typeof value === 'string')
        return [key, this._truncate(value, 240)]

      return [key, value]
    }))
  }

  /** 整理检索词，去掉多余空白并限制长度。 */
  private _keyword(value: unknown, maxLength = 40) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength)
  }

  /** 压缩空白并截断文本，超长时在末尾补省略号。 */
  private _truncate(text = '', maxLength: number) {
    const normalized = text.replace(/\s+/g, ' ').trim()

    if (normalized.length <= maxLength)
      return normalized

    return `${normalized.slice(0, maxLength)}...`
  }
}
