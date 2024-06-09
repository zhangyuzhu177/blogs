import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Login } from 'src/entities/login'
import { UserModule } from '../user/user.module'
import { CodeModule } from '../code/code.module'
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Login]),
    forwardRef(() => JwtAuthModule),
    forwardRef(() => UserModule),
    CodeModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
