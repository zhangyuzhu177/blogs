import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Login } from 'src/entities/login'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Login]),
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService
  ],
  exports: [
    AuthService
  ],
})
export class AuthModule {}
