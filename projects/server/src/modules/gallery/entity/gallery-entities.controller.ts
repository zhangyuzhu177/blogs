import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ErrorCode, LikesType, PermissionType } from 'types'
import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common'

import { HasPermission } from 'src/guards'
import type { Gallery } from 'src/entities/gallery'
import { ChangeStatusBodyDto } from 'src/dto/common'
import { GalleryIdDto } from 'src/dto/id/gallery.dto'
import { LikesService } from 'src/modules/likes/likes.service'
import { ApiSuccessResponse, getQuery, responseError } from 'src/utils'
import { CreateLikeBodyDto } from 'src/modules/likes/dto/create-link-body.dto'
import {
  IdsDto,
  QueryDto,
  QueryResDto,
  SuccessBooleanDto,
  SuccessNumberDto,
  SuccessStringDto,
} from 'src/dto'

import { GalleryService } from '../gallery.service'
import { GalleryEntitiesService } from './gallery-entities.service'
import { UpsertGalleryBodyDto } from './dto/upsert-gallery-entity-body.dto'

@Controller('gallery/entities')
@ApiTags('GalleryEntity | 图库')
export class GalleryEntitiesController {
  constructor(
    private readonly _linkSrv: LikesService,
    private readonly _gallerySrv: GalleryService,
    private readonly _galleryEntitySrv: GalleryEntitiesService,
  ) { }

  @ApiOperation({
    summary: '根据获取指定图库详情',
  })
  @Get('detail/:galleryId')
  public getGalleryDetailById(
    @Param() { galleryId }: GalleryIdDto,
    @Req() req: FastifyRequest,
  ) {
    const { user, ip } = req.raw
    return this._galleryEntitySrv.getGalleryDetail(galleryId, user, ip)
  }

  @ApiOperation({
    summary: '获取图库',
  })
  @ApiSuccessResponse(QueryResDto<Gallery[]>)
  @Post('query')
  public queryGalleryType(
    @Body() body: QueryDto<Gallery>,
  ) {
    return getQuery(
      this._gallerySrv.entityRepo(),
      body,
    )
  }

  @ApiOperation({
    summary: '创建图库',
  })
  @ApiSuccessResponse(SuccessStringDto)
  @HasPermission([PermissionType.GALLERY_CREATE])
  @Post('create')
  public createGallery(
    @Body() body: UpsertGalleryBodyDto,
  ) {
    return this._galleryEntitySrv.createGallery(body)
  }

  @ApiOperation({
    summary: '更新图库',
  })
  @ApiSuccessResponse(SuccessStringDto)
  @HasPermission([PermissionType.GALLERY_UPDATE])
  @Patch('update/:galleryId')
  public updateGallery(
    @Body() body: UpsertGalleryBodyDto,
    @Param() { galleryId }: GalleryIdDto,
  ) {
    return this._galleryEntitySrv.updateGallery(body, galleryId)
  }

  @ApiOperation({
    summary: '删除指定图库',
  })
  @ApiSuccessResponse(SuccessBooleanDto)
  @HasPermission([PermissionType.GALLERY_DELETE])
  @Delete('delete/:galleryId')
  public deleteGallery(
    @Param() { galleryId }: GalleryIdDto,
  ) {
    return this._galleryEntitySrv.deleteGallery(galleryId)
  }

  @ApiOperation({
    summary: '批量删除图库',
  })
  @ApiSuccessResponse(SuccessNumberDto)
  @HasPermission([PermissionType.GALLERY_DELETE])
  @Delete('delete')
  public async batchDeleteGallery(
    @Body() { ids }: IdsDto,
  ) {
    if (ids.length === 1) {
      return await this._galleryEntitySrv.deleteGallery(ids[0])
        ? 1
        : 0
    }
    let success
    for (const id of ids) {
      try {
        const deleteRes = await this._galleryEntitySrv.deleteGallery(id)
        deleteRes && success++
      }
      catch (_) { }
    }
    return success
  }

  @ApiOperation({
    summary: '批量修改图库状态',
  })
  @ApiSuccessResponse(SuccessNumberDto)
  @HasPermission(PermissionType.GALLERY_CHANGE_STATUS)
  @Post('status')
  async changeGalleryStatus(
    @Body() body: ChangeStatusBodyDto,
  ) {
    return this._galleryEntitySrv.changeGalleryStatus(body)
  }

  @ApiOperation({
    summary: '点赞',
  })
  @ApiSuccessResponse(SuccessStringDto)
  @Post('like')
  public async createLink(
      @Req() req: FastifyRequest,
      @Body() body: CreateLikeBodyDto,
  ) {
    const { ip } = req.raw
    const { contentId } = body

    if (!(await this._gallerySrv.entityRepo().existsBy({ id: contentId })))
      responseError(ErrorCode.GALLERY_NOT_EXISTS)

    return this._linkSrv.createLink(ip, LikesType.GALLERY, body)
  }
}
