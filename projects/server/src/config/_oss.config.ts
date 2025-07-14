import { registerAs } from '@nestjs/config'

export interface OssConfig {
  /** OSS 服务 AK */
  ak: string
  /** OSS 服务 SK */
  sk: string
  /** OSS 服务数据存储地区 */
  region: string
  /** OSS 服务是否使用安全模式连接 */
  secure: boolean
  /** OSS 桶名称 */
  bucket: string
}

export default registerAs('oss', () => {
  const { OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, OSS_BUCKET, OSS_REGION } = process.env

  return {
    accessKeyId: OSS_ACCESS_KEY_ID,
    accessKeySecret: OSS_ACCESS_KEY_SECRET,
    bucket: OSS_BUCKET,
    region: OSS_REGION,
  }
})
