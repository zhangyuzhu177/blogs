import { Body, Controller, Post, Query } from '@nestjs/common';
import { FileService } from './file.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilePathDto } from 'src/dto/file-path.dto';

@Controller('file')
@ApiTags('File | 文件服务')
export class FileController {
  constructor(
    private readonly _fileSrv: FileService
  ) { }

  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { 'file': { type: 'string', format: 'binary' } },
    }
  })
  @Post('upload')
  async uploadFile(
    @Query() query:FilePathDto,
    @Body() body:any
  ) {
    return await this._fileSrv.uploadFile(query.path,await body.file.toBuffer())
  }
}
