import type { FastifyReply } from 'fastify'
import { PermissionType } from 'types'
import { Body, Controller, Get, Param, Patch, Post, Query, Req, Res } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import type { AgentSourceType } from 'types'
import { HasPermission } from 'src/guards/permission.guard'

import { AgentService } from './agent.service'
import { AgentChatStreamBodyDto } from './dto/chat-stream.body.dto'

@Controller('agent')
@ApiTags('Agent | 博客智能助手')
export class AgentController {
  constructor(
    private readonly _agentSrv: AgentService,
  ) {}

  @ApiOperation({
    summary: 'Agent 流式问答',
  })
  @Post('chat/stream')
  public async streamChat(
    @Req() req: FastifyRequest,
    @Body() body: AgentChatStreamBodyDto,
    @Res() reply: FastifyReply,
  ) {
    reply.hijack()
    const res = reply.raw

    // SSE 必须关闭缓存和代理缓冲，浏览器才能边接收边渲染。
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    })
    res.flushHeaders?.()

    try {
      for await (const event of this._agentSrv.streamChat(body, req.raw.user)) {
        res.write(`data: ${JSON.stringify(event)}\n\n`)
        res.flushHeaders?.()
      }
    }
    catch (error) {
      res.write(`data: ${JSON.stringify({
        type: 'error',
        message: 'AI 助手暂时不可用，请稍后重试',
      })}\n\n`)
    }
    finally {
      res.end()
    }
  }

  @ApiOperation({
    summary: '获取访客的 Agent 会话列表',
  })
  @Get('conversations')
  public getConversations(
    @Query('visitorId') visitorId: string,
    @Query('sourceType') sourceType?: AgentSourceType,
    @Query('sourceId') sourceId?: string,
  ) {
    return this._agentSrv.getConversations(visitorId, sourceType, sourceId)
  }

  @ApiOperation({
    summary: '获取指定 Agent 会话的消息列表',
  })
  @Get('conversations/:conversationId/messages')
  public getMessages(
    @Param('conversationId') conversationId: string,
    @Query('visitorId') visitorId: string,
  ) {
    return this._agentSrv.getMessages(conversationId, visitorId)
  }

  @ApiOperation({
    summary: '归档指定 Agent 会话',
  })
  @Patch('conversations/:conversationId/archive')
  public archiveConversation(
    @Param('conversationId') conversationId: string,
    @Query('visitorId') visitorId: string,
  ) {
    return this._agentSrv.archiveConversation(conversationId, visitorId)
  }

  @ApiOperation({
    summary: '重建单篇文章的 Agent 知识库索引',
  })
  @HasPermission(PermissionType.ARTICLE_UPDATE)
  @Post('index/article/:articleId')
  public indexArticleKnowledge(
    @Param('articleId') articleId: string,
  ) {
    return this._agentSrv.indexArticleKnowledge(articleId)
  }

  @ApiOperation({
    summary: '重建全部已发布文章的 Agent 知识库索引',
  })
  @HasPermission(PermissionType.ARTICLE_UPDATE)
  @Post('index/articles')
  public indexAllArticleKnowledge() {
    return this._agentSrv.indexAllArticleKnowledge()
  }
}
