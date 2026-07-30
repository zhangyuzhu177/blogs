import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { Repository } from 'typeorm'
import type {
  AgentAction,
  AgentToolName,
  AgentSourceType,
  AgentStreamEvent,
  IAgentReference,
  IAgentToolResult,
} from 'types'
import { ConfigService } from '@nestjs/config'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import type { User } from 'src/entities/user'
import { Article } from 'src/entities/article'
import type { OpenAIConfig } from 'src/config/_openai.config'
import { AgentMessage } from 'src/entities/agent-message'
import { AgentConversation } from 'src/entities/agent-conversation'

import type { AgentChatStreamBodyDto } from './dto/chat-stream.body.dto'
import { RetrievalService } from './retrieval.service'
import { ToolRegistryService } from './tool-registry.service'

interface ArticleContext {
  article?: Article
  references: IAgentReference[]
  contextText: string
}

@Injectable()
export class AgentService {
  private readonly _logger = new Logger(AgentService.name)

  private readonly _openaiClient: OpenAI

  private readonly _chatModel: string

  constructor(
    private readonly _cfgSrv: ConfigService,
    @InjectRepository(Article)
    private readonly _articleRepo: Repository<Article>,
    @InjectRepository(AgentConversation)
    private readonly _conversationRepo: Repository<AgentConversation>,
    @InjectRepository(AgentMessage)
    private readonly _messageRepo: Repository<AgentMessage>,
    private readonly _retrievalSrv: RetrievalService,
    private readonly _toolRegistrySrv: ToolRegistryService,
  ) {
    const openaiConfig = this._cfgSrv.get<OpenAIConfig>('openai')

    this._chatModel = openaiConfig?.chatModel || 'deepseek-ai/DeepSeek-V3.1-Terminus'
    this._openaiClient = new OpenAI({
      apiKey: openaiConfig?.apiKey,
      baseURL: openaiConfig?.baseURL,
    })
  }

