import { Global, Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Permission])
  ],
  providers: [PermissionService],
  exports: [PermissionService]
})
export class PermissionModule {}
