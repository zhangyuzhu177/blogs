import * as OSS from 'ali-oss'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { responseParamsError } from 'src/utils/response/validate-exception-factory'

@Injectable()
export class FileService {
  public client: OSS
  constructor(
    private readonly _cfgSrv: ConfigService,
  ) {
    this.client = new OSS(this._cfgSrv.get('oss'))
  }

  /** 上传文件 */
  public async uploadFile(path: string, file: any) {
    if (!path) {
      responseParamsError([{
        property: 'path',
        constraints: {
          path: 'path is required',
        },
      }])
    }

    if (!file) {
      responseParamsError([{
        property: 'file',
        constraints: {
          file: 'file is required',
        },
      }])
    }
    const res = await this.client.put(path, file)
    return {
      url: res.url,
      path: res.name,
    }
  }
}
