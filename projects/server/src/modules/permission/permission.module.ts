import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Permission } from 'src/entities/permission'
import { PermissionService } from './permission.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
  ],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
