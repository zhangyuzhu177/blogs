import { applyDecorators } from '@nestjs/common'
import { ApiBody, ApiConsumes } from '@nestjs/swagger'

import type { SchemasObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

export function ApiFormData(
  key = 'file',
  cfg: Record<string, SchemasObject['properties']> = {},
) {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [key]: {
            type: 'string',
            format: 'binary',
            description: '上传的文件',
          },
          ...cfg,
        },
      },
    }),
  )
}
