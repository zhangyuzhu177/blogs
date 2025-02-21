import { registerAs } from '@nestjs/config'
import {parseIntRaw} from 'utils'

export type RedisConfig = Record<
  RedisType,
  {
    /** Redis 主键 */
    key: string
    /** Redis 连接地址 */
    url: string
    /** Redis 服务器地址 */
    host: string
    /** Redis 服务器端口 */
    port: number
    /** Redis 数据库索引 */
    db: number
  }
>

function getUrl(db: number): RedisConfig[RedisType] {
  const {
    REDIS_HOST, REDIS_PORT,
    REDIS_USER, REDIS_PSWD,
  } = process.env

  const host = REDIS_HOST || 'localhost'
  const port = parseIntRaw(REDIS_PORT, 6379)

  const auth = REDIS_USER || REDIS_PSWD ? `${REDIS_USER || ''}${REDIS_PSWD ? `:${REDIS_PSWD}` : ''}@` : ''
  const key = `${host}_${port}_${db}_${REDIS_USER || ''}`
  const url = `redis://${auth}${host}:${port}/${db}`
  return { key, url, host, port, db }
}

export default registerAs('redis', (): RedisConfig => {
  const {
    REDIS_AUTH_JWT_DB,
    REDIS_CODE_DB,
  } = process.env

  return {
    [RedisType.AUTH_JWT]: getUrl(parseIntRaw(REDIS_AUTH_JWT_DB, 0)),
    [RedisType.CODE]: getUrl(parseIntRaw(REDIS_CODE_DB, 1)),
  }
})
