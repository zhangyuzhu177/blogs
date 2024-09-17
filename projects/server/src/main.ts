import { join } from 'node:path'
import fmp from '@fastify/multipart'
import * as dotenvFlow from 'dotenv-flow'
import { NestFactory } from '@nestjs/core'
import compression from '@fastify/compress'
import { ConfigService } from '@nestjs/config'
import { Logger, ValidationPipe } from '@nestjs/common'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'

import registerSwagger from './bootstrap/register-swagger'
import { AppModule } from './app.module'
import { validatePath } from './utils/validatePath'
import { parseBoolRaw } from './utils/parseBoolRaw'
import { getExceptionFactory } from './utils/response/validate-exception-factory'

async function bootstrap() {
  dotenvFlow.config({ path: '../shared' })

  const logger = new Logger('Bootstrap')

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const packageJson = await require(join(__dirname, '../package.json'))
  const cfgSrv = app.get(ConfigService)
  const globalPrefix = validatePath(cfgSrv.get('SERVER_BASE_PATH') || '/')
  app.setGlobalPrefix(globalPrefix)

  /** 启用 压缩 */
  app.register(compression)
  /** 文件 */
  app.register(fmp, {
    attachFieldsToBody: true,
    limits: {
      fileSize: 1024 * 1024 * 1024,
    },
  })

  // Register Swagger
  if (parseBoolRaw(cfgSrv.get('SWAGGER_ENABLED')))
    await registerSwagger(app, cfgSrv, globalPrefix, packageJson.version)

  /** 启用 validation */
  app.useGlobalPipes(
    new ValidationPipe({ exceptionFactory: getExceptionFactory() }),
  )

  // Global variables
  globalThis.prefix = globalPrefix
  globalThis.version = packageJson.version

  await app.listen(Number.parseInt(cfgSrv.get('SERVER_PORT')) || 3000, '::')

  logger.verbose(`App is running on ${await app.getUrl()}${cfgSrv.get('SWAGGER_SERVER_HOST')}${cfgSrv.get('SWAGGER_PATH')}`)
}
bootstrap()
