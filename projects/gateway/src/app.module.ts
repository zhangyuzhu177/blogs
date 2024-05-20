import { join } from 'node:path'
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import type { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'


import allConfig from './config'
import { validatePath } from './utils/validatePath'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ResponseInterceptor } from './interceptors/response.interceptor'
import { ThrottlerExceptionFilter } from './filter/throttler-exception.filter'
import { InfoMiddleware } from './middleware/info.middleware'
import { AuthMiddleware } from './middleware/auth.middleware'
import { AccessMiddleware } from './middleware/access.middleware'

@Module({
  imports: [

    // External Modules
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({ ttl: 10, limit: 30 }),
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.dev', '.env.staging', '.env.production', '.env'],
      isGlobal: true,
      cache: true,
      load: [...allConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_cfgSrv: ConfigService) =>
        _cfgSrv.get<TypeOrmModuleOptions>('db'),
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_cfgSrv: ConfigService) => [
        {
          rootPath: join(__dirname, 'public'),
          serveRoot: validatePath(_cfgSrv.get('SERVER_BASE_PATH')|| '/'),
        },
      ],
    }),
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: ThrottlerExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InfoMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
    consumer.apply(AccessMiddleware)
      .exclude(
        { path: 'log/(.*)', method: RequestMethod.ALL },
      ).forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      })
  }
}
