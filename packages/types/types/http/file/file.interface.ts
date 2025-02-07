import type { IUrlDto } from '../../dto/url.interface'
import type { IPathDto } from '../../dto/path.interface'

/**
 * 上传文件
 * 请求参数
 */
export interface FileBodyDto
  extends IUrlDto, IPathDto {}
