import { Column, Entity, PrimaryColumn } from "typeorm";
import { IConfigDto, ISysConfig, SysConfig } from "types";

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
