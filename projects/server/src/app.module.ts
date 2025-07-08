import { join } from 'node:path'
import { validatePath } from 'utils'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'
import { Module, RequestMethod } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import type { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import type { MiddlewareConsumer, NestModule } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'

import allConfig from './config'
import { LogModule } from './modules/log/log.module'
import { CodeModule } from './modules/code/code.module'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { FileModule } from './modules/file/file.module'
import { RoleModule } from './modules/role/role.module'
import { RedisModule } from './modules/redis/redis.module'
import { EmailModule } from './modules/email/email.module'
import { AuthMiddleware } from './middleware/auth.middleware'
import { InfoMiddleware } from './middleware/info.middleware'
import { GalleryModule } from './modules/gallery/gallery.module'
import { ArticleModule } from './modules/article/article.module'
import { SysConfigModule } from './modules/config/config.module'
import { AccessMiddleware } from './middleware/access.middleware'
import { JwtAuthModule } from './modules/jwt-auth/jwt-auth.module'
import { WebsocketGateway } from './modules/websocket/websocket.gateway'
import { PermissionModule } from './modules/permission/permission.module'
import { ResponseInterceptor } from './interceptors/response.interceptor'
import { ThrottlerExceptionFilter } from './filter/throttler-exception.filter'

@Module({
  imports: [
    // Internal Modules
    LogModule,
    AuthModule,
    UserModule,
    RoleModule,
    RedisModule,
    EmailModule,
    FileModule,
    CodeModule,
    JwtAuthModule,
    ArticleModule,
    GalleryModule,
    SysConfigModule,
    PermissionModule,
    WebsocketGateway,

    // External Modules
    // 定时任务
    ScheduleModule.forRoot(),
    // 请求限流
    ThrottlerModule.forRoot({ ttl: 10, limit: 30 }),
    // 环境配置
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.dev', '.env.staging', '.env.production', '.env'],
      isGlobal: true,
      cache: true,
      load: [...allConfig],
    }),
    // 数据库
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_cfgSrv: ConfigService) =>
        _cfgSrv.get<TypeOrmModuleOptions>('db'),
    }),
    // 静态资源服务
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_cfgSrv: ConfigService) => [
        {
          rootPath: join(__dirname, 'public'),
          serveRoot: validatePath(_cfgSrv.get('SERVER_BASE_PATH') || '/'),
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
        { path: 'email/(.*)', method: RequestMethod.ALL },
      ).forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      })
  }
}
