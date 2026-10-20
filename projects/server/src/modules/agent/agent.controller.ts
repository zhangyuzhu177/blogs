import { FastifyReply } from 'fastify'
import { AgentSourceType, PermissionType } from 'types'
import { Body, Controller, Get, Param, Patch, Post, Query, Req, Res } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

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
  /**
   * 流式问答。
   * 以 SSE 把 Agent 的增量回答、工具状态和引用来源推给前端。
   */
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
  /**
   * 获取当前访客的会话列表。
   * 可按来源页面过滤，只返回该访客自己的活跃会话。
   */
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
  /**
   * 获取指定会话的历史消息。
   * 需要同时提供访客 Id，避免通过会话 Id 读取他人记录。
   */
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
  /**
   * 归档指定会话。
   * 归档后前台不再恢复该会话，历史消息仍保留在数据库中。
   */
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
  /**
   * 重建单篇文章的知识库索引。
   * 需要文章更新权限，供后台或 Swagger 手动触发。
   */
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
  /**
   * 重建全部已发布文章的知识库索引。
   * 需要文章更新权限，适合首次上线或切换 Embedding 模型后执行。
   */
  public indexAllArticleKnowledge() {
    return this._agentSrv.indexAllArticleKnowledge()
  }
}
