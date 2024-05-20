import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from 'src/entities/login';
import { UserModule } from '../user/user.module';
import { CodeModule } from '../code/code.module';
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module';

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
