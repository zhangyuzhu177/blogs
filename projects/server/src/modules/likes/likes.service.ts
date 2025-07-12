import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ErrorCode, type LikesType } from 'types'
import { InjectRepository } from '@nestjs/typeorm'

import { Likes } from 'src/entities/likes'
import { parseSqlError, responseError } from 'src/utils'
import type { CreateLikeBodyDto } from './dto/create-link-body.dto'

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Likes)
    private readonly _likesRepo: Repository<Likes>,
  ) { }

  /**
   * 点赞
   */
  public async createLink(
    ip: string,
    type: LikesType,
    body: CreateLikeBodyDto,
  ) {
    try {
      const insertRes = await this._likesRepo.insert({
        ...body,
        ip,
        type,
      })
      return insertRes.identifiers[0].id
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.DUPLICATE_ENTRY)
        responseError(ErrorCode.LIKE_IS_EXIST)
      throw e
    }
  }

  public linkeRepo() {
    return this._likesRepo
  }
}
