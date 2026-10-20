import { AIMessage, type BaseMessage, HumanMessage } from '@langchain/core/messages'
import { ChatOpenAI } from '@langchain/openai'
import { createAgent, toolCallLimitMiddleware } from 'langchain'
import { Repository } from 'typeorm'
import type {
  AgentAction,
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

interface LangChainStreamEvent {
  event: string
  metadata?: {
    langgraph_node?: string
  }
  data?: {
    chunk?: {
      content?: unknown
      text?: unknown
      tool_call_chunks?: unknown[]
    }
    output?: {
      content?: unknown
      text?: unknown
      tool_calls?: unknown[]
    }
  }
}

const ACTION_HINTS: Record<AgentAction, string> = {
  'chat': '',
  'summarize': '请先读取当前文章，再用结构化要点总结。',
  'related': '请检索站内文章和知识库，只根据工具结果推荐可继续阅读的内容，并保留链接。',
  'explain-code': '请先读取当前文章，再解释其中的代码或实现思路。',
  'learning-path': '请结合当前文章检索站内内容，给出循序渐进的学习路线和链接。',
}

@Injectable()
export class AgentService {
  private readonly _logger = new Logger(AgentService.name)

  private readonly _model: ChatOpenAI

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
    this._model = new ChatOpenAI({
      model: this._chatModel,
      apiKey: openaiConfig?.apiKey,
      temperature: 0.6,
      maxTokens: 1200,
      streaming: true,
      streamUsage: false,
      useResponsesApi: false,
      maxRetries: 1,
      timeout: 120000,
      configuration: {
        apiKey: openaiConfig?.apiKey,
        baseURL: openaiConfig?.baseURL,
      },
    })
    this._model.supportsStrictToolCalling = false
  }

  /**
   * 流式问答主流程。
   * LangChain agent 负责决定调用哪些只读工具，Service 把工具状态和模型增量转换成 SSE 事件。
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
    const currentArticle = await this._loadCurrentArticle(body)
    const history = await this._loadHistoryMessages(conversation.id)

    yield {
      type: 'conversation',
      conversationId: conversation.id,
    }

    await this._messageRepo.save(this._messageRepo.create({
      conversationId: conversation.id,
      role: 'user',
      content: body.message,
      metadata: {
        action,
      },
    }))

    const queue = new AsyncEventQueue<AgentStreamEvent>()
    const run = this._runAgent({
      queue,
      body,
      action,
      conversation,
      currentArticle,
      history,
      startedAt,
    })

    try {
      for await (const event of queue)
        yield event
    }
    finally {
      await run
    }
  }

  /**
   * 获取访客会话列表。
   * 仅按 visitorId 查询，避免匿名访客看到不属于自己的历史记录。
   */
  public async getConversations(
    visitorId: string,
    sourceType?: AgentChatStreamBodyDto['sourceType'],
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

  /**
   * 执行 LangChain Agent。
   * 把模型增量、引用来源和结束状态写入事件队列，供流式接口向外推送。
   */
  private async _runAgent(options: {
    queue: AsyncEventQueue<AgentStreamEvent>
    body: AgentChatStreamBodyDto
    action: AgentAction
    conversation: AgentConversation
    currentArticle?: Article
    history: BaseMessage[]
    startedAt: number
  }) {
    const { queue, body, action, conversation, currentArticle, history, startedAt } = options
    const references: IAgentReference[] = []
    const toolEvents: IAgentToolResult[] = []
    let answer = ''

    if (currentArticle)
      references.push(this._currentArticleReference(currentArticle))

    try {
      const tools = this._toolRegistrySrv.createTools({
        conversationId: conversation.id,
        sourceId: body.sourceId,
        currentArticle,
        onEvent: (event) => {
          if (event.type === 'tool_result')
            toolEvents.push(event.result)

          queue.push(event)
        },
        onReferences: nextReferences => this._appendReferences(references, nextReferences),
      })
      const agent = createAgent({
        model: this._model,
        tools,
        systemPrompt: this._buildSystemPrompt(action, body, currentArticle),
        middleware: [
          toolCallLimitMiddleware({
            runLimit: 5,
            exitBehavior: 'continue',
          }),
        ],
      })
      const eventStream = await agent.streamEvents(
        {
          messages: [
            ...history,
            new HumanMessage(this._composeUserMessage(body.message, action)),
          ],
        },
        {
          version: 'v2',
          recursionLimit: 12,
        },
      )

      for await (const event of eventStream as AsyncIterable<LangChainStreamEvent>) {
        if (event.event !== 'on_chat_model_stream' && event.event !== 'on_chat_model_end')
          continue

        const node = event.metadata?.langgraph_node
        if (node && node !== 'model_request')
          continue

        const delta = event.event === 'on_chat_model_stream'
          ? this._extractChunkText(event.data?.chunk)
          : (!answer && !event.data?.output?.tool_calls?.length
              ? this._extractChunkText(event.data?.output)
              : '')
        if (!delta)
          continue

        answer += delta
        queue.push({
          type: 'delta',
          content: delta,
        })
      }

      if (!answer) {
        answer = '暂时没有生成有效回答。'
        queue.push({
          type: 'delta',
          content: answer,
        })
      }

      await this._saveAssistantMessage({
        conversationId: conversation.id,
        content: answer,
        action,
        startedAt,
        references,
        toolEvents,
      })

      if (references.length) {
        queue.push({
          type: 'references',
          references,
        })
      }

      queue.push({
        type: 'done',
      })
    }
    catch (error) {
      this._logger.error('Agent stream failed', error)

      const content = answer || 'AI 助手暂时不可用，请稍后重试。'
      try {
        await this._saveAssistantMessage({
          conversationId: conversation.id,
          content,
          action,
          startedAt,
          references,
          toolEvents,
        })
      }
      catch (saveError) {
        this._logger.error('保存 Agent 回答失败', saveError)
      }

      if (answer) {
        if (references.length) {
          queue.push({
            type: 'references',
            references,
          })
        }

        queue.push({
          type: 'done',
        })
        return
      }

      queue.push({
        type: 'error',
        message: 'AI 助手暂时不可用，请稍后重试',
      })
    }
    finally {
      queue.close()
    }
  }

  /**
   * 保存助手回答。
   * 同时记录模型、耗时、引用来源和工具调用结果。
   */
  private async _saveAssistantMessage(options: {
    conversationId: string
    content: string
    action: AgentAction
    startedAt: number
    references: IAgentReference[]
    toolEvents: IAgentToolResult[]
  }) {
    const { conversationId, content, action, startedAt, references, toolEvents } = options

    await this._messageRepo.save(this._messageRepo.create({
      conversationId,
      role: 'assistant',
      content,
      metadata: {
        action,
        model: this._chatModel,
        durationMs: Date.now() - startedAt,
        references,
        toolEvents,
      },
    }))
  }

  /**
   * 获取或创建会话。
   * 会话 Id 属于当前访客时复用，否则用首条问题创建新会话。
   */
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

  /**
   * 用用户首条问题生成会话标题，过长时截断。
   */
  private _createConversationTitle(message: string) {
    const normalized = message.replace(/\s+/g, ' ').trim()
    return normalized.length > 32 ? `${normalized.slice(0, 32)}...` : normalized
  }

  /**
   * 加载当前文章。
   * 仅当前页面是已发布文章时返回，供 Agent 总结和解释使用。
   */
  private async _loadCurrentArticle(body: AgentChatStreamBodyDto) {
    if (body.sourceType !== 'article' || !body.sourceId)
      return

    return this._articleRepo.findOne({
      where: {
        id: body.sourceId,
        status: true,
      },
      relations: {
        tags: true,
        articleType: true,
      },
    })
  }

  /**
   * 读取最近对话并转换成 LangChain 消息，作为多轮上下文。
   */
  private async _loadHistoryMessages(conversationId: string) {
    const history = await this._messageRepo.find({
      where: {
        conversationId,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 8,
    })

    return history
      .reverse()
      .filter(message => message.role === 'user' || message.role === 'assistant')
      .map((message) => {
        const content = this._truncate(message.content, 1200)
        return message.role === 'assistant'
          ? new AIMessage(content)
          : new HumanMessage(content)
      })
  }

  /**
   * 组装系统提示词。
   * 约束助手使用中文，并在需要站内内容时先调用工具。
   */
  private _buildSystemPrompt(
    action: AgentAction,
    body: AgentChatStreamBodyDto,
    article?: Article,
  ) {
    return [
      '你是此博客网站的中文阅读助手，你的名字叫小张。',
      '你可以调用工具读取当前文章、检索站内文章、检索知识库、检索图库和读取归档统计。',
      '回答要求：',
      '1. 使用自然、简洁的中文；',
      '2. 不确定时直接说明不确定，不要编造不存在的文章、链接或数据；',
      '3. 需要文章内容、统计、图库或站内推荐时，必须先调用工具，只根据工具结果回答；',
      '4. 总结或解释当前文章时，先调用 getCurrentArticle；',
      '5. 推荐相关内容或学习路线时，调用 searchArticles 和 searchKnowledge，并保留工具返回的链接；',
      `当前快捷动作：${action}`,
      body.sourceType ? `当前页面类型：${body.sourceType}` : '',
      body.sourceId ? `当前页面 Id：${body.sourceId}` : '',
      article?.name ? `当前文章标题：${article.name}` : '',
    ].filter(Boolean).join('\n')
  }

  /**
   * 把快捷动作的提示拼到用户问题前面。
   */
  private _composeUserMessage(message: string, action: AgentAction) {
    const hint = ACTION_HINTS[action]
    if (!hint)
      return message

    return `${hint}\n${message}`
  }

  /**
   * 把当前文章转换成前端可展示的引用来源。
   */
  private _currentArticleReference(article: Article): IAgentReference {
    return {
      sourceType: 'article',
      sourceId: article.id,
      title: article.name,
      url: `/archives/article?articleId=${article.id}`,
      snippet: this._truncate(article.abstract || article.content || '', 120),
      score: 1,
    }
  }

  /**
   * 合并工具返回的引用，并按来源去重。
   */
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

  /**
   * 从模型流式块中提取可展示文本，忽略工具调用片段。
   */
  private _extractChunkText(chunk?: LangChainStreamEvent['data']['chunk']) {
    if (!chunk?.tool_call_chunks?.length && typeof chunk?.text === 'string' && chunk.text)
      return chunk.text

    if (chunk?.tool_call_chunks?.length)
      return ''

    return this._extractText(chunk?.content)
  }

  /**
   * 把字符串或内容块数组提取成纯文本。
   */
  private _extractText(content: unknown): string {
    if (typeof content === 'string')
      return content

    if (!Array.isArray(content))
      return ''

    return content.map((block) => {
      if (typeof block === 'string')
        return block

      if (!block || typeof block !== 'object' || !('text' in block))
        return ''

      const typedBlock = block as { type?: string; text?: unknown }
      if (typedBlock.type && typedBlock.type !== 'text')
        return ''

      return String(typedBlock.text || '')
    }).join('')
  }

  /**
   * 压缩空白并截断过长文本。
   */
  private _truncate(text: string, maxLength: number) {
    const normalized = text.replace(/\s+/g, ' ').trim()

    if (normalized.length <= maxLength)
      return normalized

    return `${normalized.slice(0, maxLength)}...`
  }
}

class AsyncEventQueue<T> implements AsyncIterable<T> {
  private readonly _items: T[] = []

  private readonly _waiters: Array<(result: IteratorResult<T>) => void> = []

  private _closed = false

  /**
   * 写入一条事件。
   * 已有等待中的消费者时直接交给它，否则先放入队列。
   */
  public push(item: T) {
    if (this._closed)
      return

    const waiter = this._waiters.shift()
    if (waiter) {
      waiter({ value: item, done: false })
      return
    }

    this._items.push(item)
  }

  /**
   * 关闭队列，并唤醒所有等待中的消费者。
   */
  public close() {
    if (this._closed)
      return

    this._closed = true
    while (this._waiters.length) {
      const waiter = this._waiters.shift()
      waiter?.({ value: undefined as T, done: true })
    }
  }

  /**
   * 按写入顺序消费事件。
   * 队列为空时等待新事件，关闭后结束迭代。
   */
  public [Symbol.asyncIterator](): AsyncIterator<T> {
    return {
      next: () => {
        const item = this._items.shift()
        if (item !== undefined)
          return Promise.resolve({ value: item, done: false as const })

        if (this._closed)
          return Promise.resolve({ value: undefined as T, done: true as const })

        return new Promise<IteratorResult<T>>(resolve => this._waiters.push(resolve))
      },
    }
  }
}