  /**
   * 流式问答主流程。
   * 这里使用 async generator，是为了把“业务事件”和“SSE 写入”解耦：
   * Service 只产出事件，Controller 负责把事件写到 HTTP 响应里。
   */
  public async *streamChat(
    body: AgentChatStreamBodyDto,
    user?: User,
  ): AsyncGenerator<AgentStreamEvent> {
    if (!body.visitorId)
      throw new BadRequestException('visitorId 不能为空')

    if (!body.message?.trim())
      throw new BadRequestException('问题不能为空')

    const startedAt = Date.now()
    const action = body.action || 'chat'
    const conversation = await this._getOrCreateConversation(body, user)
    const articleContext = await this._buildArticleContext(body, action, body.message)
    const toolEvents: IAgentToolResult[] = []

    yield {
      type: 'conversation',
      conversationId: conversation.id,
    }

    const toolNames = this._toolRegistrySrv.planTools({
      action,
      userMessage: body.message,
      sourceType: body.sourceType,
      sourceId: body.sourceId,
      currentArticle: articleContext.article,
    })

    for (const toolName of toolNames) {
      const toolCallId = this._createToolCallId(toolName)

      yield {
        type: 'tool_start',
        toolCallId,
        toolName,
        displayText: this._toolRegistrySrv.getToolStartText(toolName),
      }

      const result = await this._toolRegistrySrv.runTool(
        conversation.id,
        toolName,
        toolCallId,
        {
          userMessage: body.message,
          sourceId: body.sourceId,
          currentArticle: articleContext.article,
        },
      )

      if (result.contextText)
        articleContext.contextText = [articleContext.contextText, result.contextText].filter(Boolean).join('\n\n')

      this._appendReferences(articleContext.references, result.references)
      toolEvents.push(result.event)

      yield {
        type: 'tool_result',
        result: result.event,
      }
    }

    const messages = await this._buildMessages(conversation.id, body.message, articleContext, action)

    // 先构建模型上下文，再保存当前用户消息，避免历史记录里重复出现本轮问题。
    await this._messageRepo.save(this._messageRepo.create({
      conversationId: conversation.id,
      role: 'user',
      content: body.message,
      metadata: {
        action,
      },
    }))

    let answer = ''

    try {
      const stream = await this._openaiClient.chat.completions.create({
        model: this._chatModel,
        messages,
        stream: true,
        max_tokens: 1200,
        temperature: 0.6,
      })

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || ''
        if (!delta)
          continue

        answer += delta
        yield {
          type: 'delta',
          content: delta,
        }
      }

      if (articleContext.references.length) {
        yield {
          type: 'references',
          references: articleContext.references,
        }
      }

      await this._messageRepo.save(this._messageRepo.create({
        conversationId: conversation.id,
        role: 'assistant',
        content: answer || '暂时没有生成有效回答。',
        metadata: {
          action,
          model: this._chatModel,
          durationMs: Date.now() - startedAt,
          references: articleContext.references,
          toolEvents,
        },
      }))

      yield {
        type: 'done',
      }
    }
    catch (error) {
      this._logger.error('Agent stream failed', error)

      await this._messageRepo.save(this._messageRepo.create({
        conversationId: conversation.id,
        role: 'assistant',
        content: 'AI 助手暂时不可用，请稍后重试。',
        metadata: {
          action,
          model: this._chatModel,
          durationMs: Date.now() - startedAt,
        },
      }))

      yield {
        type: 'error',
        message: 'AI 助手暂时不可用，请稍后重试',
      }
    }
  }

  /**
   * 获取访客会话列表。
   * 仅按 visitorId 查询，避免匿名访客看到不属于自己的历史记录。
   */
  public async getConversations(
    visitorId: string,
    sourceType?: AgentSourceType,
    sourceId?: string,
  ) {
    if (!visitorId)
      return []

    return this._conversationRepo.find({
      where: {
        visitorId,
        status: 'active',
        ...(sourceType ? { sourceType } : {}),
        ...(sourceId ? { sourceId } : {}),
      },
      order: {
        updatedAt: 'DESC',
      },
      take: 20,
    })
  }

  /**
   * 获取会话消息。
   * 先校验会话归属，再返回消息，避免通过 conversationId 越权读取。
   */
  public async getMessages(conversationId: string, visitorId: string) {
    if (!conversationId || !visitorId)
      return []

    const conversation = await this._conversationRepo.findOne({
      where: {
        id: conversationId,
        visitorId,
      },
    })

    if (!conversation)
      return []

    return this._messageRepo.find({
      where: {
        conversationId,
      },
      order: {
        createdAt: 'ASC',
      },
    })
  }

  /**
   * 归档会话。
   * 归档后不会再被刷新恢复，但消息仍保留在数据库中，便于后续做后台审计或历史管理。
   */
  public async archiveConversation(conversationId: string, visitorId: string) {
    if (!conversationId || !visitorId)
      return

    await this._conversationRepo.update({
      id: conversationId,
      visitorId,
    }, {
      status: 'archived',
    })
  }

  /**
   * 手动重建单篇文章知识库索引。
   * 给后台或 Swagger 使用，文章发布/更新时也会自动触发同一套逻辑。
   */
  public indexArticleKnowledge(articleId: string) {
    return this._retrievalSrv.indexArticle(articleId)
  }

  /**
   * 手动重建所有已发布文章知识库索引。
   * 阶段二首次上线后建议执行一次，让历史文章可被 RAG 检索。
   */
  public indexAllArticleKnowledge() {
    return this._retrievalSrv.indexAllArticles()
  }

  private async _getOrCreateConversation(body: AgentChatStreamBodyDto, user?: User) {
    if (body.conversationId) {
      const existed = await this._conversationRepo.findOne({
        where: {
          id: body.conversationId,
          visitorId: body.visitorId,
        },
      })

      if (existed)
        return existed
    }

    const title = this._createConversationTitle(body.message)

    const conversation = this._conversationRepo.create({
      visitorId: body.visitorId,
      userId: user?.id,
      title,
      sourceType: body.sourceType || 'site',
      sourceId: body.sourceId,
      model: this._chatModel,
      status: 'active',
    })

    return this._conversationRepo.save(conversation)
  }

  private _createConversationTitle(message: string) {
    const normalized = message.replace(/\s+/g, ' ').trim()
    return normalized.length > 32 ? `${normalized.slice(0, 32)}...` : normalized
  }

  private _createToolCallId(toolName: AgentToolName) {
    return `${toolName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  }

  /**
   * 构建当前文章上下文和 RAG 检索上下文。
   * 阶段二开始，站内推荐不再直接拼接最近文章列表，而是走知识块索引检索。
   */
  private async _buildArticleContext(
    body: AgentChatStreamBodyDto,
    action: AgentAction,
    userMessage: string,
  ): Promise<ArticleContext> {
    const references: IAgentReference[] = []
    const contextParts: string[] = []
    let currentArticle: Article | undefined

    if (body.sourceType === 'article' && body.sourceId) {
      const article = await this._articleRepo.findOne({
        where: {
          id: body.sourceId,
          status: true,
        },
        relations: {
          tags: true,
          articleType: true,
        },
      })

      if (article) {
        currentArticle = article
        const articleText = [
          `标题：${article.name}`,
          article.abstract ? `摘要：${article.abstract}` : '',
          article.tags?.length ? `标签：${article.tags.map(tag => tag.name).join('、')}` : '',
          `正文：${this._truncate(article.content || '', 9000)}`,
        ].filter(Boolean).join('\n')

        contextParts.push(`【当前文章】\n${articleText}`)

        references.push({
          sourceType: 'article',
          sourceId: article.id,
          title: article.name,
          url: `/archives/article?articleId=${article.id}`,
          snippet: this._truncate(article.abstract || article.content || '', 120),
          score: 1,
        })
      }
    }

    await this._appendRetrievalContext({
      action,
      userMessage,
      currentArticle,
      references,
      contextParts,
    })

    return {
      article: currentArticle,
      references,
      contextText: contextParts.filter(Boolean).join('\n\n'),
    }
  }

  /**
   * 根据问题检索知识库，并把 top chunks 塞入模型上下文。
   * 检索失败不阻断主问答，避免索引表未初始化或模型服务异常时影响当前文章追问。
   */
  private async _appendRetrievalContext(options: {
    action: AgentAction
    userMessage: string
    currentArticle?: Article
    references: IAgentReference[]
    contextParts: string[]
  }) {
    const { action, userMessage, currentArticle, references, contextParts } = options
    const relatedQuestion = this._isRelatedQuestion(action, userMessage)
    const retrievalQuery = relatedQuestion && currentArticle
      ? [
          currentArticle.name,
          currentArticle.abstract,
          currentArticle.tags?.map(tag => tag.name).join(' '),
          userMessage,
        ].filter(Boolean).join('\n')
      : userMessage

    try {
      const matches = await this._retrievalSrv.searchKnowledge(retrievalQuery, {
        limit: relatedQuestion ? 6 : 4,
        sourceTypes: ['article'],
        sourceId: currentArticle && !relatedQuestion ? currentArticle.id : undefined,
        excludeSourceId: currentArticle && relatedQuestion ? currentArticle.id : undefined,
      })

      const knowledgeContext = this._retrievalSrv.buildKnowledgeContext(matches)
      if (knowledgeContext)
        contextParts.push(knowledgeContext)

      this._appendReferences(references, this._retrievalSrv.buildReferences(matches))
    }
    catch (error) {
      this._logger.warn(`知识库检索失败，已跳过 RAG 上下文：${(error as Error).message}`)
    }
  }

  private _isRelatedQuestion(action: AgentAction, message: string) {
    if (action === 'related' || action === 'learning-path')
      return true

    return /相关|推荐|继续阅读|学习路线|先看|还有哪些|站内/.test(message)
  }

  private _appendReferences(references: IAgentReference[], nextReferences: IAgentReference[]) {
    const existed = new Set(references.map(reference => `${reference.sourceType}:${reference.sourceId}`))

    for (const reference of nextReferences) {
      const key = `${reference.sourceType}:${reference.sourceId}`
      if (existed.has(key))
        continue

      references.push(reference)
      existed.add(key)
    }
  }

  private async _buildMessages(
    conversationId: string,
    userMessage: string,
    articleContext: ArticleContext,
    action: AgentAction,
  ): Promise<ChatCompletionMessageParam[]> {
    const history = await this._messageRepo.find({
      where: {
        conversationId,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 8,
    })

    const systemPrompt = [
      '你是 小张 该博客的中文阅读助手。',
      '你需要基于当前文章、站内知识库检索结果和用户问题回答。',
      '回答要求：',
      '1. 使用自然、简洁的中文；',
      '2. 不确定时直接说明不确定，不要编造不存在的文章、链接或数据；',
      '3. 如果用户要求总结，优先给出结构化要点；',
      '4. 如果用户要求找相关内容，只能基于提供的站内知识库检索结果推荐；',
      '5. 如果用户要求解释代码，先解释思路，再给出必要的注意点；',
      `当前快捷动作：${action}`,
      articleContext.contextText ? `\n${articleContext.contextText}` : '',
    ].filter(Boolean).join('\n')

    const normalizedHistory = history
      .reverse()
      .filter(message => message.role === 'user' || message.role === 'assistant')
      .map<ChatCompletionMessageParam>(message => ({
        role: message.role as 'user' | 'assistant',
        content: this._truncate(message.content, 1200),
      }))

    return [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...normalizedHistory,
      {
        role: 'user',
        content: userMessage,
      },
    ]
  }

  private _truncate(text: string, maxLength: number) {
    const normalized = text.replace(/\s+/g, ' ').trim()

    if (normalized.length <= maxLength)
      return normalized

    return `${normalized.slice(0, maxLength)}...`
  }
}
