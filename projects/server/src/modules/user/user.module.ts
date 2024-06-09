import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/entities/user'
import { CodeModule } from '../code/code.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [
    CodeModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
