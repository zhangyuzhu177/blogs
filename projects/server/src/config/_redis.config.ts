import { registerAs } from '@nestjs/config'

interface RedisConnectionOptions {
  host: string
  port: number
  db: number
  username?: string
  password?: string
}

function getUrl(opt: RedisConnectionOptions): { key: string; url: string } {
  const { host, port, db, username, password } = opt
  if (!host || !port || (db !== 0 && !db))
    return null
  const auth = username ? `${username}${password ? `:${password}` : ''}@` : ''
  const key = `${host}_${port}_${db}_${username || ''}`
  const url = `redis://${auth}${host}:${port}/${db}`
  return { key, url }
}

export default registerAs('redis', () => {
  return {
    [RedisType.AUTH_JWT]: getUrl({
      host: process.env.REDIS_HOST,
      port: Number.parseInt(process.env.REDIS_PORT),
      db: Number.parseInt(process.env.REDIS_AUTH_JWT_DB),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    }),
    [RedisType.CODE]: getUrl({
      host: process.env.REDIS_HOST,
      port: Number.parseInt(process.env.REDIS_PORT),
      db: Number.parseInt(process.env.REDIS_CODE_DB),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    }),
  }
})
