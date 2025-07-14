import { createClient } from 'redis'
import type { RedisClientType } from 'redis'
import { ConfigService } from '@nestjs/config'
import { Injectable, Logger } from '@nestjs/common'

import type { RedisConfig } from 'src/config/_redis.config'

@Injectable()
export class RedisService {
  private readonly _logger = new Logger(RedisService.name)

  /** Redis 客户端 */
  private readonly _clients: Map<string, RedisClientType> = new Map()

  constructor(
    private readonly _cfgSrv: ConfigService,
  ) { }

  /**
   * 获取 Redis 客户端
   */
  public getClient(redisType: RedisType) {
    const { key, url } = this._cfgSrv.get<RedisConfig>('redis')[redisType]
    if (!key || !url)
      return

    const client = this._clients.get(key)
    if (!client) {
      const _client: RedisClientType = createClient({ url })
      _client.connect()
      this._clients.set(key, _client)
      this._logger.verbose(`新的 Redis 连接：${key}`)
      return _client
    }
    return client
  }

  /**
   * 断开所有的 Redis 连接
   */
  public disposeAllConnection() {
    return Promise.all(
      Array.from(this._clients.keys()).map(
        key => this._clients.get(key).quit(),
      ),
    )
  }
}
