import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { LikesService } from './likes.service'
import { GetLinkBodyDto } from './dto/get-link-body.dto'

@Controller('likes')
@ApiTags('Likes | 点赞')
export class LikesController {
  constructor(
    private readonly _linkSrv: LikesService,
  ) { }

  @ApiOperation({
    summary: '获取指定内容的点赞',
  })
  @Post('get-link')
  public async getLink(
    @Body() body: GetLinkBodyDto,
  ) {
    return await this._linkSrv.likeRepo().find({
      where: body,
    })
  }
}
