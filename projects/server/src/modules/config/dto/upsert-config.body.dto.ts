import { ApiPropertyOptional } from "@nestjs/swagger";
import { IConfigDto } from "src/types/dto/config.interface";
import { VersionDto } from "src/types/dto/version.dto";
import { SysConfig } from "src/types/enum/config.enum";

export class UpsertConfigBodyDto  extends VersionDto {
  @ApiPropertyOptional({
    description: 'App配置',
    example: {
      name: '测试',
      icon: '/logo.svg',
      nameEn: 'test',
    },
  })
  app?: IConfigDto[SysConfig.APP]

  @ApiPropertyOptional({
    description: '页面配置',
    example: {
      title:'string',
      label: 'string',
      url:'',
    },
  })
  home?: IConfigDto[SysConfig.HOME]

  @ApiPropertyOptional({
    description: '文章页配置',
    example: {
      title:'string',
      label: 'string',
      url:'',
    },
  })
  article?: IConfigDto[SysConfig.ARTICLE]

  @ApiPropertyOptional({
    description: '关于页配置',
    example: {
    title: "",
    label: "",
    url: "",
    avatar: "",
    name: "",
    phone: "",
    email: "",
    github:"",
    motto: "",
    content: "",
    },
  })
  about?: IConfigDto[SysConfig.ABOUT]
}
