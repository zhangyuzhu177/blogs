import { In } from 'typeorm'
import { ErrorCode } from 'types'
import { Injectable, Logger } from '@nestjs/common'

import { parseSqlError, responseError } from 'src/utils'
import type { ChangeStatusBodyDto } from 'src/dto/common'

import { GalleryService } from '../gallery.service'
import type { UpsertGalleryBodyDto } from './dto/upsert-gallery-entity-body.dto'

@Injectable()
export class GalleryEntitiesService {
  private readonly _logger = new Logger(GalleryEntitiesService.name)

  constructor(
    private readonly _gallerySrv: GalleryService,
  ) { }

  /**
   * 获取图库详情
   */
  public async getGalleryDetail(id: string, ip: string) {
    const article = await this._gallerySrv.entityRepo().findOne({
      where: { id },
      relations: {
        galleryType: true,
      },
    })

    if (!article)
      responseError(ErrorCode.ARTICLE_NOT_EXISTS)

    this._logger.verbose(ip)
    await this._gallerySrv.entityRepo().increment({ id }, 'pageView', 1)

    return article
  }

  /**
   * 创建图库
   * @param body 图库内容
   * @returns 创建的图库 ID
   */
  public async createGallery(body: UpsertGalleryBodyDto) {
    try {
      const insertRes = await this._gallerySrv.entityRepo().insert(body)
      return insertRes.identifiers[0].id
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.GALLERY_TYPE_NOT_EXISTS)
      throw e
    }
  }

  /**
   * 修改图库
   * @param body 图库内容
   * @param id 图库 ID
   * @returns 图库 ID
   */
  public async updateGallery(body: UpsertGalleryBodyDto, id: string) {
    if (!(await this._gallerySrv.entityRepo().existsBy({ id })))
      responseError(ErrorCode.GALLERY_NOT_EXISTS)

    try {
      await this._gallerySrv.entityRepo().update({ id }, body)
      return id
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.GALLERY_TYPE_NOT_EXISTS)
      throw e
    }
  }

  /**
   * 删除图库
   * @param id 删除图库的 ID
   * @returns 是否删除成功
   */
  public async deleteGallery(id: string) {
    if (!(await this._gallerySrv.entityRepo().existsBy({ id })))
      responseError(ErrorCode.GALLERY_NOT_EXISTS)

    const deleteRes = await this._gallerySrv.entityRepo().delete({ id })
    return deleteRes.affected > 0
  }

  public async changeGalleryStatus(body: ChangeStatusBodyDto) {
    const { ids, status } = body

    if (ids.length === 1 && !(await this._gallerySrv.entityRepo().existsBy({ id: ids[0] })))
      responseError(ErrorCode.GALLERY_NOT_EXISTS)

    const updateRes = await this._gallerySrv.entityRepo().update(
      { id: In(ids) },
      { status },
    )

    return updateRes.affected
  }
}
