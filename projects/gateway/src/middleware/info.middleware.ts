import { Injectable } from '@nestjs/common'
import type { NestMiddleware } from '@nestjs/common'

@Injectable()
export class InfoMiddleware implements NestMiddleware {
  constructor() { }
  use(req: any, _res: any, next: () => void) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    req.ip = ip
    next()
  }
}
