import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Gallery } from 'src/entities/gallery'
import { GalleryType } from 'src/entities/gallery-type'

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private readonly _galleryRepo: Repository<Gallery>,
    @InjectRepository(GalleryType)
    private readonly _galleryTypeRepo: Repository<GalleryType>,
  ) { }

  public entityRepo() {
    return this._galleryRepo
  }

  public typesRepo() {
    return this._galleryTypeRepo
  }
}
