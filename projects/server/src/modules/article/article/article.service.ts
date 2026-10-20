import { ChatOpenAI } from '@langchain/openai'
import { In } from 'typeorm'
import { ErrorCode } from 'types'
import { objectOmit } from 'utils'
import { ConfigService } from '@nestjs/config'
import { Injectable, Logger } from '@nestjs/common'

import type { User } from 'src/entities/user'
import type { OpenAIConfig } from 'src/config/_openai.config'
import type { ChangeStatusBodyDto } from 'src/dto/common'
import { parseSqlError, responseError } from 'src/utils'
import { RetrievalService } from 'src/modules/agent/retrieval.service'

import { ArticleService } from '../article.service'
import type { UpsertArticleBodyDto } from './dto/upsert-body.dto'

@Injectable()
export class ArticleEntitiesService {
  private readonly _logger = new Logger(ArticleEntitiesService.name)

  private readonly _model: ChatOpenAI

  constructor(
    private readonly _cfgSrv: ConfigService,
    private readonly _articleSrv: ArticleService,
    private readonly _retrievalSrv: RetrievalService,
  ) {
    const openaiConfig = this._cfgSrv.get<OpenAIConfig>('openai')

    this._model = new ChatOpenAI({
      model: openaiConfig?.chatModel || 'deepseek-ai/DeepSeek-V3.1-Terminus',
      apiKey: openaiConfig?.apiKey,
      temperature: 0.7,
      maxTokens: 200,
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
  }

  /**
   * 获取分类,标签,文章数量
   */
  public async getArticleAndTypeAndTagCount() {
    const [articleCount, typeCount, tagCount] = await Promise.all([
      this._articleSrv.entitiesRepo().count(),
      this._articleSrv.articleTypeRepo().count(),
      this._articleSrv.articleTagRepo().count(),
    ])

    const data = [
      {
        name: '文章',
        count: articleCount,
      },
      {
        name: '分类',
        count: typeCount,
      },
      {
        name: '标签',
        count: tagCount,
      },
    ]

    return data
  }

  /**
   * 获取文章详情
   */
  public async getArticleDetail(id: string, user: User, ip: string) {
    const article = await this._articleSrv.entitiesRepo().findOne({
      where: { id },
      relations: {
        tags: true,
      },
      select: {
        tags: {
          id: true,
          name: true,
        },
      },
    })

    if (!article)
      responseError(ErrorCode.ARTICLE_NOT_EXISTS)

    this._logger.verbose(ip)
    await this._articleSrv.entitiesRepo().increment({ id }, 'pageView', 1)

    return article
  }

  /**
   * 发布文章
   */
  public async createArticle(body: UpsertArticleBodyDto) {
    const { tagIds } = body
    const tags = await this._articleSrv.articleTagRepo().findBy({ id: In(tagIds) })
    if (tags.length !== tagIds.length)
      responseError(ErrorCode.ARTICLE_TAG_NOT_EXISTS)

    try {
      const data = this._articleSrv.entitiesRepo().create({
        ...objectOmit(body, 'tagIds'),
        tags,
      })

      const insertRes = await this._articleSrv.entitiesRepo().save(data)

      await this._syncArticleIndex(insertRes.id, insertRes.status)

      return insertRes.id
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.ARTICLE_TYPE_NOT_EXISTS)
      throw e
    }
  }

  /**
   * 编辑文章
   */
  public async updateArticle(body: UpsertArticleBodyDto, id: string) {
    const { tagIds } = body
    const tags = await this._articleSrv.articleTagRepo().findBy({ id: In(tagIds) })
    if (tags.length !== tagIds.length)
      responseError(ErrorCode.ARTICLE_TAG_NOT_EXISTS)

    const article = await this._articleSrv.entitiesRepo().findOne({
      where: { id },
      relations: {
        tags: true,
      },
    })

    if (!article)
      responseError(ErrorCode.ARTICLE_NOT_EXISTS)

    try {
      Object.assign(article, {
        ...objectOmit(body, 'tagIds'),
        tags,
      })

      await this._articleSrv.entitiesRepo().save(article)
      await this._syncArticleIndex(id, article.status)

      return id
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.ARTICLE_TYPE_NOT_EXISTS)
      throw e
    }
  }

  /**
   * 批量修改文章状态
   */
  public async changeArticleStatus(body: ChangeStatusBodyDto) {
    const { ids, status } = body

    if (
      ids.length === 1
      && !(await this._articleSrv.entitiesRepo().existsBy({ id: ids[0] }))
    )
      responseError(ErrorCode.ARTICLE_NOT_EXISTS)

    const updateRes = await this._articleSrv.entitiesRepo().update(
      { id: In(ids) },
      { status },
    )

    await Promise.all(ids.map(id => this._syncArticleIndex(id, status)))

    return updateRes.affected
  }

  /**
   * 删除文章
   */
  public async deleteArticle(id: string) {
    if (!(await this._articleSrv.entitiesRepo().existsBy({ id })))
      responseError(ErrorCode.ARTICLE_NOT_EXISTS)

    const deleteRes = await this._articleSrv.entitiesRepo().delete({ id })
    await this._syncArticleIndex(id, false)

    return deleteRes.affected
  }

  /**
   * 同步文章 RAG 索引。
   * 索引属于增强能力，失败时只记录日志，不阻断文章发布、编辑或删除主流程。
   */
  private async _syncArticleIndex(articleId: string, enabled: boolean) {
    try {
      if (enabled)
        await this._retrievalSrv.indexArticle(articleId)
      else
        await this._retrievalSrv.removeArticleIndex(articleId)
    }
    catch (error) {
      this._logger.warn(`同步文章 RAG 索引失败：${articleId}，${(error as Error).message}`)
    }
  }

  /**
   * AI自动生成摘要
   */
  public async aiGenerateAbstract(content: string) {
    const prompt = `
        你是一名专业的中文编辑。请为以下文章生成一段简洁、连贯的中文摘要，要求：
        1. 摘要长度控制在 80 到 100 字之间；
        2. 语言流畅、通顺；
        3. 不要出现“本文”“文章”“教程”这样的措辞；
        4. 仅返回摘要内容，不要解释或附加说明。

        文章内容如下：
        ${content}
      `

    try {
      const stream = await this._model.stream(prompt)
      return this._readAbstractStream(stream)
    }
    catch (error) {
      responseError(ErrorCode.ARTICLE_ABSTRACT_GENERATE_FAILED)
    }
  }

  /**
   * 把 LangChain 消息块转成纯文本增量，保持摘要接口的 SSE 内容格式不变。
   */
  private async *_readAbstractStream(stream: AsyncIterable<{ content: unknown }>) {
    for await (const chunk of stream) {
      const delta = this._extractText(chunk.content)
      if (delta)
        yield delta
    }
  }

  private _extractText(content: unknown) {
    if (typeof content === 'string')
      return content

    if (!Array.isArray(content))
      return ''

    return content.map((block) => {
      if (typeof block === 'string')
        return block

      if (!block || typeof block !== 'object' || !('text' in block))
        return ''

      const typedBlock = block as { type?: string, text?: unknown }
      if (typedBlock.type && typedBlock.type !== 'text')
        return ''

      return String(typedBlock.text || '')
    }).join('')
  }
}
