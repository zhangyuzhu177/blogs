import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Likes } from 'src/entities/likes'

import { LikesService } from './likes.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Likes]),
  ],
  providers: [
    LikesService,
  ],
  exports: [
    LikesService,
  ],
})
export class LikesModule { }
