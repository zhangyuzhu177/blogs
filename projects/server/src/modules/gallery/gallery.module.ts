import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Gallery } from 'src/entities/gallery'
import { GalleryType } from 'src/entities/gallery-type'

import { GalleryService } from './gallery.service'
import { GalleryTypeService } from './type/gallery-type.service'
import { GalleryTypeController } from './type/gallery-type.controller'
import { GalleryEntitiesService } from './entity/gallery-entities.service'
import { GalleryEntitiesController } from './entity/gallery-entities.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Gallery, GalleryType]),
  ],
  controllers: [
    GalleryTypeController,
    GalleryEntitiesController,
  ],
  providers: [
    GalleryService,
    GalleryTypeService,
    GalleryEntitiesService,
  ],
})
export class GalleryModule { }
