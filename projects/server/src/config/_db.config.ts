import { registerAs } from '@nestjs/config'
import type { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { parseBoolRaw } from 'src/utils/parseBoolRaw'

export default registerAs('db', () => {
  return <TypeOrmModuleOptions>{
    type: process.env.DB_TYPE || 'mysql',
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PSWD,
    database: process.env.DB_NAME,
    extra: {
      connectionLimit: Number.parseInt(process.env.DB_CONN_LIMIT) || 100,
    },
    logger: 'file',
    logging: true,
    autoLoadEntities: true,
    migrations: ['src/migration/*.js'],
    synchronize: parseBoolRaw(process.env.ORM_ENABLE_SYNC) || false,
    legacySpatialSupport: false,
  }
})
