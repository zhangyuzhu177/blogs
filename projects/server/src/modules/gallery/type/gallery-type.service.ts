import { ErrorCode } from 'types'
import { Injectable } from '@nestjs/common'

import { parseSqlError, responseError } from 'src/utils'

import { GalleryService } from '../gallery.service'
import type { UpsertGalleryTypeBodyDto } from './dto/upsert-gallery-type-body.dto'

@Injectable()
export class GalleryTypeService {
  constructor(
    private readonly _gallerySrv: GalleryService,
  ) { }

  /**
   * 创建图库类型
   * @param body 图库类型信息
   * @returns 创建的图库类型 ID
   */
  public async createGalleryType(body: UpsertGalleryTypeBodyDto) {
    try {
      const insertRes = await this._gallerySrv.typesRepo().insert(body)
      return insertRes.identifiers[0].id
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.DUPLICATE_ENTRY)
        responseError(ErrorCode.GALLERY_TYPE_IS_EXIST)
      throw e
    }
  }

  /**
   * 编辑图库类型
   * @param body 图库类型信息
   * @param id 图库类型 ID
   * @returns 图库类型 ID
   */
  public async updateGalleryType(body: UpsertGalleryTypeBodyDto, id: string) {
    if (!(await this._gallerySrv.typesRepo().existsBy({ id })))
      responseError(ErrorCode.GALLERY_TYPE_NOT_EXISTS)

    try {
      await this._gallerySrv.typesRepo().update({ id }, body)
      return id
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.DUPLICATE_ENTRY)
        responseError(ErrorCode.GALLERY_TYPE_IS_EXIST)
      throw e
    }
  }

  /**
   * 删除图库类型
   * @param id 图库类型 ID
   * @returns 是否删除成功
   */
  public async deleteGalleryType(id: string) {
    if (!(await this._gallerySrv.typesRepo().existsBy({ id })))
      responseError(ErrorCode.GALLERY_TYPE_NOT_EXISTS)

    try {
      const deleteRes = await this._gallerySrv.typesRepo().delete({ id })
      return deleteRes.affected > 0
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.GALLERY_TYPE_HAS_GALLERY)
      throw e
    }
  }
}
