import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Gallery } from 'src/entities/gallery'
import { GalleryType } from 'src/entities/gallery-type'

import { GalleryService } from './gallery.service'
import { GalleryTypeService } from './type/gallery-type.service'
import { GalleryTypeController } from './type/gallery-type.controller'
import { GalleryEntityService } from './entity/gallery-entity.service'
import { GalleryEntityController } from './entity/gallery-entity.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Gallery, GalleryType]),
  ],
  controllers: [
    GalleryEntityController,
    GalleryTypeController,
  ],
  providers: [
    GalleryService,
    GalleryTypeService,
    GalleryEntityService,
  ],
})
export class GalleryModule { }
