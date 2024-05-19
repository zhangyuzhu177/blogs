import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import type { ConfigService } from '@nestjs/config'
import type { INestApplication } from '@nestjs/common'
import type { SwaggerCustomOptions } from '@nestjs/swagger'
import { validatePath } from 'src/utils/validatePath'

/**
 * 注册
 */
export default async function registerSwagger(
  app: INestApplication,
  cfgSrv: ConfigService,
  globalPrefix: string,
  version: string,
) {
  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setVersion(version)
    .setTitle(cfgSrv.get('SWAGGER_TITLE'))
    .setDescription(cfgSrv.get('SWAGGER_DESC'))
    .addServer('/')
    .addServer(cfgSrv.get('SWAGGER_SERVER_HOST'))
    .build()
  const cssUrl = validatePath(`${globalPrefix}/assets/swagger.css`)
  const jsRaw = validatePath(`${globalPrefix}/assets/swagger.js`)

  const opt: SwaggerCustomOptions = {
    swaggerOptions: {
      filter: true,
      // useUnsafeMarkdown: true,
      persistAuthorization: true,
      showCommonExtensions: true,
      displayRequestDuration: true,
      syntaxHighlight: { activate: true, theme: 'arta' },
      defaultModelsExpandDepth: -1,
      tagsSorter: 'alpha',
    },
    customCssUrl: cssUrl,
    customJs: jsRaw,
    useGlobalPrefix: true,
    customSiteTitle: cfgSrv.get('SWAGGER_TITLE'),
  }
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup(cfgSrv.get('SWAGGER_PATH'), app, document, opt)
}
