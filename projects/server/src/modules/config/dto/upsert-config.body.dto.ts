import { ApiPropertyOptional } from "@nestjs/swagger"
import { VersionDto } from "src/dto/version.dto"
import { IConfigDto, IUpsertConfigBodyDto, SysConfig } from "types"

export class UpsertConfigBodyDto
  extends VersionDto
  implements IUpsertConfigBodyDto{
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
