import { ConfigModule, ConfigService } from '@nestjs/config'
import { Global, Module, forwardRef } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { AuthModule } from '../auth/auth.module'
import { JwtAuthService } from './jwt-auth.service'

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (_: ConfigService) => {
        return {}
      },
    }),

    forwardRef(() => AuthModule),
  ],
  providers: [
    JwtAuthService,
    JwtService,
  ],
  exports: [
    JwtAuthService,
  ],
})

export class JwtAuthModule {}
