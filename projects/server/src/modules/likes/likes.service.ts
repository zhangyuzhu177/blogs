import { Repository } from 'typeorm'
import type { LikesType } from 'types'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Likes } from 'src/entities/likes'
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
    contentId: string,
    body: CreateLikeBodyDto,
  ) {
    try {
      const insertRes = await this._likesRepo.insert({
        ...body,
        ip,
        type,
        contentId,
      })
      return insertRes.identifiers[0].id
    }
    catch (e) {
      console.log(e)
    }
  }
}
