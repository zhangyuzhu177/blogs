import { IConfigDto } from "src/types/dto/config.interface";
import { ISysConfig } from "src/types/entities/sys-config.interface";
import { SysConfig } from "src/types/enum/config.enum";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Config implements ISysConfig<SysConfig> {
  @PrimaryColumn({
    type: 'enum',
    enum: SysConfig,
  })
  version: SysConfig

  @Column({
    type: 'json',
    nullable: true,
  })
  config?: IConfigDto[SysConfig]
}
