import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Likes } from 'src/entities/likes'

import { LikesService } from './likes.service'
import { LikesController } from './likes.controller'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Likes]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule { }
