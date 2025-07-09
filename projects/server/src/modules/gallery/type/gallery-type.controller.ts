import { PermissionType } from 'types'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common'

import { HasPermission } from 'src/guards'
import { ApiSuccessResponse, getQuery } from 'src/utils'
import type { GalleryType } from 'src/entities/gallery-type'
import { GalleryTypeIdDto } from 'src/dto/id/gallery-type.dto'
import {
  IdsDto,
  QueryDto,
  QueryResDto,
  SuccessBooleanDto,
  SuccessNumberDto,
  SuccessStringDto,
} from 'src/dto'

import { GalleryService } from '../gallery.service'
import { GalleryTypeService } from './gallery-type.service'
import { UpsertGalleryTypeBodyDto } from './dto/upsert-gallery-type-body.dto'

@Controller('gallery/type')
@ApiTags('GalleryType | 图库分类')
export class GalleryTypeController {
  constructor(
    private readonly _gallerySrv: GalleryService,
    private readonly _galleryTypeSrv: GalleryTypeService,
  ) { }

  @ApiOperation({
    summary: '获取图库分类',
  })
  @ApiSuccessResponse(QueryResDto<GalleryType[]>)
  @Post('query')
  async queryGalleryType(
    @Body() body: QueryDto<GalleryType>,
  ) {
    return getQuery(
      this._gallerySrv.typesRepo(),
      body,
    )
  }

  @ApiOperation({
    summary: '创建图库分类',
  })
  @ApiSuccessResponse(SuccessStringDto)
  @HasPermission(PermissionType.GALLERY_TYPE_CREATE)
  @Post('create')
  async createGalleryType(
    @Body() body: UpsertGalleryTypeBodyDto,
  ) {
    return this._galleryTypeSrv.createGalleryType(body)
  }

  @ApiOperation({
    summary: ' 编辑图库分类',
  })
  @ApiSuccessResponse(SuccessStringDto)
  @HasPermission(PermissionType.GALLERY_TYPE_UPDATE)
  @Patch('update/:galleryTypeId')
  async updateGalleryType(
    @Body() body: UpsertGalleryTypeBodyDto,
    @Param() { galleryTypeId }: GalleryTypeIdDto,
  ) {
    return this._galleryTypeSrv.updateGalleryType(body, galleryTypeId)
  }

  @ApiOperation({
    summary: '删除指定图库分类',
  })
  @ApiSuccessResponse(SuccessBooleanDto)

  @HasPermission(PermissionType.GALLERY_TYPE_DELETE)
  @Delete('delete/:galleryTypeId')
  async deleteGalleryType(
    @Param() { galleryTypeId }: GalleryTypeIdDto,
  ) {
    return this._galleryTypeSrv.deleteGalleryType(galleryTypeId)
  }

  @ApiOperation({
    summary: '批量删除图库分类',
  })
  @ApiSuccessResponse(SuccessNumberDto)

  @HasPermission(PermissionType.GALLERY_TYPE_DELETE)
  @Delete('delete')
  async deleteGalleryTypes(
    @Body() { ids }: IdsDto,
  ) {
    if (ids.length === 1) {
      return await this._galleryTypeSrv.deleteGalleryType(ids[0])
        ? 1
        : 0
    }

    let success = 0
    for (const id of ids) {
      try {
        const deleteRes = await this._galleryTypeSrv.deleteGalleryType(id)
        deleteRes && success++
      }
      catch (_) { }
    }
    return success
  }
}
