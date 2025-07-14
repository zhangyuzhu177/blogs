import { registerAs } from '@nestjs/config'
import { parseBoolRaw, parseIntRaw } from 'utils'
import type { TypeOrmModuleOptions } from '@nestjs/typeorm'

export default registerAs('db', () => {
  const {
    DB_HOST, DB_PORT, DB_USER, DB_PSWD,
    DB_NAME, DB_CONNECT_TIMEOUT,
    DB_CONN_LIMIT, DB_ORM_ENABLE_SYNC,
  } = process.env

  return <TypeOrmModuleOptions>{
    type: 'mysql',
    host: DB_HOST || 'localhost',
    port: parseIntRaw(DB_PORT, 3306),
    username: DB_USER,
    password: DB_PSWD,
    database: DB_NAME,
    connectTimeout: parseIntRaw(DB_CONNECT_TIMEOUT, 60000),
    extra: {
      connectionLimit: parseIntRaw(DB_CONN_LIMIT, 100),
    },
    autoLoadEntities: true,
    synchronize: parseBoolRaw(DB_ORM_ENABLE_SYNC, false),
    legacySpatialSupport: false,
  }
})
