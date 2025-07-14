import { SysConfig } from 'types'
import type { IConfigDto, ISysConfig } from 'types'
import { Column, Entity, PrimaryColumn } from 'typeorm'

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
